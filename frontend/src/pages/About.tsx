import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bus,
  ShieldCheck,
  Zap,
  Users,
  Award,
  Clock,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  TrendingUp,
  MapPin,
  HeartHandshake
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ============ HERO SECTION ============ */}
      <section className="hero-panel px-4 py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transforming Intercity Bus Mobility in India</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Building India's Most Reliable
            <br />
            <span className="text-red-400">Bus Booking Ecosystem</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            VeloxBus bridges passengers seeking comfortable, punctual bus travel with India's top certified private and state fleet operators through high-speed seat reservation technology.
          </p>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">40+</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Hub Cities Connected</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">450+</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Daily Active Trips</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600">50,000+</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Happy Passengers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-amber-500">4.8★</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Average Fleet Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHO WE SERVE: TWO-COLUMN PILLARS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Empowering Both Passengers & Bus Operators</h2>
          <p className="text-slate-500 text-sm">Designed specifically to solve long-distance transit bottlenecks across India</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Passengers */}
          <div className="card p-6 sm:p-8 space-y-6 border-t-4 border-t-red-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">For Travelers</span>
                <h3 className="text-xl font-bold text-slate-900">For Passengers</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              We eliminate the stress of double-booked seats and paper tickets. With VeloxBus, you get guaranteed berth holds, real-time live availability, and verified luxury buses.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Guaranteed Seat Hold:</strong> Once selected, your berth is held for 10 minutes exclusively for you.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Paperless QR Pass:</strong> Instant cryptographic boarding pass on your phone with offline conductor scan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Instant 1-Click Refunds:</strong> Fast automated cancellation refunds processed without waiting days.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Verified Amenities:</strong> Clean sanitized blankets, charging points, GPS tracking, and bottled water.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link to="/" className="btn-primary text-xs w-full sm:w-auto">
                Search & Book Buses
              </Link>
            </div>
          </div>

          {/* For Operators */}
          <div className="card p-6 sm:p-8 space-y-6 border-t-4 border-t-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">For Fleet Partners</span>
                <h3 className="text-xl font-bold text-slate-900">For Bus Operators</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              We empower private bus fleet operators with an enterprise digital management portal to optimize seat occupancy, control route pricing, and prevent inventory collisions.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
                <span><strong>Fleet & Layout Builder:</strong> Configure single/double-deck AC Sleeper (2+1) and AC Seater (2+2) layouts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
                <span><strong>Zero-Collision Concurrency:</strong> Automated atomic seat reservations eliminate duplicate ticket conflicts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
                <span><strong>Dynamic Schedule Publishing:</strong> Launch seasonal holiday express buses with customized base fares.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
                <span><strong>Direct Conductor Verification:</strong> Offline QR scanner verifies passenger tickets at boarding points.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link to="/register" className="btn-secondary text-xs w-full sm:w-auto">
                Register as Fleet Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CORE VALUES & SAFETY ============ */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Core Principles</h2>
            <p className="text-slate-500 text-sm">The foundation of everything we build at VeloxBus</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-6 space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Punctuality First</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We partner with operators that maintain on-time departures and optimal highway routing across all interstate corridors.
              </p>
            </div>

            <div className="card p-6 space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Data Lock-in</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Self-contained, highly secure architecture with offline cryptographic ticket verification and complete data privacy.
              </p>
            </div>

            <div className="card p-6 space-y-3 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Transparent Pricing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No hidden booking fees, no surprise convenience charges. What you see on the seat map is exactly what you pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-8 sm:p-12 text-center bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold">Ready to Experience Smarter Bus Travel?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Book your journey across 40+ Indian hub cities today with real-time seat lock guarantee.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="btn-primary w-full sm:w-auto">
              Book Tickets Now
            </Link>
            <Link to="/contact" className="btn-secondary !bg-slate-800 !text-white !border-slate-700 hover:!bg-slate-700 w-full sm:w-auto">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
