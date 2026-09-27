export type BusStatus = 'ON TIME' | 'DELAYED' | 'ARRIVING SOON' | 'MAINTENANCE' | 'COMPLETED';

export type UserRole = 'student' | 'admin' | 'driver' | 'guest';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  name: string;
  coordinates: Coordinates;
  scheduledTime: string; // e.g. "08:15 AM"
  estimatedArrivalMinutes?: number;
  distanceKm?: number;
  status: 'Passed' | 'Arriving Soon' | 'Upcoming' | 'Destination';
  landmark?: string;
}

export interface BusRoute {
  id: string;
  name: string;
  code: string;
  startPoint: string;
  endPoint: string;
  totalDistanceKm: number;
  estimatedTotalMinutes: number;
  stops: BusStop[];
  waypoints: Coordinates[]; // Detailed path coordinates for polyline
}

export interface Bus {
  id: string;
  busNumber: string; // e.g. "BUS-101"
  plateNumber: string; // e.g. "KA-34-M-4589"
  driverName: string;
  driverPhone: string;
  routeId: string;
  routeName: string;
  status: BusStatus;
  currentSpeed: number; // km/h
  passengers: number;
  capacity: number;
  currentLocation: Coordinates;
  currentLocationName: string;
  nextStopId: string;
  nextStopName: string;
  etaMinutes: number;
  distanceToNextKm: number;
  lastUpdated: string;
  fuelPercent: number;
  isTripActive: boolean;
  routeProgressIndex: number; // 0 to 100% or waypoint index
}

export interface AppNotification {
  id: string;
  busId: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'arrival' | 'delay';
  read: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  email: string;
  college: string;
  department: string;
  year: string;
  favoriteBusId: string;
  defaultPickupStopId: string;
  notificationsEnabled: boolean;
  locationSharingEnabled: boolean;
  avatarUrl?: string;
}
