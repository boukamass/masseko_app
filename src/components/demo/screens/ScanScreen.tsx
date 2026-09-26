import React, { useState } from 'react';
import { 
  Scan, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Search,
  ChevronRight
} from 'lucide-react';
import { DemoScreen } from '../MobileBottomNav';
import { mockLots } from '../../../data/mockPointeNoireData';

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
  const [selectedPolymer, setSelectedPolymer] = useState<PolymerGuide>(POLYMER_DATA[0]);
  const [manualLotInput, setManualLotInput] = useState<string>('');

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLotInput.trim()) {
      setScannedLotId(manualLotInput.trim().toUpperCase());
      setMobileScreen('lot');
    }
  };

  return (
    <div className="space-y-3 pb-3 select-none">
      {/* 1. Header with Mode Switcher */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="min-w-0">
          <h2 className="font-bold text-base sm:text-lg text-slate-950 leading-tight truncate">
            Scan & Diagnostic Plastique
          </h2>
          <span className="text-xs text-slate-600 font-medium block truncate">
            Traçabilité des lots et guide des matières
          </span>
        </div>

        {/* Mode Switch Pills */}
        <div className="flex items-center p-0.5 bg-slate-100 rounded-2xl text-xs font-bold shrink-0 border border-slate-300">
          <button
            type="button"
            onClick={() => setScanScreenMode('qr_scanner')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[34px] ${
              scanScreenMode === 'qr_scanner'
                ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-bold shadow-xs'
                : 'text-slate-700'
            }`}
          >
            Scanner QR
          </button>
          <button
            type="button"
            onClick={() => setScanScreenMode('type_recognition')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[34px] ${
              scanScreenMode === 'type_recognition'
                ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-bold shadow-xs'
                : 'text-slate-700'
            }`}
          >
            Résines
          </button>
        </div>
      </div>

      {/* Mode 1: QR Scanner */}
      {scanScreenMode === 'qr_scanner' ? (
        <div className="space-y-3 animate-in fade-in">
          {/* Scanner Viewfinder Box */}
          <div className="relative w-full h-72 bg-slate-950 rounded-3xl overflow-hidden border border-teal-500/40 shadow-inner flex flex-col items-center justify-between p-3.5 text-white">
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
              <span className="text-[11px] font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1 rounded-full shadow-md animate-pulse whitespace-nowrap">
                Détection : MASSEKO-2026-000127
              </span>
            </div>

            {/* Bottom Scanned Result Overlay */}
            <div className="relative z-10 w-full bg-black/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs flex items-center justify-between gap-2 shadow-lg">
              <div className="min-w-0">
                <span className="font-bold text-teal-300 block text-xs sm:text-sm truncate">
                  Lot #MASSEKO-2026-000127
                </span>
                <span className="text-xs text-slate-300 font-medium block truncate mt-0.5">
                  183.5 kg PET • Côte Sauvage & Songolo
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScannedLotId('MASSEKO-2026-000127');
                  setMobileScreen('lot');
                }}
                className="h-10 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white text-xs font-bold px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Ouvrir Lot</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

          {/* Manual Entry Fallback */}
          <form onSubmit={handleManualSearch} className="p-3 bg-white rounded-3xl border border-slate-300 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-slate-950 block">
              Recherche manuelle de lot :
            </span>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={manualLotInput}
                  onChange={(e) => setManualLotInput(e.target.value)}
                  placeholder="Ex: MASSEKO-2026-000127"
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-950 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Vérifier</span>
              </button>
            </div>
          </form>
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
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[75px] shadow-xs active:scale-95 ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-500/30'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs text-slate-950">
                      {poly.code}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 font-bold" />}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium truncate block mt-1">
                    {poly.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Polymer Detailed Box */}
          <div className="p-4 rounded-3xl border space-y-3 shadow-xs bg-white border-slate-300 text-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
              <span className="font-bold text-sm truncate text-slate-950">
                {selectedPolymer.code} — {selectedPolymer.name}
              </span>
              <span className="text-xs font-bold text-white bg-teal-700 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 shadow-xs">
                {selectedPolymer.price}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              <strong className="text-slate-950 font-bold">Exemples :</strong> {selectedPolymer.examples}
            </p>

            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 font-medium flex items-start gap-2 shadow-xs">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-700 shrink-0 mt-0.5" />
              <span>{selectedPolymer.impact}</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileScreen('report')}
              className="w-full h-11 px-4 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-md"
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
