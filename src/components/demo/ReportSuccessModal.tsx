import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Award, 
  Clock, 
  ArrowRight, 
  Map, 
  FileText,
  X
} from 'lucide-react';
import { WasteReport } from '../../types/koba';
import { TurtleIcon } from './TurtleIcon';

interface ReportSuccessModalProps {
  report: WasteReport | null;
  isOpen: boolean;
  onClose: () => void;
  onViewOnMap: () => void;
  onViewMyReports: () => void;
  themeMode: 'forest' | 'fixora';
  isOnline: boolean;
}

export const ReportSuccessModal: React.FC<ReportSuccessModalProps> = ({
  report,
  isOpen,
  onClose,
  onViewOnMap,
  onViewMyReports,
  themeMode,
  isOnline,
}) => {
  if (!isOpen || !report) return null;

  const isFixora = themeMode === 'fixora';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl overflow-hidden transition-all animate-in zoom-in-95">
        {/* Header with celebratory gradient */}
        <div className="p-4 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight text-white">
                Signalement Enregistré !
              </h3>
              <p className="text-xs text-teal-200 font-normal">
                {isOnline ? 'Transmis aux équipes de collecte' : 'Sauvegardé localement sur le téléphone'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 text-xs">
          {/* Summary Card */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-mono text-xs font-semibold text-teal-700">
                {report.id.toUpperCase()}
              </span>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>En attente de ramassage</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="font-medium truncate">{report.locationName}</span>
            </div>

            {report.isNestingZone && (
              <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-medium bg-amber-50 p-1.5 rounded-xl border border-amber-200">
                <TurtleIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Priorité Protection des Nids de Tortues</span>
              </div>
            )}
          </div>

          {/* Eco-Points Reward Box */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-xs text-emerald-950 block">
                  +20 Éco-Points Attribués
                </span>
                <span className="text-[10.5px] text-emerald-800 font-normal block">
                  Bonus supplémentaire (+30 pts) dès la pesée réelle
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-950 bg-amber-400 px-2 py-0.5 rounded-lg border border-amber-500 shadow-2xs">
              +20 pts
            </span>
          </div>

          {/* Tracking hint */}
          <p className="text-[11px] text-slate-500 font-normal leading-relaxed text-center">
            Vous pourrez suivre l'avancement du ramassage et la pesée exacte dans votre espace <strong>« Mes Signalements »</strong>.
          </p>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={onViewMyReports}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Consulter Mes Signalements</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onViewOnMap}
              className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap border border-slate-200"
            >
              <Map className="w-3.5 h-3.5 shrink-0 text-teal-600" />
              <span>Localiser sur la Carte</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
