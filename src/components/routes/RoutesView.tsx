import React from 'react';
import { useBus } from '../../context/BusContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Route as RouteIcon,
  Clock,
  MapPin,
  ArrowRight,
  Bus as BusIcon,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const RoutesView: React.FC = () => {
  const { buses, routes, setSelectedBusId, setCurrentView, selectedBusId } = useBus();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            College Transit Routes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official BITM college transport schedules, designated pick-up stops, and live bus allocations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            {routes.length} Active Corridors
          </span>
        </div>
      </div>

      {/* Routes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {buses.map((bus) => {
          const route = routes.find((r) => r.id === bus.routeId);
          const isSelected = bus.id === selectedBusId;

          return (
            <div
              key={bus.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-100 dark:border-blue-900">
                      <BusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                        {bus.busNumber}
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono">{bus.plateNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={bus.status} size="sm" />
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {bus.routeName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ETA: {bus.etaMinutes} min
                    </span>
                    <span>·</span>
                    <span>Speed: {bus.currentSpeed} km/h</span>
                  </div>
                </div>

                {/* Stops Outline */}
                {route && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Route Stops ({route.stops.length})
                    </span>
                    <div className="space-y-1.5">
                      {route.stops.map((stop, idx) => (
                        <div
                          key={stop.id}
                          className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate">{stop.name}</span>
                          </div>
                          <span className="font-mono text-[11px] text-slate-400 shrink-0">
                            {stop.scheduledTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Driver: <strong className="text-slate-700 dark:text-slate-300">{bus.driverName}</strong>
                </span>
                <button
                  onClick={() => {
                    setSelectedBusId(bus.id);
                    setCurrentView('map');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
                >
                  <span>Track Route</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
