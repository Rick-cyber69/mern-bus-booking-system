import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Booking } from '../types';
import { Ticket, ArrowRight, XCircle, Bus } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (pnr: string) => {
    if (!window.confirm(`Are you sure you want to cancel booking PNR ${pnr}?`)) return;
    try {
      await api.post(`/bookings/cancel/${pnr}`);
      alert(`Booking ${pnr} cancelled successfully. Refund processed.`);
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Banner */}
        <div className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">My Trips & Bookings</h2>
            <p className="text-xs text-slate-500 mt-1">Manage your active departures, digital QR boarding passes, and cancellations.</p>
          </div>
          <Link
            to="/"
            className="btn-primary text-xs w-full sm:w-auto text-center"
          >
            + Book New Trip
          </Link>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm">Loading your trips...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bus className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Bookings Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">You haven't made any bus reservations yet. Search and book intercity buses across India.</p>
            <Link to="/" className="btn-primary text-xs inline-block">
              Search Buses Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const schedule = booking.scheduleId;
              const bus = schedule?.busId;
              const route = schedule?.routeId;
              const isCancelled = booking.bookingStatus === 'CANCELLED';

              return (
                <div key={booking._id} className="card p-5 sm:p-6 space-y-4">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          PNR: {booking.pnr}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            isCancelled
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-base sm:text-lg font-bold text-slate-900 pt-1">
                        <span>{route?.originCity || 'Origin'}</span>
                        <ArrowRight className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>{route?.destinationCity || 'Destination'}</span>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                      <span className="text-[11px] text-slate-400 block">Total Amount</span>
                      <span className="text-lg sm:text-xl font-bold text-slate-900">₹{booking.totalAmount}</span>
                    </div>
                  </div>

                  {/* Trip Details & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
                      <span>Bus: <strong className="text-slate-800">{bus?.name || 'InterCity Express'}</strong></span>
                      <span>&bull;</span>
                      <span>Seats: <strong className="text-red-600 font-bold">{booking.seatNumbers.join(', ')}</strong></span>
                      <span>&bull;</span>
                      <span>Category: <strong className="text-slate-700">{bus?.busType}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <Link
                        to={`/ticket/${booking.pnr}`}
                        className="btn-primary !py-2 !px-3.5 text-xs flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Ticket</span>
                      </Link>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking.pnr)}
                          className="btn-secondary !py-2 !px-3.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
