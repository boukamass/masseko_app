import React, { useState } from 'react';
import { 
  Scan, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DemoScreen } from '../MobileBottomNav';

interface ScanScreenProps {
  scanScreenMode: 'qr_scanner' | 'type_recognition';
  setScanScreenMode: (mode: 'qr_scanner' | 'type_recognition') => void;
  setMobileScreen: (screen: DemoScreen) => void;
  setScannedLotId: (id: string) => void;
  themeMode: 'forest' | 'fixora';
}

interface PolymerGuide {
  id: string;
  code: string;
  name: string;
  examples: string;
  recyclability: string;
  price: string;
  impact: string;
  color: string;
}

const POLYMER_DATA: PolymerGuide[] = [
  {
    id: 'pet',
    code: 'PET (01)',
    name: 'Polyéthylène Téréphtalate',
    examples: 'Bouteilles d’eau minérale, sodas, barquettes transparentes',
    recyclability: '100% Recyclable (Haute Valeur)',
    price: '250 FCFA / kg',
    impact: 'Très abondant sur la Côte Sauvage. Risque d’ingestion par les tortues.',
    color: 'border-teal-500 bg-teal-50 text-teal-900',
  },
  {
    id: 'pehd',
    code: 'PE-HD (02)',
    name: 'Polyéthylène Haute Densité',
    examples: 'Bidons d’huile, bouteilles de shampoing, bouchons',
    recyclability: 'Très Recyclable',
    price: '200 FCFA / kg',
    impact: 'Plastique rigide résistant. Risque de blessures aux nageoires.',
    color: 'border-cyan-500 bg-cyan-50 text-cyan-900',
  },
  {
    id: 'pp',
    code: 'PP (05)',
    name: 'Polypropylène',
    examples: 'Bouchons, cordages marins, filets de pêche synthétiques',
    recyclability: 'Recyclable en granulés',
    price: '180 FCFA / kg',
    impact: 'Flotte en surface et s’emmêle dans les récifs et nids.',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
  },
  {
    id: 'pebd',
    code: 'PE-LD (04)',
    name: 'Polyéthylène Basse Densité',
    examples: 'Sacs plastiques transparents, films d’emballage',
    recyclability: 'Recyclable sous conditions',
    price: '120 FCFA / kg',
    impact: 'Urgence critique : ressemble aux méduses, mortel pour les tortues luth.',
    color: 'border-rose-500 bg-rose-50 text-rose-900',
  },
];

export const ScanScreen: React.FC<ScanScreenProps> = ({
  scanScreenMode,
  setScanScreenMode,
  setMobileScreen,
  setScannedLotId,
  themeMode,
}) => {
  const isFixora = themeMode === 'fixora';
  const [selectedPolymer, setSelectedPolymer] = useState<PolymerGuide>(POLYMER_DATA[0]);

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Header with Mode Switcher */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="min-w-0">
          <h2 className="font-semibold text-base sm:text-lg text-slate-900 leading-tight truncate">
            Scan & Diagnostic Plastique
          </h2>
          <span className="text-xs text-slate-500 font-normal block truncate">
            Traçabilité des lots et guide des matières
          </span>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-2xl text-xs font-medium shrink-0 border border-slate-200">
          <button
            type="button"
            onClick={() => setScanScreenMode('qr_scanner')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[34px] ${
              scanScreenMode === 'qr_scanner'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium shadow-xs'
                : 'text-slate-600 font-normal'
            }`}
          >
            Scanner QR
          </button>
          <button
            type="button"
            onClick={() => setScanScreenMode('type_recognition')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[34px] ${
              scanScreenMode === 'type_recognition'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium shadow-xs'
                : 'text-slate-600 font-normal'
            }`}
          >
            Résines
          </button>
        </div>
      </div>

      {/* Mode 1: QR Scanner */}
      {scanScreenMode === 'qr_scanner' ? (
        <div className="space-y-3 animate-in fade-in">
          <div className="relative w-full h-72 bg-black rounded-3xl overflow-hidden border border-teal-500/30 shadow-inner flex flex-col items-center justify-between p-3.5 text-white">
            {/* Real QR graphic */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MASSEKO-2026-000127"
                alt="QR Code"
                className="w-36 h-36 bg-white p-2.5 rounded-2xl shadow-xl border border-teal-400/60"
              />
            </div>

            {/* Viewfinder Corners */}
            <div className="relative z-10 m-auto w-44 h-44 border border-teal-400/80 rounded-2xl flex items-center justify-center bg-teal-500/10">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-400 rounded-tl-md"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-400 rounded-tr-md"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-teal-400 rounded-bl-md"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-400 rounded-br-md"></div>
              <span className="text-[11px] font-medium bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1 rounded-full shadow-md animate-pulse whitespace-nowrap">
                Détection MASSEKO-2026-000127
              </span>
            </div>

            {/* Bottom Scanned Result Overlay */}
            <div className="relative z-10 w-full bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs flex items-center justify-between gap-2 shadow-lg">
              <div className="min-w-0">
                <span className="font-semibold text-teal-300 block text-xs sm:text-sm truncate">
                  Lot #MASSEKO-2026-000127
                </span>
                <span className="text-xs text-slate-300 font-normal block truncate mt-0.5">
                  183.5 kg PET • Songolo
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScannedLotId('MASSEKO-2026-000127');
                  setMobileScreen('lot');
                }}
                className="h-10 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white text-xs font-medium px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Ouvrir Fiche Lot</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Quick Resin Guide */
        <div className="space-y-3 animate-in fade-in">
          {/* Quick Selector Pills */}
          <div className="grid grid-cols-2 gap-2">
            {POLYMER_DATA.map((poly) => {
              const isSelected = selectedPolymer.id === poly.id;
              return (
                <button
                  key={poly.id}
                  type="button"
                  onClick={() => setSelectedPolymer(poly)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[75px] shadow-xs ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/90 ring-2 ring-teal-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs text-slate-900">
                      {poly.code}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 font-semibold" />}
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal truncate block mt-1">
                    {poly.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Polymer Detailed Box */}
          <div className="p-4 rounded-2xl border space-y-3 shadow-xs bg-white border-slate-200 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
              <span className="font-semibold text-sm truncate text-slate-900">
                {selectedPolymer.code} — {selectedPolymer.name}
              </span>
              <span className="text-xs font-semibold text-white bg-teal-700 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 shadow-xs">
                {selectedPolymer.price}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <strong className="text-slate-900 font-medium">Exemples :</strong> {selectedPolymer.examples}
            </p>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-normal flex items-start gap-2 shadow-xs">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{selectedPolymer.impact}</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileScreen('report')}
              className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-md"
            >
              <span className="whitespace-nowrap">Signaler ce type de plastique</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
