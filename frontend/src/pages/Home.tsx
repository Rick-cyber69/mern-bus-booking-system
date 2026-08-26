import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeftRight,
  Zap,
  Award,
  ShieldCheck,
  ChevronDown,
  Flame,
  Activity,
  Lock,
  Star,
  Percent,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  Tag
} from 'lucide-react';

export const Home: React.FC = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await api.get('/routes/cities');
        setCities(res.data.cities || []);
        if (res.data.cities?.length >= 2) {
          setOrigin(res.data.cities.includes('Bangalore') ? 'Bangalore' : res.data.cities[0]);
          setDestination(res.data.cities.includes('Hyderabad') ? 'Hyderabad' : res.data.cities[1]);
        }
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    };
    fetchCities();
  }, []);

  const handleSwapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleQuickDate = (offsetDays: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + offsetDays);
    setDate(targetDate.toISOString().split('T')[0]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) {
      alert('Please select both origin and destination cities');
      return;
    }
    const queryParams = new URLSearchParams({ origin, destination, date }).toString();
    navigate(`/search?${queryParams}`);
  };

  const popularRoutes = [
    {
      from: 'Bangalore',
      to: 'Hyderabad',
      fare: '₹850',
      duration: '8h 00m',
      busName: 'VRL Volvo 9600 Multi-Axle AC Sleeper',
      busType: 'AC Sleeper',
      availableSeats: 12,
      departure: '09:30 PM',
      arrival: '05:30 AM',
      rating: 4.8,
      amenities: ['WiFi', 'Charging Point', 'Blanket', 'Water Bottle']
    },
    {
      from: 'Mumbai',
      to: 'Goa',
      fare: '₹1,200',
      duration: '11h 00m',
      busName: 'SRS Royal Scania Multi-Axle Sleeper',
      busType: 'AC Sleeper',
      availableSeats: 8,
      departure: '08:30 PM',
      arrival: '07:30 AM',
      rating: 4.7,
      amenities: ['WiFi', 'Snacks', 'Charging Point', 'Live Tracking']
    },
    {
      from: 'Delhi',
      to: 'Jaipur',
      fare: '₹550',
      duration: '5h 00m',
      busName: 'SRS InterCity Luxury Coach (2+2)',
      busType: 'AC Seater',
      availableSeats: 16,
      departure: '07:30 AM',
      arrival: '12:30 PM',
      rating: 4.5,
      amenities: ['Charging Point', 'Reclining Seats', 'Reading Light']
    }
  ];

  const faqs = [
    {
      q: 'How does real-time seat reservation work?',
      a: 'When you tap any seat on our interactive seat map, it is immediately locked exclusively for you for 10 minutes. No other passenger can select the same seat during checkout, completely preventing double bookings.'
    },
    {
      q: 'How do I board the bus with my digital ticket?',
      a: 'After completing your booking, you receive an instant digital QR Boarding Pass (viewable on mobile and downloadable as PDF). Simply show the QR code to the bus conductor at the boarding point for offline verification.'
    },
    {
      q: 'Can I cancel my bus ticket and get an instant refund?',
      a: 'Yes. You can cancel your booking anytime from "My Trips" before bus departure. Eligible refunds are automatically processed back to your original payment method.'
    },
    {
      q: 'What amenities are provided on AC Sleeper buses?',
      a: 'Our AC Sleeper coaches (Volvo 9600, Scania, Mercedes-Benz) include clean sanitized blankets, personal charging points, LED reading lights, complimentary packaged water bottles, and free onboard WiFi.'
    }
  ];

  const whyUsItems = [
    {
      icon: Zap,
      title: 'Guaranteed Seat Lock',
      desc: 'Sub-second real-time seat locking guarantees your chosen berth with zero double-booking risk.',
      color: 'text-red-600 bg-red-50'
    },
    {
      icon: ShieldCheck,
      title: 'Free Cancellation',
      desc: 'Hassle-free 1-click ticket cancellations with instant refund processing directly to your account.',
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      icon: Award,
      title: 'Digital QR Boarding',
      desc: 'Paperless digital boarding passes with offline QR codes and downloadable PDF tickets.',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: Activity,
      title: '24x7 Passenger Care',
      desc: 'Round-the-clock customer helpline assistance, boarding point support, and live trip status.',
      color: 'text-amber-600 bg-amber-50'
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-slate-50">
      {/* ============ HIGH-CONVERTING MARQUEE TICKER BAR ============ */}
      <div className="marquee-wrapper bg-slate-800 py-2">
        <div className="marquee-track flex items-center gap-12 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Tag className="w-3.5 h-3.5 text-red-400" />
            Special Offer: Flat 15% OFF on your first booking — Use Code: <strong className="text-white bg-red-600/30 px-1.5 py-0.5 rounded border border-red-500/40">FIRSTBUS</strong>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Guaranteed Seat Reservations with Instant Booking Confirmation
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Free Cancellation & Instant Refund Available on All AC Routes
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            40+ Top Cities & 450+ Daily Departures Connected Across India
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            4.8★ Rated Luxury Sleeper Experience on Volvo & Scania Fleets
          </span>

          {/* Duplicate loop for continuous marquee */}
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Tag className="w-3.5 h-3.5 text-red-400" />
            Special Offer: Flat 15% OFF on your first booking — Use Code: <strong className="text-white bg-red-600/30 px-1.5 py-0.5 rounded border border-red-500/40">FIRSTBUS</strong>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Guaranteed Seat Reservations with Instant Booking Confirmation
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Free Cancellation & Instant Refund Available on All AC Routes
          </span>
        </div>
      </div>

      {/* ============ HERO + SEARCH ============ */}
      <section className="hero-panel px-4 py-8 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              India's Smartest Way to
              <br />
              <span className="text-red-400">Book Bus Tickets</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base px-2">
              Search, compare, and book intercity bus tickets across India with real-time seat availability and instant QR boarding passes.
            </p>
          </div>

          {/* ===== SEARCH FORM ===== */}
          <div className="search-box p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-end gap-3">
                {/* Origin */}
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    From
                  </label>
                  <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="input-field">
                    <option value="">Select Origin City</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Swap */}
                <div className="flex justify-center md:pb-1">
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    title="Swap Cities"
                    className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 flex items-center justify-center transition-all duration-200 hover:rotate-180"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination */}
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    To
                  </label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)} className="input-field">
                    <option value="">Select Destination City</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Date */}
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Date of Journey
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Quick Dates */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Quick Dates:</span>
                  {[
                    { label: 'Today', offset: 0 },
                    { label: 'Tomorrow', offset: 1 },
                    { label: 'Day After', offset: 2 },
                  ].map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => handleQuickDate(d.offset)}
                      className="px-2.5 py-1 rounded-lg text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 font-medium transition-colors text-xs"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Real-time Live Seat Availability</span>
                </div>
              </div>

              {/* Search Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto sm:px-12 py-3 text-sm font-bold flex items-center justify-center gap-2 mx-auto"
                >
                  <Search className="w-4 h-4" />
                  Search Buses
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">Why Book With VeloxBus?</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Guaranteed lowest fares, certified operators, and zero-hassle cancellations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {whyUsItems.map((item, idx) => (
            <div key={idx} className="card p-5 space-y-3 text-center">
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto`}>
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ POPULAR ROUTES ============ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <span className="badge-red">
                <Flame className="w-3 h-3" /> Trending
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">Popular Indian Bus Routes</h2>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Frequent daily departures</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {popularRoutes.map((route, idx) => (
              <div key={idx} className="card overflow-hidden flex flex-col">
                {/* Route Header */}
                <div className="p-4 sm:p-5 pb-4 border-b border-slate-100 flex-1 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{route.busType}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {route.rating}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium truncate">{route.busName}</p>

                  {/* Route Display */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-center">
                      <p className="text-base sm:text-lg font-bold text-slate-900">{route.departure}</p>
                      <p className="text-xs text-slate-500 font-medium">{route.from}</p>
                    </div>
                    <div className="flex-1 mx-3 relative">
                      <div className="border-t-2 border-dashed border-slate-200" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1.5">
                        <span className="text-[10px] text-slate-400 font-medium">{route.duration}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-base sm:text-lg font-bold text-slate-900">{route.arrival}</p>
                      <p className="text-xs text-slate-500 font-medium">{route.to}</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {route.amenities.map((a) => (
                      <span key={a} className="text-[9px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">{a}</span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <p className="text-[10px] text-slate-400">Starting from</p>
                    <p className="text-lg font-bold text-slate-900">{route.fare}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-emerald-600 font-semibold mb-1">{route.availableSeats} seats left</p>
                    <button
                      type="button"
                      onClick={() => {
                        setOrigin(route.from);
                        setDestination(route.to);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="btn-primary !py-1.5 !px-3 text-xs"
                    >
                      Select Bus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Three simple steps to your next journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { step: '1', title: 'Search Routes', desc: 'Enter origin, destination city in India, and your travel date.' },
            { step: '2', title: 'Select Berth / Seat', desc: 'Choose your preferred berth with real-time seat lock guarantee.' },
            { step: '3', title: 'Get Digital QR Ticket', desc: 'Complete booking and receive your instant digital PDF boarding pass.' },
          ].map((item) => (
            <div key={item.step} className="text-center space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white text-lg font-bold flex items-center justify-center mx-auto shadow-sm">
                {item.step}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">40+</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Top Cities</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-red-400">450+</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Daily Departures</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">50K+</p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Happy Travelers</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-amber-400">4.8<span className="text-sm">★</span></p>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div key={idx} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full px-4 sm:px-5 py-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-red-500' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-3.5 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
