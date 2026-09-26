import React, { useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Award,
  RefreshCw,
  Layers,
  HelpCircle,
  ExternalLink,
  Flame,
  Check,
  RotateCcw
} from 'lucide-react';
import { DemoScreen } from '../MobileBottomNav';
import { TurtleIcon } from '../TurtleIcon';
import { UserProfile } from '../../../types/koba';

interface EducationScreenProps {
  setMobileScreen: (screen: DemoScreen) => void;
  themeMode: 'forest' | 'fixora';
  currentUser?: UserProfile | null;
  onAwardPoints?: (points: number) => void;
  triggerAudioGuidance?: (french: string, lingala: string, kituba: string) => void;
}

type EduTab = 'turtles' | 'lifespan' | 'circular' | 'quiz';

interface TurtleSpecies {
  id: string;
  name: string;
  scientificName: string;
  weight: string;
  size: string;
  diet: string;
  nestingPeriod: string;
  danger: string;
  whyDanger: string;
  tagColor: string;
  imageUrl: string;
}

const TURTLE_SPECIES: TurtleSpecies[] = [
  {
    id: 'luth',
    name: 'Tortue Luth',
    scientificName: 'Dermochelys coriacea',
    weight: '300 à 650 kg',
    size: 'Jusqu\'à 2,20 mètres',
    diet: 'Méduses marines exclusivement',
    nestingPeriod: 'Octobre à Février (Songolo & Côte Sauvage)',
    danger: 'Sacs plastiques transparents flottants',
    whyDanger: 'Confondus avec des méduses. Provoquent une occlusion de l\'estomac et une mort par inanition.',
    tagColor: 'emerald',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'olivacee',
    name: 'Tortue Olivâtre',
    scientificName: 'Lepidochelys olivacea',
    weight: '35 à 50 kg',
    size: '60 à 75 centimètres',
    diet: 'Crabes, crevettes et mollusques côtiers',
    nestingPeriod: 'Novembre à Mars (Estran de Djeno & Mondongo)',
    danger: 'Filets fantômes et cordages en nylon',
    whyDanger: 'S\'emmêle sous l\'eau. Incapable de remonter respirer à la surface en 45 minutes, elle se noie.',
    tagColor: 'blue',
    imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'verte',
    name: 'Tortue Verte',
    scientificName: 'Chelonia mydas',
    weight: '120 à 200 kg',
    size: '1 à 1,30 mètre',
    diet: 'Herbiers marins et algues de fond',
    nestingPeriod: 'Toute l\'année au large, ponte sporadique',
    danger: 'Micro-plastiques et bidons toxiques',
    whyDanger: 'Ingestion involontaire lors du broutage des fonds marins. Perturbe gravement la reproduction.',
    tagColor: 'teal',
    imageUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80',
  },
];

const DECOMPOSITION_ITEMS = [
  {
    id: 'sac',
    name: 'Sac Plastique (LDPE)',
    years: '20 à 50 ans',
    barPercent: 18,
    color: 'bg-amber-500',
    consequence: 'Se fragmente en milliers de micro-plastiques toxiques ingérés par les poissons pêchés au filet à Pointe-Noire.',
    localAlternative: 'Sacs réutilisables en raphia ou tissu local.',
  },
  {
    id: 'canette',
    name: 'Canette en Métal / Aluminium',
    years: '200 ans',
    barPercent: 42,
    color: 'bg-orange-500',
    consequence: 'Oxydation lente avec libération d\'oxydes métalliques blessant les pattes des nouveau-nés sur le sable.',
    localAlternative: 'Collecte prioritaire pour fonderies artisanales d\'aluminium à Tié-Tié.',
  },
  {
    id: 'bouteille',
    name: 'Bouteille Plastique (PET 01)',
    years: '450 ans',
    barPercent: 75,
    color: 'bg-rose-500',
    consequence: 'Roule inlassablement dans les rouleaux de la Côte Sauvage. Met plus de 4 siècles à se dissoudre.',
    localAlternative: 'Rachat à 250 FCFA/kg pour fabrication de pavés écologiques.',
  },
  {
    id: 'filet',
    name: 'Filet de Pêche Nylon (Filet Fantôme)',
    years: '600 ans',
    barPercent: 100,
    color: 'bg-red-600',
    consequence: 'Le piège le plus mortel. Continue de capturer poissons, dauphins et tortues pendant 6 siècles d\'affilée.',
    localAlternative: 'Dépôt aux points relais partenaires contre prime écocitoyenne.',
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Pourquoi la Tortue Luth est-elle la première victime des sacs plastiques jetés en mer ?',
    options: [
      { text: 'Elle adore la couleur brillante du plastique', correct: false },
      { text: 'Elle confond les sacs transparents avec les méduses dont elle se nourrit', correct: true },
      { text: 'Les sacs l\'attirent pour construire son nid sur la plage', correct: false },
    ],
    explanation: 'La Tortue Luth se nourrit quasi-exclusivement de méduses. Dans l\'eau trouble du ressac, un sac plastique transparent flotte exactement comme une méduse vivante.',
  },
  {
    id: 2,
    question: 'Combien d\'années met une bouteille d\'eau en plastique (PET) à se dégrader dans l\'océan Atlantique ?',
    options: [
      { text: 'Environ 5 ans', correct: false },
      { text: 'Environ 50 ans', correct: false },
      { text: 'Environ 450 ans', correct: true },
    ],
    explanation: 'Une bouteille en plastique met environ 450 ans à disparaître. Pendant ce temps, elle étouffe les fonds et se divise en toxines durables.',
  },
  {
    id: 3,
    question: 'De nuit à Songolo, vous observez une tortue géante en train de creuser un nid. Quel est le bon geste ?',
    options: [
      { text: 'Allumer la torche du téléphone pour éclairer son visage', correct: false },
      { text: 'Éteindre toute lumière, garder 10m de distance et faire un signalement discret sur Masseko', correct: true },
      { text: 'La pousser vers l\'eau pour l\'aider à repartir plus vite', correct: false },
    ],
    explanation: 'La lumière blanche aveugle et terrorise les tortues reproductrices. Elles font demi-tour sans pondre ou abandonnent leurs œufs. Le calme et la discrétion sauvent la couvée.',
  },
  {
    id: 4,
    question: 'Que deviennent les plastiques collectés et tracés par l\'application Masseko à Pointe-Noire ?',
    options: [
      { text: 'Ils sont brûlés à ciel ouvert sur la plage', correct: false },
      { text: 'Ils sont valorisés localement en pavés étanches et granulés recyclés', correct: true },
      { text: 'Ils sont jetés dans les caniveaux de Tié-Tié', correct: false },
    ],
    explanation: 'Masseko connecte directement les collecteurs aux usines de recyclage locales pour créer des pavés écologiques imputrescibles pour cours d\'écoles et voiries.',
  },
];

export const EducationScreen: React.FC<EducationScreenProps> = ({
  setMobileScreen,
  themeMode,
  currentUser,
  onAwardPoints,
  triggerAudioGuidance,
}) => {
  const isFixora = themeMode === 'fixora';
  const [activeTab, setActiveTab] = useState<EduTab>('turtles');
  const [selectedTurtle, setSelectedTurtle] = useState<TurtleSpecies>(TURTLE_SPECIES[0]);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [pointsClaimed, setPointsClaimed] = useState<boolean>(false);

  const handleSelectAnswer = (optionIdx: number) => {
    if (selectedAnswers[currentQuestionIdx] !== undefined) return; // already answered
    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentQuestionIdx] = optionIdx;
    setSelectedAnswers(nextAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers([]);
    setQuizFinished(false);
  };

  const scoreCount = selectedAnswers.filter(
    (ansIdx, qIdx) => ansIdx !== undefined && QUIZ_QUESTIONS[qIdx].options[ansIdx].correct
  ).length;

  const handleClaimPoints = () => {
    if (!pointsClaimed && onAwardPoints) {
      onAwardPoints(40);
      setPointsClaimed(true);
    }
  };

  const playAudioSummary = () => {
    setAudioPlaying(true);
    if (triggerAudioGuidance) {
      triggerAudioGuidance(
        'Bienvenue à l\'Académie Masseko. Apprenez comment protéger les tortues marines de Pointe-Noire et valoriser nos plages.',
        'Boyei malamu na Eteyelo Masseko. Toyekola ndenge ya kobatela banyama ya mayi na bibale ya Pointe-Noire mpe kobimisa mosolo na bosoto.',
        'Mbote na Académie Masseko. Beto longuka mutindu ya kukeba banyama ya mubu ya Pointe-Noire mpe kubalula mvindu na kimvwama.'
      );
    }
    setTimeout(() => setAudioPlaying(false), 5000);
  };

  return (
    <div className="space-y-3 pb-3">
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between pt-0.5 gap-2">
        <button
          type="button"
          onClick={() => setMobileScreen('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer py-1 px-2.5 rounded-xl bg-slate-100 border border-slate-300 whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Accueil</span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={playAudioSummary}
            className={`flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              audioPlaying
                ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Écouter le guide vocal (Français / Lingala / Kituba)"
          >
            {audioPlaying ? <Volume2 className="w-3 h-3 shrink-0" /> : <VolumeX className="w-3 h-3 shrink-0" />}
            <span className="whitespace-nowrap">{audioPlaying ? 'Lecture Audio...' : 'Audio Vocal'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md relative overflow-hidden border border-emerald-500">
        <div className="absolute -right-6 -bottom-6 opacity-15 pointer-events-none">
          <TurtleIcon className="w-32 h-32" />
        </div>

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-lg bg-white/20 text-white">
              <GraduationCap className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white">
              Académie Littoral Masseko
            </span>
          </div>

          <h2 className="text-base font-bold tracking-tight leading-tight text-white">
            Comprendre pour Mieux Protéger
          </h2>

          <p className="text-[11px] text-white/95 font-semibold leading-relaxed max-w-[280px]">
            Guide interactif des sanctuaires côtiers de Pointe-Noire, du cycle de vie des plastiques et de l'économie circulaire.
          </p>

          <div className="pt-1 flex items-center gap-3 text-[10px] font-semibold text-white">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-white" />
              4 Modules Clés
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md border border-amber-300 shadow-2xs">
              <Award className="w-3 h-3 text-slate-950" />
              +40 Pts Quiz Éco
            </span>
          </div>
        </div>
      </div>

      {/* Modern 4-Tab Navigation Selector */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-200 text-[10.5px] font-bold border border-slate-300">
        <button
          type="button"
          onClick={() => setActiveTab('turtles')}
          className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer ${
            activeTab === 'turtles'
              ? 'bg-emerald-700 text-white font-bold shadow-xs'
              : 'text-slate-800 hover:text-slate-950'
          }`}
        >
          <TurtleIcon className="w-4 h-4" />
          <span className="leading-tight truncate font-bold">Tortues</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lifespan')}
          className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer ${
            activeTab === 'lifespan'
              ? 'bg-emerald-700 text-white font-bold shadow-xs'
              : 'text-slate-800 hover:text-slate-950'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="leading-tight truncate font-bold">Plastiques</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('circular')}
          className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer ${
            activeTab === 'circular'
              ? 'bg-emerald-700 text-white font-bold shadow-xs'
              : 'text-slate-800 hover:text-slate-950'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="leading-tight truncate font-bold">Recyclage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 text-center cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'text-amber-950 hover:text-amber-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="leading-tight truncate font-bold">Quiz +40</span>
        </button>
      </div>

      {/* TAB 1: TORTUES & BIODIVERSITÉ */}
      {activeTab === 'turtles' && (
        <div className="space-y-3">
          {/* Species Selector Chips */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-950 uppercase tracking-wider block px-0.5">
              Espèces Phares de Pointe-Noire
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {TURTLE_SPECIES.map((species) => {
                const isSelected = selectedTurtle.id === species.id;
                return (
                  <button
                    key={species.id}
                    type="button"
                    onClick={() => setSelectedTurtle(species)}
                    className={`p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-100 border-emerald-600 shadow-xs ring-2 ring-emerald-500/30'
                        : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[11px] font-bold block truncate text-slate-950">
                      {species.name}
                    </span>
                    <span className="text-[9.5px] text-slate-700 italic font-bold block truncate">
                      {species.scientificName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Species Card */}
          <div className="p-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-md space-y-2.5 transition-all">
            <div className="relative h-28 rounded-xl overflow-hidden border border-slate-300">
              <img
                src={selectedTurtle.imageUrl}
                alt={selectedTurtle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                <span className="text-xs font-bold">{selectedTurtle.name}</span>
                <span className="text-[10px] text-emerald-300 font-bold">{selectedTurtle.scientificName}</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-300">
                <span className="text-slate-800 font-bold block text-[9.5px] uppercase">Gabarit</span>
                <span className="font-bold text-slate-950 block">
                  {selectedTurtle.weight}
                </span>
                <span className="text-[10px] text-slate-700 font-semibold block truncate">{selectedTurtle.size}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-300">
                <span className="text-slate-800 font-bold block text-[9.5px] uppercase">Régime Marin</span>
                <span className="font-bold text-slate-950 truncate block">
                  {selectedTurtle.diet}
                </span>
                <span className="text-[10px] text-emerald-800 block truncate font-bold">
                  {selectedTurtle.nestingPeriod.split('(')[0]}
                </span>
              </div>
            </div>

            {/* Lethal Danger Box */}
            <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-rose-950">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Danger Mortel : {selectedTurtle.danger}</span>
              </div>
              <p className="text-[10.5px] text-rose-950 mt-1 leading-relaxed font-semibold">
                {selectedTurtle.whyDanger}
              </p>
            </div>
          </div>

          {/* 4 Golden Rules Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Les 4 Réflexes d'Or en cas de Ponte Nocturne</span>
            </div>

            <div className="space-y-1.5 text-[10.5px] text-emerald-950 font-medium">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white font-semibold text-[9px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  1
                </span>
                <p>
                  <strong className="font-bold text-emerald-950">Zéro lumière vive :</strong> Éteignez torches blanches et flashs de téléphone. La lumière effraie la femelle qui fait demi-tour sans pondre.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  2
                </span>
                <p>
                  <strong className="font-bold text-emerald-950">Distance de sécurité (10 m) :</strong> Ne jamais encercler, toucher la carapace ni manipuler les nouveau-nés émergeant du sable.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  3
                </span>
                <p>
                  <strong className="font-bold text-emerald-950">Signalement Masseko :</strong> Enregistrez la position GPS discrètement avec le tag <span className="underline font-bold">Zone de Nids</span>.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-700 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  4
                </span>
                <p>
                  <strong className="font-bold text-emerald-950">Alerte Éco-Gardes :</strong> Les écogardes partenaires posent une clôture grillagée pour sécuriser les œufs contre les braconniers et chiens errants.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DURÉE DE VIE DES PLASTIQUES */}
      {activeTab === 'lifespan' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300 text-[10.5px] shadow-2xs">
            <span className="font-bold text-amber-950 block text-xs">
              Combien de temps vos déchets persistent-ils à Pointe-Noire ?
            </span>
            <p className="text-[10.5px] text-amber-950 mt-1 leading-tight font-bold">
              Dans l'océan Atlantique, le sel, le soleil équatorial et les vagues ne détruisent pas le plastique : ils le fragmentent en poisons microscopiques.
            </p>
          </div>

          {/* Timeline Items */}
          <div className="space-y-2">
            {DECOMPOSITION_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-slate-300 bg-white text-slate-950 shadow-2xs space-y-1.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-950">
                    {item.name}
                  </span>
                  <span className="font-bold text-[11px] text-rose-700">
                    {item.years}
                  </span>
                </div>

                {/* Progress Bar of Eternity */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.barPercent}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-700 font-medium leading-relaxed">
                  {item.consequence}
                </p>

                <div className="pt-1 flex items-center gap-1.5 text-[9.5px] font-bold text-sky-800">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Alternative locale : {item.localAlternative}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Multiplier Simulation */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-sm space-y-1.5 border border-blue-600">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
              Simulation Citoyenne Pointe-Noire
            </span>
            <div className="text-sm font-bold leading-tight text-white">
              Si 1 000 foyers évitent 1 bouteille PET par jour pendant 1 an :
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[10.5px]">
              <div className="p-2 rounded-xl bg-white/15 border border-white/20">
                <span className="text-blue-100 block font-bold">Volume évité</span>
                <span className="text-base font-bold text-white">9,1 Tonnes</span>
                <span className="text-[10px] text-blue-200 block font-semibold">de plastique en mer</span>
              </div>
              <div className="p-2 rounded-xl bg-white/15 border border-white/20">
                <span className="text-blue-100 block font-bold">Nids protégés</span>
                <span className="text-base font-bold text-white">+18 Nids</span>
                <span className="text-[10px] text-blue-200 block font-semibold">sauvés à Songolo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ÉCONOMIE CIRCULAIRE & VALORISATION LOCALE */}
      {activeTab === 'circular' && (
        <div className="space-y-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-200 text-[10.5px]">
            <span className="font-bold text-sky-950 block">
              De l'Estran Sablonneux au Pavé Écologique
            </span>
            <p className="text-[10px] text-sky-900 mt-0.5 leading-tight font-medium">
              Chaque kilogramme ramassé possède une valeur marchande tracée dans l'application Masseko.
            </p>
          </div>

          {/* 4 Steps Journey */}
          <div className="space-y-2">
            <div className="p-3 rounded-2xl border border-slate-300 bg-white text-slate-950 shadow-2xs flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-950">
                  Collecte & Dépôt Citoyen
                </h4>
                <p className="text-[10.5px] text-slate-700 mt-0.5 font-medium leading-relaxed">
                  Les citoyens et pêcheurs ramassent les plastiques échoués. Dépôt dans l'un des 6 centres de quartier (Côte Sauvage, Mpita, Tié-Tié, Loandjili).
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-300 bg-white text-slate-950 shadow-2xs flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-950">
                  Pesée Certifiée & QR Code Lot
                </h4>
                <p className="text-[10.5px] text-slate-700 mt-0.5 font-medium leading-relaxed">
                  Le collecteur pèse le sac sur une balance de pesée. Un passeport numérique (Lot QR) est généré en direct.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-300 bg-white text-slate-950 shadow-2xs flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-950">
                  Rémunération & Mobile Money
                </h4>
                <p className="text-[10.5px] text-slate-700 mt-0.5 font-medium leading-relaxed">
                  Crédit instantané d'Éco-Points convertibles en argent (Airtel Money / MTN MoMo) ou bons alimentaires chez les commerçants partenaires.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-slate-300 bg-white text-slate-950 shadow-2xs flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                4
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-950">
                  Moulage de Pavés Écologiques
                </h4>
                <p className="text-[10.5px] text-slate-700 mt-0.5 font-medium leading-relaxed">
                  Mélangés à 70% avec du sable local, les plastiques fondus deviennent des pavés imperméables servant à paver les cours des écoles de Pointe-Noire.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="p-3 rounded-2xl border border-slate-300 bg-white space-y-2 shadow-xs">
            <span className="text-[11px] font-bold text-slate-950 uppercase tracking-wider block">
              Grille Officielle de Rachat au Kilogramme
            </span>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-slate-800 font-bold block text-[10px]">PET 01 (Bouteilles)</span>
                <span className="text-sm font-bold text-emerald-800">
                  250 FCFA / kg
                </span>
                <span className="text-[10px] text-slate-700 font-semibold block">Environ 30 bouteilles</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-slate-800 font-bold block text-[10px]">PEHD 02 (Bidons rigides)</span>
                <span className="text-sm font-bold text-blue-800">
                  220 FCFA / kg
                </span>
                <span className="text-[10px] text-slate-700 font-semibold block">Filière tuyaux et casiers</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-slate-800 font-bold block text-[10px]">Filets Fantômes Nylon</span>
                <span className="text-sm font-bold text-rose-800">
                  180 FCFA / kg
                </span>
                <span className="text-[10px] text-slate-700 font-semibold block">+ Prime biodiversité marine</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="text-slate-800 font-bold block text-[10px]">Aluminium & Métal</span>
                <span className="text-sm font-bold text-amber-900">
                  400 FCFA / kg
                </span>
                <span className="text-[10px] text-slate-700 font-semibold block">Fonderies de Tié-Tié</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUIZ ÉCO-SENTINELLE */}
      {activeTab === 'quiz' && (
        <div className="space-y-3">
          {!quizFinished ? (
            <div className="p-3.5 rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-2xs space-y-3">
              {/* Question progress */}
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-bold text-sky-800">
                  Question {currentQuestionIdx + 1} sur {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-[10.5px] text-slate-800 font-bold">
                  Objectif : +40 Points Éco-Masseko
                </span>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5">
                {QUIZ_QUESTIONS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full flex-1 transition-all ${
                      idx === currentQuestionIdx
                        ? 'bg-sky-600'
                        : selectedAnswers[idx] !== undefined
                        ? 'bg-sky-300'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Question Text */}
              <h3 className="font-bold text-sm text-slate-950 leading-snug">
                {QUIZ_QUESTIONS[currentQuestionIdx].question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, optIdx) => {
                  const isChosen = selectedAnswers[currentQuestionIdx] === optIdx;
                  const hasAnswered = selectedAnswers[currentQuestionIdx] !== undefined;
                  const isCorrect = option.correct;

                  let btnStyle = 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 font-bold';

                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer shadow-2xs ${btnStyle}`}
                    >
                      <span className="leading-snug">{option.text}</span>
                      {hasAnswered && isCorrect && (
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 font-bold" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation box after answer */}
              {selectedAnswers[currentQuestionIdx] !== undefined && (
                <div className="p-3 rounded-xl bg-sky-100 border border-sky-300 space-y-1">
                  <span className="text-[10.5px] font-bold text-sky-950 block uppercase">
                    Explication Pédagogique
                  </span>
                  <p className="text-[11px] text-sky-950 leading-relaxed font-semibold">
                    {QUIZ_QUESTIONS[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}

              {/* Next Question Button */}
              {selectedAnswers[currentQuestionIdx] !== undefined && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full py-3 px-3 rounded-xl bg-[#0A3D62] hover:bg-[#072B46] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">
                    {currentQuestionIdx < QUIZ_QUESTIONS.length - 1
                      ? 'Question Suivante'
                      : 'Voir mon Résultat & Certificat'}
                  </span>
                  <ChevronRight className="w-4 h-4 shrink-0 text-white" />
                </button>
              )}
            </div>
          ) : (
            /* Quiz Completed Result Screen */
            <div className="p-4 rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-md text-center space-y-3.5">
              <div className="w-14 h-14 rounded-3xl bg-amber-400 border border-amber-300 flex items-center justify-center mx-auto text-slate-950 shadow-md">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
                  Évaluation Validée
                </span>
                <h3 className="text-lg font-bold text-slate-950 mt-0.5">
                  {scoreCount === QUIZ_QUESTIONS.length
                    ? 'Félicitations Sentinelle Major !'
                    : 'Bravo pour votre Engagement !'}
                </h3>
                <p className="text-xs text-slate-700 font-semibold mt-1">
                  Vous avez obtenu <strong className="text-emerald-800 font-bold">{scoreCount} / {QUIZ_QUESTIONS.length}</strong> bonnes réponses.
                </p>
              </div>

              {/* Diploma Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950 to-teal-950 text-white text-left space-y-2 border border-emerald-500/40 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TurtleIcon className="w-4 h-4 text-emerald-300" />
                    <span className="text-[10.5px] font-bold tracking-wider uppercase text-emerald-200">
                      Certificat Écocitoyen
                    </span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-800 text-white font-semibold shadow-2xs">
                    Pointe-Noire
                  </span>
                </div>

                <div className="border-t border-emerald-700/60 pt-2">
                  <span className="text-[10.5px] text-emerald-200 font-bold block">Sentinelle Certifiée :</span>
                  <span className="text-sm font-bold text-white block">
                    {currentUser ? currentUser.fullName : 'Sentinelle Littorale Anonyme'}
                  </span>
                  <span className="text-[10px] text-emerald-100 font-medium block mt-0.5">
                    Compétences validées : Détection de nids, tri des résines PET/PEHD & alerte Éco-Gardes.
                  </span>
                </div>
              </div>

              {/* Claim Points Action */}
              <div className="space-y-2 pt-1">
                {!pointsClaimed ? (
                  <button
                    type="button"
                    onClick={handleClaimPoints}
                    className="w-full py-3 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer whitespace-nowrap"
                  >
                    <Award className="w-4 h-4 shrink-0 text-slate-950" />
                    <span className="whitespace-nowrap font-bold text-slate-950">Réclamer mes +40 Points Éco</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-950 text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap border border-emerald-300 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="whitespace-nowrap">+40 Points crédités sur votre Pass Éco !</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap text-center shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Recommencer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobileScreen('home')}
                    className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap text-center shadow-2xs"
                  >
                    <span className="whitespace-nowrap">Retour Accueil</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
