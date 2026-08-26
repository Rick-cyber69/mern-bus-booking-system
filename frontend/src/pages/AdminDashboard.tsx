import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Route } from '../types';
import { ShieldCheck, Users, MapPin, Activity, Plus } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [operators, setOperators] = useState<User[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  // New Route Form
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [distanceKm, setDistanceKm] = useState(350);
  const [estimatedMinutes, setEstimatedMinutes] = useState(300);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const opsRes = await api.get('/auth/operators');
      setOperators(opsRes.data.operators || []);

      const routesRes = await api.get('/routes');
      setRoutes(routesRes.data.routes || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/routes', {
        originCity: originCity.trim(),
        destinationCity: destinationCity.trim(),
        distanceKm,
        estimatedMinutes
      });
      alert('New Route added to system master!');
      setOriginCity('');
      setDestinationCity('');
      fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add route');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">System Super Admin Dashboard</h2>
            <p className="text-xs text-slate-500 mt-1">Platform overview, fleet operators, and system master route management.</p>
          </div>
          <span className="badge-red self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>SUPER ADMIN</span>
          </span>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="card p-5 sm:p-6 space-y-2">
            <span className="text-xs text-slate-500 font-semibold block">Registered Bus Operators</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{operators.length}</span>
          </div>
          <div className="card p-5 sm:p-6 space-y-2">
            <span className="text-xs text-slate-500 font-semibold block">Active Master Routes</span>
            <span className="text-2xl sm:text-3xl font-bold text-red-600">{routes.length}</span>
          </div>
          <div className="card p-5 sm:p-6 space-y-2">
            <span className="text-xs text-slate-500 font-semibold block">Engine Status</span>
            <span className="text-base sm:text-lg font-bold text-emerald-600 flex items-center space-x-2">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>Operational (Self-Hosted)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Master Routes List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="card p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>Master System Routes ({routes.length})</span>
              </h3>

              <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                {routes.map((route) => (
                  <div key={route._id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900">
                        {route.originCity} → {route.destinationCity}
                      </span>
                      <span className="block text-xs text-slate-500 mt-0.5">
                        Distance: {route.distanceKm} km &bull; Duration: ~{Math.floor(route.estimatedMinutes / 60)}h {route.estimatedMinutes % 60}m
                      </span>
                    </div>
                    <span className="badge-green flex-shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Master Route Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="card p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-red-600" />
                <span>Add New Intercity Route</span>
              </h3>

              <form onSubmit={handleCreateRoute} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Origin City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Destination City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Distance (Km)</label>
                    <input
                      type="number"
                      required
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Duration (Minutes)</label>
                    <input
                      type="number"
                      required
                      value={estimatedMinutes}
                      onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10))}
                      className="input-field"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-xs"
                >
                  Add Route to Master
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
