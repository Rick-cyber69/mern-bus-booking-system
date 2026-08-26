import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Bus,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
  Plus,
  Ticket,
  Filter,
  CheckCircle2,
  RefreshCw,
  MapPin,
  DollarSign
} from 'lucide-react';

export const OperatorServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'BOOKINGS'>('SERVICES');
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalServices: 0,
    totalRevenue: 0,
    totalSeatsBooked: 0,
    overallOccupancy: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOperatorData();
  }, []);

  const fetchOperatorData = async () => {
    setLoading(true);
    try {
      // Fetch operator services
      const servicesRes = await api.get('/schedules/operator-services');
      setServices(servicesRes.data.services || []);
      setStats(servicesRes.data.stats || {});

      // Fetch operator bookings
      const bookingsRes = await api.get('/bookings/operator-bookings');
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error('Error fetching operator data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const origin = s.routeId?.originCity || '';
    const dest = s.routeId?.destinationCity || '';
    const bus = s.busId?.name || '';
    const term = searchTerm.toLowerCase();
    return origin.toLowerCase().includes(term) || dest.toLowerCase().includes(term) || bus.toLowerCase().includes(term);
  });

  const filteredBookings = bookings.filter((b) => {
    const pnr = b.pnr || '';
    const name = b.passengers?.[0]?.name || b.userId?.name || '';
    const term = searchTerm.toLowerCase();
    return pnr.toLowerCase().includes(term) || name.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header Banner */}
        <div className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-red">
                <Bus className="w-3.5 h-3.5" /> Fleet Portal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Operator Services & Passenger Bookings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live manifest of your active bus schedules, seat occupancy metrics, and passenger booking records.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={fetchOperatorData}
              className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1.5"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <Link
              to="/operator-dashboard"
              className="btn-primary !py-2 !px-3.5 text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish New Trip</span>
            </Link>
          </div>
        </div>

        {/* Live Fleet Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card p-4 sm:p-5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active Departures</span>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalServices || services.length}</p>
            <span className="text-[10px] text-slate-400">Scheduled bus trips</span>
          </div>

          <div className="card p-4 sm:p-5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Bookings</span>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">{bookings.length}</p>
            <span className="text-[10px] text-slate-400">Confirmed passenger tickets</span>
          </div>

          <div className="card p-4 sm:p-5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Seats Reserved</span>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.totalSeatsBooked || 0}</p>
            <span className="text-[10px] text-slate-400">Occupancy: {stats.overallOccupancy || 0}%</span>
          </div>

          <div className="card p-4 sm:p-5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Estimated Revenue</span>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600">₹{stats.totalRevenue || 0}</p>
            <span className="text-[10px] text-slate-400">From active departures</span>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-slate-200/80 p-1 rounded-xl border border-slate-300/60 self-start">
            <button
              type="button"
              onClick={() => setActiveTab('SERVICES')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'SERVICES'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Active Services ({services.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('BOOKINGS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'BOOKINGS'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-red-600" />
              <span>Passenger Manifest ({bookings.length})</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'SERVICES' ? 'Search by city or bus...' : 'Search by PNR or name...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !pl-9 !py-2 text-xs"
            />
          </div>
        </div>

        {/* ============ TAB 1: ACTIVE SERVICES / SCHEDULES ============ */}
        {activeTab === 'SERVICES' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-500 text-sm">Loading fleet services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="card p-12 text-center space-y-3">
                <Bus className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Services Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchTerm ? 'No schedules match your search query.' : 'You have not published any departure schedules yet.'}
                </p>
                <Link to="/operator-dashboard" className="btn-primary text-xs inline-block">
                  Publish Your First Departure
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map((service) => {
                  const bus = service.busId;
                  const route = service.routeId;
                  const booked = service.bookedCount || service.bookedSeats?.length || 0;
                  const capacity = service.capacity || bus?.totalSeats || 36;
                  const percent = Math.round((booked / capacity) * 100);

                  return (
                    <div key={service._id} className="card p-5 space-y-4 flex flex-col justify-between">
                      {/* Top Route Details */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {bus?.busType}
                          </span>
                          <span className="badge-green text-[10px]">
                            SCHEDULED
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                            <span>{route?.originCity}</span>
                            <ArrowRight className="w-4 h-4 text-red-600" />
                            <span>{route?.destinationCity}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{bus?.name} &bull; <strong className="text-slate-700">{bus?.busNumber}</strong></p>
                        </div>

                        {/* Timing Block */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Departure</span>
                            <p className="font-bold text-slate-900 mt-0.5">
                              {new Date(service.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {new Date(service.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Base Fare</span>
                            <p className="font-bold text-red-600 text-sm mt-0.5">₹{service.baseFare}</p>
                            <p className="text-[10px] text-slate-500">Per seat</p>
                          </div>
                        </div>

                        {/* Occupancy Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Seat Occupancy</span>
                            <span className="font-bold text-slate-900">{booked} / {capacity} seats ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                percent > 75 ? 'bg-emerald-500' : percent > 40 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Est. Revenue</span>
                          <span className="font-bold text-emerald-700 text-sm">₹{service.estimatedRevenue || booked * service.baseFare}</span>
                        </div>

                        <Link
                          to={`/search?origin=${route?.originCity}&destination=${route?.destinationCity}`}
                          className="btn-secondary !py-1.5 !px-3 text-xs"
                        >
                          View as Passenger
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============ TAB 2: PASSENGER BOOKING MANIFEST ============ */}
        {activeTab === 'BOOKINGS' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-500 text-sm">Loading passenger manifest...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card p-12 text-center space-y-3">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Passenger Bookings</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchTerm ? 'No bookings match your search query.' : 'There are no active passenger bookings recorded for your fleet yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBookings.map((booking) => {
                  const schedule = booking.scheduleId;
                  const bus = schedule?.busId;
                  const route = schedule?.routeId;
                  const isCancelled = booking.bookingStatus === 'CANCELLED';

                  return (
                    <div key={booking._id} className="card p-5 space-y-4">
                      {/* Top PNR & Route */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
                              PNR: {booking.pnr}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                isCancelled ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {booking.bookingStatus}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 pt-1">
                            <span>{route?.originCity || 'Origin'}</span>
                            <ArrowRight className="w-4 h-4 text-red-600" />
                            <span>{route?.destinationCity || 'Destination'}</span>
                          </div>
                        </div>

                        <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Fare Paid</span>
                          <span className="text-lg font-bold text-slate-900">₹{booking.totalAmount}</span>
                        </div>
                      </div>

                      {/* Passenger Details & Seats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Passenger Name(s)</span>
                          <span className="font-bold text-slate-800">
                            {booking.passengers?.map((p: any) => p.name).join(', ') || booking.userId?.name || 'Guest Passenger'}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Assigned Seats</span>
                          <span className="font-bold text-red-600">{booking.seatNumbers?.join(', ')}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-medium">Bus Fleet</span>
                          <span className="font-semibold text-slate-700">{bus?.name} ({bus?.busNumber})</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Booked on: {new Date(booking.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <Link
                          to={`/ticket/${booking.pnr}`}
                          className="text-red-600 font-semibold hover:underline"
                        >
                          View E-Ticket & QR &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
