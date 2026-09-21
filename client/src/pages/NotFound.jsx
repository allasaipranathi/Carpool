import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-slate-100 text-center space-y-5 max-w-md w-full">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            404 Route Not Found
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Lost in Transit?
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
            The page or ride you are looking for has taken a detour or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/home"
            className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/find-ride"
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Find a Ride</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
