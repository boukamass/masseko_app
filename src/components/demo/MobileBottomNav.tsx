import React from 'react';
import { Leaf, Map, Camera, Truck, BarChart3 } from 'lucide-react';

export type DemoScreen = 'onboarding' | 'auth' | 'profile' | 'home' | 'map' | 'report' | 'scan' | 'tour' | 'lot' | 'impact' | 'education';

interface MobileBottomNavProps {
  mobileScreen: DemoScreen;
  setMobileScreen: (screen: DemoScreen) => void;
  themeMode?: 'forest' | 'fixora';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  mobileScreen,
  setMobileScreen,
}) => {
  const navItems = [
    {
      id: 'home' as DemoScreen,
      label: 'Accueil',
      icon: Leaf,
      active: mobileScreen === 'home',
    },
    {
      id: 'map' as DemoScreen,
      label: 'Carte',
      icon: Map,
      active: mobileScreen === 'map',
    },
    {
      id: 'report' as DemoScreen,
      label: 'Signaler',
      icon: Camera,
      isFab: true,
      active: mobileScreen === 'report',
    },
    {
      id: 'tour' as DemoScreen,
      label: 'Tournée',
      icon: Truck,
      active: mobileScreen === 'tour',
    },
    {
      id: 'impact' as DemoScreen,
      label: 'Impact',
      icon: BarChart3,
      active: mobileScreen === 'impact',
    },
  ];

  return (
    <div className="px-3 py-2 border-t flex items-center justify-around z-30 transition-colors bg-white border-slate-300 text-slate-950 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] shrink-0 w-full">
      {navItems.map((item) => {
        const Icon = item.icon;

        if (item.isFab) {
          return (
            <button
              key={item.id}
              onClick={() => setMobileScreen('report')}
              className="relative -top-3.5 flex flex-col items-center justify-center group focus:outline-none cursor-pointer"
              aria-label="Signaler un déchet"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform group-hover:scale-105 active:scale-95 bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-600 text-white border-2 border-white ${
                  item.active
                    ? 'ring-4 ring-teal-600/40 shadow-teal-950/40'
                    : 'ring-2 ring-teal-500/40 hover:shadow-teal-950/50'
                }`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold mt-1 text-slate-950 whitespace-nowrap">
                Signaler
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setMobileScreen(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[54px] cursor-pointer ${
              item.active
                ? 'text-teal-950 font-extrabold bg-teal-100/90 scale-102 border border-teal-300 shadow-2xs'
                : 'text-slate-700 hover:text-slate-950 font-semibold hover:bg-slate-100'
            }`}
          >
            <Icon className={`w-4.5 h-4.5 transition-transform ${item.active ? 'scale-105 text-teal-800' : 'text-slate-700'}`} />
            <span className="whitespace-nowrap leading-none tracking-tight text-xs">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
