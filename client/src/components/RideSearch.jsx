import React from 'react';
import { Search, MapPin, Calendar, Users, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';

export const RideSearch = ({
  filters,
  onChange,
  onSearch,
  onReset,
  showExtendedFilters = true,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-slate-100">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="space-y-4"
      >
        {/* Main Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* From */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Pickup (From)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="from"
                value={filters.from || ''}
                onChange={handleInputChange}
                placeholder="e.g. Guntur"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* To */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Destination (To)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-500">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="to"
                value={filters.to || ''}
                onChange={handleInputChange}
                placeholder="e.g. Vijayawada"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Travel Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                name="date"
                value={filters.date || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md hover:shadow-brand-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Find Rides</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Reset Search"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Extended Filter Bar */}
        {showExtendedFilters && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-500 font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters & Sort:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Vehicle Type Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Vehicle:</span>
                <select
                  name="vehicleType"
                  value={filters.vehicleType || 'All'}
                  onChange={handleInputChange}
                  className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="All">All Vehicles</option>
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Auto">Auto</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Seats Needed */}
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Min Seats:</span>
                <select
                  name="seats"
                  value={filters.seats || '1'}
                  onChange={handleInputChange}
                  className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="1">1+ seat</option>
                  <option value="2">2+ seats</option>
                  <option value="3">3+ seats</option>
                  <option value="4">4+ seats</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  name="sortBy"
                  value={filters.sortBy || 'match_score'}
                  onChange={handleInputChange}
                  className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="match_score">Best Route Match</option>
                  <option value="price_low">Lowest Price</option>
                  <option value="price_high">Highest Price</option>
                  <option value="rating_high">Highest Rated Driver</option>
                  <option value="seats_high">Most Available Seats</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RideSearch;
