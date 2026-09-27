import React from 'react';
import { useBus } from '../../context/BusContext';
import { Bell, Info, AlertTriangle, Clock, MapPin, Check } from 'lucide-react';

export const RecentNotificationsCard: React.FC = () => {
  const { notifications, markNotificationAsRead, setCurrentView } = useBus();

  const recent = notifications.slice(0, 4);

  const getIcon = (type: string) => {
    switch (type) {
      case 'arrival':
        return <MapPin className="w-4 h-4 text-emerald-500" />;
      case 'delay':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Alerts & Updates
            </h3>
          </div>
          <button
            onClick={() => setCurrentView('notifications')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All ({notifications.length})
          </button>
        </div>

        <div className="space-y-3">
          {recent.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-3 rounded-xl border transition-colors cursor-pointer text-xs ${
                !n.read
                  ? 'bg-blue-50/40 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900'
                  : 'bg-slate-50/50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Instant transit push notifications</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
      </div>
    </div>
  );
};
