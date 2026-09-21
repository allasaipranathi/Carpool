import React from 'react';
import { Car, Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
          <Car className="w-6 h-6 animate-pulse" />
        </div>
        <Loader2 className="w-6 h-6 text-brand-600 animate-spin absolute -top-1 -right-1" />
      </div>
      <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
