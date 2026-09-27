import React from 'react';
import { useBus } from '../../context/BusContext';
import {
  User,
  GraduationCap,
  Star,
  MapPin,
  Bell,
  Navigation,
  Moon,
  LogOut,
  Shield,
  Check,
  Smartphone,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    studentProfile,
    updateStudentProfile,
    buses,
    routes,
    favoriteBusId,
    setFavoriteBusId,
    selectedPickupStopId,
    setSelectedPickupStopId,
    darkMode,
    toggleDarkMode,
    logout,
  } = useBus();

  const handleToggleNotifications = () => {
    updateStudentProfile({ notificationsEnabled: !studentProfile.notificationsEnabled });
  };

  const handleToggleLocation = () => {
    updateStudentProfile({ locationSharingEnabled: !studentProfile.locationSharingEnabled });
  };

  // Get all available stops
  const allStops = routes.flatMap((r) => r.stops);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Student ID Virtual Badge Card */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background watermark shapes */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-12 top-4 text-white/10 font-bold text-6xl select-none">
          BITM
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white/20 bg-white shadow-md shrink-0">
              {studentProfile.avatarUrl ? (
                <img
                  src={studentProfile.avatarUrl}
                  alt={studentProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xl">
                  {studentProfile.name.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{studentProfile.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/40 border border-blue-400/30 uppercase tracking-wider">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5 font-mono">
                ID: {studentProfile.studentId} · {studentProfile.department}
              </p>
              <p className="text-xs text-blue-100/80 mt-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>{studentProfile.college}</span>
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">
              Transit Card Status
            </span>
            <span className="text-sm font-bold text-emerald-300">Active · Fall 2026</span>
          </div>
        </div>
      </div>

      {/* Transit Preferences Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Transit Pass & Bus Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Favorite Bus Selector */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span className="font-semibold text-slate-900 dark:text-white">
                Primary College Bus
              </span>
            </div>
            <select
              value={favoriteBusId}
              onChange={(e) => setFavoriteBusId(e.target.value)}
              className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium outline-none"
            >
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} — {b.routeName}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-2">
              This bus will default to your home screen live tracker.
            </p>
          </div>

          {/* Preferred Pickup Stop */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-slate-900 dark:text-white">
                Default Pickup Stop
              </span>
            </div>
            <select
              value={selectedPickupStopId}
              onChange={(e) => setSelectedPickupStopId(e.target.value)}
              className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium outline-none"
            >
              {allStops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.scheduledTime})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-2">
              Estimated arrival push notifications trigger for this stop.
            </p>
          </div>
        </div>
      </div>

      {/* App Settings Toggles */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Settings & Devices</h3>

        <div className="space-y-3 text-xs">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Live Arrival Push Notifications
                </span>
                <span className="text-[11px] text-slate-400">
                  Receive alerts when your bus is approaching your pickup stop.
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleNotifications}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                studentProfile.notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  studentProfile.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Location Services Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Location Services
                </span>
                <span className="text-[11px] text-slate-400">
                  Allows app to highlight the nearest bus stop to you automatically.
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleLocation}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                studentProfile.locationSharingEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  studentProfile.locationSharingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Dark Appearance Mode
                </span>
                <span className="text-[11px] text-slate-400">
                  Switch between light and high-contrast dark themes.
                </span>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Logout action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-400">Session ID: bitm-std-live-session</span>
          <button
            onClick={logout}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 transition-colors inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
