import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { getLiveTracking, updateLiveLocation } from '../services/api';
import { 
  Car, 
  MapPin, 
  Navigation, 
  Clock, 
  Gauge, 
  CheckCircle2, 
  RotateCw, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  ChevronRight,
  Radio
} from 'lucide-react';

export const LiveRouteMap = ({ rideId, isDriver = false, onProgressUpdate }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const carMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const remainingPolylineRef = useRef(null);

  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [autoSimulate, setAutoSimulate] = useState(false);

  // Fetch Live Location data
  const fetchTracking = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await getLiveTracking(rideId);
      if (res.success && res.data) {
        setTrackingData(res.data);
      }
    } catch (err) {
      console.error('Failed to load tracking data:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [rideId]);

  // Initial fetch and 5s polling
  useEffect(() => {
    fetchTracking(true);
    const interval = setInterval(() => {
      fetchTracking(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchTracking]);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || !trackingData) return;

    const { origin, destination, currentPosition, waypoints } = trackingData;

    // Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([currentPosition.lat, currentPosition.lng], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Custom Origin Marker Icon
      const originIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-200 font-bold text-xs">A</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Custom Destination Marker Icon
      const destIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg ring-4 ring-indigo-200 font-bold text-xs">B</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([origin.lat, origin.lng], { icon: originIcon })
        .addTo(map)
        .bindPopup(`<b>Pickup:</b> ${trackingData.from} (${trackingData.pickupPoint || 'Origin'})`);

      L.marker([destination.lat, destination.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup(`<b>Destination:</b> ${trackingData.to} (${trackingData.dropPoint || 'Drop'})`);
    }

    const map = mapInstanceRef.current;

    // Custom Live Vehicle Marker Icon with pulsation
    const carIcon = L.divIcon({
      className: 'custom-car-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-12 h-12 rounded-full bg-brand-500/30 animate-ping"></span>
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-xl ring-4 ring-white relative z-10">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h2m-6 0a1 1 0 001-1v-3" />
            </svg>
          </div>
          <div class="absolute -top-7 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md">
            🚗 Driver Live (${currentPosition.speedKmH} km/h)
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Update Car Marker position
    if (carMarkerRef.current) {
      carMarkerRef.current.setLatLng([currentPosition.lat, currentPosition.lng]);
    } else {
      carMarkerRef.current = L.marker([currentPosition.lat, currentPosition.lng], { icon: carIcon })
        .addTo(map)
        .bindPopup(`<b>${trackingData.driver?.fullName || 'Driver'}</b> is currently en route!`);
    }

    // Polyline for full route
    const allCoords = waypoints.map((w) => [w.lat, w.lng]);
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
    }
    routePolylineRef.current = L.polyline(allCoords, {
      color: '#0ea5e9',
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
    }).addTo(map);

  }, [trackingData]);

  // Handler for driver advancing simulated / actual position
  const handleAdvancePosition = async (newPercent) => {
    setUpdating(true);
    try {
      const res = await updateLiveLocation(rideId, {
        progressPercent: newPercent,
        speedKmH: Math.floor(Math.random() * 20) + 45,
        address: newPercent >= 100 ? `Reached Destination: ${trackingData?.to}` : `Passing Checkpoint near Highway KM ${Math.round(newPercent * 0.4)}`,
      });
      if (res.success) {
        fetchTracking(false);
        if (onProgressUpdate) onProgressUpdate(newPercent);
      }
    } catch (err) {
      console.error('Failed to update live position:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Auto Simulator Effect (moves vehicle smoothly every 4 seconds when toggled)
  useEffect(() => {
    let timer;
    if (autoSimulate && trackingData?.currentPosition) {
      timer = setInterval(() => {
        const nextPercent = Math.min(100, (trackingData.currentPosition.progressPercent || 0) + 12);
        handleAdvancePosition(nextPercent);
        if (nextPercent >= 100) setAutoSimulate(false);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [autoSimulate, trackingData]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card text-center">
        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2 animate-spin">
          <RotateCw className="w-5 h-5" />
        </div>
        <p className="text-xs font-semibold text-slate-500">Connecting to Real-Time Satellite Tracking...</p>
      </div>
    );
  }

  if (!trackingData) return null;

  const currentPos = trackingData.currentPosition;

  return (
    <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden space-y-0">
      
      {/* Top Live Status Telemetry Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-400 relative">
            <Radio className="w-6 h-6 animate-pulse text-brand-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-1 right-1 ring-2 ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                LIVE GPS TELEMETRY
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentPos.progressPercent}% Route Covered
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5 truncate">
              {currentPos.address}
            </h3>
          </div>
        </div>

        {/* Telemetry Pills */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10 backdrop-blur-md text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">EST. TIME OF ARRIVAL</span>
            <span className="text-sm font-extrabold text-amber-300 flex items-center justify-center space-x-1">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {currentPos.etaMinutes} mins ({currentPos.remainingDistanceKm} km left)
            </span>
          </div>

          <div className="bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10 backdrop-blur-md text-center">
            <span className="text-[10px] text-slate-400 font-semibold block">CURRENT SPEED</span>
            <span className="text-sm font-extrabold text-emerald-300 flex items-center justify-center space-x-1">
              <Gauge className="w-3.5 h-3.5 mr-1" />
              {currentPos.speedKmH} km/h
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 relative">
        <div 
          className="bg-gradient-to-r from-brand-500 via-sky-400 to-indigo-600 h-2 transition-all duration-500"
          style={{ width: `${currentPos.progressPercent}%` }}
        />
      </div>

      {/* Interactive Map View */}
      <div className="relative">
        <div 
          ref={mapContainerRef} 
          className="w-full h-80 sm:h-96 z-10 relative bg-slate-100"
        />

        {/* Map Overlays & Recenter Button */}
        <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
          <button
            onClick={() => {
              if (mapInstanceRef.current && currentPos) {
                mapInstanceRef.current.flyTo([currentPos.lat, currentPos.lng], 13);
              }
            }}
            className="py-2 px-3 bg-white/95 text-slate-800 rounded-xl shadow-lg border border-slate-200 text-xs font-bold hover:bg-white transition-all flex items-center space-x-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-brand-600" />
            <span>Center on Car</span>
          </button>
        </div>
      </div>

      {/* Checkpoints Stepper */}
      <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Route Waypoint Checkpoints
          </span>
          <span className="text-xs text-brand-600 font-semibold">
            {trackingData.waypoints.filter((w) => w.reached).length} of {trackingData.waypoints.length} Checkpoints Reached
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {trackingData.waypoints.map((wp) => (
            <div
              key={wp.index}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                wp.reached
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                {wp.reached ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                )}
                <span className="truncate">{wp.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">
                {wp.reached ? 'Reached ✅' : 'Upcoming ⏳'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Controls / Simulation Toolbar (Shown for Driver or Demo testing) */}
      <div className="p-4 bg-brand-50/50 border-t border-brand-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-brand-900">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span className="font-bold">Live GPS Simulator:</span>
          <span className="text-slate-600 hidden sm:inline">Advance vehicle checkpoint to test real-time passenger map updates</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={updating}
            onClick={() => handleAdvancePosition(Math.min(100, currentPos.progressPercent + 20))}
            className="py-1.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold shadow-sm transition-all disabled:opacity-50"
          >
            {updating ? 'Updating...' : '+20% Forward'}
          </button>

          <button
            type="button"
            onClick={() => setAutoSimulate(!autoSimulate)}
            className={`py-1.5 px-3 rounded-lg font-bold transition-all ${
              autoSimulate
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {autoSimulate ? '⏸ Pause Auto-Drive' : '▶ Auto-Drive Route'}
          </button>

          <button
            type="button"
            onClick={() => handleAdvancePosition(0)}
            className="py-1.5 px-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg"
            title="Reset to Origin"
          >
            Reset
          </button>
        </div>
      </div>

    </div>
  );
};

export default LiveRouteMap;
