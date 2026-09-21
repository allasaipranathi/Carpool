import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Car, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Shield, 
  Users, 
  Sparkles,
  Loader2 
} from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'College Student',
    collegeName: '',
    department: '',
    companyName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleUserTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      userType: type,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setError('Please provide a valid email address.');
      return false;
    }

    const phoneRegex = /^\+?[\d\s-]{8,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      setError('Please provide a valid phone number (8-15 digits).');
      return false;
    }

    if (!formData.password) {
      setError('Please enter a password.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    if (formData.userType === 'College Student' && !formData.collegeName.trim()) {
      setError('Please enter your college name.');
      return false;
    }

    if (formData.userType === 'Office Employee' && !formData.companyName.trim()) {
      setError('Please enter your company name.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/home', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* Left Visual Brand Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-700 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-10 -left-10 w-40 h-40 bg-brand-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2.5 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                CarPool <span className="text-sky-300">Connect</span>
              </span>
            </Link>

            <div className="space-y-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-sky-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Join The Smarter Commute</span>
              </span>
              <h1 className="text-3xl font-extrabold leading-tight text-white">
                Connect with peers on your daily route.
              </h1>
              <p className="text-sky-100/90 text-sm leading-relaxed">
                Save fuel costs, reduce carbon footprint, and commute safely with verified students and working professionals.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="relative z-10 my-8 space-y-4 pt-6 border-t border-white/15">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-white/10 text-sky-200 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Verified Campus & Work Communities</h4>
                <p className="text-xs text-sky-200/80">Connect exclusively with college mates and verified office colleagues.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-white/10 text-sky-200 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Split Commute Costs Easily</h4>
                <p className="text-xs text-sky-200/80">Save up to 60% on monthly travel expenses with fair cost splitting.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-sky-200/70">
            Trusted by students & corporate employees across top campuses and tech parks.
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-slate-500 text-sm mt-1">
              Start sharing rides and making every commute rewarding.
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start space-x-3 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Switcher */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUserTypeChange('College Student')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                    formData.userType === 'College Student'
                      ? 'border-brand-600 bg-brand-50/80 text-brand-700 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>College Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUserTypeChange('Office Employee')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                    formData.userType === 'Office Employee'
                      ? 'border-brand-600 bg-brand-50/80 text-brand-700 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Office Employee</span>
                </button>
              </div>
            </div>

            {/* Basic Info: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Sai Pranathi"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Dynamic fields based on user type */}
            {formData.userType === 'College Student' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100/80">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <GraduationCap className="w-4 h-4 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleChange}
                      placeholder="e.g. Stanford University"
                      required
                      className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Course / Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                    </div>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science"
                      className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100/80">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Google / Microsoft / Tech Mahindra"
                    required
                    className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-brand-500/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
