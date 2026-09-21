import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Bell, 
  CheckCheck, 
  Car, 
  Clock, 
  Star, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ArrowRight 
} from 'lucide-react';

export const Notifications = () => {
  const { 
    notifications, 
    loading, 
    unreadCount, 
    fetchAllNotifications, 
    markRead, 
    markAllRead 
  } = useNotifications();

  useEffect(() => {
    fetchAllNotifications();
  }, [fetchAllNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'request_received':
        return <Car className="w-5 h-5 text-brand-600" />;
      case 'request_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'request_rejected':
      case 'ride_cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'rating_received':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Activity & Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications {unreadCount > 0 && `(${unreadCount} Unread)`}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Real-time status updates for your ride requests, confirmations, and peer reviews.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="py-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5 flex-shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <LoadingSpinner text="Fetching your notifications..." />
      ) : notifications.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden divide-y divide-slate-100">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markRead(n._id)}
              className={`p-5 transition-colors flex items-start space-x-4 cursor-pointer hover:bg-slate-50/80 ${
                !n.isRead ? 'bg-brand-50/30' : 'bg-white'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-bold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium flex-shrink-0">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>

                {n.relatedRide && (
                  <div className="mt-2.5">
                    <Link
                      to={`/ride/${n.relatedRide?._id || n.relatedRide}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                    >
                      <span>View Related Ride</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {!n.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600 flex-shrink-0 mt-2" title="Unread" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-soft space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No notifications yet</h3>
          <p className="text-xs text-slate-500">
            When passengers request seats or drivers accept your bookings, alerts will show up right here.
          </p>
        </div>
      )}

    </div>
  );
};

export default Notifications;
