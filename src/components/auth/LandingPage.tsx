import React, { useState } from 'react';
import { useBus } from '../../context/BusContext';
import {
  Bus,
  MapPin,
  Clock,
  Shield,
  Smartphone,
  ChevronRight,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  X,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginAs } = useBus();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<'student' | 'admin' | 'driver'>('student');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');

  const handleOpenLogin = (role: 'student' | 'admin' | 'driver') => {
    setTargetRole(role);
    if (role === 'student') {
      setEmailOrId('student@rymec.in');
      setPassword('rymec2026');
    } else if (role === 'admin') {
      setEmailOrId('admin@rymec.in');
      setPassword('admin2026');
    } else {
      setEmailOrId('driver.ramesh@rymec.in');
      setPassword('driver2026');
    }
    setLoginModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(targetRole);
    setLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight">SmartBus</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  RYMEC
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Rao Bahadur Y. Mahabaleswarappa Engineering College
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenLogin('student')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              Student Portal
            </button>
            <button
              onClick={() => handleOpenLogin('admin')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors hidden sm:block"
            >
              Admin Access
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Brief & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Next-Gen Smart Campus Transportation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
            Track Your College Bus in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Real Time
            </span>
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Know where your bus is, when it will arrive, and which stops it is approaching.
            Eliminate bus stand wait times with live telemetry and accurate ETA forecasting.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleOpenLogin('student')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
            >
              <User className="w-4 h-4" />
              <span>Student Live Tracking</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => handleOpenLogin('admin')}
              className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all"
            >
              <Shield className="w-4 h-4 inline mr-2 text-blue-600" />
              <span>Admin Fleet Console</span>
            </button>

            <button
              onClick={() => handleOpenLogin('driver')}
              className="px-4 py-3 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium"
            >
              Driver Mode →
            </button>
          </div>

          {/* Value Props Pills */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block text-sm">3–5 Sec</span>
              <span className="text-slate-500 dark:text-slate-400">GPS Ping Interval</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block text-sm">12 Buses</span>
              <span className="text-slate-500 dark:text-slate-400">Active Campus Fleet</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block text-sm">99.4%</span>
              <span className="text-slate-500 dark:text-slate-400">Schedule Reliability</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Asset Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
            <img
              src="/src/assets/images/college_bus_modern_1790486285458.jpg"
              alt="Smart College Bus"
              className="w-full h-80 sm:h-96 object-cover transform transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            {/* Floating Live Telemetry Badge over image */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    101
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      BUS-101 (Ballari → RYMEC)
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Approaching Cowl Bazaar
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                    ETA
                  </span>
                  <span className="text-base font-bold font-mono text-blue-600">7 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Pillars */}
      <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Interactive Map
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Real-time Leaflet tracking showing animated bus positions along official transit corridors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Dynamic ETA Forecasting
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Accurate arrival calculation based on current road speed, distance, and traffic congestion.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Designated Stop Advisories
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Set your favorite pickup point and receive automated alerts when the vehicle is 2km away.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 SmartBus · Rao Bahadur Y. Mahabaleswarappa Engineering College (RYMEC), Ballari</p>
      </footer>

      {/* Student/Admin Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  SB
                </div>
                <div>
                  <h3 className="text-sm font-bold capitalize">{targetRole} Authentication</h3>
                  <p className="text-[11px] text-slate-400">RYMEC Transport Prototype Portal</p>
                </div>
              </div>
              <button
                onClick={() => setLoginModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email or Student ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder="student@rymec.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-[11px] text-blue-700 dark:text-blue-300">
                <p className="font-semibold">Demo credentials preloaded</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Click below to immediately enter the prototype dashboard without a backend.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-colors"
              >
                Sign In to {targetRole === 'student' ? 'Student Dashboard' : targetRole === 'admin' ? 'Fleet Admin' : 'Driver Console'}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400">Quick role switch: </span>
                <button
                  type="button"
                  onClick={() => handleOpenLogin('student')}
                  className={`text-[11px] font-semibold underline mx-1 ${
                    targetRole === 'student' ? 'text-blue-600' : 'text-slate-500'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenLogin('admin')}
                  className={`text-[11px] font-semibold underline mx-1 ${
                    targetRole === 'admin' ? 'text-blue-600' : 'text-slate-500'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenLogin('driver')}
                  className={`text-[11px] font-semibold underline mx-1 ${
                    targetRole === 'driver' ? 'text-blue-600' : 'text-slate-500'
                  }`}
                >
                  Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
