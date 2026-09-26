import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Award, 
  MapPin, 
  Phone, 
  LogOut, 
  GraduationCap, 
  RotateCcw,
  FileText,
  Clock,
  CheckCircle2,
  Truck,
  Factory,
  ChevronRight,
  Map
} from 'lucide-react';
import { UserProfile, WasteReport } from '../../types/koba';
import { USER_CATEGORIES_DEFINITIONS } from '../../data/mockPointeNoireData';
import { DemoScreen } from './MobileBottomNav';
import { TurtleIcon } from './TurtleIcon';

interface ProfileModalProps {
  currentUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSwitchUser?: (user: UserProfile) => void;
  setMobileScreen: (screen: DemoScreen) => void;
  themeMode: 'forest' | 'fixora';
  userReports?: WasteReport[];
  setSelectedMapPoint?: (report: WasteReport) => void;
  initialTab?: 'profile' | 'reports';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onLogout,
  setMobileScreen,
  themeMode,
  userReports = [],
  setSelectedMapPoint,
  initialTab = 'profile',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'reports'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const isFixora = themeMode === 'fixora';

  // Filter reports belonging to current user or active session
  const myReports = userReports.filter(
    (r) => !currentUser || r.authorId === currentUser.id || r.authorId === 'user-001' || r.authorId?.startsWith('user-')
  );

  const getStatusBadge = (report: WasteReport) => {
    if (report.status === 'collected' || report.status === 'validated') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>Collecté ({report.actualWeightKg || report.estimatedWeightKg} kg)</span>
        </span>
      );
    }
    if (report.status === 'valorized' || report.status === 'received') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300 flex items-center gap-1 shrink-0">
          <Factory className="w-3 h-3 text-teal-700" />
          <span>Valorisé en Usine</span>
        </span>
      );
    }
    if (report.status === 'assigned' || report.status === 'in_collection') {
      return (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300 flex items-center gap-1 shrink-0">
          <Truck className="w-3 h-3 text-sky-700" />
          <span>En cours de tournée</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shrink-0">
        <Clock className="w-3 h-3 text-amber-700" />
        <span>En attente de collecte</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl p-4 space-y-3.5 transition-all animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center text-xs">
              {activeTab === 'profile' ? <User className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-950 leading-none">
                {activeTab === 'profile' ? 'Mon Profil Écocitoyen' : 'Mes Signalements'}
              </h3>
              <span className="text-xs text-slate-600 font-normal">Masseko Pointe-Noire</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl p-0.5 bg-slate-100 border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-1/2 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-teal-800 font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-950 font-medium'
            }`}
          >
            Mon Profil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`w-1/2 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-white text-teal-800 font-bold shadow-xs'
                : 'text-slate-700 hover:text-slate-950 font-medium'
            }`}
          >
            <span>Mes Signalements</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-100 text-teal-900 font-bold">
              {myReports.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Mon Profil */}
        {activeTab === 'profile' && (
          <div className="space-y-3.5 overflow-y-auto pr-0.5 no-scrollbar">
            {currentUser ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white space-y-2.5 shadow-md border border-teal-600/40">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {currentUser.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight text-white">{currentUser.fullName}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-teal-200 block font-normal">
                          {currentUser.levelName}
                        </span>
                        {currentUser.category && (
                          <span className="text-[10px] font-bold bg-white/20 text-white px-1.5 py-0.2 rounded-md border border-white/20">
                            {USER_CATEGORIES_DEFINITIONS.find((c) => c.id === currentUser.category)?.shortLabel || currentUser.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-teal-200 block font-normal">Mes Éco-Points</span>
                    <span className="text-xs font-bold text-slate-950 bg-amber-400 border border-amber-300 px-2 py-0.5 rounded-lg shadow-2xs inline-block">
                      {currentUser.points} pts
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-teal-600/70 text-xs">
                  <div className="flex items-center gap-1 text-white truncate font-normal">
                    <MapPin className="w-3.5 h-3.5 text-teal-200 shrink-0" />
                    <span className="truncate">{currentUser.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white truncate font-normal">
                    <Phone className="w-3.5 h-3.5 text-teal-200 shrink-0" />
                    <span className="truncate">{currentUser.phone || 'Non renseigné'}</span>
                  </div>
                </div>

                {(currentUser.organizationOrSchool || currentUser.schoolName) && (
                  <div className="flex items-center gap-1.5 pt-1 text-xs text-amber-200 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Structure / Établissement : {currentUser.organizationOrSchool || currentUser.schoolName}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                <span className="font-bold">Vous êtes actuellement en Mode Invité.</span>
                <p className="text-xs text-amber-900 font-normal mt-1">
                  Connectez-vous pour accumuler des Éco-Points et enregistrer vos signalements officiels.
                </p>
              </div>
            )}

            {/* Actions Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  setMobileScreen('education');
                }}
                className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <GraduationCap className="w-4.5 h-4.5 text-slate-950 shrink-0" />
                <span className="whitespace-nowrap">Académie Masseko & Quiz (+40 Pts)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setMobileScreen('auth');
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Gestion du Compte</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                    setMobileScreen('auth');
                  }}
                  className="w-full py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Se Déconnecter</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Mes Signalements */}
        {activeTab === 'reports' && (
          <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1 max-h-[60vh] no-scrollbar">
            {myReports.length === 0 ? (
              <div className="p-6 text-center space-y-2 text-slate-600">
                <FileText className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs font-medium">Vous n'avez pas encore enregistré de signalement.</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setMobileScreen('report');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Signaler un déchet
                </button>
              </div>
            ) : (
              myReports.map((r) => {
                const isCollected = r.status === 'collected' || r.status === 'validated' || r.status === 'valorized';
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      if (setSelectedMapPoint) setSelectedMapPoint(r);
                      onClose();
                      setMobileScreen('map');
                    }}
                    className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-xs transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img src={r.photoUrl} alt={r.locationName} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-xs truncate block text-slate-950">
                            {r.locationName}
                          </span>
                          <span className="text-[10.5px] text-slate-600 font-normal block truncate">
                            {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • Réf: {r.id.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {getStatusBadge(r)}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-slate-700">
                        {r.isNestingZone && (
                          <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-300">
                            <TurtleIcon className="w-3 h-3" />
                            <span>Nid protégé</span>
                          </span>
                        )}
                        <span className="text-slate-600 font-medium">
                          {isCollected ? `Pesé : ${r.actualWeightKg} kg` : `Estimé : ~${r.estimatedWeightKg} kg`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-teal-800 font-bold text-[11px]">
                        <span>Voir carte</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
