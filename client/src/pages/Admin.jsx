import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  getAdminDashboard, 
  getAdminUsers, 
  toggleUserStatus, 
  getAdminRides, 
  adminCancelRide 
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  ShieldAlert, 
  Users, 
  Car, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Ban, 
  Trash2, 
  ArrowRight, 
  AlertTriangle 
} from 'lucide-react';

export const Admin = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [ridesList, setRidesList] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Cancel ride modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rideToCancel, setRideToCancel] = useState(null);

  // If user is not admin, redirect
  if (user?.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, usersRes, ridesRes] = await Promise.all([
        getAdminDashboard(),
        getAdminUsers({ search: userSearch }),
        getAdminRides(),
      ]);

      if (dashRes.success) setStats(dashRes.data);
      if (usersRes.success) setUsersList(usersRes.data || []);
      if (ridesRes.success) setRidesList(ridesRes.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [userSearch]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleToggleUser = async (userId) => {
    try {
      const res = await toggleUserStatus(userId);
      if (res.success) {
        setActionMsg(res.message || 'User status updated.');
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleAdminCancelRide = async () => {
    if (!rideToCancel) return;
    try {
      const res = await adminCancelRide(rideToCancel._id);
      if (res.success) {
        setActionMsg('Ride successfully cancelled by administrator.');
        setCancelModalOpen(false);
        setRideToCancel(null);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel ride.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/30 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
            <span>Platform Operations & Moderation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            CarPool Connect Admin Panel
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-0.5">
            Monitor registered members, live carpools, and platform safety compliance.
          </p>
        </div>

        <div className="flex space-x-2">
          {['overview', 'users', 'rides'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg('')} className="text-xs font-bold">Dismiss</button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Fetching platform telemetry..." />
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Users</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Rides</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalRides}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft text-center">
                  <span className="text-xs text-slate-500 font-medium">Active Rides</span>
                  <p className="text-2xl font-black text-brand-600 mt-1">{stats.activeRides}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft text-center">
                  <span className="text-xs text-slate-500 font-medium">Completed Trips</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{stats.completedTrips}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft text-center">
                  <span className="text-xs text-slate-500 font-medium">Cancelled Trips</span>
                  <p className="text-2xl font-black text-red-600 mt-1">{stats.cancelledTrips}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-soft text-center">
                  <span className="text-xs text-slate-500 font-medium">Total Bookings</span>
                  <p className="text-2xl font-black text-indigo-600 mt-1">{stats.totalBookings}</p>
                </div>
              </div>

              {/* Recent Users & Rides Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Recently Registered Users</h3>
                  <div className="divide-y divide-slate-100">
                    {stats.recentUsers?.map((u) => (
                      <div key={u._id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{u.fullName}</p>
                          <p className="text-slate-400">{u.email}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {u.userType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-card border border-slate-100 space-y-4">
                  <h3 className="text-base font-bold text-slate-900">Recent Rides Published</h3>
                  <div className="divide-y divide-slate-100">
                    {stats.recentRides?.map((r) => (
                      <div key={r._id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{r.from} → {r.to}</p>
                          <p className="text-slate-400">Driver: {r.driver?.fullName || 'User'}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                          ₹{r.pricePerPassenger}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Registered Platform Members ({usersList.length})</h3>
                <div className="relative max-w-xs w-full">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">User Type & Affiliation</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{u.fullName}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800">{u.userType}</span>
                          <p className="text-[11px] text-slate-400">{u.collegeName || u.companyName || '-'}</p>
                        </td>
                        <td className="p-3 font-mono">{u.phone}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleUser(u._id)}
                              className={`py-1 px-3 rounded-lg text-xs font-semibold ${
                                u.isActive
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {u.isActive ? 'Deactivate' : 'Reactivate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ride Moderation Tab */}
          {activeTab === 'rides' && (
            <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Platform Rides Listing ({ridesList.length})</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="p-3">Route</th>
                      <th className="p-3">Driver</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Price / Seats</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ridesList.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <p className="font-bold text-slate-900">{r.from} → {r.to}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-800">{r.driver?.fullName || 'Driver'}</p>
                          <p className="text-[11px] text-slate-400">{r.driver?.email}</p>
                        </td>
                        <td className="p-3">
                          <span>{r.date}</span>
                          <span className="block text-slate-400">{r.departureTime}</span>
                        </td>
                        <td className="p-3">{r.vehicleModel} ({r.vehicleNumber})</td>
                        <td className="p-3">
                          <span className="font-bold text-slate-900">₹{r.pricePerPassenger}</span>
                          <span className="text-slate-400 block">{r.availableSeats}/{r.totalSeats} seats</span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <Link
                            to={`/ride/${r._id}`}
                            className="text-brand-600 font-bold hover:underline"
                          >
                            Inspect
                          </Link>
                          {r.status === 'scheduled' && (
                            <button
                              onClick={() => {
                                setRideToCancel(r);
                                setCancelModalOpen(true);
                              }}
                              className="text-red-600 font-bold hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Admin Cancel Ride Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Admin: Cancel Inappropriate Ride?"
        message="This administrative action will cancel this ride and notify all passengers."
        confirmText="Yes, Moderation Cancel"
        type="danger"
        onConfirm={handleAdminCancelRide}
        onCancel={() => {
          setCancelModalOpen(false);
          setRideToCancel(null);
        }}
      />

    </div>
  );
};

export default Admin;
