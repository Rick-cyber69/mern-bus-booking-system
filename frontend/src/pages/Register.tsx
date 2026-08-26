import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, User, Bus } from 'lucide-react';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('PASSENGER');
  const [operatorName, setOperatorName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        role,
        operatorName: role === 'OPERATOR' ? operatorName : ''
      });
      login(res.data.token, res.data.user);

      if (role === 'OPERATOR') {
        navigate('/operator-dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 sm:py-12 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="card p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white mx-auto shadow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create New Account</h2>
            <p className="text-xs text-slate-500">Sign up as a Passenger or Fleet Operator</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setRole('PASSENGER')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  role === 'PASSENGER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Passenger</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('OPERATOR')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  role === 'OPERATOR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>Bus Operator</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="input-field"
              />
            </div>

            {role === 'OPERATOR' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Travel Agency / Fleet Name</label>
                <input
                  type="text"
                  required
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  placeholder="Royal Express Travels"
                  className="input-field"
                />
              </div>
            )}

            <div className="space-y-1">
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Mobile Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="input-field"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-bold disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-xs text-center text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
