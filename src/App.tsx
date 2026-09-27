/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BusProvider, useBus } from './context/BusContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { LandingPage } from './components/auth/LandingPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { LiveTrackingPage } from './components/map/LiveTrackingPage';
import { RoutesView } from './components/routes/RoutesView';
import { StopsView } from './components/stops/StopsView';
import { MyBusView } from './components/bus/MyBusView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DriverPanel } from './components/driver/DriverPanel';
import { BusDetailModal } from './components/bus/BusDetailModal';

const AppContent: React.FC = () => {
  const { currentView, userRole } = useBus();

  // If user is guest or on landing view, render the landing page
  if (userRole === 'guest' || currentView === 'landing') {
    return <LandingPage />;
  }

  // Render view depending on navigation
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'map':
        return <LiveTrackingPage />;
      case 'routes':
        return <RoutesView />;
      case 'stops':
        return <StopsView />;
      case 'my-bus':
        return <MyBusView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminDashboard />;
      case 'driver':
        return <DriverPanel />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors flex flex-col">
      {/* Top Header */}
      <Header />

      {/* Main Body with Sidebar + View Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Bus Detail Modal */}
      <BusDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <BusProvider>
      <AppContent />
    </BusProvider>
  );
}
