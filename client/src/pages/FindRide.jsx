import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRides } from '../services/api';
import RideCard from '../components/RideCard';
import RideSearch from '../components/RideSearch';
import LoadingSpinner from '../components/LoadingSpinner';
import { Car, AlertCircle, Sparkles, Filter } from 'lucide-react';

export const FindRide = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
    seats: searchParams.get('seats') || '1',
    vehicleType: searchParams.get('vehicleType') || 'All',
    sortBy: searchParams.get('sortBy') || 'match_score',
  });

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMatchingRides = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...filters,
        status: 'scheduled',
      };
      if (params.vehicleType === 'All') delete params.vehicleType;

      const res = await getRides(params);
      if (res.success) {
        setRides(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch rides:', err);
      setError('Unable to load matching rides. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMatchingRides();
  }, [fetchMatchingRides]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => {
      const next = { ...prev, [name]: value };
      return next;
    });
  };

  const handleSearchSubmit = () => {
    fetchMatchingRides();
  };

  const handleReset = () => {
    const reset = {
      from: '',
      to: '',
      date: '',
      time: '',
      seats: '1',
      vehicleType: 'All',
      sortBy: 'match_score',
    };
    setFilters(reset);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Route Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find a Ride
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Compare co-travelers heading in your direction and join verified college or corporate carpools.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <RideSearch
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearchSubmit}
        onReset={handleReset}
      />

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Showing <strong className="text-slate-900">{rides.length}</strong> matching rides
          </span>
          {filters.from && filters.to && (
            <span className="text-brand-600 font-semibold truncate max-w-xs">
              {filters.from} → {filters.to}
            </span>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Searching and scoring routes..." />
        ) : rides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rides.map((ride) => (
              <RideCard key={ride._id} ride={ride} showMatchScore={true} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-soft space-y-3 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <Car className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No matching rides found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try broadening your search criteria, clearing specific filters, or checking different travel dates.
            </p>
            <button
              onClick={handleReset}
              className="py-2.5 px-5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRide;
