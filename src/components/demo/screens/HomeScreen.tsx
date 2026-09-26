import React from 'react';
import { 
  Camera, 
  Map, 
  ScanLine, 
  Truck, 
  ChevronRight, 
  Award, 
  GraduationCap, 
  ArrowRight,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { WasteReport, UserProfile } from '../../../types/koba';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';

interface HomeScreenProps {
  reports: WasteReport[];
  setMobileScreen: (screen: DemoScreen) => void;
  setSelectedMapPoint: (report: WasteReport) => void;
  themeMode: 'forest' | 'fixora';
  isOnline: boolean;
  isGpsActive?: boolean;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
  onOpenMyReports?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  reports,
  setMobileScreen,
  setSelectedMapPoint,
  themeMode,
  isOnline,
  isGpsActive = false,
  currentUser,
  onOpenProfile,
  onOpenMyReports,
}) => {
  const isFixora = themeMode === 'fixora';

  const collectedReports = reports.filter(
    (r) => r.status === 'collected' || r.status === 'validated' || r.status === 'valorized'
  );
  const totalRealKg = collectedReports.reduce((sum, r) => sum + (r.actualWeightKg || 0), 0);
  const criticalReports = reports.filter((r) => r.priorityLevel === 'CRITIQUE');
  const latestAlert = criticalReports[0] || reports[0];

  const myReports = reports.filter(
    (r) => !currentUser || r.authorId === currentUser.id || r.authorId === 'user-001' || r.authorId?.startsWith('user-')
  );

  const displayName = currentUser ? currentUser.fullName.split(' ')[0] : 'Sentinelle';
  const displayPoints = currentUser ? currentUser.points : 0;

  return (
    <div className="space-y-4 pb-3">
      {/* 1. Sleek Minimalist Header */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="min-w-0">
          <h2 className="font-bold text-lg text-slate-950 leading-tight truncate">
            Bonjour, {displayName} 👋
          </h2>
        </div>

        {/* Action Header Pills */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => (onOpenMyReports ? onOpenMyReports() : onOpenProfile ? onOpenProfile() : setMobileScreen('auth'))}
            className="px-2.5 py-1.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold text-xs shadow-xs border border-teal-300 flex items-center gap-1 transition-transform active:scale-95 cursor-pointer shrink-0 whitespace-nowrap min-h-[36px]"
            title="Mes signalements"
          >
            <FileText className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="text-xs font-bold">{myReports.length}</span>
          </button>

          {/* Points Pill */}
          <button
            type="button"
            onClick={() => (onOpenProfile ? onOpenProfile() : setMobileScreen('auth'))}
            className="px-3 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-xs border border-amber-500 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap min-h-[36px]"
            title="Mon profil & points"
          >
            <Award className="w-4 h-4 text-slate-950 shrink-0" />
            <span className="text-xs font-bold whitespace-nowrap">{displayPoints} pts</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Primary Action: Signaler un Déchet (Modern Teal & Marine Gradient) */}
      <div className="p-4.5 rounded-3xl transition-all shadow-md relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white border border-teal-600/30">
        <div className="relative z-10 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5 text-white whitespace-nowrap shrink-0 border border-white/15">
              <TurtleIcon className="w-3.5 h-3.5 text-teal-200 shrink-0" />
              <span>Protection Côtière & Nids</span>
            </span>

            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 border flex items-center gap-1 ${
              isGpsActive
                ? 'text-emerald-200 bg-emerald-950/80 border-emerald-400/40'
                : 'text-amber-200 bg-amber-950/80 border-amber-400/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isGpsActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isGpsActive ? 'GPS Actif' : 'GPS Désactivé'}</span>
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold leading-snug text-white">
              Signaler un Déchet sur la Plage
            </h3>
            <p className="text-xs text-teal-100 font-medium mt-1 leading-relaxed">
              Prenez une photo géolocalisée. Même sans connexion, vos données sont sécurisées.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMobileScreen('report')}
            className="w-full h-11 rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer whitespace-nowrap bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950"
          >
            <Camera className="w-4 h-4 shrink-0 text-slate-950" />
            <span className="whitespace-nowrap font-bold text-slate-950">Prendre Photo & Signaler</span>
            <ArrowRight className="w-4 h-4 shrink-0 text-slate-950" />
          </button>
        </div>
      </div>

      {/* 3. Essential Modules Hub (Sleek 2x2 Grid) */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-bold text-slate-950 uppercase tracking-wider">
            Services & Outils
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Module 1: Carte Leaflet */}
          <button
            type="button"
            onClick={() => setMobileScreen('map')}
            className="p-3.5 rounded-2xl border border-slate-300 bg-white hover:border-teal-600 shadow-xs text-slate-950 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between gap-2.5 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Map className="w-4.5 h-4.5 text-white" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-950 block truncate whitespace-nowrap">
                Carte des Nids
              </span>
              <span className="text-xs text-slate-700 font-semibold block truncate whitespace-nowrap mt-0.5">
                {reports.length} points géolocalisés
              </span>
            </div>
          </button>

          {/* Module 2: Académie Masseko */}
          <button
            type="button"
            onClick={() => setMobileScreen('education')}
            className="p-3.5 rounded-2xl border border-slate-300 bg-white hover:border-amber-500 shadow-xs text-slate-950 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between gap-2.5 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs border border-amber-500">
                <GraduationCap className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-[11px] font-bold text-slate-950 bg-amber-400 px-2 py-0.5 rounded-md whitespace-nowrap shadow-2xs border border-amber-600">
                +40 pts
              </span>
            </div>
            <div>
              <span className="font-bold text-sm text-slate-950 block truncate whitespace-nowrap">
                Académie Masseko
              </span>
              <span className="text-xs text-slate-700 font-semibold block truncate whitespace-nowrap mt-0.5">
                Guide tortues & Quiz
              </span>
            </div>
          </button>

          {/* Module 3: Tournées & Pesée */}
          <button
            type="button"
            onClick={() => setMobileScreen('tour')}
            className="p-3.5 rounded-2xl border border-slate-300 bg-white hover:border-teal-600 shadow-xs text-slate-950 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between gap-2.5 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-700 to-teal-700 text-white flex items-center justify-center shadow-xs">
                <Truck className="w-4.5 h-4.5 text-white" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-950 block truncate whitespace-nowrap">
                Tournée & Pesée
              </span>
              <span className="text-xs text-slate-700 font-semibold block truncate whitespace-nowrap mt-0.5">
                {totalRealKg.toFixed(0)} kg collectés
              </span>
            </div>
          </button>

          {/* Module 4: Scan Diagnostic */}
          <button
            type="button"
            onClick={() => setMobileScreen('scan')}
            className="p-3.5 rounded-2xl border border-slate-300 bg-white hover:border-teal-600 shadow-xs text-slate-950 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between gap-2.5 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-800 to-cyan-800 text-white flex items-center justify-center shadow-xs">
                <ScanLine className="w-4.5 h-4.5 text-white" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-950 block truncate whitespace-nowrap">
                Scanner & Résines
              </span>
              <span className="text-xs text-slate-700 font-semibold block truncate whitespace-nowrap mt-0.5">
                Diagnostic & QR Lots
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Priorité Côtière En Direct (Single Sleek Hotspot Card) */}
      {latestAlert && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Alerte Littorale Récente</span>
            </span>
            <button
              type="button"
              onClick={() => setMobileScreen('map')}
              className="text-xs font-bold text-teal-800 hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              Voir la carte
            </button>
          </div>

          <div
            onClick={() => {
              setMobileScreen('map');
            }}
            className="p-3.5 rounded-2xl border border-slate-300 bg-white text-slate-950 shadow-xs cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-300 shadow-xs">
                <img
                  src={latestAlert.photoUrl}
                  alt={latestAlert.locationName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm truncate block text-slate-950">
                  {latestAlert.locationName}
                </span>
                <span className="text-xs text-slate-700 font-semibold truncate block mt-0.5">
                  {latestAlert.isNestingZone ? 'Zone de ponte tortue active' : 'Déchets plastiques'}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-xs ${
                  latestAlert.priorityLevel === 'CRITIQUE'
                    ? 'bg-rose-700 text-white'
                    : 'bg-amber-400 text-slate-950 border border-amber-600 font-extrabold'
                }`}
              >
                {latestAlert.priorityLevel}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
