import React from 'react';
import { Wifi, WifiOff, User, Bell, Sun } from 'lucide-react';
import { UserProfile } from '../../types/koba';
import { TurtleIcon } from './TurtleIcon';

interface MobileTopBarProps {
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  syncPendingReports: () => void;
  themeMode?: 'forest' | 'fixora';
  setThemeMode?: (mode: 'forest' | 'fixora') => void;
  pendingSyncCount: number;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  onOpenEducation?: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  isSunlightMode?: boolean;
  onToggleSunlightMode?: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  isOnline,
  setIsOnline,
  syncPendingReports,
  pendingSyncCount,
  currentUser,
  onOpenProfile,
  onOpenAuth,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  isSunlightMode = false,
  onToggleSunlightMode,
}) => {
  return (
    <div className="px-3.5 py-2.5 border-b flex items-center justify-between text-xs z-30 select-none transition-colors bg-white border-slate-300 text-slate-950 shadow-xs shrink-0 w-full">
      {/* Brand & City */}
      <div className="flex items-center gap-1.5">
        <TurtleIcon className="w-5 h-5 text-emerald-700 shrink-0" />
        <span className="font-extrabold text-sm sm:text-base tracking-wider text-emerald-800">MASSEKO</span>
        <span className="text-xs font-semibold text-slate-700">Pointe-Noire</span>
      </div>

      {/* Controls & Status */}
      <div className="flex items-center gap-1.5">
        {/* Quick Toggle: Mode Plein Soleil / Haute Visibilité Plage */}
        {onToggleSunlightMode && (
          <button
            type="button"
            onClick={onToggleSunlightMode}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer border ${
              isSunlightMode
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title={isSunlightMode ? 'Mode Plein Soleil Actif (WCAG AAA)' : 'Activer Mode Plein Soleil (Haute visibilité)'}
            aria-label="Mode Plein Soleil"
          >
            <Sun className={`w-4 h-4 shrink-0 ${isSunlightMode ? 'text-slate-950 font-bold' : 'text-slate-700'}`} />
          </button>
        )}

        {/* Offline / Online Network Indicator */}
        <button
          type="button"
          onClick={() => {
            if (!isOnline) {
              syncPendingReports();
            } else {
              setIsOnline(false);
            }
          }}
          className={`px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer shadow-xs min-h-[34px] border ${
            isOnline
              ? 'bg-emerald-800 hover:bg-emerald-900 text-white border-emerald-900'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-600'
          }`}
          title={
            isOnline
              ? 'Réseau 4G actif (Cliquer pour basculer en mode Hors-ligne terrain)'
              : 'Mode Hors-ligne terrain (Cliquer pour synchroniser en 4G)'
          }
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-white shrink-0" />
              <span>4G En Ligne</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>Hors-ligne{pendingSyncCount > 0 ? ` (${pendingSyncCount})` : ''}</span>
            </>
          )}
        </button>

        {/* Notification Bell Button with Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-300"
          title="Notifications de collecte"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 shrink-0 text-slate-800" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-emerald-600 text-white text-[9.5px] font-bold flex items-center justify-center border-2 border-white px-0.5">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Avatar */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xs border border-teal-800"
            title={currentUser.fullName}
            aria-label="Mon profil"
          >
            {currentUser.fullName.charAt(0)}
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer border border-slate-300"
            title="Connexion"
            aria-label="Connexion"
          >
            <User className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
