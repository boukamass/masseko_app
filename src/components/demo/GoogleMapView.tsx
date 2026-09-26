import React, { useEffect, useState, useRef } from 'react';
import { Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { 
  Navigation, 
  MapPin, 
  Layers, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Compass,
  Scale,
  Crosshair
} from 'lucide-react';
import { WasteReport } from '../../types/koba';
import { TurtleIcon } from './TurtleIcon';

interface GoogleMapViewProps {
  reports: WasteReport[];
  selectedMapPoint: WasteReport | null;
  setSelectedMapPoint: (report: WasteReport | null) => void;
  patrolVehicleCoords?: [number, number];
  coastalPatrolCoordinates?: [number, number][];
  onStartWeighing?: (report: WasteReport) => void;
  onArrivedOnSite?: () => void;
  hasArrived?: boolean;
  distanceMeters?: number;
  etaMinutes?: number;
  activeStopIndex?: number;
  showTourPathLines?: boolean;
}

// Coastal corridor coordinates of Pointe-Noire (Mvassa -> Djeno -> Songolo -> Port -> Côte Sauvage -> Ngoyo)
const DEFAULT_COASTAL_PATH: [number, number][] = [
  [-4.7510, 11.8670], // Mvassa
  [-4.7645, 11.8890], // Djeno Frayère
  [-4.7720, 11.8540], // Songolo Estuaire
  [-4.7870, 11.8380], // Port de Pêche
  [-4.7985, 11.8290], // Côte Sauvage
  [-4.8120, 11.8630], // Ngoyo Littoral Sud
];

const DEFAULT_PATROL_VEHICLE: [number, number] = [-4.7885, 11.8335];

// Custom Polyline Component using useMap
const GooglePolylineOverlay: React.FC<{
  path: { lat: number; lng: number }[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  isDashed?: boolean;
}> = ({
  path,
  strokeColor = '#0ea5e9',
  strokeWeight = 5,
  strokeOpacity = 0.9,
  isDashed = false,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !path || path.length < 2) return;

    const lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 4,
    };

    const polyline = new google.maps.Polyline({
      path,
      map,
      geodesic: true,
      strokeColor,
      strokeOpacity: isDashed ? 0 : strokeOpacity,
      strokeWeight,
      ...(isDashed
        ? {
            icons: [
              {
                icon: lineSymbol,
                offset: '0',
                repeat: '15px',
              },
            ],
          }
        : {}),
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity, isDashed]);

  return null;
};

// Map Recenter & Bounds Helper
const MapController: React.FC<{
  selectedMapPoint: WasteReport | null;
  patrolVehicleCoords: [number, number];
}> = ({ selectedMapPoint, patrolVehicleCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (selectedMapPoint) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: patrolVehicleCoords[0], lng: patrolVehicleCoords[1] });
      bounds.extend({ lat: selectedMapPoint.latitude, lng: selectedMapPoint.longitude });
      
      map.fitBounds(bounds, {
        top: 60,
        right: 40,
        bottom: 60,
        left: 40,
      });
    } else {
      map.panTo({ lat: -4.785, lng: 11.848 });
      map.setZoom(12.3);
    }
  }, [map, selectedMapPoint?.id]);

  return null;
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  reports,
  selectedMapPoint,
  setSelectedMapPoint,
  patrolVehicleCoords = DEFAULT_PATROL_VEHICLE,
  coastalPatrolCoordinates = DEFAULT_COASTAL_PATH,
  onStartWeighing,
  onArrivedOnSite,
  hasArrived = false,
  distanceMeters = 0,
  etaMinutes = 1,
  activeStopIndex,
  showTourPathLines = true,
}) => {
  // Map mode state: 'roadmap' (Voies & Rues) | 'hybrid' (Hybride Pistes) | 'satellite'
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid' | 'satellite'>('roadmap');

  // Convert coastal path to Google LatLng objects
  const coastalPathLatLng = coastalPatrolCoordinates.map((c) => ({ lat: c[0], lng: c[1] }));

  // Convert tour reports to ordered path lines by road
  const tourReportsPath = reports.map((r) => ({ lat: r.latitude, lng: r.longitude }));

  // Dynamic Navigation line from vehicle to selected point
  const targetNavPath = selectedMapPoint
    ? [
        { lat: patrolVehicleCoords[0], lng: patrolVehicleCoords[1] },
        { lat: selectedMapPoint.latitude, lng: selectedMapPoint.longitude },
      ]
    : [];

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900 isolate">
      {/* 1. Google Maps Core Component */}
      <Map
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        defaultCenter={{ lat: -4.785, lng: 11.848 }}
        defaultZoom={12.3}
        mapTypeId={mapType}
        gestureHandling="greedy"
        disableDefaultUI={true}
        className="w-full h-full"
      >
        <MapController
          selectedMapPoint={selectedMapPoint}
          patrolVehicleCoords={patrolVehicleCoords}
        />

        {/* Coastal Corridor Line ("Voie Littorale Principale") */}
        <GooglePolylineOverlay
          path={coastalPathLatLng}
          strokeColor="#0284c7"
          strokeWeight={4}
          strokeOpacity={0.6}
          isDashed={true}
        />

        {/* Tour Path Lines connecting stops ("Lignes par voie pour la tournée") */}
        {showTourPathLines && tourReportsPath.length >= 2 && (
          <GooglePolylineOverlay
            path={tourReportsPath}
            strokeColor="#10b981"
            strokeWeight={5}
            strokeOpacity={0.85}
          />
        )}

        {/* Active Target Guidance Line from Patrol Vehicle */}
        {targetNavPath.length === 2 && (
          <GooglePolylineOverlay
            path={targetNavPath}
            strokeColor="#38bdf8"
            strokeWeight={6}
            strokeOpacity={0.95}
          />
        )}

        {/* 2. Patrol Vehicle Advanced Marker */}
        <AdvancedMarker
          position={{ lat: patrolVehicleCoords[0], lng: patrolVehicleCoords[1] }}
          title="Éco-Patrouille Mobile Pointe-Noire"
        >
          <div className="relative flex items-center justify-center cursor-pointer group">
            <span className="absolute -inset-2 rounded-full bg-emerald-400/50 animate-ping" />
            <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div className="absolute top-9 px-2 py-0.5 rounded-md bg-slate-950/90 text-white text-[10px] font-semibold whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              Camion Collecte #01
            </div>
          </div>
        </AdvancedMarker>

        {/* 3. Waste Signalment Point Advanced Markers */}
        {reports.map((report, idx) => {
          const isSelected = selectedMapPoint?.id === report.id;
          const isCritical = report.priorityLevel === 'CRITIQUE';
          const isCollected = report.status === 'collected' || report.status === 'validated';
          const isNesting = report.isNestingZone;

          let badgeBg = 'bg-amber-500';
          if (isNesting) badgeBg = 'bg-emerald-600';
          if (isCollected) badgeBg = 'bg-sky-600';
          if (isCritical) badgeBg = 'bg-rose-600';

          return (
            <AdvancedMarker
              key={`gmap-marker-${report.id}`}
              position={{ lat: report.latitude, lng: report.longitude }}
              title={report.locationName}
              onClick={() => setSelectedMapPoint(report)}
            >
              <div
                className={`relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
                }`}
              >
                {isCritical && !isCollected && (
                  <span className="absolute -inset-1.5 rounded-full bg-rose-500/40 animate-ping" />
                )}

                <div
                  className={`w-8 h-8 rounded-full ${badgeBg} text-white border-2 border-white shadow-md flex items-center justify-center shrink-0 font-bold text-xs`}
                >
                  {activeStopIndex !== undefined ? (
                    <span>{idx + 1}</span>
                  ) : isNesting ? (
                    <TurtleIcon className="w-4 h-4 text-white" />
                  ) : isCollected ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCritical ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>

                {isSelected && (
                  <div className="mt-1 px-2 py-0.5 rounded-lg bg-slate-900/90 text-white text-[10.5px] font-medium whitespace-nowrap shadow-lg border border-slate-700">
                    {report.locationName.split('(')[0]}
                  </div>
                )}
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>

      {/* 4. Map View Type Switcher Pill ("Lignes par Voie / Hybride / Satellite") */}
      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl shadow-xl backdrop-blur-xs">
        <button
          type="button"
          onClick={() => setMapType('roadmap')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
            mapType === 'roadmap'
              ? 'bg-sky-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
          title="Afficher les voies, rues et pistes de Pointe-Noire"
        >
          Voies & Rues
        </button>
        <button
          type="button"
          onClick={() => setMapType('hybrid')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
            mapType === 'hybrid'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
          title="Satellite avec superposition des axes routiers"
        >
          Hybride
        </button>
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
            mapType === 'satellite'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
          title="Vue Satellite"
        >
          Satellite
        </button>
      </div>

      {/* 5. Floating Uber-style Navigation HUD Banner */}
      {selectedMapPoint && (
        <div className="absolute bottom-3 left-3 right-3 z-20 animate-in slide-in-from-bottom-2">
          <div className="bg-slate-950/95 backdrop-blur-md text-white p-2.5 rounded-2xl border border-sky-400/40 shadow-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Navigation className="w-4 h-4 -rotate-45" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-bold text-xs sm:text-sm text-sky-300">
                    {hasArrived ? 'Sur le site' : distanceMeters >= 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters} m`}
                  </span>
                  <span className="text-[10px] text-slate-300">
                    • {hasArrived ? 'Arrivé' : `~${etaMinutes} min via piste`}
                  </span>
                </div>
                <p className="text-[11px] text-teal-100 font-normal truncate mt-0.5">
                  {hasArrived ? 'Déchet localisé par GPS' : `Piste vers ${selectedMapPoint.locationName.split('(')[0]}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {!hasArrived ? (
                <button
                  type="button"
                  onClick={onArrivedOnSite}
                  className="h-8 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-[11px] shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Simuler Arrivée</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onStartWeighing?.(selectedMapPoint)}
                  className="h-8 px-3 rounded-xl bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-sm flex items-center gap-1 cursor-pointer active:scale-95 transition-all whitespace-nowrap animate-pulse"
                >
                  <Scale className="w-3.5 h-3.5 shrink-0" />
                  <span>Peser</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
