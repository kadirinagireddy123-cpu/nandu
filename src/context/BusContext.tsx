import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Bus, BusRoute, BusStop, AppNotification, StudentProfile, UserRole } from '../types/bus';
import { INITIAL_BUSES, INITIAL_ROUTES, INITIAL_NOTIFICATIONS, DEMO_STUDENT } from '../data/mockData';

interface BusContextType {
  // Navigation & User
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  studentProfile: StudentProfile;
  updateStudentProfile: (updates: Partial<StudentProfile>) => void;
  isLoggedIn: boolean;
  loginAs: (role: UserRole) => void;
  logout: () => void;

  // Buses & Routes
  buses: Bus[];
  routes: BusRoute[];
  selectedBusId: string;
  setSelectedBusId: (id: string) => void;
  selectedBus: Bus;
  selectedRoute: BusRoute | undefined;
  favoriteBusId: string;
  setFavoriteBusId: (id: string) => void;
  toggleFavoriteBus: (id: string) => void;

  // Stops & Pickup Point
  selectedPickupStopId: string;
  setSelectedPickupStopId: (id: string) => void;
  pickupStop: BusStop | undefined;

  // GPS Simulation & Hackathon Demo Mode
  isSimulating: boolean;
  setIsSimulating: (active: boolean) => void;
  toggleSimulation: () => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  simulationSpeed: number; // 1x, 2x, 5x
  setSimulationSpeed: (speed: number) => void;
  lastUpdatedSecondsAgo: number;
  refreshLocation: () => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Driver Trip Controls
  startDriverTrip: (busId: string) => void;
  endDriverTrip: (busId: string) => void;
  updateDriverStatus: (busId: string, status: Bus['status'], speed: number) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredBuses: Bus[];

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Modal / Drawer
  detailModalBusId: string | null;
  setDetailModalBusId: (id: string | null) => void;
}

const BusContext = createContext<BusContextType | undefined>(undefined);

const STORAGE_FAV_KEY = 'smartbus_favorite_bus_id';
const STORAGE_DARK_KEY = 'smartbus_dark_mode';
const STORAGE_USER_ROLE_KEY = 'smartbus_user_role';

// Distance calculation helper (Haversine formula in KM)
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const BusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_DARK_KEY);
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_DARK_KEY, String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // User Authentication state
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem(STORAGE_USER_ROLE_KEY);
    return (savedRole as UserRole) || 'student';
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEMO_STUDENT);

  // Data states
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [routes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Favorite Bus
  const [favoriteBusId, setFavoriteBusIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_FAV_KEY);
    return saved || 'BUS-101';
  });

  const setFavoriteBusId = (id: string) => {
    setFavoriteBusIdState(id);
    localStorage.setItem(STORAGE_FAV_KEY, id);
    setStudentProfile((prev) => ({ ...prev, favoriteBusId: id }));
  };

  const toggleFavoriteBus = (id: string) => {
    if (favoriteBusId === id) {
      setFavoriteBusId('');
    } else {
      setFavoriteBusId(id);
    }
  };

  const [selectedBusId, setSelectedBusId] = useState<string>(favoriteBusId || 'BUS-101');
  const [selectedPickupStopId, setSelectedPickupStopId] = useState<string>('stop-101-2');
  const [detailModalBusId, setDetailModalBusId] = useState<string | null>(null);

  // Simulation controls
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [lastUpdatedSecondsAgo, setLastUpdatedSecondsAgo] = useState<number>(4);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isLoggedIn = userRole !== 'guest';

  const loginAs = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem(STORAGE_USER_ROLE_KEY, role);
    if (role === 'admin') {
      setCurrentView('admin');
    } else if (role === 'driver') {
      setCurrentView('driver');
    } else {
      setCurrentView('dashboard');
    }
  };

  const logout = () => {
    setUserRole('guest');
    localStorage.removeItem(STORAGE_USER_ROLE_KEY);
    setCurrentView('landing');
  };

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...updates }));
  };

  // Selected bus and route helper
  const selectedBus = useMemo(() => {
    return buses.find((b) => b.id === selectedBusId) || buses[0];
  }, [buses, selectedBusId]);

  const selectedRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedBus?.routeId) || routes[0];
  }, [routes, selectedBus]);

  const pickupStop = useMemo(() => {
    if (!selectedRoute) return undefined;
    return selectedRoute.stops.find((s) => s.id === selectedPickupStopId) || selectedRoute.stops[1];
  }, [selectedRoute, selectedPickupStopId]);

  // Notifications helpers
  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  }, []);

  const refreshLocation = () => {
    setLastUpdatedSecondsAgo(0);
    // Add small jitter or progress update
    setBuses((prev) =>
      prev.map((b) => {
        if (!b.isTripActive) return b;
        return {
          ...b,
          lastUpdated: 'Just now',
        };
      })
    );
  };

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      if (next) {
        setIsSimulating(true);
        setSimulationSpeed(2);
        addNotification({
          busId: selectedBusId,
          title: 'Hackathon Demo Mode Enabled',
          message: 'Fast-forward simulation active. Bus speed, live waypoints, and ETA recalculating in real-time.',
          type: 'info',
        });
      } else {
        setSimulationSpeed(1);
      }
      return next;
    });
  };

  // Driver actions
  const startDriverTrip = (busId: string) => {
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === busId) {
          return {
            ...b,
            isTripActive: true,
            status: 'ON TIME',
            currentSpeed: 36,
            routeProgressIndex: 0,
          };
        }
        return b;
      })
    );
    addNotification({
      busId,
      title: `${busId} Trip Commenced`,
      message: `Driver started trip on ${selectedRoute?.name || 'Route'}. GPS broadcasting live telemetry.`,
      type: 'info',
    });
  };

  const endDriverTrip = (busId: string) => {
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === busId) {
          return {
            ...b,
            isTripActive: false,
            status: 'COMPLETED',
            currentSpeed: 0,
            etaMinutes: 0,
          };
        }
        return b;
      })
    );
    addNotification({
      busId,
      title: `${busId} Trip Completed`,
      message: `The bus has arrived at the destination terminal (BITM College).`,
      type: 'info',
    });
  };

  const updateDriverStatus = (busId: string, status: Bus['status'], speed: number) => {
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, status, currentSpeed: speed } : b))
    );
  };

  // Live GPS simulation loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = Math.max(1000, Math.floor(3500 / simulationSpeed));
    const interval = setInterval(() => {
      setLastUpdatedSecondsAgo(0);

      setBuses((prevBuses) => {
        return prevBuses.map((bus) => {
          if (!bus.isTripActive || bus.status === 'MAINTENANCE' || bus.status === 'COMPLETED') {
            return bus;
          }

          const route = routes.find((r) => r.id === bus.routeId);
          if (!route || route.waypoints.length === 0) return bus;

          const totalWaypoints = route.waypoints.length;
          // advance progress
          let nextIndex = (bus.routeProgressIndex + 1) % totalWaypoints;
          const currentWaypoint = route.waypoints[nextIndex];

          // Micro variations in speed (28 to 44 km/h)
          const speedVariation = 32 + Math.floor(Math.sin(nextIndex) * 8);
          const currentSpeed = speedVariation > 0 ? speedVariation : 25;

          // Find closest next stop
          // Stops are mapped along the route
          const stops = route.stops;
          const stopCount = stops.length;
          // Approximate stop based on progress
          const stopIndex = Math.min(
            Math.floor((nextIndex / totalWaypoints) * stopCount),
            stopCount - 1
          );
          const nextStopCandidate = stops[Math.min(stopIndex + 1, stopCount - 1)];
          const currentStop = stops[stopIndex];

          // Calculate distance from current waypoint to next stop
          const distKm = calculateHaversineKm(
            currentWaypoint.lat,
            currentWaypoint.lng,
            nextStopCandidate.coordinates.lat,
            nextStopCandidate.coordinates.lng
          );

          // Calculate ETA = (distance / speed) * 60 minutes
          const calculatedEta = Math.max(1, Math.round((distKm / currentSpeed) * 60));

          // Passenger fluctuation (30 to 48)
          const newPassengers = Math.min(
            bus.capacity,
            Math.max(20, bus.passengers + (nextIndex % 3 === 0 ? 1 : nextIndex % 5 === 0 ? -1 : 0))
          );

          // Status calculation
          let status: Bus['status'] = bus.status;
          if (calculatedEta > 20 && bus.busNumber === 'BUS-102') {
            status = 'DELAYED';
          } else if (distKm <= 1.5) {
            status = 'ARRIVING SOON';
          } else if (bus.status !== 'DELAYED') {
            status = 'ON TIME';
          }

          return {
            ...bus,
            routeProgressIndex: nextIndex,
            currentLocation: currentWaypoint,
            currentLocationName: `Near ${currentStop.name}`,
            nextStopId: nextStopCandidate.id,
            nextStopName: nextStopCandidate.name,
            currentSpeed,
            distanceToNextKm: distKm,
            etaMinutes: calculatedEta,
            passengers: newPassengers,
            status,
            lastUpdated: 'A few seconds ago',
          };
        });
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, routes]);

  // Secondary ticker for seconds ago display
  useEffect(() => {
    const ticker = setInterval(() => {
      setLastUpdatedSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Filtered buses by search
  const filteredBuses = useMemo(() => {
    if (!searchQuery.trim()) return buses;
    const q = searchQuery.toLowerCase();
    return buses.filter(
      (b) =>
        b.busNumber.toLowerCase().includes(q) ||
        b.routeName.toLowerCase().includes(q) ||
        b.driverName.toLowerCase().includes(q) ||
        b.nextStopName.toLowerCase().includes(q) ||
        b.plateNumber.toLowerCase().includes(q)
    );
  }, [buses, searchQuery]);

  return (
    <BusContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        studentProfile,
        updateStudentProfile,
        isLoggedIn,
        loginAs,
        logout,
        buses,
        routes,
        selectedBusId,
        setSelectedBusId,
        selectedBus,
        selectedRoute,
        favoriteBusId,
        setFavoriteBusId,
        toggleFavoriteBus,
        selectedPickupStopId,
        setSelectedPickupStopId,
        pickupStop,
        isSimulating,
        setIsSimulating,
        toggleSimulation,
        isDemoMode,
        toggleDemoMode,
        simulationSpeed,
        setSimulationSpeed,
        lastUpdatedSecondsAgo,
        refreshLocation,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        addNotification,
        startDriverTrip,
        endDriverTrip,
        updateDriverStatus,
        searchQuery,
        setSearchQuery,
        filteredBuses,
        darkMode,
        toggleDarkMode,
        detailModalBusId,
        setDetailModalBusId,
      }}
    >
      {children}
    </BusContext.Provider>
  );
};

export const useBus = (): BusContextType => {
  const context = useContext(BusContext);
  if (!context) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
};
