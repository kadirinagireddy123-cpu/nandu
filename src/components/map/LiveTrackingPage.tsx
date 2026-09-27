import React from 'react';
import { useBus } from '../../context/BusContext';
import { MapView } from './MapView';
import { StatusBadge } from '../common/StatusBadge';
import { BusSelectorBar } from '../dashboard/BusSelectorBar';
import {
  Navigation,
  Compass,
  MapPin,
  Clock,
  Gauge,
  Users,
  ShieldCheck,
  Star,
  Info,
} from 'lucide-react';

export const LiveTrackingPage: React.FC = () => {
  const { selectedBus, selectedRoute, pickupStop, favoriteBusId, toggleFavoriteBus } = useBus();

  const isFav = selectedBus && favoriteBusId === selectedBus.id;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            <span>Interactive Live GPS Tracking</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time visual map telemetry with polyline route corridor and designated bus stops.
          </p>
        </div>

        {selectedBus && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteBus(selectedBus.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isFav
                  ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:border-amber-900'
                  : 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
              <span>{isFav ? 'Favorited' : 'Favorite'}</span>
            </button>
            <StatusBadge status={selectedBus.status} size="sm" />
          </div>
        )}
      </div>

      {/* Bus Switcher */}
      <BusSelectorBar />

      {/* Main Full-Size Map */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <MapView height="h-[600px] lg:h-[700px]" />
      </div>

      {/* Route Stops Legend */}
      {selectedRoute && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Route Stops Sequence ({selectedRoute.stops.length} Stops)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {selectedRoute.stops.map((stop, i) => (
              <div
                key={stop.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{stop.scheduledTime}</span>
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{stop.name}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{stop.landmark || 'Stop'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
