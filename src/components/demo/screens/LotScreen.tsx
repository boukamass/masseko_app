import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Building2,
  QrCode,
  Share2,
  FileCheck,
  Truck,
  Layers,
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { mockLots, mockRecyclers } from '../../../data/mockPointeNoireData';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect } from '../ModernSelect';

interface LotScreenProps {
  scannedLotId: string;
  selectedRecyclerId: string;
  setSelectedRecyclerId: (id: string) => void;
  themeMode: 'forest' | 'fixora';
  setMobileScreen: (screen: DemoScreen) => void;
}

export const LotScreen: React.FC<LotScreenProps> = ({
  scannedLotId,
  selectedRecyclerId,
  setSelectedRecyclerId,
  themeMode,
  setMobileScreen,
}) => {
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Find matching lot or fallback to standard certified lot
  const lot = mockLots.find((l) => l.id === scannedLotId) || mockLots[0];
  const selectedRecycler = mockRecyclers.find((r) => r.id === selectedRecyclerId) || mockRecyclers[0];

  const actualWeight = lot.actualWeightKg || 183.5;
  const pricePerKg = 250; // FCFA per kg for certified PET
  const economicValue = Math.round(actualWeight * pricePerKg);

  const handleSharePassport = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`Certificat Passeport Lot #${lot.id} - Poids : ${actualWeight} kg - Origine : ${lot.originDescription} - Recyclage : ${selectedRecycler.name}`);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="space-y-3 pb-3 select-none">
      {/* 1. Passport Badge Header (Teal & Marine Gradient) */}
      <div className="p-3.5 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-3xl flex items-center justify-between text-xs shadow-md border border-teal-600/40">
        <div>
          <span className="font-mono text-xs font-bold text-teal-200 block tracking-wider">
            LOT #{lot.id}
          </span>
          <span className="text-[11px] text-teal-100 flex items-center gap-1 mt-0.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>Passeport Numérique Certifié MASSEKO</span>
          </span>
        </div>
        <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
          Vérifié & Conforme
        </span>
      </div>

      {/* Copy Toast if shared */}
      {copiedNotification && (
        <div className="p-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Lien du certificat copié dans le presse-papiers !</span>
        </div>
      )}

      {/* 2. QR Code Container */}
      <div className="p-4 bg-white rounded-3xl border border-slate-300 shadow-sm flex flex-col items-center justify-center space-y-2">
        <div className="relative p-2 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
          <img
            src={lot.qrCodeUrl}
            alt="QR Code Passport"
            className="w-32 h-32 bg-white p-1.5 rounded-xl shadow-inner border border-slate-200"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-xs text-slate-600 font-medium">
          Scannez le QR pour inspecter la chaîne de traçabilité
        </span>
      </div>

      {/* 3. Lot Details Card */}
      <div className="p-3.5 rounded-3xl border text-xs space-y-2.5 bg-white border-slate-300 text-slate-950 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="font-bold text-xs text-slate-950 uppercase tracking-wide">
            Détails du Lot Certifié
          </span>
          <button
            type="button"
            onClick={handleSharePassport}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 border border-slate-300 active:scale-95"
            aria-label="Partager le passeport"
          >
            <Share2 className="w-3 h-3 text-teal-700" />
            <span>Partager</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Poids Réel Certifié :</span>
            <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 text-xs">
              {actualWeight} kg
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Matière Polymère :</span>
            <span className="font-bold text-slate-950">PET 01 (Bouteilles recyclables)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Origine Littorale :</span>
            <span className="font-bold text-right text-[11px] text-slate-950">{lot.originDescription}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-600 font-medium">Collecteur Agréé :</span>
            <span className="font-bold text-slate-950">{lot.collectorName}</span>
          </div>

          {/* Recycler Destination Dropdown */}
          <div className="pt-2 border-t border-slate-100">
            <ModernSelect
              label="Recycleur Destinataire :"
              value={selectedRecyclerId}
              onChange={(val) => setSelectedRecyclerId(val)}
              themeMode={themeMode}
              icon={<Building2 className="w-3.5 h-3.5 text-teal-700" />}
              size="sm"
              options={mockRecyclers.map((rec) => ({
                value: rec.id,
                label: rec.name,
                subtitle: `${rec.locationName} • Filières: ${rec.valorizationTypes.join(', ')}`,
                badge: `${rec.capacityTonPerMonth} t/m`,
                badgeColor: 'teal',
              }))}
            />
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <span className="text-slate-600 font-medium">Valeur Économique Estimée :</span>
            <span className="font-bold text-xs text-amber-950 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
              {economicValue.toLocaleString()} FCFA ({pricePerKg} FCFA/kg)
            </span>
          </div>
        </div>
      </div>

      {/* 4. Traceability Timeline */}
      <div className="p-3.5 rounded-3xl border space-y-2.5 text-xs bg-white border-slate-300 text-slate-950 shadow-sm">
        <span className="font-bold text-xs block text-slate-950 uppercase tracking-wider">
          Chronologie Immuable de Traçabilité
        </span>

        <div className="space-y-3 relative pl-4 border-l-2 border-teal-600 text-[11px] pt-1">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-teal-600"></div>
            <span className="text-slate-500 block font-mono">14 Sept 2026, 08:30 GMT</span>
            <span className="font-bold text-xs block text-slate-950">
              1. Signalement & GPS Citoyen
            </span>
            <span className="text-slate-600 font-normal block">
              Plage Côte Sauvage • Zone de Ponte Nids Luth
            </span>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-teal-600"></div>
            <span className="text-slate-500 block font-mono">14 Sept 2026, 14:15 GMT</span>
            <span className="font-bold text-xs block text-slate-950">
              2. Collecte & Pesée Réelle ({actualWeight} kg)
            </span>
            <span className="text-slate-600 font-normal block">
              Agent {lot.collectorName} • Balance Certifiée
            </span>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-teal-600"></div>
            <span className="text-slate-500 block font-mono">14 Sept 2026, 17:30 GMT</span>
            <span className="font-bold text-xs block text-slate-950">
              3. Scan QR Code & Réception Usine
            </span>
            <span className="text-slate-600 font-normal block">
              {selectedRecycler.name}
            </span>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-300"></div>
            <span className="text-slate-500 block font-mono">15 Sept 2026, 08:00 GMT</span>
            <span className="font-bold text-xs block text-emerald-800">
              4. Valorisation & Broyage PET Validé
            </span>
            <span className="text-slate-600 font-normal block">
              Certificat de Recyclage émis ({selectedRecycler.valorizationTypes[0] || 'Broyage PET'})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
