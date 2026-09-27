import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useBus } from '../../context/BusContext';
import {
  RefreshCw,
  Navigation,
  Compass,
  Layers,
  MapPin,
  GraduationCap,
  Maximize2,
  AlertCircle,
  Clock,
  Gauge,
  Users,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface MapViewProps {
  showAllBuses?: boolean;
  className?: string;
  height?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  showAllBuses = false,
  className = '',
  height = 'h-[480px] lg:h-[580px]',
}) => {
  const {
    selectedBus,
    selectedRoute,
    buses,
    pickupStop,
    refreshLocation,
    lastUpdatedSecondsAgo,
    isSimulating,
    setDetailModalBusId,
    setSelectedBusId,
  } = useBus();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const stopMarkersRef = useRef<L.Marker[]>([]);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const collegeMarkerRef = useRef<L.Marker | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'focused' | 'all'>(showAllBuses ? 'all' : 'focused');

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Default center around Ballari / RYMEC
      const initialLat = selectedBus ? selectedBus.currentLocation.lat : 15.1432;
      const initialLng = selectedBus ? selectedBus.currentLocation.lng : 76.9000;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      // Custom zoom control in bottom-right
      L.control
        .zoom({
          position: 'bottomright',
        })
        .addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    } catch (err) {
      console.error('Failed to initialize Leaflet map:', err);
      setMapError('Unable to load interactive map canvas. Displaying offline vector mode.');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Route Polyline & Bus Stops when selectedRoute changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady || !selectedRoute) return;

    // Clear previous polyline and stops
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    stopMarkersRef.current.forEach((marker) => map.removeLayer(marker));
    stopMarkersRef.current = [];

    if (collegeMarkerRef.current) {
      map.removeLayer(collegeMarkerRef.current);
      collegeMarkerRef.current = null;
    }

    if (pickupMarkerRef.current) {
      map.removeLayer(pickupMarkerRef.current);
      pickupMarkerRef.current = null;
    }

    // 1. Draw Polyline for Route
    const latLngs = selectedRoute.waypoints.map((wp) => [wp.lat, wp.lng] as [number, number]);
    const polyline = L.polyline(latLngs, {
      color: '#2563eb', // Blue-600
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: undefined,
    }).addTo(map);

    routePolylineRef.current = polyline;

    // 2. Add Stop Markers along the route
    selectedRoute.stops.forEach((stop, index) => {
      const isDestination = index === selectedRoute.stops.length - 1;
      const isOrigin = index === 0;

      const stopIconHtml = isDestination
        ? `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-indigo-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <span class="absolute -bottom-6 bg-slate-900 text-white font-medium text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
            RYMEC College
          </span>
        </div>`
        : `
        <div class="relative flex items-center justify-center">
          <div class="w-6 h-6 rounded-full ${
            isOrigin ? 'bg-blue-600' : 'bg-white'
          } border-2 border-blue-600 text-blue-600 flex items-center justify-center shadow-md font-bold text-[11px]">
            ${index + 1}
          </div>
          <span class="absolute -bottom-5 bg-white/90 text-slate-800 font-semibold text-[9px] px-1.5 py-0.2 rounded border border-slate-200 shadow-sm whitespace-nowrap hidden sm:block">
            ${stop.name}
          </span>
        </div>`;

      const stopIcon = L.divIcon({
        className: 'custom-stop-icon',
        html: stopIconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([stop.coordinates.lat, stop.coordinates.lng], {
        icon: stopIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-3 text-xs font-sans">
          <div class="font-bold text-slate-900 text-sm">${stop.name}</div>
          <div class="text-slate-500 mt-0.5">${stop.landmark || 'College Transit Stop'}</div>
          <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600">
            <span>Scheduled: <strong class="text-slate-800">${stop.scheduledTime}</strong></span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">${stop.status}</span>
          </div>
        </div>
      `);

      stopMarkersRef.current.push(marker);
    });

    // 3. Mark Student Selected Pickup Point
    if (pickupStop) {
      const pickupIcon = L.divIcon({
        className: 'custom-pickup-icon',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-400">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <span class="absolute -top-6 bg-emerald-700 text-white font-medium text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
              My Pickup Stop
            </span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const pMarker = L.marker([pickupStop.coordinates.lat, pickupStop.coordinates.lng], {
        icon: pickupIcon,
        zIndexOffset: 500,
      }).addTo(map);

      pMarker.bindPopup(`
        <div class="p-3 text-xs font-sans">
          <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Your Selected Pickup</span>
          <div class="font-bold text-slate-900 text-sm mt-0.5">${pickupStop.name}</div>
          <div class="text-slate-500 mt-1">Bus will arrive around scheduled time <strong>${pickupStop.scheduledTime}</strong></div>
        </div>
      `);

      pickupMarkerRef.current = pMarker;
    }
  }, [mapReady, selectedRoute, pickupStop]);

  // Update Bus Markers with Live Coordinates & Popups
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    const visibleBuses = viewMode === 'all' ? buses : [selectedBus].filter(Boolean);

    // Track active bus ids
    const activeBusIds = new Set<string>();

    visibleBuses.forEach((bus) => {
      activeBusIds.add(bus.id);
      const isSelected = bus.id === selectedBus?.id;

      const busIconHtml = `
        <div class="relative flex items-center justify-center group cursor-pointer">
          <!-- Pulse beacon -->
          <div class="absolute -inset-2 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          <!-- Vehicle Badge -->
          <div class="relative px-2 py-1 rounded-lg ${
            isSelected
              ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-xl'
              : 'bg-slate-900 text-white ring-1 ring-slate-700 shadow-md'
          } flex items-center gap-1.5 text-xs font-bold transition-transform transform hover:scale-110">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.6-.1-1.1-.3-1.6l-1.4-3.4c-.5-1.2-1.7-2-3-2H6.7c-1.3 0-2.5.8-3 2L2.3 9.4c-.2.5-.3 1-.3 1.6 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
            </svg>
            <span>${bus.busNumber}</span>
          </div>
          <!-- Direction / Speed tag -->
          <span class="absolute -bottom-5 bg-white text-slate-800 border border-slate-200 text-[9px] font-mono px-1 rounded shadow-sm">
            ${bus.currentSpeed} km/h
          </span>
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'custom-bus-live-icon',
        html: busIconHtml,
        iconSize: [60, 36],
        iconAnchor: [30, 18],
      });

      const existingMarker = busMarkersRef.current.get(bus.id);

      if (existingMarker) {
        existingMarker.setLatLng([bus.currentLocation.lat, bus.currentLocation.lng]);
        existingMarker.setIcon(busIcon);
      } else {
        const marker = L.marker([bus.currentLocation.lat, bus.currentLocation.lng], {
          icon: busIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        marker.on('click', () => {
          setSelectedBusId(bus.id);
        });

        busMarkersRef.current.set(bus.id, marker);
      }

      // Update popup content
      const marker = busMarkersRef.current.get(bus.id);
      if (marker) {
        marker.bindPopup(`
          <div class="p-3.5 font-sans min-w-[210px]">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="font-bold text-slate-900 text-sm">${bus.busNumber}</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded ${
                bus.status === 'ON TIME'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }">${bus.status}</span>
            </div>
            <div class="text-xs text-slate-500 mb-2">${bus.routeName}</div>
            
            <div class="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2 my-2">
              <div>
                <span class="text-slate-400 block text-[10px]">Speed</span>
                <span class="font-mono font-bold text-slate-800">${bus.currentSpeed} km/h</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">Next Stop ETA</span>
                <span class="font-mono font-bold text-blue-600">${bus.etaMinutes} min</span>
              </div>
              <div class="col-span-2">
                <span class="text-slate-400 block text-[10px]">Approaching</span>
                <span class="font-medium text-slate-800 truncate block">${bus.nextStopName}</span>
              </div>
            </div>

            <div class="flex justify-between items-center text-[11px] text-slate-500 pt-1">
              <span>Driver: ${bus.driverName}</span>
              <span>${bus.passengers}/${bus.capacity} seats</span>
            </div>
          </div>
        `);
      }
    });

    // Remove markers for buses that are no longer visible
    busMarkersRef.current.forEach((marker, id) => {
      if (!activeBusIds.has(id)) {
        map.removeLayer(marker);
        busMarkersRef.current.delete(id);
      }
    });

    // Recenter map on selected bus smoothly if in focused mode
    if (viewMode === 'focused' && selectedBus) {
      map.panTo([selectedBus.currentLocation.lat, selectedBus.currentLocation.lng], {
        animate: true,
        duration: 0.5,
      });
    }
  }, [mapReady, buses, selectedBus, viewMode, setSelectedBusId]);

  // Recenter map handler
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map || !selectedBus) return;
    map.setView([selectedBus.currentLocation.lat, selectedBus.currentLocation.lng], 14, {
      animate: true,
    });
  };

  const handleFitRouteBounds = () => {
    const map = mapInstanceRef.current;
    if (!map || !selectedRoute) return;
    const latLngs = selectedRoute.waypoints.map((wp) => [wp.lat, wp.lng] as [number, number]);
    map.fitBounds(latLngs, { padding: [40, 40] });
  };

  return (
    <div
      className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm ${className}`}
    >
      {/* Top Overlay HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Status & Telemetry */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Live GPS Tracking
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            Updated {lastUpdatedSecondsAgo}s ago
          </span>
        </div>

        {/* Right HUD Controls: Refresh, View Mode, Recenter */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setViewMode(viewMode === 'focused' ? 'all' : 'focused')}
            title="Toggle All Buses vs Selected Bus"
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {viewMode === 'all' ? 'All Buses' : 'Single Route'}
            </span>
          </button>

          <button
            onClick={handleRecenter}
            title="Center Bus"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>

          <button
            onClick={handleFitRouteBounds}
            title="Fit Entire Route"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={refreshLocation}
            title="Refresh Location"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Bus Summary Card on Map */}
      {selectedBus && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:max-w-md z-[1000] pointer-events-auto">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl text-slate-900 dark:text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight">
                    {selectedBus.busNumber}
                  </span>
                  <StatusBadge status={selectedBus.status} size="sm" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedBus.routeName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Next Stop In
                </span>
                <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                  {selectedBus.etaMinutes} min
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Speed</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {selectedBus.currentSpeed} km/h
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block">Approaching</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {selectedBus.nextStopName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Occupancy</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedBus.passengers}/{selectedBus.capacity}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Driver: {selectedBus.driverName}
              </span>
              <button
                onClick={() => setDetailModalBusId(selectedBus.id)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
              >
                View Full Details →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Error Fallback */}
      {mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center">
          <AlertCircle className="w-10 h-10 text-amber-500 mb-2" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
