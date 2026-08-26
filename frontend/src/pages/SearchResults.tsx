import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Schedule } from '../types';
import { SeatMap } from '../components/SeatMap';
import { Bus, Clock, ArrowRight, Filter, Star, CheckCircle2 } from 'lucide-react';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [holding, setHolding] = useState(false);
  const [busTypeFilter, setBusTypeFilter] = useState('ALL');

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ origin, destination, date }).toString();
        const res = await api.get(`/schedules/search?${query}`);
        setSchedules(res.data.schedules || []);
      } catch (err) {
        console.error('Error fetching schedules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [origin, destination, date]);

  const handleHoldAndProceed = async () => {
    if (!activeSchedule || selectedSeats.length === 0) return;
    setHolding(true);

    try {
      // 1. Trigger Redis seat hold API
      await api.post('/bookings/hold', {
        scheduleId: activeSchedule._id,
        seatNumbers: selectedSeats
      });

      // 2. Navigate to Checkout page with state
      navigate('/checkout', {
        state: {
          schedule: activeSchedule,
          selectedSeats
        }
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to hold seats. Please select alternative seats.');
    } finally {
      setHolding(false);
    }
  };

  const filteredSchedules = schedules.filter((s) => {
    if (busTypeFilter === 'ALL') return true;
    return s.busId?.busType?.includes(busTypeFilter);
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Route Header Banner */}
        <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 text-2xl font-bold text-slate-900">
              <span>{origin || 'Origin'}</span>
              <ArrowRight className="w-5 h-5 text-red-600" />
              <span>{destination || 'Destination'}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Journey Date: <span className="text-slate-800 font-semibold">{date || 'All Available Dates'}</span>
              <span className="mx-2">&middot;</span>
              <span className="text-emerald-600 font-medium">{filteredSchedules.length} buses found</span>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-medium">
            <Filter className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => setBusTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                busTypeFilter === 'ALL'
                  ? 'bg-red-600 border-red-600 text-white font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Buses
            </button>
            <button
              onClick={() => setBusTypeFilter('SLEEPER')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                busTypeFilter === 'SLEEPER'
                  ? 'bg-red-600 border-red-600 text-white font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Sleeper
            </button>
            <button
              onClick={() => setBusTypeFilter('SEATER')}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                busTypeFilter === 'SEATER'
                  ? 'bg-red-600 border-red-600 text-white font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Seater
            </button>
          </div>
        </div>

        {/* Main Results Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm">Searching live schedules across India...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="card p-12 text-center space-y-3">
            <Bus className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Buses Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No schedules matched your search between {origin} and {destination}. Try selecting different Indian cities like Bangalore, Hyderabad, Mumbai, Goa, or Delhi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Schedules List */}
            <div className={`space-y-4 ${activeSchedule ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
              {filteredSchedules.map((schedule) => {
                const bus = schedule.busId;
                const isSelected = activeSchedule?._id === schedule._id;

                return (
                  <div
                    key={schedule._id}
                    className={`card p-5 transition-all ${
                      isSelected ? 'ring-2 ring-red-600 border-red-200' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2.5">
                          <h3 className="text-base font-bold text-slate-900">{bus?.name || 'InterCity Express'}</h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {bus?.busType}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Departure: <strong className="text-slate-800">{new Date(schedule.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></span>
                          </span>
                          <span>&bull;</span>
                          <span>Reg: {bus?.busNumber}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {bus?.amenities?.slice(0, 4).map((amenity) => (
                            <span
                              key={amenity}
                              className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[11px] text-slate-400 block">Starting from</span>
                          <span className="text-2xl font-bold text-slate-900">₹{schedule.baseFare}</span>
                        </div>

                        <button
                          onClick={() => {
                            setActiveSchedule(schedule);
                            setSelectedSeats([]);
                          }}
                          className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                          }`}
                        >
                          {isSelected ? 'Viewing Seats' : 'Select Seats'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Seat Selection Drawer Panel */}
            {activeSchedule && (
              <div className="lg:col-span-6 space-y-4">
                <div className="card p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Select Seats</h3>
                      <p className="text-xs text-slate-500">{activeSchedule.busId?.name}</p>
                    </div>
                    <button
                      onClick={() => setActiveSchedule(null)}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-700"
                    >
                      Close ✕
                    </button>
                  </div>

                  <SeatMap
                    scheduleId={activeSchedule._id}
                    seatLayout={activeSchedule.busId?.seatLayout || []}
                    bookedSeats={activeSchedule.bookedSeats || []}
                    initialLockedSeats={[]}
                    baseFare={activeSchedule.baseFare}
                    onSeatSelectionChange={setSelectedSeats}
                  />

                  {/* Selection Summary Footer */}
                  {selectedSeats.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-red-700 font-medium block">
                          Selected ({selectedSeats.length} seats):
                        </span>
                        <span className="text-base font-bold text-slate-900">{selectedSeats.join(', ')}</span>
                        <span className="block text-xs font-bold text-emerald-700 mt-0.5">
                          Total: ₹{selectedSeats.length * activeSchedule.baseFare}
                        </span>
                      </div>

                      <button
                        onClick={handleHoldAndProceed}
                        disabled={holding}
                        className="btn-primary text-xs !py-2.5 !px-5"
                      >
                        <span>{holding ? 'Locking...' : 'Hold & Checkout'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
