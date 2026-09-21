import React from 'react';
import { Car, ShieldCheck, Heart, Users } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Car className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm">CarPool Connect</span>
            <span className="text-slate-400 text-xs hidden sm:inline">• Smart Commuting Platform</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Profiles</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>Students & Professionals</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>© {new Date().getFullYear()} CarPool Connect. Travel sustainably.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
