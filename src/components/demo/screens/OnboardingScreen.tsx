import React, { useState } from 'react';
import { ArrowRight, UserCheck, ShieldCheck, Award, MapPin, Scale } from 'lucide-react';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';

interface OnboardingScreenProps {
  setMobileScreen: (screen: DemoScreen) => void;
  themeMode: 'forest' | 'fixora';
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  setMobileScreen,
  themeMode,
}) => {
  const [onboardingSlide, setOnboardingSlide] = useState<number>(1);
  const isFixora = themeMode === 'fixora';

  return (
    <div className="space-y-4 py-2">
      {/* Slide Visual Card */}
      <div className="relative h-60 rounded-3xl overflow-hidden shadow-md border border-emerald-900/20 bg-slate-900 flex flex-col justify-end p-5 text-white">
        <img
          src={
            onboardingSlide === 1
              ? "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
              : onboardingSlide === 2
              ? "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80"
              : "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
          }
          alt="Illustration Masseko"
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {onboardingSlide === 1 && "1. Préservation Littorale"}
              {onboardingSlide === 2 && "2. Zéro Connexion Requise"}
              {onboardingSlide === 3 && "3. Traçabilité Économique"}
            </span>
            <span className="text-[10px] text-emerald-300 font-mono font-bold">
              {onboardingSlide}/3
            </span>
          </div>

          <h3 className="text-base font-semibold text-white leading-tight">
            {onboardingSlide === 1 && "Protégeons les Tortues Marines de Pointe-Noire"}
            {onboardingSlide === 2 && "Signalez Même Hors-Ligne sur la Côte Sauvage"}
            {onboardingSlide === 3 && "Valorisation & Rémunération des Déchets"}
          </h3>
        </div>
      </div>

      {/* Description Content */}
      <div className="p-4 rounded-2xl border text-xs space-y-2 transition-colors bg-white border-slate-300 text-slate-950 shadow-2xs font-medium">
        <p className="leading-relaxed">
          {onboardingSlide === 1 && (
            <span>
              <strong className="text-slate-950 font-semibold">Masseko</strong> est votre plateforme citoyenne dédiée à la préservation du littoral. Chaque sac plastique ramassé sur la Côte Sauvage ou à Songolo sauve des bébés tortues de l'étouffement lors de la ponte.
            </span>
          )}
          {onboardingSlide === 2 && (
            <span>
              Pas de réseau 4G sur la plage ? Aucun problème ! Vos photos et positions GPS sont enregistrées instantanément sur votre téléphone en toute sécurité, puis synchronisées automatiquement dès le retour du réseau.
            </span>
          )}
          {onboardingSlide === 3 && (
            <span>
              Chaque lot collecté est pesé sur balance certifiée, identifié par <strong className="text-slate-950 font-semibold">QR Code</strong> et acheminé vers les recycleurs partenaires (Congo Plastic Eco-Recycling, TotalEnergies RSE).
            </span>
          )}
        </p>

        {/* Step dots */}
        <div className="flex justify-center items-center gap-1.5 pt-2">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setOnboardingSlide(step)}
              className={`h-1.5 rounded-full transition-all ${
                onboardingSlide === step
                  ? 'w-6 bg-[#007AFF]'
                  : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {onboardingSlide < 3 ? (
          <button
            onClick={() => setOnboardingSlide(onboardingSlide + 1)}
            className="w-full h-11 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="whitespace-nowrap">Étape Suivante</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        ) : (
          <button
            onClick={() => setMobileScreen('auth')}
            className="w-full h-11 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span className="whitespace-nowrap">Créer mon Compte ou Me Connecter</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        )}

        <button
          onClick={() => setMobileScreen('home')}
          className="w-full py-2.5 rounded-2xl bg-transparent hover:bg-slate-100 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer underline underline-offset-2"
        >
          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Accès Direct Sans Compte (Mode Invité)</span>
        </button>
      </div>
    </div>
  );
};
