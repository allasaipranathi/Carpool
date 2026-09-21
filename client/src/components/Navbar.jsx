import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Car, 
  Home, 
  Search, 
  PlusCircle, 
  Clock, 
  CarFront, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap, 
  Briefcase,
  ShieldAlert 
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navLinks = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Find Ride', path: '/find-ride', icon: Search },
    { name: 'Offer Ride', path: '/offer-ride', icon: PlusCircle },
    { name: 'My Trips', path: '/my-trips', icon: Clock },
    { name: 'My Rides', path: '/my-rides', icon: CarFront },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-brand-800 bg-clip-text text-transparent">
                CarPool <span className="text-brand-600 font-black">Connect</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-1 uppercase">Smart Commute</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`
                    }
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}

              {/* Admin Link if user is admin */}
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm'
                        : 'text-purple-600 hover:bg-purple-50'
                    }`
                  }
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin</span>
                </NavLink>
              )}
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
              >
                Join Now
              </Link>
            </div>
          )}

          {/* Desktop User Info, Notifications & Logout */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3">
              {/* Notifications Icon Button */}
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `relative p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-600' : ''
                  }`
                }
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </NavLink>

              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <Link to="/profile" className="text-right group">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">
                    {user?.fullName || 'User'}
                  </p>
                  <div className="flex items-center justify-end space-x-1 mt-0.5">
                    {user?.userType === 'College Student' ? (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <GraduationCap className="w-2.5 h-2.5 mr-1" />
                        Student
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Briefcase className="w-2.5 h-2.5 mr-1" />
                        Corporate
                      </span>
                    )}
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-white hover:ring-brand-200 transition-all"
                >
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xl:inline">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && (
              <NavLink
                to="/notifications"
                className="relative p-2 rounded-xl text-slate-600 hover:text-brand-600"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl mb-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{user?.fullName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {user?.userType}
                  </span>
                </div>
              </Link>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-brand-50 text-brand-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`
                      }
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}

                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Profile Settings</span>
                </NavLink>

                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-700 bg-purple-50"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </NavLink>
                )}
              </nav>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 px-4 text-center font-semibold text-slate-700 border border-slate-200 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 px-4 text-center font-semibold text-white bg-brand-600 rounded-xl shadow-md"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
