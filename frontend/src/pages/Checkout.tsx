import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Schedule, PassengerInfo } from '../types';
import { ShieldCheck, Clock, CreditCard, Lock, CheckCircle2 } from 'lucide-react';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { schedule: Schedule; selectedSeats: string[] } | null;

  if (!state || !state.schedule || !state.selectedSeats || state.selectedSeats.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 card text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800">No Active Booking Session</h3>
        <p className="text-xs text-slate-500">Please search for a route and select seats first.</p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const { schedule, selectedSeats } = state;

  const [passengers, setPassengers] = useState<PassengerInfo[]>(
    selectedSeats.map((seat) => ({
      seatNumber: seat,
      name: '',
      age: 25,
      gender: 'MALE'
    }))
  );

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes Redis TTL countdown
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('Seat hold timer expired! Please search and re-select your seats.');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passenger inputs
    for (const p of passengers) {
      if (!p.name.trim()) {
        alert(`Please enter passenger name for seat ${p.seatNumber}`);
        return;
      }
    }

    setProcessing(true);

    try {
      // Execute payment confirmation API
      const res = await api.post('/bookings/confirm', {
        scheduleId: schedule._id,
        passengers,
        paymentMethod: 'SELF_HOSTED_MOCK_GATEWAY'
      });

      if (res.data.success) {
        navigate(`/ticket/${res.data.booking.pnr}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const totalAmount = selectedSeats.length * schedule.baseFare;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hold Lock Countdown Header */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Seats Locked (Redis Hold Engine)</h4>
              <p className="text-xs text-amber-700">Complete payment before timer expires to guarantee your seats.</p>
            </div>
          </div>
          <div className="font-mono text-lg font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Passenger Information Form */}
          <div className="md:col-span-8 space-y-6">
            <div className="card p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Passenger Details
              </h3>

              <form onSubmit={handleConfirmPayment} className="space-y-5">
                {passengers.map((passenger, idx) => (
                  <div key={passenger.seatNumber} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                        Passenger {idx + 1} &bull; Seat {passenger.seatNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">₹{schedule.baseFare}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                          className="input-field"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Age</label>
                        <input
                          type="number"
                          min="1"
                          max="110"
                          required
                          value={passenger.age}
                          onChange={(e) => handlePassengerChange(idx, 'age', parseInt(e.target.value, 10))}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Gender</label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                        className="input-field"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                ))}

                {/* Payment Action Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary w-full py-3.5 text-base font-bold flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{processing ? 'Processing Payment...' : `Pay ₹${totalAmount} & Confirm Booking`}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Fare Summary Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="card p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Fare Breakdown</h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Bus Type</span>
                  <span className="text-slate-900 font-semibold">{schedule.busId?.busType}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Seat Count</span>
                  <span className="text-slate-900 font-semibold">{selectedSeats.length} Seats ({selectedSeats.join(', ')})</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Price Per Seat</span>
                  <span className="text-slate-900 font-semibold">₹{schedule.baseFare}</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-2 border-t border-slate-100">
                  <span>Convenience Fee</span>
                  <span className="text-emerald-600 font-semibold">₹0 (Free)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-red-600 text-lg font-extrabold">₹{totalAmount}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Self-Hosted Local Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600" />
                  <span>Instant QR Boarding Pass</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
