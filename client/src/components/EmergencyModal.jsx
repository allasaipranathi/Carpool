import React, { useState } from 'react';
import { PhoneCall, AlertOctagon, ShieldAlert, X, ExternalLink } from 'lucide-react';

export const EmergencyModal = ({ isOpen, onClose, emergencyContact, tripInfo }) => {
  const [confirmCall, setConfirmCall] = useState(false);

  if (!isOpen) return null;

  const handleCall = () => {
    if (emergencyContact?.phone) {
      window.location.href = `tel:${emergencyContact.phone}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-100 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200 animate-pulse">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                Safety Support
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Emergency Assistance</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200/70 text-xs text-red-800 space-y-1">
          <p className="font-semibold flex items-center">
            <ShieldAlert className="w-4 h-4 mr-1 text-red-600 flex-shrink-0" />
            Immediate Peer & Contact Escalation
          </p>
          <p className="text-red-700/90 leading-relaxed">
            For critical emergencies, please dial your local national emergency services (e.g., 112 / 100). Use this button to reach your designated contact with 1 tap.
          </p>
        </div>

        {/* Trip snippet */}
        {tripInfo && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Current Trip: </span>
            {tripInfo.from} → {tripInfo.to} ({tripInfo.date})
          </div>
        )}

        {/* Emergency Contact Card */}
        {emergencyContact?.name && emergencyContact?.phone ? (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Your Designated Contact
            </div>
            <div className="text-base font-bold text-slate-900">{emergencyContact.name}</div>
            <div className="text-xs text-slate-500">
              Relationship: <span className="font-semibold text-slate-700">{emergencyContact.relationship || 'Primary Contact'}</span>
            </div>
            <div className="text-sm font-extrabold text-brand-600 tracking-wide pt-1">
              📞 {emergencyContact.phone}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-800">
            <p className="font-bold">No Emergency Contact Saved</p>
            <p className="mt-1">
              Please update your profile to add an emergency contact (Name, Relationship, and Phone).
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {emergencyContact?.phone ? (
            <button
              type="button"
              onClick={handleCall}
              className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call Emergency Contact</span>
            </button>
          ) : (
            <a
              href="/profile"
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all text-center text-sm"
            >
              <span>Add Contact in Profile</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 text-center"
          >
            Cancel & Return to Trip
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmergencyModal;
