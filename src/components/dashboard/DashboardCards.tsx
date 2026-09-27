import React from 'react';
import { useBus } from '../../context/BusContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Bus as BusIcon,
  Clock,
  MapPin,
  Users,
  Star,
  Activity,
  Gauge,
  Fuel,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const DashboardCards: React.FC = () => {
  const {
    selectedBus,
    favoriteBusId,
    toggleFavoriteBus,
    lastUpdatedSecondsAgo,
    setCurrentView,
    setDetailModalBusId,
  } = useBus();

  if (!selectedBus) return null;

  const isFav = favoriteBusId === selectedBus.id;
  const availableSeats = Math.max(0, selectedBus.capacity - selectedBus.passengers);
  const occupancyPercent = Math.round((selectedBus.passengers / selectedBus.capacity) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card A: LIVE BUS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-100 dark:border-blue-900">
              <BusIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Live Bus
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {selectedBus.busNumber}
              </h3>
            </div>
          </div>

          <button
            onClick={() => toggleFavoriteBus(selectedBus.id)}
            title={isFav ? 'Remove from favorites' : 'Mark as favorite bus'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFav
                ? 'bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900'
                : 'text-slate-300 hover:text-slate-600 border-transparent hover:border-slate-200 dark:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        <div className="mt-3.5 space-y-1.5 text-xs">
          <div className="text-slate-600 dark:text-slate-300 font-medium truncate">
            {selectedBus.routeName}
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {selectedBus.currentSpeed} km/h
              </span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {lastUpdatedSecondsAgo}s ago
            </span>
          </div>
          <div className="pt-1">
            <StatusBadge status={selectedBus.status} size="sm" />
          </div>
        </div>
      </div>

      {/* Card B: ETA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-100 dark:border-indigo-900">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Estimated Arrival
              </span>
              <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-tight">
                {selectedBus.etaMinutes} min
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            GPS Live
          </span>
        </div>

        <div className="mt-3.5 space-y-1.5 text-xs">
          <div className="text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span className="text-slate-400">Next stop:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
              {selectedBus.nextStopName}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-400">Distance left:</span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
              {selectedBus.distanceToNextKm} km
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Avg speed calculated at {selectedBus.currentSpeed} km/h
          </div>
        </div>
      </div>

      {/* Card C: NEXT STOP */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-100 dark:border-amber-900">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Next Stop
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[140px]">
                {selectedBus.nextStopName}
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-3.5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Approaching:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              ~{selectedBus.etaMinutes} mins away
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-slate-400">Terminal:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              BITM College
            </span>
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {selectedBus.currentLocationName}
          </div>
        </div>
      </div>

      {/* Card D: BUS STATUS & CAPACITY */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-100 dark:border-emerald-900">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Bus Status & Seats
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {availableSeats} seats left
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
            {selectedBus.passengers}/{selectedBus.capacity}
          </span>
        </div>

        <div className="mt-3.5 space-y-2 text-xs">
          <div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  occupancyPercent > 85
                    ? 'bg-rose-500'
                    : occupancyPercent > 65
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span>Capacity load:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {occupancyPercent}%
            </span>
          </div>

          <div className="flex justify-between items-center pt-0.5">
            <span className="text-[11px] text-slate-400 truncate">
              Driver: {selectedBus.driverName}
            </span>
            <button
              onClick={() => setDetailModalBusId(selectedBus.id)}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
