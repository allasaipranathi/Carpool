import React, { useState } from 'react';
import { Share2, Copy, Check, X, Car, Calendar, Clock } from 'lucide-react';

export const ShareTripModal = ({ isOpen, onClose, ride }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !ride) return null;

  const tripUrl = `${window.location.origin}/ride/${ride._id}`;
  const driverName = ride.driver?.fullName || 'Verified Driver';

  const shareText = `🚗 CarPool Connect Trip\nRoute: ${ride.from} → ${ride.to}\nDriver: ${driverName}\nDate: ${ride.date} at ${ride.departureTime}\nSeats Available: ${ride.availableSeats}\nPrice: ₹${ride.pricePerPassenger}/seat\n\nJoin this ride: ${tripUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Share Trip Itinerary</h3>
              <p className="text-xs text-slate-500">Send trip details to classmates or colleagues</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share preview box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1.5 whitespace-pre-wrap">
          {shareText}
        </div>

        {/* Copy action */}
        <div className="pt-2 flex space-x-3">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-3 px-4 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-[0.99] ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Shareable Trip Info</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ShareTripModal;
