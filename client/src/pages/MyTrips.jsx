import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking, createRating } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingStars from '../components/RatingStars';
import ConfirmationModal from '../components/ConfirmationModal';
import LiveRouteMap from '../components/LiveRouteMap';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Car, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  PhoneCall, 
  Sparkles,
  Navigation,
  X 
} from 'lucide-react';

export const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Rating modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingReview, setRatingReview] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Live Map Modal State
  const [trackingModalRide, setTrackingModalRide] = useState(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
      if (res.success) {
        setBookings(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
      setError('Unable to load your trips.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Filter bookings by tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return ['pending', 'accepted'].includes(b.status);
    }
    if (activeTab === 'completed') {
      return b.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return ['cancelled', 'rejected'].includes(b.status);
    }
    return true;
  });

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelLoading(true);
    try {
      const res = await cancelBooking(bookingToCancel._id);
      if (res.success) {
        setActionSuccess('Trip booking cancelled.');
        setCancelModalOpen(false);
        setBookingToCancel(null);
        fetchTrips();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForRating) return;
    setRatingLoading(true);
    try {
      const ride = selectedBookingForRating.ride;
      const driverId = selectedBookingForRating.driver?._id || ride?.driver?._id;

      const res = await createRating({
        rideId: ride._id,
        toUserId: driverId,
        rating: ratingStars,
        review: ratingReview,
        role: 'driver',
      });

      if (res.success) {
        setActionSuccess('Thank you! Your driver rating and review were saved.');
        setRatingModalOpen(false);
        setSelectedBookingForRating(null);
        setRatingReview('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setRatingLoading(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      completed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
      rejected: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${map[status] || 'bg-slate-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 mb-2">
          <Clock className="w-3.5 h-3.5" />
          <span>Passenger Trips</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Bookings & Travel History
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          View your requested seats, confirmed journeys, and leave reviews for your drivers.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-xs font-bold text-emerald-700">Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-sm font-semibold">
        {[
          { id: 'upcoming', label: 'Upcoming / Pending' },
          { id: 'completed', label: 'Completed Journeys' },
          { id: 'cancelled', label: 'Cancelled / Declined' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Trips Content */}
      {loading ? (
        <LoadingSpinner text="Loading your trips..." />
      ) : filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((b) => {
            const ride = b.ride || {};
            const driver = b.driver || ride.driver || {};
            return (
              <div
                key={b._id}
                className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {statusBadge(b.status)}
                    <span className="text-base font-extrabold text-slate-900">₹{b.totalPrice} ({b.seatsBooked} seat{b.seatsBooked > 1 ? 's' : ''})</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {ride.from || 'Origin'} → {ride.to || 'Destination'}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-slate-50 rounded-2xl text-xs text-slate-600 border border-slate-100">
                    <div className="flex items-center space-x-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ride.date}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ride.departureTime}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate col-span-2">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      <span>Driver: {driver.fullName || 'Verified Driver'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/ride/${ride._id}`}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                    >
                      View Details
                    </Link>

                    {ride._id && (
                      <button
                        onClick={() => setTrackingModalRide(ride)}
                        className="py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <Navigation className="w-3.5 h-3.5 text-brand-600" />
                        <span>Live Location Map</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {['pending', 'accepted'].includes(b.status) && (
                      <button
                        onClick={() => {
                          setBookingToCancel(b);
                          setCancelModalOpen(true);
                        }}
                        className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {b.status === 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedBookingForRating(b);
                          setRatingModalOpen(true);
                        }}
                        className="py-2 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>Rate Driver</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-soft space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No {activeTab} trips found</h3>
          <p className="text-xs text-slate-500">
            Search for available carpools along your route to book your first ride.
          </p>
          <Link
            to="/find-ride"
            className="inline-flex items-center space-x-1.5 py-2 px-4 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-700 transition-colors"
          >
            <span>Search Rides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel This Trip Booking?"
        message="Are you sure you want to cancel your seat? The driver will be notified immediately."
        confirmText="Yes, Cancel Booking"
        type="danger"
        loading={cancelLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          setBookingToCancel(null);
        }}
      />

      {/* Rate Driver Modal */}
      {ratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Rate Your Journey</h3>
              <button onClick={() => setRatingModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div className="text-center space-y-2 py-2">
                <p className="text-xs text-slate-500 font-medium">How was your trip with the driver?</p>
                <div className="flex justify-center">
                  <RatingStars
                    rating={ratingStars}
                    size="xl"
                    interactive={true}
                    onRate={(val) => setRatingStars(val)}
                  />
                </div>
                <span className="text-xs font-bold text-amber-500">{ratingStars} out of 5 Stars</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Feedback / Review
                </label>
                <textarea
                  value={ratingReview}
                  onChange={(e) => setRatingReview(e.target.value)}
                  rows="3"
                  placeholder="e.g. Great driver, on time, very polite and clean car!"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setRatingModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ratingLoading}
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {ratingLoading ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Map Tracking Modal Dialog */}
      {trackingModalRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden space-y-4 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="p-4 sm:p-6 pb-0 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  Real-Time Location Tracking
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {trackingModalRide.from} → {trackingModalRide.to}
                </h3>
              </div>
              <button
                onClick={() => setTrackingModalRide(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 pt-0">
              <LiveRouteMap rideId={trackingModalRide._id} isDriver={false} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyTrips;
