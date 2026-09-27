import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Truck,
  Play,
  Square,
  Radio,
  Navigation,
  MapPin,
  Clock,
  Gauge,
  Users,
  AlertTriangle,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const DriverPanel: React.FC = () => {
  const {
    selectedBus,
    startDriverTrip,
    endDriverTrip,
    updateDriverStatus,
    addNotification,
    refreshLocation,
  } = useBus();

  const [simulatedPassengers, setSimulatedPassengers] = useState(selectedBus.passengers);
  const [delayMessage, setDelayMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleStart = () => {
    startDriverTrip(selectedBus.id);
  };

  const handleEnd = () => {
    endDriverTrip(selectedBus.id);
  };

  const handleShareGps = () => {
    refreshLocation();
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 2500);
  };

  const handleReportDelay = () => {
    updateDriverStatus(selectedBus.id, 'DELAYED', 20);
    addNotification({
      busId: selectedBus.id,
      title: `${selectedBus.busNumber} Traffic Delay`,
      message: delayMessage || 'Driver reported heavy traffic congestion. ETA extended by 8 minutes.',
      type: 'delay',
    });
    setDelayMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-500/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Driver Telemetry Console
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                In-Cab Terminal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Assigned to: <strong>{selectedBus.driverName}</strong> ({selectedBus.busNumber})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={selectedBus.status} size="md" />
        </div>
      </div>

      {/* Main In-Cab Telemetry Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Assigned Bus & Route
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {selectedBus.busNumber}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                Route A
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{selectedBus.routeName}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Trip Operational Status
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    selectedBus.isTripActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                {selectedBus.isTripActive ? 'ACTIVE TRIP' : 'STANDBY'}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Speed: {selectedBus.currentSpeed} km/h
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Destination: RYMEC College Main Campus
            </p>
          </div>
        </div>

        {/* Live Trip Nav Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                Current Location
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedBus.currentLocationName}
              </span>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Lat: {selectedBus.currentLocation.lat.toFixed(4)}, Lng: {selectedBus.currentLocation.lng.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                Next Scheduled Stop
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedBus.nextStopName}
              </span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                Distance: {selectedBus.distanceToNextKm} km · ETA: ~{selectedBus.etaMinutes} min
              </p>
            </div>
          </div>
        </div>

        {/* Primary Driver Trip Actions */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Trip Controls
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleStart}
              disabled={selectedBus.isTripActive}
              className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                selectedBus.isTripActive
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Trip</span>
            </button>

            <button
              onClick={handleEnd}
              disabled={!selectedBus.isTripActive}
              className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                !selectedBus.isTripActive
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20'
              }`}
            >
              <Square className="w-4 h-4 fill-current" />
              <span>End Trip</span>
            </button>

            <button
              onClick={handleShareGps}
              className="py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{broadcastSent ? 'GPS Ping Sent!' : 'Share GPS Location'}</span>
            </button>
          </div>
        </div>

        {/* Delay Reporting Tool */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Report Traffic Delay / Road Incident</span>
          </span>

          <div className="flex gap-2">
            <input
              type="text"
              value={delayMessage}
              onChange={(e) => setDelayMessage(e.target.value)}
              placeholder="e.g. Heavy traffic at Cowl Bazaar junction, 10 min delay..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
            />
            <button
              onClick={handleReportDelay}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl whitespace-nowrap transition-colors"
            >
              Broadcast Delay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
