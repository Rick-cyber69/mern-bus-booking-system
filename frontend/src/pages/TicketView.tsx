import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Booking } from '../types';
import { Download, CheckCircle, ArrowRight, QrCode } from 'lucide-react';

export const TicketView: React.FC = () => {
  const { pnr } = useParams<{ pnr: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        const found = res.data.bookings.find((b: Booking) => b.pnr === pnr);
        if (found) {
          setBooking(found);
        }
      } catch (err) {
        console.error('Error fetching ticket:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [pnr]);

  const handleDownloadPDF = async () => {
    if (!pnr) return;
    try {
      const response = await api.get(`/bookings/ticket/${pnr}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ticket-${pnr}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download PDF ticket');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 card text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Ticket Not Found</h3>
        <p className="text-xs text-slate-500">PNR {pnr} could not be retrieved.</p>
        <Link to="/" className="btn-primary text-xs inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  const schedule = booking.scheduleId;
  const bus = schedule?.busId;
  const route = schedule?.routeId;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Success Confirmation Card */}
        <div className="card p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Booking Confirmed</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">E-Ticket Ready</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">PNR: <strong className="text-slate-800">{booking.pnr}</strong></p>
          </div>

          {/* Digital Ticket Pass */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-5">
            <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Route</span>
                <div className="flex items-center space-x-2 text-lg font-bold text-slate-900 mt-0.5">
                  <span>{route?.originCity || 'Origin'}</span>
                  <ArrowRight className="w-4 h-4 text-red-600" />
                  <span>{route?.destinationCity || 'Destination'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Fare Paid</span>
                <span className="text-xl font-bold text-emerald-700">₹{booking.totalAmount}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Bus Operator</span>
                <span className="text-slate-800 font-semibold">{bus?.name || 'InterCity Line'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Category</span>
                <span className="text-slate-800 font-semibold">{bus?.busType}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Seats</span>
                <span className="text-red-600 font-bold">{booking.seatNumbers.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Status</span>
                <span className="text-emerald-700 font-bold uppercase">{booking.bookingStatus}</span>
              </div>
            </div>

            {/* QR Code Container */}
            {booking.qrCodeData && (
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <QrCode className="w-4 h-4 text-red-600" />
                    <span>Digital Boarding Pass QR</span>
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Show this QR code to the bus conductor upon boarding. Verified offline with cryptographic signatures.
                  </p>
                </div>

                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <img src={booking.qrCodeData} alt="Ticket QR Code" className="w-24 h-24" />
                </div>
              </div>
            )}
          </div>

          {/* Download PDF Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadPDF}
              className="btn-primary w-full sm:w-auto text-xs flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Ticket</span>
            </button>

            <Link
              to="/my-bookings"
              className="btn-secondary w-full sm:w-auto text-xs text-center"
            >
              View My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
