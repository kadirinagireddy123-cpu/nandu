import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  MapPin,
  Info,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    addNotification,
    selectedBusId,
  } = useBus();

  const [filter, setFilter] = useState<'all' | 'unread' | 'delay' | 'arrival'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'delay') return n.type === 'delay';
    if (filter === 'arrival') return n.type === 'arrival';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'arrival':
        return <MapPin className="w-5 h-5 text-emerald-500" />;
      case 'delay':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const handleSimulateAlert = () => {
    addNotification({
      busId: selectedBusId,
      title: 'Approaching Cowl Bazaar',
      message: `${selectedBusId} is now within 1.5 km of Cowl Bazaar shelter. Please prepare to board.`,
      type: 'arrival',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Transit Alerts & Notifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time push advisories for approaching stops, traffic variations, and route announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateAlert}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 inline-flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Push Alert</span>
          </button>

          <button
            onClick={markAllNotificationsAsRead}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>

          <button
            onClick={clearNotifications}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear all notifications"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'unread'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('arrival')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'arrival'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Arrivals
        </button>
        <button
          onClick={() => setFilter('delay')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'delay'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Delays
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-medium">No alerts found</p>
            <p className="text-xs mt-1">You are all caught up with your college transit updates.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationAsRead(item.id)}
              className={`p-5 transition-colors cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 flex items-start gap-4 ${
                !item.read ? 'bg-blue-50/30 dark:bg-blue-950/15' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-100 dark:ring-blue-900" />
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.message}
                </p>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                  <span>Target: {item.busId}</span>
                  <span>·</span>
                  <span>Delivered via RYMEC SmartBus Gateway</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
