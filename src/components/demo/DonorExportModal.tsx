import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Scale 
} from 'lucide-react';
import { REAL_IMPACT_CAMPAIGNS } from '../../data/mockPointeNoireData';
import { WasteReport } from '../../types/koba';
import { TurtleIcon } from './TurtleIcon';
import { ModernSelect } from './ModernSelect';

interface DonorExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: WasteReport[];
  selectedDonorTemplate: string;
  setSelectedDonorTemplate: (template: string) => void;
  handleDownloadDonorCSV: () => void;
}

export const DonorExportModal: React.FC<DonorExportModalProps> = ({
  isOpen,
  onClose,
  reports,
  selectedDonorTemplate,
  setSelectedDonorTemplate,
  handleDownloadDonorCSV,
}) => {
  if (!isOpen) return null;

  const totalCertifiedKg = reports.reduce((acc, r) => acc + (r.actualWeightKg || 0), 0);
  const totalCo2SavedKg = (totalCertifiedKg * 2.5).toFixed(1);
  const totalNestsProtected = reports.filter(r => r.isNestingZone).length * 4;

  const donorTemplates = [
    { id: 'fonds_climat', name: 'Fonds Environnemental & Économie Circulaire Côtière', code: 'ENV-PN-2026' },
    { id: 'programme_biodiv', name: 'Programme National Biodiversité & Littoral Congo', code: 'BIO-ECO-984' },
    { id: 'fonds_mer', name: 'Fonds Littoral & Préservation des Tortues Marines', code: 'MASSEKO-CONGO-KOB' },
    { id: 'gestion_dechets', name: 'Cadre Régional de Gestion Intégrée des Déchets Côtiers', code: 'GESTION-POINTE-NOIRE' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between border-b border-teal-600/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-white">
                Rapport d'Audit & Certification Bailleurs
              </h3>
              <p className="text-[11px] text-teal-100 font-normal">
                Génération des fiches de justification certifiées Masseko
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700">
          {/* Scientific Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold text-emerald-950 block mb-0.5">
                Certification Rigoureuse du Poids Réel
              </span>
              Seul le tonnage <strong className="font-medium text-emerald-900">pesé lors de la collecte</strong> est certifié pour les bailleurs et partenaires. Les estimations visuelles citoyennes servent exclusivement au dispatching logistique.
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <ModernSelect
              label="Organisme / Protocole Bailleur :"
              value={selectedDonorTemplate}
              onChange={(val) => setSelectedDonorTemplate(val)}
              themeMode="fixora"
              icon={<FileText className="w-4 h-4 text-[#0A3D62]" />}
              options={donorTemplates.map((t) => ({
                value: t.id,
                label: t.name,
                subtitle: `Code Protocole : ${t.code}`,
                badge: t.code.split('-')[0],
                badgeColor: 'blue',
              }))}
            />
          </div>

          {/* Aggregated KPI Summary Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                Poids Certifié
              </span>
              <span className="font-semibold text-sm text-emerald-700 block mt-0.5">
                {totalCertifiedKg.toFixed(1)} kg
              </span>
              <span className="text-[9.5px] text-slate-500 font-normal">Balance certifiée</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                CO2 Évité
              </span>
              <span className="font-semibold text-sm text-blue-700 block mt-0.5">
                {totalCo2SavedKg} kg
              </span>
              <span className="text-[9.5px] text-slate-500 font-normal">Facteur 2.5 kg/kg</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide block">
                Nids Sécurisés
              </span>
              <span className="font-semibold text-sm text-amber-700 block mt-0.5">
                {totalNestsProtected} nids
              </span>
              <span className="text-[9.5px] text-slate-500 font-normal">Pointe-Noire</span>
            </div>
          </div>

          {/* Audit Verification List */}
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <span className="font-semibold text-xs text-slate-900 block">
              Garanties & Traçabilité de Terrain :
            </span>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700">Horodatage et coordonnées GPS certifiés des dépôts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700">Passeport numérique QR Code rattaché à chaque lot envoyé en usine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700">Protection des nids de pontes (Tortues Luth & Olivâtre)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors font-medium text-xs cursor-pointer"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              handleDownloadDonorCSV();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger Rapport Justificatif (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
