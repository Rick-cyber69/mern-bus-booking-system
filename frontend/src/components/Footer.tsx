import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bus,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowUpRight,
  MapPin
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Guaranteed Seat Booking</h4>
                <p className="text-xs text-slate-400 mt-0.5">Real-time seat locking with zero double-booking risk.</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-500 flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Instant QR Boarding</h4>
                <p className="text-xs text-slate-400 mt-0.5">Paperless digital tickets with instant offline QR verification.</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-600/30 flex items-center justify-center text-amber-500 flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">24x7 Customer Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Dedicated passenger helpline & instant cancellation refunds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column (Span 2 on large) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white leading-none">VeloxBus</span>
                <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">India's Smartest Bus Booking</p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              VeloxBus connects 40+ major Indian hub cities with over 450+ daily scheduled departures. Headquartered in Kolkata with 24x7 passenger care and real-time seat reservation.
            </p>

            <div className="text-xs text-slate-400 flex items-start gap-2 pt-1">
              <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>EcoSpace Business Park, Sector V, New Town, Kolkata, West Bengal 700156</span>
            </div>

            {/* Social Media Links */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Follow Us</p>
              <div className="flex items-center gap-2.5">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Twitter / X">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About VeloxBus</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us & Helpline</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">For Passengers</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">For Fleet Operators</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Partner Onboarding</Link></li>
            </ul>
          </div>

          {/* Popular Routes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Popular Routes</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/search?origin=Bangalore&destination=Hyderabad" className="hover:text-white transition-colors">Bangalore to Hyderabad</Link></li>
              <li><Link to="/search?origin=Mumbai&destination=Goa" className="hover:text-white transition-colors">Mumbai to Goa Sleeper</Link></li>
              <li><Link to="/search?origin=Delhi&destination=Jaipur" className="hover:text-white transition-colors">Delhi to Jaipur Express</Link></li>
              <li><Link to="/search?origin=Bangalore&destination=Chennai" className="hover:text-white transition-colors">Bangalore to Chennai</Link></li>
              <li><Link to="/search?origin=Kolkata&destination=Siliguri" className="hover:text-white transition-colors">Kolkata to Siliguri AC</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">Track Ticket Status</Link></li>
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">Cancel Ticket</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Refund Inquiries</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Kolkata Office Map</Link></li>
              <li className="flex items-center gap-1.5 text-slate-300 pt-1">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>support@veloxbus.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} VeloxBus India Technologies Pvt Ltd &middot; Kolkata, India</span>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">UPI</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">RuPay</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Visa</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Mastercard</span>
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
