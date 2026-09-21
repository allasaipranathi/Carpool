import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRides, getMyBookings, getMyOfferedRides } from '../services/api';
import RideCard from '../components/RideCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  PlusCircle, 
  Star, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Compass,
  AlertCircle 
} from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
  });

  const [recommendedRides, setRecommendedRides] = useState([]);
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Traveler';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch active rides
        const ridesRes = await getRides({ status: 'scheduled' });
        if (ridesRes.success) {
          // Exclude rides where current user is driver
          const otherRides = (ridesRes.data || []).filter(
            (r) => r.driver?._id !== user?._id
          );
          setRecommendedRides(otherRides.slice(0, 4));
        }

        // Fetch user's bookings to see if there is an upcoming trip
        const bookingsRes = await getMyBookings();
        if (bookingsRes.success && bookingsRes.data?.length > 0) {
          const upcoming = bookingsRes.data.find(
            (b) => b.status === 'accepted' || b.status === 'pending'
          );
          if (upcoming) {
            setUpcomingTrip(upcoming);
          }
        }
      } catch (err) {
        console.error('Failed to load home dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.from) query.set('from', searchParams.from);
    if (searchParams.to) query.set('to', searchParams.to);
    if (searchParams.date) query.set('date', searchParams.date);
    if (searchParams.time) query.set('time', searchParams.time);
    navigate(`/find-ride?${query.toString()}`);
  };

  // Estimated money saved calculation based on completed trips
  const estimatedSavings = (user?.totalTrips || 0) * 180;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-200 border border-white/15 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Verified Peer Carpool Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-1">
                Where are you travelling today?
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <Link
                to="/find-ride"
                className="py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center space-x-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Find Ride</span>
              </Link>
              <Link
                to="/offer-ride"
                className="py-2.5 px-4 bg-white/15 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 backdrop-blur-md transition-all flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Offer Ride</span>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
              <span className="text-xs text-sky-200 font-medium block">Your Trips</span>
              <span className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 block">
                {user?.totalTrips || 0}
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
              <span className="text-xs text-sky-200 font-medium block">Passenger Rating</span>
              <div className="flex items-center space-x-1 mt-0.5 text-xl sm:text-2xl font-extrabold text-amber-300">
                <Star className="w-5 h-5 fill-amber-300" />
                <span>{user?.rating ? Number(user.rating).toFixed(1) : '5.0'}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
              <span className="text-xs text-sky-200 font-medium block">Est. Money Saved</span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-300 mt-0.5 block">
                ₹{estimatedSavings}
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
              <span className="text-xs text-sky-200 font-medium block">Community Status</span>
              <span className="text-sm sm:text-base font-bold text-white mt-1 flex items-center space-x-1 truncate">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{user?.userType || 'Verified Member'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Main Search Widget (Floats over hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 w-full space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-brand-600" />
              <span>Search Routes & Match Rides</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Smart route scoring active</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  From (Origin)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchParams.from}
                    onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                    placeholder="e.g. Guntur"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  To (Destination)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchParams.to}
                    onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                    placeholder="e.g. Vijayawada"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={searchParams.date}
                    onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Preferred Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="time"
                    value={searchParams.time}
                    onChange={(e) => setSearchParams({ ...searchParams, time: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md hover:shadow-brand-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Find Matching Rides</span>
              </button>

              <Link
                to="/offer-ride"
                className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Offer a Ride</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Upcoming Trip Alert Card if any */}
        {upcomingTrip && (
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full">
                  Upcoming Trip ({upcomingTrip.status})
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {upcomingTrip.ride?.from} → {upcomingTrip.ride?.to}
                </h3>
                <p className="text-xs text-emerald-100/80">
                  Date: {upcomingTrip.ride?.date} at {upcomingTrip.ride?.departureTime} • Driver: {upcomingTrip.ride?.driver?.fullName}
                </p>
              </div>
            </div>

            <Link
              to={`/ride/${upcomingTrip.ride?._id}`}
              className="py-2.5 px-5 bg-white text-emerald-950 font-bold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition-all flex-shrink-0"
            >
              View Trip Itinerary
            </Link>
          </div>
        )}

        {/* Recommended Active Rides */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recommended Active Rides</h2>
              <p className="text-xs text-slate-500">Popular student and office carpool routes scheduled this week</p>
            </div>
            <Link
              to="/find-ride"
              className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
            >
              <span>Explore all rides</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Finding available routes..." />
          ) : recommendedRides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recommendedRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} showMatchScore={false} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No active rides scheduled yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first to publish a ride along your campus or office route!
              </p>
              <Link
                to="/offer-ride"
                className="inline-flex items-center space-x-1.5 py-2 px-4 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create a Ride</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
