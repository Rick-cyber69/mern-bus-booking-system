import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, User, Bus, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);

      if (res.data.user.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (res.data.user.role === 'OPERATOR') {
        navigate('/operator-dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (emailVal: string) => {
    setEmail(emailVal);
    setPassword('password123');
  };

  const demoAccounts = [
    { label: 'Passenger', email: 'alex@gmail.com', icon: User, desc: 'Book tickets' },
    { label: 'Operator', email: 'operator@expressbus.com', icon: Bus, desc: 'Manage fleet' },
    { label: 'Admin', email: 'admin@busbooking.local', icon: ShieldCheck, desc: 'Full access' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <LogIn className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sign in to VeloxBus</h2>
            <p className="text-xs text-slate-500">Enter your credentials to continue</p>
          </div>

          {/* Quick Demo Access */}
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-center">
              Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                    email === acc.email
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <acc.icon className="w-4 h-4" />
                  <span className="text-[11px] font-semibold">{acc.label}</span>
                  <span className="text-[9px] text-slate-400">{acc.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] font-semibold text-slate-400 uppercase">or use email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-xs text-center text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-600 font-semibold hover:text-red-700 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
