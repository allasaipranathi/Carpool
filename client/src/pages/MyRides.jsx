import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMyOfferedRides, completeRide, cancelRide } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  CarFront, 
  Calendar, 
  Clock, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';

export const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Complete / Cancel modals
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchMyRides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyOfferedRides();
      if (res.success) {
        setRides(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load offered rides:', err);
      setError('Unable to load your rides.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRides();
  }, [fetchMyRides]);

  const filteredRides = rides.filter((r) => {
    if (activeTab === 'active') {
      return ['scheduled', 'ongoing'].includes(r.status);
    }
    if (activeTab === 'completed') {
      return r.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return r.status === 'cancelled';
    }
    return true;
  });

  const handleConfirmComplete = async () => {
    if (!selectedRide) return;
    setModalLoading(true);
    try {
      const res = await completeRide(selectedRide._id);
      if (res.success) {
        setActionSuccess('Ride marked completed! Passenger trips updated.');
        setCompleteModalOpen(false);
        setSelectedRide(null);
        fetchMyRides();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete ride.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedRide) return;
    setModalLoading(true);
    try {
      const res = await cancelRide(selectedRide._id);
      if (res.success) {
        setActionSuccess('Ride and all related bookings cancelled.');
        setCancelModalOpen(false);
        setSelectedRide(null);
        fetchMyRides();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel ride.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            <CarFront className="w-3.5 h-3.5" />
            <span>Driver Ride Listings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Offered Rides
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Manage your published vehicle seats, accept passenger requests, and track completed journeys.
          </p>
        </div>

        <Link
          to="/offer-ride"
          className="py-3 px-5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Ride</span>
        </Link>
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
          { id: 'active', label: 'Active Scheduled Rides' },
          { id: 'completed', label: 'Completed Rides' },
          { id: 'cancelled', label: 'Cancelled Rides' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rides Content */}
      {loading ? (
        <LoadingSpinner text="Loading your offered rides..." />
      ) : filteredRides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRides.map((ride) => {
            const occupiedSeats = ride.totalSeats - ride.availableSeats;
            return (
              <div
                key={ride._id}
                className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {ride.status}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">₹{ride.pricePerPassenger}/seat</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {ride.from} → {ride.to}
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
                    <div className="flex items-center space-x-1.5 truncate">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-brand-700">
                        {occupiedSeats} / {ride.totalSeats} seats occupied
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <CarFront className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{ride.vehicleModel}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/ride/${ride._id}`}
                    className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1"
                  >
                    <span>View Requests</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {ride.status === 'scheduled' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRide(ride);
                          setCompleteModalOpen(true);
                        }}
                        className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRide(ride);
                          setCancelModalOpen(true);
                        }}
                        className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-soft space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <CarFront className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No {activeTab} rides listed</h3>
          <p className="text-xs text-slate-500">
            Driving to your college campus or workplace? Publish your empty seats and save fuel costs.
          </p>
          <Link
            to="/offer-ride"
            className="inline-flex items-center space-x-1.5 py-2 px-4 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-700 transition-colors"
          >
            <span>Publish a Ride</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Complete Trip Confirmation Modal */}
      <ConfirmationModal
        isOpen={completeModalOpen}
        title="Mark Ride as Completed?"
        message="This will conclude the journey for all accepted passengers and prompt everyone to submit ratings."
        confirmText="Yes, Complete Trip"
        type="success"
        loading={modalLoading}
        onConfirm={handleConfirmComplete}
        onCancel={() => {
          setCompleteModalOpen(false);
          setSelectedRide(null);
        }}
      />

      {/* Cancel Ride Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel This Scheduled Ride?"
        message="Cancelling this ride will immediately inform all booked passengers and remove it from public listings."
        confirmText="Yes, Cancel Ride"
        type="danger"
        loading={modalLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          setSelectedRide(null);
        }}
      />

    </div>
  );
};

export default MyRides;
