import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getRideById, 
  getRideBookings, 
  createBooking, 
  acceptBooking, 
  rejectBooking, 
  cancelRide, 
  completeRide 
} from '../services/api';
import UserCard from '../components/UserCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import EmergencyModal from '../components/EmergencyModal';
import ShareTripModal from '../components/ShareTripModal';
import LiveRouteMap from '../components/LiveRouteMap';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  PhoneCall, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  FileText, 
  HelpCircle,
  Loader2 
} from 'lucide-react';

export const RideDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [myBooking, setMyBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Modals state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Join request form state
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [pickupNote, setPickupNote] = useState('');
  const [dropNote, setDropNote] = useState('');

  const fetchRideData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getRideById(id);
      if (res.success) {
        setRide(res.data);

        // If current user is the driver, fetch all booking requests for this ride
        if (res.data.driver?._id === user?._id || user?.role === 'admin') {
          const bRes = await getRideBookings(id);
          if (bRes.success) {
            setBookings(bRes.data || []);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load ride:', err);
      setError('Ride not found or failed to load.');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchRideData();
  }, [fetchRideData]);

  const isDriver = ride?.driver?._id === user?._id;
  const isJoinedPassenger = ride?.passengers?.some((p) => p.user?._id === user?._id || p.user === user?._id);

  // Handle Join Request Submit
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setError('');
    try {
      const res = await createBooking({
        rideId: ride._id,
        seatsBooked: seatsRequested,
        pickupPoint: pickupNote,
        dropPoint: dropNote,
      });

      if (res.success) {
        setActionSuccess('Join request sent to driver! You will be notified when accepted.');
        setShowJoinModal(false);
        fetchRideData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit join request.';
      setError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  // Driver Accept Request
  const handleAcceptRequest = async (bookingId) => {
    try {
      const res = await acceptBooking(bookingId);
      if (res.success) {
        setActionSuccess('Booking request accepted! Seat availability updated.');
        fetchRideData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept booking.');
    }
  };

  // Driver Reject Request
  const handleRejectRequest = async (bookingId) => {
    try {
      const res = await rejectBooking(bookingId);
      if (res.success) {
        setActionSuccess('Booking request rejected.');
        fetchRideData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject booking.');
    }
  };

  // Driver Cancel Ride
  const handleCancelRide = async () => {
    setModalLoading(true);
    try {
      const res = await cancelRide(ride._id);
      if (res.success) {
        setShowCancelModal(false);
        fetchRideData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel ride.');
    } finally {
      setModalLoading(false);
    }
  };

  // Driver Complete Ride
  const handleCompleteRide = async () => {
    setModalLoading(true);
    try {
      const res = await completeRide(ride._id);
      if (res.success) {
        setShowCompleteModal(false);
        fetchRideData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark ride completed.');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading ride details..." />;

  if (error && !ride) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{error}</h2>
        <Link
          to="/find-ride"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ride Search</span>
        </Link>
      </div>
    );
  }

  const calculatedTotal = (ride?.pricePerPassenger || 0) * seatsRequested;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button & Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/find-ride"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matching Rides</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Share trip */}
          <button
            onClick={() => setShowShareModal(true)}
            className="py-2 px-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Share Trip</span>
          </button>

          {/* Emergency Safety button */}
          {(isDriver || isJoinedPassenger) && (
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>🚨 Safety / Emergency</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess('')}
            className="text-emerald-700 font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Details + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Itinerary & Vehicle (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Ride Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  Ride Itinerary
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {ride.from} → {ride.to}
                </h1>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">₹{ride.pricePerPassenger}</span>
                <span className="text-xs text-slate-400 block -mt-1 font-medium">per seat</span>
              </div>
            </div>

            {/* Visual Route Points */}
            <div className="space-y-4 pl-6 border-l-2 border-dashed border-brand-300 ml-2">
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-brand-500 ring-4 ring-brand-100" />
                <p className="text-xs font-semibold text-slate-400">Pickup Origin</p>
                <h4 className="text-base font-bold text-slate-900">{ride.from}</h4>
                {ride.pickupPoint && (
                  <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 p-2 rounded-lg inline-block border border-slate-100">
                    📍 Pickup Landmark: {ride.pickupPoint}
                  </p>
                )}
              </div>

              <div className="relative pt-2">
                <div className="absolute -left-[31px] top-2.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                <p className="text-xs font-semibold text-slate-400">Destination</p>
                <h4 className="text-base font-bold text-slate-900">{ride.to}</h4>
                {ride.dropPoint && (
                  <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 p-2 rounded-lg inline-block border border-slate-100">
                    🎯 Drop Landmark: {ride.dropPoint}
                  </p>
                )}
              </div>
            </div>

            {/* Time & Seats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  Date
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">{ride.date}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Departure
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">{ride.departureTime}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Est. Arrival
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">{ride.arrivalTime || 'Flexible'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  Available Seats
                </span>
                <p className={`text-sm font-bold mt-1 ${ride.availableSeats > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {ride.availableSeats} of {ride.totalSeats} seats left
                </p>
              </div>
            </div>

            {/* Vehicle & Guidelines */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Car className="w-4 h-4 text-indigo-600" />
                <span>Vehicle Specifications</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-indigo-950">
                <div>Type: <span className="font-bold">{ride.vehicleType}</span></div>
                <div>Model: <span className="font-bold">{ride.vehicleModel}</span></div>
                <div>Plate: <span className="font-mono font-bold">{ride.vehicleNumber}</span></div>
              </div>
              {ride.description && (
                <p className="text-xs text-indigo-900/80 pt-1 border-t border-indigo-100">
                  💬 <span className="italic">{ride.description}</span>
                </p>
              )}
            </div>

          </div>

          {/* Real-Time Live Location & Checkpoint Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span>Real-Time Vehicle Location & Checkpoint Map</span>
              </h3>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Satellite Feed</span>
              </span>
            </div>

            <LiveRouteMap 
              rideId={ride._id} 
              isDriver={isDriver} 
              onProgressUpdate={() => fetchRideData()}
            />
          </div>

          {/* Passenger List if authorized */}
          {(isDriver || isJoinedPassenger) && ride.passengers?.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-brand-600" />
                <span>Confirmed Co-Passengers ({ride.passengers.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ride.passengers.map((p, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
                      {p.user?.fullName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{p.user?.fullName || 'Co-Passenger'}</p>
                      <p className="text-[11px] text-slate-500">{p.seats || 1} seat(s) reserved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Driver Management: Pending Requests */}
          {isDriver && (
            <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-brand-600" />
                <span>Manage Join Requests ({bookings.length})</span>
              </h3>

              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((booking) => {
                    const pass = booking.passenger || {};
                    return (
                      <div
                        key={booking._id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-slate-900">{pass.fullName}</h4>
                            <span className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                              {pass.userType}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              booking.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Requested: <strong className="text-slate-800">{booking.seatsBooked} seat(s)</strong> (₹{booking.totalPrice})
                          </p>
                          {booking.pickupPoint && (
                            <p className="text-xs text-slate-500">Pickup note: {booking.pickupPoint}</p>
                          )}
                        </div>

                        {booking.status === 'pending' && (
                          <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleAcceptRequest(booking._id)}
                              className="flex-1 sm:flex-none py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(booking._id)}
                              className="flex-1 sm:flex-none py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No passenger requests received yet.</p>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Driver Card & Primary Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Driver Profile Card */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Offered by Driver
            </span>
            <UserCard user={ride.driver} />
          </div>

          {/* Action Box */}
          <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Trip Actions</h3>

            {!isDriver ? (
              <div className="space-y-3">
                {ride.status === 'scheduled' && ride.availableSeats > 0 ? (
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-md hover:shadow-brand-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>Request to Join Ride</span>
                  </button>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                    {ride.status !== 'scheduled' ? `This ride is ${ride.status}.` : 'No seats remaining on this ride.'}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {ride.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => setShowCompleteModal(true)}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Trip Completed</span>
                    </button>

                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Ride</span>
                    </button>
                  </>
                )}

                {ride.status === 'completed' && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs text-center font-semibold">
                    Trip successfully completed 🎉
                  </div>
                )}

                {ride.status === 'cancelled' && (
                  <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs text-center font-semibold">
                    This ride was cancelled.
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
              <p>💳 Payment: Cash / Direct UPI upon pickup</p>
              <p>🛡️ Verified Student & Corporate Members only</p>
            </div>
          </div>

        </div>

      </div>

      {/* Join Ride Request Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Request Seat(s)</h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Number of Seats
                </label>
                <select
                  value={seatsRequested}
                  onChange={(e) => setSeatsRequested(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 font-semibold"
                >
                  {[...Array(ride.availableSeats)].map((_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1} Seat{idx > 0 ? 's' : ''} (₹{ride.pricePerPassenger * (idx + 1)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Pickup Landmark Note
                </label>
                <input
                  type="text"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  placeholder="e.g. Near HP Petrol Pump / Gate 1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-brand-50/70 border border-brand-100 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-900">Total Contribution:</span>
                <span className="text-lg font-extrabold text-brand-700">₹{calculatedTotal}</span>
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {modalLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        emergencyContact={user?.emergencyContact}
        tripInfo={{ from: ride.from, to: ride.to, date: ride.date }}
      />

      {/* Share Trip Modal */}
      <ShareTripModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        ride={ride}
      />

      {/* Driver Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        title="Cancel this Scheduled Ride?"
        message="Cancelling this ride will immediately notify all confirmed passengers and cancel their bookings."
        confirmText="Yes, Cancel Ride"
        type="danger"
        loading={modalLoading}
        onConfirm={handleCancelRide}
        onCancel={() => setShowCancelModal(false)}
      />

      {/* Driver Complete Trip Modal */}
      <ConfirmationModal
        isOpen={showCompleteModal}
        title="Complete this Journey?"
        message="Marking this ride completed will conclude all bookings and prompt passengers to leave driver ratings."
        confirmText="Complete Journey"
        type="success"
        loading={modalLoading}
        onConfirm={handleCompleteRide}
        onCancel={() => setShowCompleteModal(false)}
      />

    </div>
  );
};

export default RideDetails;
