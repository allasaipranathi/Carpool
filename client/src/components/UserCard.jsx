import React from 'react';
import { Star, GraduationCap, Building2, ShieldCheck } from 'lucide-react';

export const UserCard = ({ user, title = '', compact = false }) => {
  if (!user) return null;

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  if (compact) {
    return (
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
          {initials}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 leading-tight">{user.fullName}</p>
          <div className="flex items-center space-x-1 text-[11px] text-slate-500">
            <span className="flex items-center text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              {user.rating ? Number(user.rating).toFixed(1) : '5.0'}
            </span>
            <span>• {user.totalTrips || 0} trips</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-start space-x-3.5">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm ring-2 ring-white">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 truncate">{user.fullName}</h4>
          <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
            Verified
          </span>
        </div>

        <div className="flex items-center space-x-1.5 mt-1">
          {user.userType === 'College Student' ? (
            <span className="inline-flex items-center text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-medium truncate max-w-full">
              <GraduationCap className="w-3 h-3 mr-1 flex-shrink-0" />
              {user.collegeName || 'College Student'}
            </span>
          ) : (
            <span className="inline-flex items-center text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-medium truncate max-w-full">
              <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
              {user.companyName || 'Office Employee'}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500">
          <div className="flex items-center text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
            <span>{user.rating ? Number(user.rating).toFixed(1) : '5.0'}</span>
            <span className="text-slate-400 font-normal ml-1">({user.totalRatings || 0})</span>
          </div>
          <span>•</span>
          <span>{user.totalTrips || 0} completed rides</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
