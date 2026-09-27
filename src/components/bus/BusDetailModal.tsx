import React from 'react';
import { useBus } from '../../context/BusContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  Bus as BusIcon,
  Phone,
  MapPin,
  Clock,
  Gauge,
  Users,
  Fuel,
  Shield,
  Star,
  Radio,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const BusDetailModal: React.FC = () => {
  const {
    detailModalBusId,
    setDetailModalBusId,
    buses,
    favoriteBusId,
    toggleFavoriteBus,
    setCurrentView,
    setSelectedBusId,
  } = useBus();

  if (!detailModalBusId) return null;

  const bus = buses.find((b) => b.id === detailModalBusId);
  if (!bus) return null;

  const isFav = favoriteBusId === bus.id;
  const availableSeats = Math.max(0, bus.capacity - bus.passengers);
  const occupancyPercent = Math.round((bus.passengers / bus.capacity) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/30">
              <BusIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-mono">{bus.busNumber}</h3>
                <StatusBadge status={bus.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400 font-mono">{bus.plateNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleFavoriteBus(bus.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isFav
                  ? 'bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900'
                  : 'text-slate-400 hover:text-slate-600 border-slate-200 dark:border-slate-700'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => setDetailModalBusId(null)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Route Overview */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Active Transit Corridor
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{bus.routeName}</p>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Current: {bus.currentLocationName}</span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                Live Speed
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Gauge className="w-4 h-4 text-blue-500" />
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {bus.currentSpeed} km/h
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                Next Stop ETA
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {bus.etaMinutes} mins
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                Available Seats
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {availableSeats}
                </span>
                <span className="text-slate-400 text-[11px]">/ {bus.capacity} total</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                Fuel & Battery
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Fuel className="w-4 h-4 text-amber-500" />
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {bus.fuelPercent}%
                </span>
                <span className="text-slate-400 text-[11px]">Full</span>
              </div>
            </div>
          </div>

          {/* Seating Occupancy Bar */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Seating Occupancy</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {bus.passengers} aboard ({occupancyPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  occupancyPercent > 80
                    ? 'bg-rose-500'
                    : occupancyPercent > 60
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          {/* Driver Contact & Verification */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                {bus.driverName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {bus.driverName}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <p className="text-[11px] text-slate-400">Verified Campus Transit Driver</p>
              </div>
            </div>

            <a
              href={`tel:${bus.driverPhone}`}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call</span>
            </a>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            GPS Signal: 100% telemetry locked
          </span>
          <button
            onClick={() => {
              setSelectedBusId(bus.id);
              setDetailModalBusId(null);
              setCurrentView('map');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Track on Live Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
