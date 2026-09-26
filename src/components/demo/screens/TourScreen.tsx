import React from 'react';
import { 
  Truck, 
  ArrowUpDown, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  ChevronDown,
  Navigation
} from 'lucide-react';
import { REAL_COLLECTION_ROUTES } from '../../../data/mockPointeNoireData';
import { WasteReport } from '../../../types/koba';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect } from '../ModernSelect';

interface TourScreenProps {
  selectedTourId: string;
  setSelectedTourId: (id: string) => void;
  reports: WasteReport[];
  selectedReportToCollect: WasteReport | null;
  setSelectedReportToCollect: (report: WasteReport | null) => void;
  setSelectedMapPoint?: (report: WasteReport | null) => void;
  weighInput: number;
  setWeighInput: (val: number) => void;
  handleValidateCollection: (reportId: string) => void;
  weighSuccess: boolean;
  isRouteOptimized: boolean;
  setIsRouteOptimized: (opt: boolean) => void;
  themeMode?: 'forest' | 'fixora';
  setMobileScreen: (screen: DemoScreen) => void;
}

export const TourScreen: React.FC<TourScreenProps> = ({
  selectedTourId,
  setSelectedTourId,
  reports,
  selectedReportToCollect,
  setSelectedReportToCollect,
  setSelectedMapPoint,
  weighInput,
  setWeighInput,
  handleValidateCollection,
  weighSuccess,
  isRouteOptimized,
  setIsRouteOptimized,
  themeMode,
  setMobileScreen,
}) => {
  const isFixora = themeMode === 'fixora';
  const currentTour =
    REAL_COLLECTION_ROUTES.find((t) => t.id === selectedTourId) || REAL_COLLECTION_ROUTES[0];

  const collectedReports = reports.filter(
    (r) => r.status === 'collected' || r.status === 'validated' || r.status === 'valorized'
  );
  const collectedCount = collectedReports.length;
  const progressPercent = Math.round((collectedCount / (reports.length || 1)) * 100);

  // Visually sort stops based on active route optimization filter
  const displayedReports = [...reports].sort((a, b) => {
    if (!isRouteOptimized) {
      // Emergency / Urgency order: Highest priority score first
      return (b.priorityScore || 0) - (a.priorityScore || 0);
    }
    // Route Optimized: Order by proximity/coastal corridor (latitude)
    return a.latitude - b.latitude;
  });

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Sleek Compact Tour Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200 shadow-xs">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-950 leading-tight">
                Tournée de Collecte
              </h3>
              <span className="text-xs text-slate-600 font-normal">
                {currentTour.driverName} • {currentTour.vehicleType}
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-xl shadow-xs">
            {collectedCount}/{reports.length} ({progressPercent}%)
          </span>
        </div>

        {/* Route Selector Dropdown */}
        <ModernSelect
          value={selectedTourId}
          onChange={(val) => setSelectedTourId(val)}
          themeMode={themeMode}
          icon={<Truck className="w-4 h-4 text-blue-600" />}
          size="sm"
          options={REAL_COLLECTION_ROUTES.map((route) => ({
            value: route.id,
            label: `${route.code} — ${route.name}`,
            subtitle: `${route.zone} • ${route.distanceKm} km`,
            badge: `${route.distanceKm} km`,
            badgeColor: 'blue',
          }))}
        />
      </div>

      {/* 2. Fast Route Bar */}
      <div className="p-3 rounded-2xl bg-white border border-slate-300 flex items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-teal-600 to-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRouteOptimized(!isRouteOptimized)}
          className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
            isRouteOptimized
              ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-800 border border-slate-300'
          }`}
          title="Alterner l'ordre des arrêts"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{isRouteOptimized ? 'Itinéraire Optimisé' : 'Ordre Urgence'}</span>
        </button>
      </div>

      {/* 3. Streamlined Stops List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-950">
            Points d'Arrêt ({displayedReports.length})
          </span>
          <span className="text-xs font-normal text-slate-600">
            {currentTour.distanceKm} km au total
          </span>
        </div>

        {displayedReports.map((r, index) => {
          const isSelected = selectedReportToCollect?.id === r.id;
          const isCollected =
            r.status === 'collected' || r.status === 'validated' || r.status === 'valorized';

          return (
            <div
              key={r.id}
              className={`p-3.5 rounded-2xl border transition-all text-xs ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                  : isCollected
                  ? 'bg-slate-50 border-slate-200 opacity-80'
                  : 'bg-white border-slate-300 text-slate-950 shadow-sm hover:border-slate-400'
              }`}
            >
              {/* Stop Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ${
                      isCollected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {isCollected ? '✓' : index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-slate-950 truncate block">
                        {r.locationName}
                      </span>
                      {r.isNestingZone && (
                        <TurtleIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-slate-600 font-normal block truncate mt-0.5">
                      {r.wasteType.replace('_', ' ')} • Est. {r.estimatedWeightKg} kg
                    </span>
                  </div>
                </div>

                {/* Right Badge / Action */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {!isCollected && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMapPoint?.(r);
                        setMobileScreen('map');
                      }}
                      className="h-9 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs active:scale-95"
                      title="Tracer la route GPS jusqu'au déchet"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <span>Itinéraire</span>
                    </button>
                  )}

                  {isCollected ? (
                    <span className="text-xs font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full whitespace-nowrap shadow-xs">
                      {r.actualWeightKg || r.estimatedWeightKg} kg réels
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReportToCollect(isSelected ? null : r);
                        if (!isSelected) {
                          setWeighInput(r.estimatedWeightKg);
                        }
                      }}
                      className="h-9 px-3 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-xs active:scale-95"
                    >
                      <Scale className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{isSelected ? 'Fermer' : 'Peser'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Simplified Inline Weighing Box */}
              {isSelected && !isCollected && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-bold text-slate-900 truncate">
                      Pesée de la collecte :
                    </span>
                    <span className="text-xs text-blue-700 font-mono font-bold whitespace-nowrap shrink-0">
                      Balance #01
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="0.5"
                        value={weighInput}
                        onChange={(e) => setWeighInput(parseFloat(e.target.value) || 0)}
                        className="w-full h-11 px-3.5 rounded-xl bg-white border border-slate-300 font-bold text-base text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                        placeholder="Ex: 24.5"
                      />
                      <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-500 pointer-events-none">
                        kg
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleValidateCollection(r.id)}
                      className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">{weighSuccess ? 'Validé !' : 'Valider Lot QR'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
