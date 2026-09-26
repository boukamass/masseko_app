import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Camera, 
  AlertTriangle,
  Compass,
  Plus,
  Minus,
  Truck,
  Navigation,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Eye,
  Scale
} from 'lucide-react';
import { WasteReport } from '../../../types/koba';
import { POINTE_NOIRE_COASTAL_SITES } from '../../../data/mockPointeNoireData';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect, ModernSelectOption } from '../ModernSelect';

interface MapScreenProps {
  reports: WasteReport[];
  selectedMapPoint: WasteReport | null;
  setSelectedMapPoint: (report: WasteReport | null) => void;
  setSelectedReportToCollect?: (report: WasteReport | null) => void;
  setWeighInput?: (val: number) => void;
  mapFilter: 'all' | 'simple_waste' | 'critical' | 'turtle_nest' | 'collected';
  setMapFilter: (filter: 'all' | 'simple_waste' | 'critical' | 'turtle_nest' | 'collected') => void;
  mapSectorFilter: string;
  setMapSectorFilter: (sector: string) => void;
  themeMode?: 'forest' | 'fixora';
  setMobileScreen: (screen: DemoScreen) => void;
  handleApproveReport: (id: string) => void;
  handleRejectReport: (id: string) => void;
}

// Coastal corridor coordinates of Pointe-Noire (Songolo -> Port de Pêche -> Côte Sauvage -> Ngoyo -> Djeno)
const COASTAL_PATROL_COORDINATES: [number, number][] = [
  [-4.7510, 11.8670], // Mvassa
  [-4.7645, 11.8890], // Djeno Frayère
  [-4.7720, 11.8540], // Songolo Estuaire
  [-4.7870, 11.8380], // Port de Pêche
  [-4.7985, 11.8290], // Côte Sauvage
  [-4.8120, 11.8630], // Ngoyo Littoral Sud
];

// Active patrol vehicle position
const PATROL_VEHICLE_COORDS: [number, number] = [-4.7885, 11.8335];

// Default overview center & zoom for Pointe-Noire
const POINTE_NOIRE_CENTER: [number, number] = [-4.785, 11.848];
const DEFAULT_BALANCED_ZOOM = 12.3;

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80';

// Geodesic distance calculator in meters
function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const MapScreen: React.FC<MapScreenProps> = ({
  reports,
  selectedMapPoint,
  setSelectedMapPoint,
  setSelectedReportToCollect,
  setWeighInput,
  mapFilter,
  setMapFilter,
  mapSectorFilter,
  setMapSectorFilter,
  themeMode,
  setMobileScreen,
  handleApproveReport,
  handleRejectReport,
}) => {
  const isFixora = themeMode === 'fixora';

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const [showVehicleInfo, setShowVehicleInfo] = useState<boolean>(false);
  const [inspectingPhotoReport, setInspectingPhotoReport] = useState<WasteReport | null>(null);
  const [photoZoomLevel, setPhotoZoomLevel] = useState<number>(1);
  const [hasArrived, setHasArrived] = useState<boolean>(false);

  // Dynamic distance and ETA to selected waste point
  const distanceMeters = selectedMapPoint
    ? calculateDistanceMeters(
        PATROL_VEHICLE_COORDS[0],
        PATROL_VEHICLE_COORDS[1],
        selectedMapPoint.latitude,
        selectedMapPoint.longitude
      )
    : 0;

  const etaMinutes = Math.max(1, Math.round(distanceMeters / 250)); // ~15 km/h sur piste sable

  // Reset arrival state when selected point changes
  useEffect(() => {
    setHasArrived(false);
  }, [selectedMapPoint?.id]);

  const handleStartWeighing = (report: WasteReport) => {
    setSelectedReportToCollect?.(report);
    setWeighInput?.(report.estimatedWeightKg || 25);
    setHasArrived(false);
    setMobileScreen('tour');
  };

  // Filtered reports list
  const filteredReports = reports.filter((r) => {
    if (mapFilter === 'simple_waste' && (r.isNestingZone || r.collectionType === 'turtle_nest')) return false;
    if (mapFilter === 'critical' && r.priorityLevel !== 'CRITIQUE') return false;
    if (mapFilter === 'turtle_nest' && !r.isNestingZone) return false;
    if (mapFilter === 'collected' && r.status !== 'collected' && r.status !== 'validated') return false;
    if (mapSectorFilter !== 'all' && !r.locationName.toLowerCase().includes(mapSectorFilter.toLowerCase())) return false;
    return true;
  });

  // Current index in filtered reports for modal carousel
  const activePhotoIndex = inspectingPhotoReport 
    ? filteredReports.findIndex((r) => r.id === inspectingPhotoReport.id)
    : -1;

  const handleNextPhoto = () => {
    if (filteredReports.length === 0 || activePhotoIndex === -1) return;
    const nextIdx = (activePhotoIndex + 1) % filteredReports.length;
    const nextReport = filteredReports[nextIdx];
    setInspectingPhotoReport(nextReport);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([nextReport.latitude, nextReport.longitude], { animate: true, duration: 0.4 });
    }
  };

  const handlePrevPhoto = () => {
    if (filteredReports.length === 0 || activePhotoIndex === -1) return;
    const prevIdx = (activePhotoIndex - 1 + filteredReports.length) % filteredReports.length;
    const prevReport = filteredReports[prevIdx];
    setInspectingPhotoReport(prevReport);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([prevReport.latitude, prevReport.longitude], { animate: true, duration: 0.4 });
    }
  };

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: POINTE_NOIRE_CENTER,
      zoom: DEFAULT_BALANCED_ZOOM,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors',
      crossOrigin: true,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    const routeLayer = L.layerGroup().addTo(map);
    routeLayerRef.current = routeLayer;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    map.on('click', () => {
      setSelectedMapPoint(null);
    });

    mapInstanceRef.current = map;

    const triggerInvalidate = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    const t1 = setTimeout(triggerInvalidate, 60);
    const t2 = setTimeout(triggerInvalidate, 200);
    const t3 = setTimeout(triggerInvalidate, 500);

    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        triggerInvalidate();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Draw Coastal Patrol Route & Active Live Route towards Selected Waste
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    // Coastal corridor dashed route
    const patrolRoute = L.polyline(COASTAL_PATROL_COORDINATES, {
      color: '#0284c7',
      weight: 2.5,
      dashArray: '5, 5',
      opacity: 0.5,
      lineCap: 'round',
    });
    routeLayerRef.current.addLayer(patrolRoute);

    // Discreet Active Eco-Patrol Vehicle Marker
    const vehicleIcon = L.divIcon({
      className: 'discreet-patrol-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <span class="absolute -inset-1.5 rounded-full bg-emerald-400/40 animate-ping"></span>
          <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const vehicleMarker = L.marker(PATROL_VEHICLE_COORDS, { icon: vehicleIcon });
    vehicleMarker.on('click', () => {
      setShowVehicleInfo((prev) => !prev);
    });
    routeLayerRef.current.addLayer(vehicleMarker);

    // If a waste point is selected, draw active glowing navigation route line from vehicle to waste!
    if (selectedMapPoint) {
      const startCoord = PATROL_VEHICLE_COORDS;
      const endCoord: [number, number] = [selectedMapPoint.latitude, selectedMapPoint.longitude];

      // Outer glow line (teal aura)
      const outerGlowLine = L.polyline([startCoord, endCoord], {
        color: '#0d9488',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
      });
      routeLayerRef.current.addLayer(outerGlowLine);

      // Inner high-visibility animated guidance route line
      const directRoute = L.polyline([startCoord, endCoord], {
        color: '#0ea5e9',
        weight: 4.5,
        dashArray: '8, 8',
        opacity: 0.95,
        lineCap: 'round',
      });
      routeLayerRef.current.addLayer(directRoute);

      // Destination target pulse circle
      const targetPulse = L.circleMarker(endCoord, {
        radius: 12,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.3,
        weight: 2.5,
      });
      routeLayerRef.current.addLayer(targetPulse);

      // Auto fit bounds to smoothly zoom in on the trajectory
      mapInstanceRef.current.fitBounds([startCoord, endCoord], {
        padding: [60, 60],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [selectedMapPoint]);

  // 3. Draw Clean, Non-Intrusive Vector Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    filteredReports.forEach((report) => {
      const isSelected = selectedMapPoint?.id === report.id;
      const isCritical = report.priorityLevel === 'CRITIQUE';
      const isCollected = report.status === 'collected' || report.status === 'validated';
      const isNesting = report.isNestingZone;
      const isSimpleWaste = !isNesting || report.collectionType === 'simple_tour';

      let pinBg = 'bg-gradient-to-tr from-sky-600 to-blue-600 border-sky-300';
      let iconSvg = `<svg class="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>`;
      let labelPill = `<span class="px-1.5 py-0.2 rounded-full text-[9.5px] font-extrabold bg-sky-950 text-sky-200 border border-sky-400 shadow-xs whitespace-nowrap">🚚 Déchet</span>`;

      if (isNesting) {
        pinBg = 'bg-gradient-to-tr from-emerald-600 to-teal-600 border-emerald-300';
        iconSvg = `<svg class="w-4.5 h-4.5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a2 2 0 00-2 2v1h4V4a2 2 0 00-2-2zM4 9a2 2 0 00-2 2v1a2 2 0 002 2h1V9H4zm16 0h-1v5h1a2 2 0 002-2v-1a2 2 0 00-2-2zM6 16l-1 2a2 2 0 001.5 2.5h1.5l-1-4.5H6zm12 0h-1l-1 4.5h1.5a2 2 0 001.5-2.5l-1-2z" /><circle cx="12" cy="12" r="4" /></svg>`;
        labelPill = `<span class="px-1.5 py-0.2 rounded-full text-[9.5px] font-extrabold bg-emerald-950 text-emerald-200 border border-emerald-400 shadow-xs whitespace-nowrap">🐢 Nid</span>`;
      } else if (isCollected) {
        pinBg = 'bg-slate-800 border-slate-500';
        iconSvg = `<svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>`;
        labelPill = `<span class="px-1.5 py-0.2 rounded-full text-[9.5px] font-extrabold bg-slate-950 text-slate-300 border border-slate-600 shadow-xs whitespace-nowrap">✓ Ramassé</span>`;
      }

      const isSelectedClass = isSelected
        ? 'scale-125 z-50 ring-4 ring-amber-400/90 shadow-2xl'
        : 'hover:scale-110 z-10';

      const pingAnimation = isCritical && !isCollected
        ? '<span class="absolute -inset-1.5 rounded-full bg-rose-500/50 animate-ping"></span>'
        : '';

      const markerHtml = `
        <div class="relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-150 ${isSelectedClass}">
          ${pingAnimation}
          <div class="w-8.5 h-8.5 rounded-full ${pinBg} text-white border-2 border-white shadow-lg flex items-center justify-center shrink-0">
            ${iconSvg}
          </div>
          <div class="mt-0.5">
            ${labelPill}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'clean-map-icon',
        html: markerHtml,
        iconSize: [38, 48],
        iconAnchor: [19, 24],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: customIcon });

      marker.on('click', (e) => {
        if (e && e.originalEvent) {
          L.DomEvent.stopPropagation(e.originalEvent);
        }
        setSelectedMapPoint(report);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([report.latitude, report.longitude], { animate: true, duration: 0.4 });
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredReports, selectedMapPoint, setSelectedMapPoint]);

  // Recenter / Reset to overview
  const handleResetOverview = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(POINTE_NOIRE_CENTER, DEFAULT_BALANCED_ZOOM, {
      animate: true,
      duration: 0.5,
    });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="space-y-3 pb-2">
      {/* 1. Clean Sector Selector & Category Pills */}
      <div className="space-y-2">
        <ModernSelect
          value={mapSectorFilter}
          onChange={(val) => setMapSectorFilter(val)}
          themeMode={themeMode}
          searchable={true}
          size="sm"
          icon={<MapPin className="w-4 h-4 text-sky-600" />}
          options={[
            {
              value: 'all',
              label: 'Tous les secteurs littoraux',
              subtitle: 'Littoral complet de Pointe-Noire',
              badge: `${reports.length} points`,
              badgeColor: 'blue',
            },
            ...POINTE_NOIRE_COASTAL_SITES.map((site) => ({
              value: site.name,
              label: site.name,
              subtitle: `${site.sector} • ${site.turtleSpecies}`,
              badge: site.threatLevel,
              badgeColor: (site.threatLevel === 'CRITIQUE'
                ? 'red'
                : site.threatLevel === 'HAUTE'
                ? 'amber'
                : 'emerald') as ModernSelectOption['badgeColor'],
            })),
          ]}
        />

        {/* Category Filters Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setMapFilter('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs ${
              mapFilter === 'all'
                ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-bold shadow-xs'
                : 'bg-white text-slate-800 border border-slate-300 font-medium hover:bg-slate-50'
            }`}
          >
            Tous ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setMapFilter('simple_waste')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
              mapFilter === 'simple_waste'
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'bg-sky-50 text-sky-950 border border-sky-300 font-medium'
            }`}
          >
            <Truck className="w-3.5 h-3.5 shrink-0 text-sky-700" />
            <span>Déchets Simples ({reports.filter((r) => !r.isNestingZone || r.collectionType === 'simple_tour').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMapFilter('turtle_nest')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
              mapFilter === 'turtle_nest'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-medium'
            }`}
          >
            <TurtleIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Nids ({reports.filter((r) => r.isNestingZone).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMapFilter('critical')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs ${
              mapFilter === 'critical'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-rose-50 text-rose-950 border border-rose-300 font-medium'
            }`}
          >
            Critiques ({reports.filter((r) => r.priorityLevel === 'CRITIQUE').length})
          </button>
          <button
            type="button"
            onClick={() => setMapFilter('collected')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs ${
              mapFilter === 'collected'
                ? 'bg-teal-800 text-white font-bold shadow-xs'
                : 'bg-teal-50 text-teal-950 border border-teal-300 font-medium'
            }`}
          >
            Collectés ({reports.filter((r) => r.status === 'collected' || r.status === 'validated').length})
          </button>
        </div>
      </div>

      {/* 2. LEAFLET INTERACTIVE MAP */}
      <div className="relative w-full h-[360px] rounded-3xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100 isolate">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Uber-style Live Navigation HUD Banner when a waste point is targeted */}
        {selectedMapPoint && (
          <div className="absolute top-2.5 left-2.5 right-2.5 z-20 animate-in slide-in-from-top-2">
            <div className="bg-slate-950/92 backdrop-blur-md text-white p-2 rounded-2xl border border-sky-400/40 shadow-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Navigation className="w-4 h-4 -rotate-45" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-bold text-xs sm:text-sm text-sky-300">
                      {hasArrived ? 'Sur le site' : distanceMeters >= 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters} m`}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      • {hasArrived ? 'Arrivé' : `~${etaMinutes} min`}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-teal-100 font-normal truncate mt-0.5">
                    {hasArrived ? 'Déchet localisé à portée de main' : `Vers ${selectedMapPoint.locationName.split('(')[0]}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!hasArrived ? (
                  <button
                    type="button"
                    onClick={() => setHasArrived(true)}
                    className="h-7.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-[11px] shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                    aria-label="Simuler l'arrivée du collecteur à moins de 15m"
                  >
                    <span>Simuler Arrivée</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleStartWeighing(selectedMapPoint)}
                    className="h-7.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-all whitespace-nowrap animate-pulse"
                  >
                    <Scale className="w-3 h-3 shrink-0" />
                    <span>Peser</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Top-Right Mini Compass (shifted down if banner is active) */}
        {!selectedMapPoint && (
          <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
            <div className="px-2.5 py-1 rounded-xl bg-slate-900/85 border border-slate-700/60 text-slate-200 text-xs font-normal backdrop-blur-xs shadow-md flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Pointe-Noire</span>
            </div>
          </div>
        )}

        {/* Floating Bottom-Right Map Controls */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={handleResetOverview}
            className="w-8 h-8 rounded-xl bg-white text-slate-800 border border-slate-300 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90"
            aria-label="Recentrer"
          >
            <Navigation className="w-4 h-4 text-blue-700" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl bg-white text-slate-800 border border-slate-300 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90"
            aria-label="Zoomer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl bg-white text-slate-800 border border-slate-300 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90"
            aria-label="Dézoomer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle Info Floating Popup */}
        {showVehicleInfo && (
          <div className="absolute top-10 left-3 right-12 z-30 p-3 rounded-2xl bg-slate-950/95 border border-slate-700 text-white shadow-2xl backdrop-blur-sm animate-in fade-in duration-150">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-white leading-tight">
                    Éco-Patrouille Littorale #1
                  </h5>
                  <span className="text-[11px] text-sky-300 font-normal">En intervention • Côte Sauvage</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVehicleInfo(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
              Camion benne en tournée sur l'axe littoral de Pointe-Noire.
            </p>
          </div>
        )}
      </div>

      {/* 3. SELECTED HOTSPOT CARD (Renders directly under the map when an icon on the map is clicked) */}
      {selectedMapPoint && (
        <div className="p-3.5 rounded-2xl border border-teal-500/40 bg-white text-slate-900 transition-all space-y-3 text-xs shadow-md animate-in slide-in-from-top-2">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-slate-950 truncate">
                {selectedMapPoint.locationName}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 font-normal truncate">
                {selectedMapPoint.wasteType.replace('_', ' ')} • {selectedMapPoint.estimatedWeightKg} kg estimés
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 shadow-2xs ${
                  selectedMapPoint.priorityLevel === 'CRITIQUE'
                    ? 'bg-rose-600 text-white'
                    : 'bg-amber-400 text-slate-950 border border-amber-500'
                }`}
              >
                Priorité : {selectedMapPoint.priorityScore} pts
              </span>

              <button
                type="button"
                onClick={() => setSelectedMapPoint(null)}
                className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer active:scale-90 transition-transform shrink-0"
                aria-label="Fermer l'aperçu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Photo Preview Box with Zoom */}
          <div 
            onClick={() => setInspectingPhotoReport(selectedMapPoint)}
            className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group cursor-pointer shadow-inner"
          >
            <img
              src={selectedMapPoint.photoUrl || FALLBACK_PHOTO}
              alt={selectedMapPoint.locationName}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== FALLBACK_PHOTO) {
                  target.src = FALLBACK_PHOTO;
                }
              }}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-normal backdrop-blur-xs border border-white/20 flex items-center gap-1">
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span>Photo terrain</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-medium shadow-xs">
                  {selectedMapPoint.status === 'collected' ? 'Collecté' : 'En attente'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-white/90 font-normal truncate max-w-[70%]">
                  {selectedMapPoint.description || 'Déchets signalés sur le littoral'}
                </p>
                <div className="h-7 px-2.5 rounded-lg bg-white/95 text-slate-900 font-medium text-xs flex items-center gap-1 shadow-md group-hover:bg-amber-300 transition-colors">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Aperçu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Notice: Simple Waste vs Turtle Nest Zone */}
          {selectedMapPoint.isNestingZone ? (
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2 text-xs text-emerald-950 font-normal">
              <TurtleIcon className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold block text-emerald-900">🐢 Zone de Nidification Protégée :</span>
                <span className="truncate block text-emerald-800">
                  {selectedMapPoint.turtleDangerLevel || "Sensibilité écologique accrue à proximité du nid."}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl flex items-center gap-2 text-xs text-sky-950 font-normal">
              <Truck className="w-4 h-4 text-sky-700 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold block text-sky-900">🚚 Déchet Simple • Tournée de Récupération :</span>
                <span className="truncate block text-sky-800">
                  Ramassage rapide par tricycle ou benne lors de la tournée ordinaire.
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStartWeighing(selectedMapPoint)}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Scale className="w-4 h-4 text-white shrink-0" />
              <span>Démarrer la Pesée & Collecte</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. HORIZONTAL GALLERY OF LOADED PHOTOS */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#0052CC]" />
            <span className="text-xs font-bold text-slate-950">
              Photos Chargées du Littoral ({filteredReports.length})
            </span>
          </div>
          <span className="text-xs font-normal text-slate-600">
            Touchez pour agrandir
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {filteredReports.map((rep) => {
            const isSelected = selectedMapPoint?.id === rep.id;
            const photoSrc = rep.photoUrl || FALLBACK_PHOTO;

            return (
              <div
                key={`gallery-${rep.id}`}
                onClick={() => {
                  setInspectingPhotoReport(rep);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.panTo([rep.latitude, rep.longitude], { animate: true, duration: 0.4 });
                  }
                }}
                className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border cursor-pointer transition-all active:scale-95 group shadow-xs ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/40 scale-102'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <img
                  src={photoSrc}
                  alt={rep.locationName}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== FALLBACK_PHOTO) {
                      target.src = FALLBACK_PHOTO;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-1.5">
                  <div className="flex justify-end">
                    <span
                      className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded-full text-white shadow-xs ${
                        rep.priorityLevel === 'CRITIQUE'
                          ? 'bg-rose-600'
                          : rep.isNestingZone
                          ? 'bg-emerald-600'
                          : 'bg-amber-500'
                      }`}
                    >
                      {rep.isNestingZone ? 'Nid' : rep.priorityLevel === 'CRITIQUE' ? 'Critique' : 'Déchet'}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-white truncate leading-tight">
                    {rep.locationName.split(' - ')[0] || rep.locationName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FULL PHOTO INSPECTION MODAL */}
      {inspectingPhotoReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm flex flex-col bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-900">
            {/* Modal Header */}
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-slate-900 truncate">
                  {inspectingPhotoReport.locationName}
                </h3>
                <p className="text-xs font-normal text-slate-500 truncate">
                  Photo {activePhotoIndex + 1} sur {filteredReports.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInspectingPhotoReport(null);
                  setPhotoZoomLevel(1);
                }}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3.5 space-y-3">
              <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                <img
                  src={inspectingPhotoReport.photoUrl || FALLBACK_PHOTO}
                  alt={inspectingPhotoReport.locationName}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== FALLBACK_PHOTO) {
                      target.src = FALLBACK_PHOTO;
                    }
                  }}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    photoZoomLevel === 2 ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  }`}
                  onClick={() => setPhotoZoomLevel(photoZoomLevel === 1 ? 2 : 1)}
                />

                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-md cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-md cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs font-normal text-slate-600 leading-relaxed">
                {inspectingPhotoReport.description || "Déchets plastiques signalés sur le littoral."}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setInspectingPhotoReport(null);
                  handleStartWeighing(inspectingPhotoReport);
                }}
                className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Planifier Pesée</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. UBER-STYLE PROXIMITY ARRIVAL NOTIFICATION MODAL */}
      {hasArrived && selectedMapPoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 text-slate-900 shadow-2xl p-4 space-y-3.5 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Guidage GPS Terminé • Arrivée Détectée
                  </span>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    Vous êtes arrivé sur le site !
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHasArrived(false)}
                className="p-1.5 rounded-xl text-slate-400 active:scale-90 transition-transform cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Site Detail & Proximity Confirmation */}
            <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-900 font-semibold">
                <span className="truncate">{selectedMapPoint.locationName}</span>
                <span className="text-emerald-700 font-mono font-bold text-[11px] whitespace-nowrap bg-emerald-100 px-2 py-0.5 rounded-md">
                  &lt; 15 m
                </span>
              </div>
              <p className="text-slate-700 font-normal leading-relaxed text-[11.5px]">
                Le capteur GPS confirme votre présence exacte sur la plage. Les déchets ({selectedMapPoint.wasteType.replace('_', ' ')} - est. {selectedMapPoint.estimatedWeightKg} kg) sont à portée immédiate.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleStartWeighing(selectedMapPoint)}
                className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Scale className="w-4 h-4" />
                <span>Commencer la Pesée Immédiate</span>
              </button>
              <button
                type="button"
                onClick={() => setHasArrived(false)}
                className="w-full h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Rester sur la carte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
