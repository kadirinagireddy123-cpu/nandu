import React from 'react';
import { useBus } from '../../context/BusContext';
import { Clock, MapPin, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const UpcomingStopsTimeline: React.FC = () => {
  const { selectedRoute, selectedBus, selectedPickupStopId, setSelectedPickupStopId } = useBus();

  if (!selectedRoute || !selectedBus) return null;

  // Calculate dynamic ETA for each stop based on current bus position
  const stops = selectedRoute.stops;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Upcoming Route Stops
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedRoute.name} · {selectedRoute.totalDistanceKm} km total
          </p>
        </div>
        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-900">
          Live Milestones
        </span>
      </div>

      <div className="space-y-4">
        {stops.map((stop, index) => {
          const isPickup = selectedPickupStopId === stop.id;
          const isDestination = index === stops.length - 1;
          const isPassed = stop.status === 'Passed';
          const isArrivingSoon = stop.status === 'Arriving Soon';

          // Estimated arrival minutes relative to the bus
          let stopEta = (index + 1) * 7;
          if (isArrivingSoon) stopEta = selectedBus.etaMinutes;
          if (isDestination) stopEta = selectedBus.etaMinutes + 18;

          return (
            <div
              key={stop.id}
              className={`flex items-start justify-between p-3 rounded-xl border transition-all ${
                isPickup
                  ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20'
                  : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 relative">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDestination
                        ? 'bg-indigo-600 text-white'
                        : isPassed
                        ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        : isArrivingSoon
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {stop.name}
                    </span>
                    {isPickup && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        My Pickup
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {stop.landmark || 'Regular pickup stop'}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span>Sched: {stop.scheduledTime}</span>
                    <button
                      onClick={() => setSelectedPickupStopId(stop.id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {isPickup ? 'Selected' : 'Set as Pickup'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-mono font-bold block ${
                    isPassed
                      ? 'text-slate-400 line-through'
                      : isArrivingSoon
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isPassed ? 'Passed' : `${stopEta} min`}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5 block">
                  {stop.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
