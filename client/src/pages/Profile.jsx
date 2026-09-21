import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, updateEmergencyContact, changePassword } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building2, 
  Star, 
  ShieldCheck, 
  Lock, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  LogOut,
  Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    collegeName: user?.collegeName || '',
    department: user?.department || '',
    yearOfStudy: user?.yearOfStudy || '',
    companyName: user?.companyName || '',
  });

  // Emergency Contact Form State
  const [emergencyForm, setEmergencyForm] = useState({
    name: user?.emergencyContact?.name || '',
    relationship: user?.emergencyContact?.relationship || '',
    phone: user?.emergencyContact?.phone || '',
  });

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await updateUserProfile(profileForm);
      if (res.success) {
        setUser(res.data);
        localStorage.setItem('carpool_user', JSON.stringify(res.data));
        setSuccessMsg('Profile details updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await updateEmergencyContact(emergencyForm);
      if (res.success) {
        const updatedUser = { ...user, emergencyContact: res.data };
        setUser(updatedUser);
        localStorage.setItem('carpool_user', JSON.stringify(updatedUser));
        setSuccessMsg('Emergency contact updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update emergency contact.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await changePassword(passwordForm);
      if (res.success) {
        setSuccessMsg('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-extrabold shadow-lg ring-4 ring-white/30">
            {initials}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-white">{user?.fullName}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-sky-100 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-sky-300" />
                Verified
              </span>
            </div>
            <p className="text-sky-100 text-xs sm:text-sm">{user?.email}</p>
            <div className="pt-1 flex items-center justify-center sm:justify-start space-x-3 text-xs text-sky-200">
              <span className="flex items-center text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300 mr-1" />
                {user?.rating ? Number(user.rating).toFixed(1) : '5.0'} ({user?.totalRatings || 0} reviews)
              </span>
              <span>•</span>
              <span>{user?.totalTrips || 0} completed trips</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Settings Container */}
      <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 space-x-2 text-xs font-bold">
          {[
            { id: 'profile', label: 'Personal Information', icon: User },
            { id: 'emergency', label: 'Emergency Contact', icon: PhoneCall },
            { id: 'password', label: 'Security & Password', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSuccessMsg('');
                  setErrorMsg('');
                }}
                className={`flex items-center space-x-1.5 py-2.5 px-4 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-brand-700 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Personal Info */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email (Verified)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  User Type
                </label>
                <input
                  type="text"
                  value={user?.userType || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              {user?.userType === 'College Student' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      College / University
                    </label>
                    <input
                      type="text"
                      value={profileForm.collegeName}
                      onChange={(e) => setProfileForm({ ...profileForm, collegeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Year of Study
                    </label>
                    <input
                      type="text"
                      value={profileForm.yearOfStudy}
                      onChange={(e) => setProfileForm({ ...profileForm, yearOfStudy: e.target.value })}
                      placeholder="e.g. 3rd Year"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Emergency Contact */}
        {activeTab === 'emergency' && (
          <form onSubmit={handleEmergencySubmit} className="p-6 sm:p-8 space-y-6">
            <div className="p-4 bg-red-50/70 border border-red-100 rounded-2xl text-xs text-red-800 leading-relaxed">
              <strong>Emergency Safety Setting:</strong> This contact is displayed when you or your co-travelers tap the 🚨 Emergency button during an ongoing trip.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emergencyForm.name}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Relationship
                </label>
                <input
                  type="text"
                  value={emergencyForm.relationship}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, relationship: e.target.value })}
                  placeholder="e.g. Parent / Spouse / Sibling"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Emergency Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={emergencyForm.phone}
                  onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Emergency Contact</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  New Password (Min 6 chars)
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmNewPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        )}

        {/* Bottom Actions */}
        <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
          </p>
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1.5 py-2 px-4 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Profile;
