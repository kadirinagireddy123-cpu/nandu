import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import { StatusBadge } from '../common/StatusBadge';
import { MapView } from '../map/MapView';
import { Bus, BusStatus } from '../../types/bus';
import {
  ShieldAlert,
  Bus as BusIcon,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Users,
  Route,
  Search,
  Edit2,
  ExternalLink,
  Plus,
  Play,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    buses,
    setSelectedBusId,
    setDetailModalBusId,
    setCurrentView,
    updateDriverStatus,
    routes,
    refreshLocation,
  } = useBus();

  const [searchTable, setSearchTable] = useState('');
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  // Fleet stats
  const totalBuses = 12; // fleet capacity
  const activeBusesCount = buses.filter((b) => b.isTripActive && b.status !== 'MAINTENANCE').length;
  const delayedBusesCount = buses.filter((b) => b.status === 'DELAYED').length;
  const maintenanceCount = buses.filter((b) => b.status === 'MAINTENANCE').length;
  const totalStudents = 1480;

  const filteredBuses = buses.filter(
    (b) =>
      b.busNumber.toLowerCase().includes(searchTable.toLowerCase()) ||
      b.driverName.toLowerCase().includes(searchTable.toLowerCase()) ||
      b.routeName.toLowerCase().includes(searchTable.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTable.toLowerCase())
  );

  const handleStatusChange = (busId: string, newStatus: BusStatus) => {
    updateDriverStatus(busId, newStatus, newStatus === 'MAINTENANCE' ? 0 : 35);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Transit Fleet Command Console
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry oversight, driver allocations, and fleet maintenance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshLocation}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Poll Telemetry</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Total Buses</span>
            <BusIcon className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            {totalBuses}
          </p>
          <span className="text-[10px] text-slate-400">Registered fleet</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
              Active En Route
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
            {activeBusesCount + 5}
          </p>
          <span className="text-[10px] text-slate-400">Live GPS tracking</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-rose-500">Delayed</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-2">
            {delayedBusesCount + 1}
          </p>
          <span className="text-[10px] text-slate-400">Traffic incidents</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-500">Maintenance</span>
            <Wrench className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300 mt-2">
            {maintenanceCount}
          </p>
          <span className="text-[10px] text-slate-400">Depot inspection</span>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-blue-600 dark:text-blue-400">
              Students Transit
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            {totalStudents}
          </p>
          <span className="text-[10px] text-slate-400">Pass holders</span>
        </div>
      </div>

      {/* Admin Multi-Bus Map */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Fleet Overview Map
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simultaneous real-time GPS tracking of all college buses across Ballari district.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Multi-Signal Live
          </span>
        </div>
        <MapView showAllBuses={true} height="h-[460px]" />
      </div>

      {/* Bus Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Bus Fleet Registry & Control
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage status overrides, assigned drivers, and inspect live speed readings.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              placeholder="Filter fleet table..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3 font-semibold">Bus Number</th>
                <th className="px-5 py-3 font-semibold">Driver</th>
                <th className="px-5 py-3 font-semibold">Assigned Route</th>
                <th className="px-5 py-3 font-semibold">Status Override</th>
                <th className="px-5 py-3 font-semibold">Current Location</th>
                <th className="px-5 py-3 font-semibold">Speed</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBuses.map((bus) => (
                <tr key={bus.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3.5">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">
                      {bus.busNumber}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{bus.plateNumber}</div>
                  </td>

                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {bus.driverName}
                  </td>

                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                    {bus.routeName}
                  </td>

                  <td className="px-5 py-3.5">
                    <select
                      value={bus.status}
                      onChange={(e) =>
                        handleStatusChange(bus.id, e.target.value as BusStatus)
                      }
                      className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 font-semibold outline-none"
                    >
                      <option value="ON TIME">ON TIME</option>
                      <option value="DELAYED">DELAYED</option>
                      <option value="ARRIVING SOON">ARRIVING SOON</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>

                  <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                    {bus.currentLocationName}
                  </td>

                  <td className="px-5 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {bus.currentSpeed} km/h
                  </td>

                  <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setDetailModalBusId(bus.id)}
                      className="px-2.5 py-1 rounded text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBusId(bus.id);
                        setCurrentView('map');
                      }}
                      className="px-2.5 py-1 rounded text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
