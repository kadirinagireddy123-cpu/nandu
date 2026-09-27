import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, Clock, Navigation, CheckCircle2, Search, Filter } from 'lucide-react';

export const StopsView: React.FC = () => {
  const { routes, buses, selectedPickupStopId, setSelectedPickupStopId, setCurrentView, setSelectedBusId } = useBus();
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('all');
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Collect all stops with their corresponding bus info
  const allStops = routes.flatMap((route) => {
    const bus = buses.find((b) => b.routeId === route.id) || buses[0];
    return route.stops.map((stop, idx) => ({
      ...stop,
      routeCode: route.code,
      routeName: route.name,
      busNumber: bus.busNumber,
      busId: bus.id,
      distanceFromOriginKm: Math.round((idx + 1) * 3.2 * 10) / 10,
    }));
  });

  const filteredStops = allStops.filter((stop) => {
    const matchesRoute =
      selectedRouteFilter === 'all' || stop.routeCode === selectedRouteFilter;
    const matchesSearch =
      !filterSearch ||
      stop.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
      stop.busNumber.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (stop.landmark && stop.landmark.toLowerCase().includes(filterSearch.toLowerCase()));
    return matchesRoute && matchesSearch;
  });

  const getStopStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Passed
          </span>
        );
      case 'Arriving Soon':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse">
            Arriving Soon
          </span>
        );
      case 'Upcoming':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            Upcoming
          </span>
        );
      case 'Destination':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold">
            Destination
          </span>
        );
      default:
        return <span className="text-[11px] text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Designated Campus Bus Stops
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check real-time arrival estimates and select your daily pickup point for arrival push alerts.
          </p>
        </div>

        {/* Route Filter Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto">
          <button
            onClick={() => setSelectedRouteFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedRouteFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Corridors ({allStops.length})
          </button>
          {routes.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteFilter(r.code)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedRouteFilter === r.code
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {r.code}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input for Stops */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search stop name or landmark..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-blue-500 outline-none text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Stops Table / Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3 font-semibold">Stop Name & Landmark</th>
                <th className="px-5 py-3 font-semibold">Assigned Bus</th>
                <th className="px-5 py-3 font-semibold">Arrival Time</th>
                <th className="px-5 py-3 font-semibold">Route Distance</th>
                <th className="px-5 py-3 font-semibold">Live Status</th>
                <th className="px-5 py-3 font-semibold text-right">Pickup Point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStops.map((stop) => {
                const isSelectedPickup = selectedPickupStopId === stop.id;

                return (
                  <tr
                    key={`${stop.routeCode}-${stop.id}`}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelectedPickup ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <MapPin
                          className={`w-4 h-4 shrink-0 ${
                            isSelectedPickup
                              ? 'text-emerald-600'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {stop.name}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {stop.landmark || 'Main Shelter'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => {
                          setSelectedBusId(stop.busId);
                          setCurrentView('map');
                        }}
                        className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{stop.busNumber}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({stop.routeCode})
                        </span>
                      </button>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{stop.scheduledTime}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {stop.distanceFromOriginKm} km
                    </td>

                    <td className="px-5 py-3.5">{getStopStatusBadge(stop.status)}</td>

                    <td className="px-5 py-3.5 text-right">
                      {isSelectedPickup ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>My Pickup</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedPickupStopId(stop.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
