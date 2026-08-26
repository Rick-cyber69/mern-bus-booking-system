import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Users,
  Bus,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Building2
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [inquiryType, setInquiryType] = useState<'PASSENGER' | 'OPERATOR' | 'GENERAL'>('PASSENGER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pnr, setPnr] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      alert(`Thank you ${name}! Your inquiry has been received. Our team will contact you within 15 minutes.`);
      setName('');
      setEmail('');
      setPhone('');
      setPnr('');
      setMessage('');
      setSubmitted(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ============ HERO SECTION ============ */}
      <section className="hero-panel px-4 py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>24x7 Dedicated Passenger & Operator Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            We're Here to Help You
            <br />
            <span className="text-red-400">Every Mile of the Way</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Have a question about your bus booking, cancellation refund, or want to partner your fleet with VeloxBus? Reach out to our Kolkata head office.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* ============ TWO-TRACK SUPPORT CARDS ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Passenger Support */}
          <div className="card p-6 sm:p-8 space-y-4 border-l-4 border-l-red-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">For Travelers</span>
                <h3 className="text-lg font-bold text-slate-900">Passenger Care & Helpline</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Need assistance with your seat reservation, PNR tracking, digital QR boarding pass, or instant cancellation refund?
            </p>

            <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span><strong>Helpline:</strong> +91 33 2357 8900 / +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span><strong>Email:</strong> support@veloxbus.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Availability:</strong> 24 Hours &middot; 7 Days a Week</span>
              </div>
            </div>
          </div>

          {/* Operator Partnerships */}
          <div className="card p-6 sm:p-8 space-y-4 border-l-4 border-l-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">For Fleet Owners</span>
                <h3 className="text-lg font-bold text-slate-900">Operator Fleet Partnerships</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Looking to list your AC Sleepers, Volvo, or EV bus inventory on VeloxBus? Speak directly with our Kolkata fleet onboarding team.
            </p>

            <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-800 flex-shrink-0" />
                <span><strong>Fleet Desk:</strong> +91 33 2357 8901</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-800 flex-shrink-0" />
                <span><strong>Partner Inquiries:</strong> partners@veloxbus.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-slate-800 flex-shrink-0" />
                <span><strong>Office Hours:</strong> Mon – Sat &middot; 09:30 AM to 06:30 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ CONTACT FORM & HEAD OFFICE LOCATION ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form (Span 7) */}
          <div className="lg:col-span-7">
            <div className="card p-6 sm:p-8 space-y-6">
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">Send Us a Direct Message</h3>
                <p className="text-xs text-slate-500">Fill in the details below and our team will get back to you promptly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inquiry Type Tabs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">I am inquiring as:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setInquiryType('PASSENGER')}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                        inquiryType === 'PASSENGER'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Passenger
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('OPERATOR')}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                        inquiryType === 'OPERATOR'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Bus Operator
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('GENERAL')}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors ${
                        inquiryType === 'GENERAL'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      General Query
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  {inquiryType === 'PASSENGER' ? (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Booking PNR (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. PNR-981240"
                        value={pnr}
                        onChange={(e) => setPnr(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Fleet Agency Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Travels"
                        value={pnr}
                        onChange={(e) => setPnr(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Message / Inquiry Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please describe your question or requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-field resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="btn-primary w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitted ? 'Submitting Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Kolkata Head Office & Map Location (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Kolkata Office Address Card */}
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Headquarters</span>
                  <h3 className="text-base font-bold text-slate-900">Kolkata Head Office</h3>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p className="font-bold text-slate-900">VeloxBus India Technologies Pvt Ltd</p>
                <p>
                  EcoSpace Business Park, Block 4B, 6th Floor,
                  <br />
                  Action Area II, Sector V / New Town,
                  <br />
                  Kolkata, West Bengal 700156, India
                </p>
                <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-600">
                  <p><strong>Nearest Transit:</strong> Karunamoyee Bus Terminal & New Town Metro</p>
                  <p><strong>CIN:</strong> U72900WB2024PTC198420</p>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Map for Kolkata Office */}
            <div className="card p-4 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Office Map Location</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Sector V, Kolkata
                </span>
              </div>

              <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                <iframe
                  title="VeloxBus Kolkata Head Office"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14736.294156644265!2d88.42857432840552!3d22.576356784841926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275b020703c0d%3A0xece6f8e0fc2e1613!2sSector%20V%2C%20Bidhannagar%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
