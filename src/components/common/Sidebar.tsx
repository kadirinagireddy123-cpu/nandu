import React from 'react';
import { useBus } from '../../context/BusContext';
import {
  LayoutDashboard,
  MapPin,
  Route,
  Navigation,
  Bus as BusIcon,
  Bell,
  User,
  ShieldAlert,
  Sliders,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, userRole, unreadNotifsCount, favoriteBusId } = useBus();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'map',
      label: 'Live Tracking',
      icon: MapPin,
      badge: 'Live',
    },
    {
      id: 'routes',
      label: 'Routes',
      icon: Route,
      badge: null,
    },
    {
      id: 'stops',
      label: 'Bus Stops',
      icon: Navigation,
      badge: null,
    },
    {
      id: 'my-bus',
      label: 'My Bus',
      icon: BusIcon,
      badge: favoriteBusId ? 'Saved' : null,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      badge: null,
    },
    {
      id: 'admin',
      label: 'Admin Console',
      icon: ShieldAlert,
      badge: 'Fleet',
      roleOnly: 'admin',
    },
    {
      id: 'driver',
      label: 'Driver Panel',
      icon: Sliders,
      badge: 'Sim',
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-4 h-[calc(100vh-4rem)] sticky top-16 transition-colors">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : item.id === 'notifications'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                          : item.id === 'map'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Route Status Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              RYMEC Campus Fleet
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Active on route:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">4 buses</span>
            </div>
            <div className="flex justify-between">
              <span>Destination:</span>
              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
                RYMEC Campus
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
        <p className="flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>SmartBus Prototype</span>
        </p>
        <p>Ballari Transit Node · v1.0</p>
      </div>
    </aside>
  );
};
