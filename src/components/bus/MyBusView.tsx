import React from 'react';
import { useBus } from '../../context/BusContext';
import { StatusBadge } from '../common/StatusBadge';
import { MapView } from '../map/MapView';
import {
  Star,
  Bus as BusIcon,
  MapPin,
  Clock,
  Gauge,
  Users,
  Navigation,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const MyBusView: React.FC = () => {
  const {
    buses,
    favoriteBusId,
    selectedBus,
    setSelectedBusId,
    setDetailModalBusId,
    studentProfile,
    pickupStop,
  } = useBus();

  const favBus = buses.find((b) => b.id === favoriteBusId) || selectedBus;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              My Saved Daily Bus
            </h2>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personalized live telemetry for your designated daily college route and pickup stop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            Assigned: {studentProfile.college.split('-')[0]}
          </span>
        </div>
      </div>

      {/* Main Bus Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/25">
              <BusIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {favBus.busNumber}
                </span>
                <StatusBadge status={favBus.status} size="md" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {favBus.routeName} · Driver: {favBus.driverName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Estimated Pickup In
              </span>
              <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {favBus.etaMinutes} min
              </span>
            </div>
            <button
              onClick={() => setDetailModalBusId(favBus.id)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              Full Specs
            </button>
          </div>
        </div>

        {/* Live Pickup Indicator */}
        {pickupStop && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                  Your Pickup Stop: {pickupStop.name}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {pickupStop.landmark || 'Scheduled stop'} · Sched: {pickupStop.scheduledTime}
                </span>
              </div>
            </div>

            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">
              ~{favBus.etaMinutes} mins
            </span>
          </div>
        )}

        {/* Embedded Live Map for My Bus */}
        <div className="mt-5">
          <MapView height="h-[420px]" />
        </div>
      </div>
    </div>
  );
};
