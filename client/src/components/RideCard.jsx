import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  ArrowRight, 
  GraduationCap, 
  Building2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const RideCard = ({ ride, showMatchScore = true }) => {
  if (!ride) return null;

  const driver = ride.driver || {};
  const isAvailable = ride.availableSeats > 0 && ride.status === 'scheduled';

  const statusColors = {
    scheduled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ongoing: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-slate-100 text-slate-700 border-slate-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft hover:shadow-card border border-slate-100 hover:border-brand-200 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                statusColors[ride.status] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {ride.status}
            </span>

            {showMatchScore && ride.matchScore !== undefined && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                <Sparkles className="w-3 h-3 text-brand-600" />
                <span>{ride.matchScore}% Route Match</span>
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-lg font-extrabold text-slate-900">
              ₹{ride.pricePerPassenger}
            </span>
            <span className="text-xs text-slate-400 font-medium block -mt-1">/ passenger</span>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-2 relative pl-6 border-l-2 border-dashed border-slate-200 ml-2 mb-5">
          <div className="relative">
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-brand-500 border-2 border-white ring-2 ring-brand-100" />
            <p className="text-xs text-slate-400 font-medium">Origin</p>
            <h4 className="text-base font-bold text-slate-900 leading-tight">{ride.from}</h4>
            {ride.pickupPoint && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">📍 {ride.pickupPoint}</p>
            )}
          </div>

          <div className="relative pt-2">
            <div className="absolute -left-[31px] top-2.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-100" />
            <p className="text-xs text-slate-400 font-medium">Destination</p>
            <h4 className="text-base font-bold text-slate-900 leading-tight">{ride.to}</h4>
            {ride.dropPoint && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">🎯 {ride.dropPoint}</p>
            )}
          </div>
        </div>

        {/* Departure & Vehicle Info */}
        <div className="grid grid-cols-2 gap-2 py-3 px-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-4">
          <div className="flex items-center space-x-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{ride.date}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{ride.departureTime}</span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className={ride.availableSeats > 0 ? 'text-emerald-700 font-semibold' : 'text-red-500 font-semibold'}>
              {ride.availableSeats} / {ride.totalSeats} seats left
            </span>
          </div>
          <div className="flex items-center space-x-1.5 truncate">
            <Car className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{ride.vehicleModel}</span>
          </div>
        </div>
      </div>

      {/* Driver Footer & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
            {driver.fullName ? driver.fullName.charAt(0).toUpperCase() : 'D'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate leading-tight">
              {driver.fullName || 'Driver'}
            </p>
            <div className="flex items-center space-x-1 text-[11px] text-slate-500">
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                {driver.rating ? Number(driver.rating).toFixed(1) : '5.0'}
              </span>
              <span>•</span>
              <span className="truncate text-slate-400">
                {driver.userType === 'College Student' ? 'Student' : 'Employee'}
              </span>
            </div>
          </div>
        </div>

        <Link
          to={`/ride/${ride._id}`}
          className="inline-flex items-center space-x-1 py-2 px-3.5 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm group-hover:shadow-md flex-shrink-0"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default RideCard;
