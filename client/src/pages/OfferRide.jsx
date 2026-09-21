import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRide } from '../services/api';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  IndianRupee, 
  FileText, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Loader2 
} from 'lucide-react';

export const OfferRide = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    pickupPoint: '',
    dropPoint: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    availableSeats: 3,
    vehicleType: 'Car',
    vehicleModel: '',
    vehicleNumber: '',
    pricePerPassenger: 100,
    description: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.from.trim()) {
      setError('Please provide origin (From location).');
      return false;
    }
    if (!formData.to.trim()) {
      setError('Please provide destination (To location).');
      return false;
    }
    if (!formData.date) {
      setError('Please choose a travel date.');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(`${formData.date}T23:59:59`);
    if (selectedDate < today) {
      setError('Ride date cannot be in the past.');
      return false;
    }

    if (!formData.departureTime) {
      setError('Please provide departure time.');
      return false;
    }

    const seats = parseInt(formData.availableSeats, 10);
    if (isNaN(seats) || seats < 1) {
      setError('Available seats must be at least 1.');
      return false;
    }

    const price = parseFloat(formData.pricePerPassenger);
    if (isNaN(price) || price < 0) {
      setError('Price per passenger cannot be negative.');
      return false;
    }

    if (!formData.vehicleModel.trim()) {
      setError('Please provide your vehicle model (e.g. Hyundai Creta).');
      return false;
    }

    if (!formData.vehicleNumber.trim()) {
      setError('Please provide your vehicle registration number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await createRide(formData);
      if (res.success && res.data?._id) {
        navigate(`/ride/${res.data._id}`);
      } else {
        navigate('/my-rides');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create ride. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Driver Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Publish a New Carpool Ride
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          List your empty seats, share daily travel expenses, and commute safely with verified co-travelers.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-8">
        
        {/* Step 1: Route Details */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs">1</span>
            <span>Route & Itinerary</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                From Location (City/Area) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  placeholder="e.g. Guntur"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                To Location (City/Area) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="e.g. Vijayawada"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Exact Pickup Point (Optional)
              </label>
              <input
                type="text"
                name="pickupPoint"
                value={formData.pickupPoint}
                onChange={handleChange}
                placeholder="e.g. Laxmipuram Bus Stand / Ring Road"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Exact Drop Point (Optional)
              </label>
              <input
                type="text"
                name="dropPoint"
                value={formData.dropPoint}
                onChange={handleChange}
                placeholder="e.g. Benz Circle / Tech Mahindra Gate"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Schedule & Pricing */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs">2</span>
            <span>Date, Time & Cost Sharing</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Departure Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Est. Arrival Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Price / Passenger (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 font-bold text-sm">
                  ₹
                </div>
                <input
                  type="number"
                  name="pricePerPassenger"
                  value={formData.pricePerPassenger}
                  onChange={handleChange}
                  min="0"
                  step="5"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Vehicle Information */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs">3</span>
            <span>Vehicle Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Auto">Auto</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Available Seats <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  min="1"
                  max="8"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Vehicle Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                placeholder="e.g. Hyundai Creta (White)"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Registration / Plate Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g. AP 07 BK 4521"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 uppercase tracking-wider placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Notes */}
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Trip Guidelines / Co-traveler Notes (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="e.g. AC available, luggage space for backpacks, no smoking, college music friendly."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Submit Action */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-md hover:shadow-brand-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-70 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publishing your ride...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Publish Ride & Open Requests</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default OfferRide;
