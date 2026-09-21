import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Car, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  PhoneCall, 
  Lock, 
  TrendingUp, 
  Leaf, 
  HeartHandshake, 
  Compass,
  GraduationCap,
  Building2 
} from 'lucide-react';

export const Landing = () => {
  const { isAuthenticated } = useAuth();

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Create an Account',
      desc: 'Sign up in 30 seconds with your college or corporate email address for verified safety.',
    },
    {
      step: '02',
      title: 'Find or Offer a Ride',
      desc: 'Search active routes along your daily commute or list your empty vehicle seats.',
    },
    {
      step: '03',
      title: 'Match with People',
      desc: 'Our intelligent scoring algorithm matches co-travelers taking identical routes and times.',
    },
    {
      step: '04',
      title: 'Travel Together',
      desc: 'Meet at convenient pickup spots, travel comfortably, and split fuel costs fairly.',
    },
    {
      step: '05',
      title: 'Rate Your Experience',
      desc: 'Leave honest ratings and reviews to build a trusted, reliable campus and office community.',
    },
  ];

  const features = [
    {
      icon: Compass,
      title: 'Smart Route Matching',
      desc: 'Instant percentage match calculated from your pickup, destination, and departure hours.',
      color: 'bg-brand-50 text-brand-600 border-brand-100',
    },
    {
      icon: Users,
      title: 'Seat Availability Tracking',
      desc: 'Live seat counts update instantly upon booking approvals to eliminate overbooking.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      icon: HeartHandshake,
      title: 'Seamless Ride Requests',
      desc: 'Passengers request seats with one click; drivers accept or decline requests in real time.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      icon: Star,
      title: 'Community Ratings & Reviews',
      desc: 'Peer ratings keep drivers and co-passengers accountable for punctuality and pleasant rides.',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      icon: PhoneCall,
      title: 'Emergency Contact Safety',
      desc: 'One-tap emergency contact dialer accessible right on active trip dashboards.',
      color: 'bg-red-50 text-red-600 border-red-100',
    },
    {
      icon: Lock,
      title: 'Secure Authentication',
      desc: 'Protected with encrypted passwords, JSON Web Tokens, and verified affiliation profiles.',
      color: 'bg-teal-50 text-teal-600 border-teal-100',
    },
    {
      icon: TrendingUp,
      title: 'Fair Cost Sharing',
      desc: 'Save up to 60% of monthly commuting expenses with transparent, non-commercial splitting.',
      color: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly Commuting',
      desc: 'Reduce traffic congestion and vehicular emissions across major campus & office corridors.',
      color: 'bg-green-50 text-green-600 border-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-sky-200 border border-white/15 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Smart Carpooling for Students & Working Professionals</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            Share the Ride.<br />
            <span className="bg-gradient-to-r from-sky-300 via-brand-200 to-emerald-300 bg-clip-text text-transparent">
              Save Money.
            </span><br />
            Travel Together.
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Find students and colleagues travelling your route, share rides, and make every journey smarter, safer, and cost-effective.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/find-ride" : "/register"}
              className="w-full sm:w-auto py-3.5 px-8 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-base"
            >
              <Search className="w-5 h-5" />
              <span>Find a Ride</span>
            </Link>

            <Link
              to={isAuthenticated ? "/offer-ride" : "/register"}
              className="w-full sm:w-auto py-3.5 px-8 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-base"
            >
              <PlusCircle className="w-5 h-5 text-sky-300" />
              <span>Offer a Ride</span>
            </Link>
          </div>

          {/* Social Proof Tags */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Members</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Campus & Corporate Corridors</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Top Rated Community (4.8+ Avg)</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Simple 5-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How CarPool Connect Works
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Everything you need to share rides effortlessly between your campus, tech park, and home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {howItWorksSteps.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-card border border-slate-100 flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <span className="text-2xl font-black text-brand-600 group-hover:scale-110 transition-transform inline-block">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100/60 w-full border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered For Safety & Convenience
            </h2>
            <p className="text-slate-500 text-sm">
              Discover why thousands of commuters choose CarPool Connect every weekday.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-card border border-slate-100 transition-all space-y-3"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus & Corporate Highlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-gradient-to-br from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-premium flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-200 border border-white/15">
              <Sparkles className="w-3 h-3" />
              <span>Join Your Campus or Workplace Community</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Ready to revolutionize your daily commute?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Whether you are traveling to college lectures or tech hubs, CarPool Connect pairs you with verified peers heading your way.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/register"
              className="py-3.5 px-6 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-2xl shadow-md transition-all text-center text-sm"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="py-3.5 px-6 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md transition-all text-center text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
