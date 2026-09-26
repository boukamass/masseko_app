import React, { useState } from 'react';
import { 
  Truck, 
  ArrowUpDown, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Navigation,
  AlertTriangle,
  FileText,
  ShieldCheck,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  Check
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

type TourFilterType = 'all' | 'critical' | 'nests' | 'waste' | 'completed';

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
  const [activeFilter, setActiveFilter] = useState<TourFilterType>('all');
  const [showClosureModal, setShowClosureModal] = useState<boolean>(false);

  const currentTour =
    REAL_COLLECTION_ROUTES.find((t) => t.id === selectedTourId) || REAL_COLLECTION_ROUTES[0];

  const collectedReports = reports.filter(
    (r) => r.status === 'collected' || r.status === 'validated' || r.status === 'valorized'
  );
  const pendingReports = reports.filter(
    (r) => r.status !== 'collected' && r.status !== 'validated' && r.status !== 'valorized'
  );

  const collectedCount = collectedReports.length;
  const totalReportsCount = reports.length || 1;
  const progressPercent = Math.round((collectedCount / totalReportsCount) * 100);

  const totalCertifiedWeight = collectedReports.reduce(
    (acc, r) => acc + (r.actualWeightKg || r.estimatedWeightKg || 0),
    0
  );
  const protectedNestsCount = collectedReports.filter((r) => r.isNestingZone).length;

  // Visually sort stops based on active route optimization filter
  const sortedReports = [...reports].sort((a, b) => {
    if (!isRouteOptimized) {
      // Emergency / Urgency order: Highest priority score first
      return (b.priorityScore || 0) - (a.priorityScore || 0);
    }
    // Route Optimized: Order by proximity/coastal corridor (latitude)
    return a.latitude - b.latitude;
  });

  // Filter based on active tab
  const filteredReports = sortedReports.filter((r) => {
    const isCollected = r.status === 'collected' || r.status === 'validated' || r.status === 'valorized';
    if (activeFilter === 'completed') return isCollected;
    if (activeFilter === 'critical') return !isCollected && r.priorityLevel === 'CRITIQUE';
    if (activeFilter === 'nests') return !isCollected && r.isNestingZone;
    if (activeFilter === 'waste') return !isCollected && !r.isNestingZone;
    return true; // 'all'
  });

  // Find next recommended stop to process (first uncollected item)
  const nextRecommendedStop = sortedReports.find(
    (r) => r.status !== 'collected' && r.status !== 'validated' && r.status !== 'valorized'
  );

  const handleQuickWeightAdjust = (addedKg: number) => {
    setWeighInput(Math.max(1, (weighInput || 0) + addedKg));
  };

  return (
    <div className="space-y-3 pb-3 select-none">
      {/* 1. CARTE DE PLANIFICATION DU CIRCUIT */}
      <div className="p-3.5 rounded-3xl bg-white border border-slate-300 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-950 truncate leading-tight">
                Feuille de Route & Collecte
              </h3>
              <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                {currentTour.driverName} • {currentTour.vehicleType}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowClosureModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 border border-slate-300 active:scale-95 transition-transform"
            aria-label="Clôturer ou voir le bilan de la tournée"
          >
            <FileText className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span>Bilan</span>
          </button>
        </div>

        {/* Route Selector Dropdown */}
        <div>
          <ModernSelect
            value={selectedTourId}
            onChange={(val) => setSelectedTourId(val)}
            themeMode={themeMode}
            icon={<Truck className="w-4 h-4 text-teal-700" />}
            size="sm"
            options={REAL_COLLECTION_ROUTES.map((route) => ({
              value: route.id,
              label: `${route.code} — ${route.name}`,
              subtitle: `${route.zone} • ${route.distanceKm} km • ${route.stopsCount} arrêts`,
              badge: `${route.distanceKm} km`,
              badgeColor: 'teal',
            }))}
          />
        </div>

        {/* Progress & Quick Stats */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Progression : {collectedCount} / {reports.length} arrêts traités
            </span>
            <span className="font-bold text-teal-800">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-teal-600 to-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
            <span>Tonnage pesé : <strong className="text-slate-900 font-bold">{totalCertifiedWeight.toFixed(1)} kg</strong></span>
            <span>Nids sécurisés : <strong className="text-emerald-700 font-bold">{protectedNestsCount}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. PROCHAIN ARRÊT RECOMMANDÉ (Focus chauffeur) */}
      {nextRecommendedStop && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-md border border-teal-700/50 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Prochain arrêt conseillé</span>
            </span>

            <span className="text-[11px] font-mono text-teal-200">
              Réf: {nextRecommendedStop.id.toUpperCase()}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-white truncate">
                {nextRecommendedStop.locationName}
              </h4>
              <p className="text-xs text-teal-100/90 mt-0.5 truncate">
                {nextRecommendedStop.isNestingZone ? 'Zone de ponte tortue' : 'Déchets plastiques'} • Est. ~{nextRecommendedStop.estimatedWeightKg} kg
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedMapPoint?.(nextRecommendedStop);
                  setMobileScreen('map');
                }}
                className="h-8 px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-90 border border-white/20"
                aria-label="Voir l'itinéraire sur la carte"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-300" />
                <span>GPS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedReportToCollect(nextRecommendedStop);
                  setWeighInput(nextRecommendedStop.estimatedWeightKg || 25);
                }}
                className="h-8 px-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all active:scale-90 shadow-sm"
              >
                <Scale className="w-3.5 h-3.5 text-slate-950" />
                <span>Traiter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BARRE DE FILTRES ET D'OPTIMISATION DE ROUTE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-950">
            Filtres d'intervention ({filteredReports.length})
          </span>

          <button
            type="button"
            onClick={() => setIsRouteOptimized(!isRouteOptimized)}
            className={`h-7 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all whitespace-nowrap shrink-0 active:scale-95 border ${
              isRouteOptimized
                ? 'bg-teal-700 text-white border-teal-800 shadow-2xs'
                : 'bg-white text-slate-800 border-slate-300'
            }`}
            aria-label="Alterner l'ordre des arrêts"
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>{isRouteOptimized ? 'Route Nord ➔ Sud' : 'Ordre Urgence'}</span>
          </button>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-bold cursor-pointer active:scale-95 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            Tous ({reports.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('critical')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-bold flex items-center gap-1 cursor-pointer active:scale-95 ${
              activeFilter === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-950 border border-rose-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
            <span>Urgences ({reports.filter((r) => r.priorityLevel === 'CRITIQUE' && r.status !== 'collected').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('nests')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-bold flex items-center gap-1 cursor-pointer active:scale-95 ${
              activeFilter === 'nests'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-950 border border-emerald-300'
            }`}
          >
            <TurtleIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Nids ({reports.filter((r) => r.isNestingZone && r.status !== 'collected').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('waste')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-bold flex items-center gap-1 cursor-pointer active:scale-95 ${
              activeFilter === 'waste'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-950 border border-sky-300'
            }`}
          >
            <Truck className="w-3.5 h-3.5 shrink-0 text-sky-700" />
            <span>Déchets ({reports.filter((r) => !r.isNestingZone && r.status !== 'collected').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 transition-all font-bold flex items-center gap-1 cursor-pointer active:scale-95 ${
              activeFilter === 'completed'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}
          >
            <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600 font-bold" />
            <span>Traités ({collectedCount})</span>
          </button>
        </div>
      </div>

      {/* 4. LISTE STRUCTURÉE DES ARRÊTS */}
      <div className="space-y-2.5">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
            <p className="text-xs font-bold text-slate-800">Aucun arrêt dans cette catégorie.</p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200"
            >
              Afficher tous les arrêts
            </button>
          </div>
        ) : (
          filteredReports.map((r, index) => {
            const isSelected = selectedReportToCollect?.id === r.id;
            const isCollected =
              r.status === 'collected' || r.status === 'validated' || r.status === 'valorized';
            const isCritical = r.priorityLevel === 'CRITIQUE';

            return (
              <div
                key={r.id}
                className={`p-3.5 rounded-3xl border transition-all text-xs ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-600 shadow-md ring-2 ring-teal-500/30'
                    : isCollected
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : isCritical
                    ? 'bg-white border-rose-300 shadow-xs'
                    : 'bg-white border-slate-300 text-slate-950 shadow-2xs'
                }`}
              >
                {/* Stop Card Header */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    {/* Thumbnail or Step Number */}
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-300 shadow-2xs">
                      <img
                        src={r.photoUrl}
                        alt={r.locationName}
                        className="w-full h-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 left-0 text-center text-[9px] font-extrabold text-white py-0.2 ${
                          isCollected
                            ? 'bg-emerald-700'
                            : isCritical
                            ? 'bg-rose-700'
                            : 'bg-slate-800'
                        }`}
                      >
                        {isCollected ? '✓ FAIT' : `#${index + 1}`}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-950 truncate block">
                          {r.locationName}
                        </span>
                      </div>

                      {/* Intervention Type Badges */}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {r.isNestingZone ? (
                          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                            <TurtleIcon className="w-3 h-3 text-emerald-700" />
                            <span>Nid Protégé</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-sky-950 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-300">
                            {r.wasteType.replace('_', ' ')}
                          </span>
                        )}

                        {isCritical && !isCollected && (
                          <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-1.5 py-0.5 rounded-md border border-rose-300">
                            Critique
                          </span>
                        )}

                        <span className="text-[10.5px] text-slate-600 font-medium">
                          {isCollected
                            ? `Pesé : ${r.actualWeightKg || r.estimatedWeightKg} kg`
                            : `Est. ~${r.estimatedWeightKg} kg`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (GPS & Weighing) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isCollected && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMapPoint?.(r);
                          setMobileScreen('map');
                        }}
                        className="h-9 w-9 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 flex items-center justify-center cursor-pointer shadow-2xs active:scale-90"
                        aria-label={`Tracer la route GPS jusqu'à ${r.locationName}`}
                      >
                        <Navigation className="w-4 h-4 text-sky-700" />
                      </button>
                    )}

                    {isCollected ? (
                      <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1.5 rounded-xl shadow-2xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Validé</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReportToCollect(isSelected ? null : r);
                          if (!isSelected) {
                            setWeighInput(r.estimatedWeightKg || 25);
                          }
                        }}
                        className={`h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs active:scale-95 ${
                          isSelected
                            ? 'bg-slate-800 text-white'
                            : r.isNestingZone
                            ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white'
                            : 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5 shrink-0" />
                        <span>{isSelected ? 'Fermer' : r.isNestingZone ? 'Sécuriser' : 'Peser'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* INLINE ACTION / WEIGHING BOX */}
                {isSelected && !isCollected && (
                  <div className="mt-3 pt-3 border-t border-teal-200/80 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-950 flex items-center gap-1.5">
                        {r.isNestingZone ? (
                          <>
                            <TurtleIcon className="w-4 h-4 text-emerald-700" />
                            <span>Sécurisation & Pesée des Débris du Nid :</span>
                          </>
                        ) : (
                          <>
                            <Scale className="w-4 h-4 text-teal-700" />
                            <span>Pesée officielle de la collecte :</span>
                          </>
                        )}
                      </span>
                      <span className="text-[11px] text-teal-900 font-mono font-bold bg-teal-100 px-2 py-0.5 rounded-md border border-teal-300">
                        Balance #01 Certifiée
                      </span>
                    </div>

                    {/* Weight Input Field */}
                    <div className="space-y-1.5">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="0.5"
                          value={weighInput}
                          onChange={(e) => setWeighInput(parseFloat(e.target.value) || 0)}
                          className="w-full h-12 px-3.5 rounded-2xl bg-white border-2 border-teal-600 font-bold text-base text-slate-950 focus:outline-none shadow-inner"
                          placeholder="Ex: 24.5"
                        />
                        <span className="absolute right-3.5 top-3.5 text-xs font-extrabold text-teal-900 pointer-events-none">
                          kg
                        </span>
                      </div>

                      {/* Touch Quick Add Chips */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] text-slate-600 font-medium">Ajustement rapide :</span>
                        {[+5, +10, +25, +50].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => handleQuickWeightAdjust(amt)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] border border-slate-300 active:scale-90 transition-transform"
                          >
                            +{amt}kg
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Validation Button */}
                    <button
                      type="button"
                      onClick={() => handleValidateCollection(r.id)}
                      className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-95 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-200" />
                      <span>{weighSuccess ? 'Collecte Validée avec Succès !' : 'Valider la Pesée & Créer Lot QR (+30 Pts)'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. MODALE DE BILAN & CLÔTURE DE TOURNEE */}
      {showClosureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-teal-800 to-slate-900 text-white relative">
              <button
                type="button"
                onClick={() => setShowClosureModal(false)}
                className="absolute right-3 top-3 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Fermer le bilan"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Bilan de la Tournée
                  </h3>
                  <p className="text-xs text-teal-200">
                    {currentTour.code} • {currentTour.zone}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3.5 text-xs overflow-y-auto no-scrollbar">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                    Tonnage Réel Pesé
                  </span>
                  <span className="font-bold text-base text-emerald-800 block mt-0.5">
                    {totalCertifiedWeight.toFixed(1)} kg
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                    Nids Protégés
                  </span>
                  <span className="font-bold text-base text-teal-800 block mt-0.5">
                    {protectedNestsCount} nids
                  </span>
                </div>
              </div>

              {/* Status details */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-emerald-950 text-xs">
                    Traçabilité & Décharge Usine
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Tous les déchets pesés sont regroupés sous passeport numérique QR et prêts pour transfert vers le centre de recyclage.
                </p>
              </div>

              {/* Destination Partner */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Centre de Traitement Assigné :
                </span>
                <span className="font-bold text-slate-900 block text-xs">
                  Congo Plastic Eco-Recycling (Loandjili)
                </span>
                <span className="text-[11px] text-slate-600 block">
                  Chauffeur : {currentTour.driverName} ({currentTour.vehicleType})
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowClosureModal(false);
                    setMobileScreen('lot');
                  }}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Consulter les Lots QR & Usines</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowClosureModal(false)}
                  className="w-full h-10 rounded-2xl bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center border border-slate-300 cursor-pointer active:scale-95"
                >
                  Retour à la tournée
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
