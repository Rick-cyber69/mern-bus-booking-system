import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, LogOut, Ticket, ShieldCheck, LayoutDashboard, Menu, X, CalendarCheck, PlusCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white leading-none">
                VeloxBus
              </span>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Book Buses Online</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/about"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Contact Us
            </Link>

            {user ? (
              <>
                {user.role === 'PASSENGER' && (
                  <Link
                    to="/my-bookings"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-red-400" />
                    <span>My Trips</span>
                  </Link>
                )}

                {user.role === 'OPERATOR' && (
                  <>
                    <Link
                      to="/operator-services"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4 text-emerald-400" />
                      <span>Services & Bookings</span>
                    </Link>

                    <Link
                      to="/operator-dashboard"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-red-400" />
                      <span>Add Fleet / Trip</span>
                    </Link>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/operator-services"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4 text-emerald-400" />
                      <span>All Services</span>
                    </Link>
                    <Link
                      to="/admin-dashboard"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-red-400" />
                      <span>Admin</span>
                    </Link>
                  </>
                )}

                <div className="w-px h-6 bg-slate-700 mx-2" />

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800">
                    <div className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-medium text-white leading-none">{user.name}</p>
                      <span className="text-[10px] text-slate-400">{user.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-slate-700 pt-3">
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">About Us</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">Contact Us</Link>

            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5 my-2 bg-slate-800/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <span className="text-xs text-slate-400">{user.role}</span>
                  </div>
                </div>
                {user.role === 'PASSENGER' && (
                  <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">My Trips</Link>
                )}
                {user.role === 'OPERATOR' && (
                  <>
                    <Link to="/operator-services" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-emerald-400 hover:text-white hover:bg-slate-800 rounded-lg">Services & Bookings</Link>
                    <Link to="/operator-dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">Add Fleet / Schedule</Link>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/operator-services" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-emerald-400 hover:text-white hover:bg-slate-800 rounded-lg">All Fleet Services</Link>
                    <Link to="/admin-dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">Admin Panel</Link>
                  </>
                )}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-slate-800 rounded-lg">Logout</button>
              </>
            ) : (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-slate-300 hover:text-white text-center">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block mx-3 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg text-center font-semibold">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
