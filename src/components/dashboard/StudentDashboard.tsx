import React from 'react';
import { useBus } from '../../context/BusContext';
import { DashboardCards } from './DashboardCards';
import { BusSelectorBar } from './BusSelectorBar';
import { MapView } from '../map/MapView';
import { UpcomingStopsTimeline } from './UpcomingStopsTimeline';
import { RecentNotificationsCard } from './RecentNotificationsCard';
import { Sparkles, Navigation, Clock, ShieldCheck, Zap } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { studentProfile, selectedBus, selectedRoute, isDemoMode, toggleDemoMode } = useBus();

  return (
    <div className="space-y-6">
      {/* Welcome Kicker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {studentProfile.name.split(' ')[0]} 👋
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hidden sm:inline">
              CSE Dept
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking {selectedBus.busNumber} along the {selectedRoute?.name || 'College Transit Corridor'}.
          </p>
        </div>

        {/* Demo Fast Forward Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDemoMode}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
              isDemoMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{isDemoMode ? 'Demo Mode Active (2x)' : 'Hackathon Demo Mode'}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Bus Selector */}
      <BusSelectorBar />

      {/* 4 Main KPI Cards: Live Bus, ETA, Next Stop, Bus Status */}
      <DashboardCards />

      {/* Main Interactive Map Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Live Campus Route Tracker</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simulated GPS position refreshing every 3–5 seconds along route waypoints.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
              Target: <strong className="text-slate-800 dark:text-slate-200">BITM College</strong>
            </span>
          </div>
        </div>

        <MapView height="h-[460px] lg:h-[540px]" />
      </div>

      {/* 2-Column Section: Upcoming Stops & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingStopsTimeline />
        <RecentNotificationsCard />
      </div>
    </div>
  );
};
