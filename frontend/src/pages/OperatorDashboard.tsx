import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bus as BusType, Route, Schedule } from '../types';
import { Bus, Plus, Calendar, Layers, Clock } from 'lucide-react';

export const OperatorDashboard: React.FC = () => {
  const [buses, setBuses] = useState<BusType[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Bus Creation Form State
  const [busNumber, setBusNumber] = useState('');
  const [busName, setBusName] = useState('');
  const [type, setType] = useState('AC_SLEEPER');
  const [totalSeats, setTotalSeats] = useState(36);

  // Schedule Creation Form State
  const [selectedBus, setSelectedBus] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [baseFare, setBaseFare] = useState(850);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const busesRes = await api.get('/buses');
      setBuses(busesRes.data.buses || []);

      const routesRes = await api.get('/routes');
      setRoutes(routesRes.data.routes || []);

      if (routesRes.data.routes?.length > 0) {
        setSelectedRoute(routesRes.data.routes[0]._id);
      }
      if (busesRes.data.buses?.length > 0) {
        setSelectedBus(busesRes.data.buses[0]._id);
      }
    } catch (err) {
      console.error('Error fetching operator data:', err);
    }
  };

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/buses', {
        busNumber,
        name: busName,
        busType: type,
        totalSeats,
        amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle']
      });
      alert('Bus added to fleet successfully!');
      setBusNumber('');
      setBusName('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add bus');
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBus || !selectedRoute) return;
    try {
      await api.post('/schedules', {
        busId: selectedBus,
        routeId: selectedRoute,
        departureTime,
        arrivalTime,
        baseFare
      });
      alert('Departure Schedule published successfully!');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create schedule');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="card p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Operator Fleet Control Panel</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your fleet of buses, customize sleeper/seater configurations, and publish departure schedules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Create Bus Form */}
          <div className="card p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Bus className="w-5 h-5 text-red-600" />
              <span>Add Bus to Fleet</span>
            </h3>

            <form onSubmit={handleCreateBus} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Bus Registration Number</label>
                <input
                  type="text"
                  required
                  placeholder="KA-01-AK-9901"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Bus Model / Line Name</label>
                <input
                  type="text"
                  required
                  placeholder="Volvo 9600 Multi-Axle AC Sleeper"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Bus Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="input-field"
                  >
                    <option value="AC_SLEEPER">AC Sleeper (2+1)</option>
                    <option value="NON_AC_SLEEPER">Non-AC Sleeper</option>
                    <option value="AC_SEATER">AC Seater (2+2)</option>
                    <option value="NON_AC_SEATER">Non-AC Seater</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Total Capacity</label>
                  <input
                    type="number"
                    required
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(parseInt(e.target.value, 10))}
                    className="input-field"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-xs flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Register Bus</span>
              </button>
            </form>
          </div>

          {/* Schedule Departure Form */}
          <div className="card p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>Publish Departure Schedule</span>
            </h3>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Select Bus</label>
                <select
                  value={selectedBus}
                  onChange={(e) => setSelectedBus(e.target.value)}
                  className="input-field"
                >
                  {buses.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name} ({b.busNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Select Intercity Route</label>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="input-field"
                >
                  {routes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.originCity} → {r.destinationCity} ({r.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Departure Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Arrival Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Base Ticket Fare (₹)</label>
                <input
                  type="number"
                  step="1"
                  required
                  value={baseFare}
                  onChange={(e) => setBaseFare(parseFloat(e.target.value))}
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-xs flex items-center justify-center space-x-2"
              >
                <Clock className="w-4 h-4" />
                <span>Publish Schedule</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
