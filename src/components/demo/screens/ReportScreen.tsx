import React, { useRef, useState, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  Boxes, 
  ShoppingBag, 
  Package, 
  Layers,
  ShieldAlert,
  Navigation,
  RefreshCw,
  AlertTriangle,
  Radio,
  Crosshair,
  Truck
} from 'lucide-react';
import { 
  POINTE_NOIRE_COASTAL_SITES, 
  REAL_TURTLE_THREATS 
} from '../../../data/mockPointeNoireData';
import { WasteType, WasteVolume } from '../../../types/koba';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect, ModernSelectOption } from '../ModernSelect';

interface ReportScreenProps {
  reportStep: number;
  setReportStep: (step: number) => void;
  locationName: string;
  setLocationName: (loc: string) => void;
  wasteType: WasteType;
  setWasteType: (type: WasteType) => void;
  estimatedVolume: WasteVolume;
  setEstimatedVolume: (vol: WasteVolume) => void;
  isNestingZone: boolean;
  setIsNestingZone: (nesting: boolean) => void;
  turtleDangerLevelText: string;
  setTurtleDangerLevelText: (level: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  capturedPhotoUrl: string | null;
  setCapturedPhotoUrl: (url: string | null) => void;
  realGpsCoords: { lat: number; lng: number } | null;
  setRealGpsCoords: (coords: { lat: number; lng: number } | null) => void;
  isGpsActive?: boolean;
  handleCreateReport: (e: React.FormEvent) => void;
  calculateDynamicScore: () => number;
  themeMode: 'forest' | 'fixora';
  speechLanguage: 'french' | 'lingala' | 'kituba';
  setSpeechLanguage: (lang: 'french' | 'lingala' | 'kituba') => void;
  triggerAudioGuidance: (fr: string, ling: string, kit: string) => void;
  activeSpeechText: string | null;
  reportSuccess: string | null;
  setMobileScreen: (screen: DemoScreen) => void;
}

const DEFAULT_PREVIEWS: Record<WasteType, string> = {
  plastic_bag: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  plastic_bottle: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
  fishing_net: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
  mixed_plastic: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=800&q=80',
  fishing_gear: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  other: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
};

export const ReportScreen: React.FC<ReportScreenProps> = ({
  reportStep,
  setReportStep,
  locationName,
  setLocationName,
  wasteType,
  setWasteType,
  estimatedVolume,
  setEstimatedVolume,
  isNestingZone,
  setIsNestingZone,
  turtleDangerLevelText,
  setTurtleDangerLevelText,
  description,
  setDescription,
  capturedPhotoUrl,
  setCapturedPhotoUrl,
  realGpsCoords,
  setRealGpsCoords,
  isGpsActive = false,
  handleCreateReport,
  calculateDynamicScore,
  themeMode,
  speechLanguage,
  setSpeechLanguage,
  triggerAudioGuidance,
  activeSpeechText,
  reportSuccess,
  setMobileScreen,
}) => {
  const isFixora = themeMode === 'fixora';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<'active' | 'inactive' | 'denied' | 'unsupported'>('inactive');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  // Proactive GPS & Geolocation permission detection
  useEffect(() => {
    if (realGpsCoords && isGpsActive) {
      setGpsStatus('active');
      setGpsStatusMessage(`GPS Fixé : ${realGpsCoords.lat.toFixed(4)}, ${realGpsCoords.lng.toFixed(4)}`);
      return;
    }

    if (isGpsActive === false) {
      setGpsStatus('denied');
      setGpsStatusMessage('GPS désactivé sur le smartphone. Activez la géolocalisation dans vos réglages.');
      return;
    }

    if (typeof navigator !== 'undefined' && 'permissions' in navigator && navigator.permissions?.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
        if (permission.state === 'granted') {
          handleGetRealGPS(true);
        } else if (permission.state === 'denied') {
          setGpsStatus('denied');
          setGpsStatusMessage('Localisation désactivée ou refusée par le navigateur.');
        } else {
          setGpsStatus('inactive');
          setGpsStatusMessage('GPS en attente : activez la géolocalisation de votre téléphone.');
        }

        permission.onchange = () => {
          if (permission.state === 'granted') {
            handleGetRealGPS(true);
          } else if (permission.state === 'denied') {
            setGpsStatus('denied');
            setGpsStatusMessage('Localisation désactivée sur le téléphone.');
            setRealGpsCoords(null);
          }
        };
      }).catch(() => {
        setGpsStatus('inactive');
      });
    } else if (typeof navigator !== 'undefined' && !navigator.geolocation) {
      setGpsStatus('unsupported');
      setGpsStatusMessage("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  }, [realGpsCoords, isGpsActive]);

  // Native Camera / File Capture Handlers
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCapturedPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetRealGPS = (silent = false) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsStatus('unsupported');
      setGpsStatusMessage("La géolocalisation n'est pas supportée.");
      return;
    }

    setIsLocatingGPS(true);
    if (!silent) setGpsStatusMessage("Acquisition des satellites GPS en cours...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingGPS(false);
        const { latitude, longitude, accuracy } = position.coords;
        setRealGpsCoords({ lat: latitude, lng: longitude });
        setGpsAccuracy(Math.round(accuracy));
        setGpsStatus('active');
        setGpsStatusMessage(`GPS Fixé : ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`);
      },
      (error) => {
        setIsLocatingGPS(false);
        setRealGpsCoords(null);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('denied');
          setGpsStatusMessage("Accès GPS refusé : activez la localisation dans les réglages de votre smartphone.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsStatus('denied');
          setGpsStatusMessage("GPS désactivé sur le téléphone : activez la géolocalisation dans les réglages.");
        } else {
          setGpsStatus('inactive');
          setGpsStatusMessage("Signal GPS indisponible : utilisation du secteur de plage sélectionné.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleTakePhotoClick = () => {
    // Proactively acquire GPS if not yet active
    if (gpsStatus !== 'active') {
      handleGetRealGPS(true);
    }
    fileInputRef.current?.click();
  };

  const stepTitles = [
    'Photo & Secteur',
    'Type de Déchet',
    'Gabarit Estimé',
    'Menace Nids',
    'Score & Envoi',
  ];

  const wasteTypesList: { id: WasteType; label: string; desc: string; icon: any }[] = [
    { id: 'plastic_bag', label: 'Sacs Plastiques', desc: 'Confusion létale avec les méduses', icon: ShoppingBag },
    { id: 'plastic_bottle', label: 'Bouteilles PET', desc: 'Bouteilles de boissons recyclables', icon: Package },
    { id: 'fishing_net', label: 'Filets Fantômes', desc: 'Risque d’étranglement des tortues', icon: Layers },
    { id: 'mixed_plastic', label: 'Plastiques Mixtes', desc: 'Bidons et contenants divers', icon: Boxes },
  ];

  const volumeList: { id: WasteVolume; label: string; range: string; desc: string }[] = [
    { id: 'small', label: 'Petit', range: '~1-5 kg', desc: 'Tient dans un sac poubelle' },
    { id: 'medium', label: 'Moyen', range: '~15-30 kg', desc: 'Brouette ou plusieurs sacs' },
    { id: 'large', label: 'Grand', range: '~50-100 kg', desc: 'Étalé sur le sable' },
    { id: 'very_large', label: 'Très Grand', range: '>100 kg', desc: 'Amas important (Camion requis)' },
  ];

  const currentPreview = capturedPhotoUrl || DEFAULT_PREVIEWS[wasteType] || DEFAULT_PREVIEWS.plastic_bottle;

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Header with Compact Stepper & Audio Shortcut */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              {reportStep}
            </span>
            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
              {stepTitles[reportStep - 1]}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Guide */}
            <button
              type="button"
              onClick={() =>
                triggerAudioGuidance(
                  "Prenez une photo claire du déchet et confirmez votre secteur de plage.",
                  "Zua foti ya pamba mpe tindá esika ozali na libongo.",
                  "Bika foto ya mbote mpe tubila bisika nge kele na masa."
                )
              }
              className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 transition-colors cursor-pointer flex items-center justify-center border border-teal-200"
              title="Écouter le guide vocal"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Language Switch */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-xs font-semibold border border-slate-300">
              {(['french', 'lingala', 'kituba'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSpeechLanguage(lang)}
                  className={`px-2 py-1 rounded-lg uppercase transition-all ${
                    speechLanguage === lang
                      ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:text-slate-950 font-medium'
                  }`}
                >
                  {lang === 'french' ? 'FR' : lang === 'lingala' ? 'LN' : 'KT'}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-slate-600 pl-1">
              {reportStep}/5
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(reportStep / 5) * 100}%` }}
          />
        </div>

        {/* Spoken feedback banner if any */}
        {activeSpeechText && (
          <div className="p-2.5 rounded-xl bg-teal-700 text-white text-xs font-normal flex items-center gap-2 animate-in fade-in shadow-xs">
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="truncate">"{activeSpeechText}"</span>
          </div>
        )}

        {reportSuccess && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in shadow-md">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{reportSuccess}</span>
          </div>
        )}
      </div>

      {/* 2. Step Form */}
      <form onSubmit={handleCreateReport} className="space-y-3">
        {/* ================= STEP 1: PHOTO & LOCATION ================= */}
        {reportStep === 1 && (
          <div className="space-y-3 animate-in fade-in">
            {/* Real Camera Capture / Photo Area */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />

            <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center text-white group shadow-sm">
              <img
                src={currentPreview}
                alt="Captured Waste"
                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform group-hover:scale-102"
              />

              {/* Live Geotag Watermark Badge on Photo */}
              <div className="absolute top-2.5 right-2.5 z-10 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-right shadow-md">
                <div className="flex items-center gap-1.5 justify-end text-[10.5px] font-semibold text-white">
                  <span className={`w-2 h-2 rounded-full ${gpsStatus === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{gpsStatus === 'active' ? 'Photo Géolocalisée' : 'Secteur Déclaratif'}</span>
                </div>
                <span className="text-[9.5px] text-teal-200 font-mono block">
                  {realGpsCoords 
                    ? `${realGpsCoords.lat.toFixed(4)}, ${realGpsCoords.lng.toFixed(4)}`
                    : locationName.split('(')[0].trim()}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-3 gap-2">
                <div className="flex items-center justify-between">
                  <div className="bg-black/70 px-2.5 py-1 rounded-xl text-xs font-normal flex items-center gap-1.5 backdrop-blur-xs text-white border border-white/20">
                    <Camera className="w-3.5 h-3.5 text-teal-400" />
                    <span>{capturedPhotoUrl ? 'Photo Réelle Chargée' : 'Aperçu Photo'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTakePhotoClick}
                    className="h-9 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 shrink-0" />
                    <span>{capturedPhotoUrl ? 'Reprendre Photo' : 'Prendre Photo'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Smart GPS Detection & Status Card */}
            <div className={`p-3 rounded-2xl border transition-all shadow-xs ${
              gpsStatus === 'active'
                ? 'bg-emerald-50/80 border-emerald-300 text-slate-900'
                : gpsStatus === 'denied'
                ? 'bg-amber-50/90 border-amber-300 text-slate-900'
                : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    gpsStatus === 'active'
                      ? 'bg-emerald-600 text-white'
                      : gpsStatus === 'denied'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-teal-600 text-white'
                  }`}>
                    {isLocatingGPS ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : gpsStatus === 'active' ? (
                      <Navigation className="w-4 h-4 text-white" />
                    ) : gpsStatus === 'denied' ? (
                      <AlertTriangle className="w-4 h-4 text-slate-950" />
                    ) : (
                      <Radio className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs truncate block">
                        {gpsStatus === 'active' 
                          ? 'Signal GPS Verrouillé' 
                          : gpsStatus === 'denied'
                          ? 'Localisation GPS Non Autorisée'
                          : 'Détection GPS Disponible'}
                      </span>
                      {gpsStatus === 'active' && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-md">
                          Certifié
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal block truncate">
                      {gpsStatus === 'active' && realGpsCoords
                        ? `${realGpsCoords.lat.toFixed(5)}°, ${realGpsCoords.lng.toFixed(5)}° (±${gpsAccuracy || 4}m)`
                        : gpsStatus === 'denied'
                        ? 'Activez le GPS dans les réglages du smartphone'
                        : 'Recommandé pour certifier l\'emplacement du nid'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGetRealGPS(false)}
                  disabled={isLocatingGPS}
                  className={`h-8 px-3 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0 active:scale-95 ${
                    gpsStatus === 'active'
                      ? 'bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-300'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-spin' : ''}`} />
                  <span>{gpsStatus === 'active' ? 'Actualiser' : 'Activer GPS'}</span>
                </button>
              </div>

              {gpsStatusMessage && (
                <p className={`text-[11px] font-mono mt-1.5 pt-1.5 border-t ${
                  gpsStatus === 'active' 
                    ? 'text-emerald-800 border-emerald-200' 
                    : gpsStatus === 'denied'
                    ? 'text-amber-800 border-amber-200'
                    : 'text-slate-600 border-slate-100'
                }`}>
                  {gpsStatusMessage}
                </p>
              )}
            </div>

            <ModernSelect
              label="Secteur Littoral Sélectionné :"
              value={locationName}
              onChange={(val) => setLocationName(val)}
              themeMode={themeMode}
              searchable={true}
              icon={<MapPin className="w-4 h-4 text-teal-600" />}
              options={POINTE_NOIRE_COASTAL_SITES.map((site) => ({
                value: site.name,
                label: site.name,
                subtitle: `${site.sector} • ${site.turtleSpecies}`,
                badge: site.threatLevel,
                badgeColor: (site.threatLevel === 'CRITIQUE'
                  ? 'red'
                  : site.threatLevel === 'HAUTE'
                  ? 'amber'
                  : 'emerald') as ModernSelectOption['badgeColor'],
              }))}
            />

            <button
              type="button"
              onClick={() => setReportStep(2)}
              className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Suivant : Type de Déchet</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}

        {/* ================= STEP 2: WASTE TYPE ================= */}
        {reportStep === 2 && (
          <div className="space-y-3 animate-in fade-in">
            <span className="text-xs font-bold text-slate-950 uppercase tracking-wider block truncate">
              Matière Dominante
            </span>

            <div className="grid grid-cols-2 gap-2">
              {wasteTypesList.map((item) => {
                const Icon = item.icon;
                const isSelected = wasteType === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWasteType(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        isSelected ? 'bg-gradient-to-tr from-teal-700 to-emerald-700 text-white' : 'bg-slate-100 text-slate-800'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 font-bold" />}
                    </div>

                    <div className="mt-2 min-w-0">
                      <span className="font-bold text-xs text-slate-950 block leading-tight truncate">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-600 font-normal block mt-0.5 truncate">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(1)}
                className="w-1/3 h-11 px-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 bg-white hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap text-center shadow-xs"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(3)}
                className="w-2/3 h-11 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Suivant : Gabarit</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: VOLUME ESTIMATION ================= */}
        {reportStep === 3 && (
          <div className="space-y-3 animate-in fade-in">
            <span className="text-xs font-bold text-slate-950 uppercase tracking-wider block truncate">
              Gabarit Visuel Estimé
            </span>

            <div className="space-y-2">
              {volumeList.map((vol) => {
                const isSelected = estimatedVolume === vol.id;

                return (
                  <button
                    key={vol.id}
                    type="button"
                    onClick={() => setEstimatedVolume(vol.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/20 text-slate-950 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-xs'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-950 truncate">
                          {vol.label}
                        </span>
                        <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 border border-slate-300">
                          {vol.range}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-600 font-normal block mt-0.5 truncate">
                        {vol.desc}
                      </span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 font-bold" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(2)}
                className="w-1/3 h-11 px-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 bg-white hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap text-center shadow-xs"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(4)}
                className="w-2/3 h-11 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Suivant : Menace Nids</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: CATEGORY / TURTLE DANGER ================= */}
        {reportStep === 4 && (
          <div className="space-y-3 animate-in fade-in">
            <span className="text-xs font-bold text-slate-950 uppercase tracking-wider block truncate">
              Type d'Emplacement & Mode de Collecte
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* Option 1: Simple Waste for Recovery Tour */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  !isNestingZone
                    ? 'bg-sky-50 border-sky-600 shadow-xs ring-2 ring-sky-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-2xs'
                }`}
                onClick={() => setIsNestingZone(false)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    !isNestingZone ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm block text-slate-950">
                      Déchet Simple (Tournée de Récupération)
                    </span>
                    <span className="text-xs text-slate-600 font-normal block mt-0.5">
                      Accès facile sur axe routier, marché ou plage sans nid
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="collection_category"
                  checked={!isNestingZone}
                  onChange={() => setIsNestingZone(false)}
                  className="w-4 h-4 text-sky-600 focus:ring-sky-500 cursor-pointer pointer-events-none"
                />
              </div>

              {/* Option 2: Nesting Zone */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isNestingZone
                    ? 'bg-emerald-50 border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-2xs'
                }`}
                onClick={() => setIsNestingZone(true)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isNestingZone ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <TurtleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm block text-slate-950">
                      Zone de Ponte / Sanctuaire de Nids
                    </span>
                    <span className="text-xs text-slate-600 font-normal block mt-0.5">
                      Proximité directe des nids de tortues Luth ou Olivier
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="collection_category"
                  checked={isNestingZone}
                  onChange={() => setIsNestingZone(true)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                />
              </div>
            </div>

            {/* If Nesting Zone is active: Threat Selector */}
            {isNestingZone && (
              <div className="space-y-2 animate-in fade-in pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  Type de Menace Côtière Identifiée
                </span>

                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5 no-scrollbar bg-white p-1 rounded-xl border border-slate-200">
                  {REAL_TURTLE_THREATS.map((t) => {
                    const isSelected = turtleDangerLevelText === t.label;

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTurtleDangerLevelText(t.label)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-500/20 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-950 shadow-2xs'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-xs truncate block text-slate-950">
                            {t.shortLabel || t.label}
                          </span>
                          <span className="text-[11px] text-slate-600 font-normal truncate block mt-0.5">
                            {t.speciesConcerned}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 shadow-2xs ${
                            t.dangerLevel === 'EXTRÊME'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-400 text-slate-950 border border-amber-500'
                          }`}
                        >
                          {t.dangerLevel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(3)}
                className="w-1/3 h-11 px-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 bg-white hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap text-center shadow-xs"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(5)}
                className="w-2/3 h-11 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Calculer Score Priorité</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: PRIORITY SCORE & SUBMIT ================= */}
        {reportStep === 5 && (
          <div className="space-y-3 animate-in fade-in">
            {/* Score Pill Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 text-white space-y-2 shadow-md border border-teal-500/30">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-200 truncate">
                  Score de Priorité d'Intervention
                </span>
                <span className="bg-white text-teal-950 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap shrink-0">
                  {calculateDynamicScore()} / 100 PTS
                </span>
              </div>

              <div className="text-xs text-white space-y-1 pt-1.5 border-t border-teal-500/30">
                <div className="flex justify-between font-normal">
                  <span className="text-teal-100">Gabarit estimé :</span>
                  <span className="font-bold text-white">+{estimatedVolume === 'very_large' ? 35 : estimatedVolume === 'large' ? 25 : 15} pts</span>
                </div>
                <div className="flex justify-between font-normal">
                  <span className="text-teal-100">Protection nids :</span>
                  <span className="font-bold text-white">+{isNestingZone ? 25 : 0} pts</span>
                </div>
              </div>
            </div>

            {/* Optional Description */}
            <div>
              <label className="block text-xs font-bold text-slate-950 mb-1.5">
                Repère de terrain (Optionnel) :
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Près du grand palmier à 30m de la piste..."
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 text-xs sm:text-sm font-medium shadow-xs focus:border-teal-600 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(4)}
                className="w-1/3 h-11 px-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 bg-white hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap text-center shadow-xs"
              >
                Retour
              </button>
              <button
                type="submit"
                className="w-2/3 h-11 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                <span className="whitespace-nowrap">Enregistrer Signalement</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
