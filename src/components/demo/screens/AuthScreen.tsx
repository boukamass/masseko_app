import React, { useState } from 'react';
import { 
  Lock, 
  Phone, 
  User, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound,
  GraduationCap,
  Briefcase,
  Building2,
  Info
} from 'lucide-react';
import { UserProfile, MassekoRole, UserCategory } from '../../../types/koba';
import { POINTE_NOIRE_NEIGHBORHOODS, USER_CATEGORIES_DEFINITIONS } from '../../../data/mockPointeNoireData';
import { ModernSelect, ModernSelectOption } from '../ModernSelect';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';

interface AuthScreenProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  setMobileScreen: (screen: DemoScreen) => void;
  themeMode: 'forest' | 'fixora';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLogin,
  onRegister,
  setMobileScreen,
  themeMode,
}) => {
  const isFixora = themeMode === 'fixora';
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState<string>('+242 06 812 34 56');
  const [loginPin, setLoginPin] = useState<string>('1234');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Register Form States
  const [regFullName, setRegFullName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('+242 06 ');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regNeighborhood, setRegNeighborhood] = useState<string>(POINTE_NOIRE_NEIGHBORHOODS[0]);
  const [regCategory, setRegCategory] = useState<UserCategory>('student');
  const [regOrganization, setRegOrganization] = useState<string>('Lycée Victor Augagneur');
  const [regRole, setRegRole] = useState<MassekoRole>('citizen');
  const [regSchoolName, setRegSchoolName] = useState<string>('');
  const [regPin, setRegPin] = useState<string>('1234');
  const [regAcceptedCharter, setRegAcceptedCharter] = useState<boolean>(true);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Submit Login
  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInput = loginPhoneOrEmail.trim();
    if (!cleanInput) {
      setLoginError('Veuillez renseigner votre numéro de téléphone ou adresse email.');
      return;
    }

    const user: UserProfile = {
      id: currentUser?.id || `user-${Date.now().toString().slice(-4)}`,
      fullName: cleanInput.includes('@') ? cleanInput.split('@')[0] : 'Sentinelle Littorale',
      email: cleanInput.includes('@') ? cleanInput : `${cleanInput.replace(/[^0-9]/g, '')}@masseko.cg`,
      phone: cleanInput.includes('@') ? '+242 06 000 00 00' : cleanInput,
      role: 'citizen',
      category: 'citizen',
      neighborhood: 'Côte Sauvage (Sanctuaire)',
      points: 150,
      levelName: 'Sentinelle Active',
    };

    onLogin(user);
    setAuthSuccess(`Connexion réussie !`);
    setTimeout(() => {
      setAuthSuccess(null);
      setMobileScreen('home');
    }, 600);
  };

  // Submit Registration
  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!regFullName.trim()) {
      setRegisterError('Veuillez indiquer votre nom complet ou pseudonyme.');
      return;
    }
    if (!regAcceptedCharter) {
      setRegisterError('Veuillez accepter la charte d’engagement écocitoyen.');
      return;
    }

    const categoryToRole: Record<UserCategory, MassekoRole> = {
      student: 'school',
      coastal_pro: 'citizen',
      fisherman: 'fisherman',
      association_member: 'association',
      citizen: 'citizen',
      municipal_agent: 'collector',
      scientist: 'admin',
      recycler: 'recycler',
    };

    const targetRole = categoryToRole[regCategory] || 'citizen';

    const roleLevels: Record<MassekoRole, string> = {
      citizen: 'Sentinelle Littorale',
      fisherman: 'Éco-Gardien des Mers',
      school: 'Ambassadeur Scolaire',
      collector: 'Collecteur Terrestre',
      association: 'Partenaire Littoral',
      admin: 'Modérateur',
      recycler: 'Partenaire Recyclage',
    };

    const newUser: UserProfile = {
      id: `user-${Date.now().toString().slice(-4)}`,
      fullName: regFullName.trim(),
      email: regEmail.trim() || `${regPhone.replace(/[^0-9]/g, '') || 'citoyen'}@masseko.cg`,
      phone: regPhone.trim(),
      role: targetRole,
      category: regCategory,
      organizationOrSchool: regOrganization.trim() || undefined,
      neighborhood: regNeighborhood,
      schoolName: regCategory === 'student' ? (regOrganization.trim() || 'Lycée Victor Augagneur') : undefined,
      points: 50,
      levelName: roleLevels[targetRole] || 'Sentinelle Engagée',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };

    onRegister(newUser);
    setAuthSuccess(`Compte créé avec succès !`);
    setTimeout(() => {
      setAuthSuccess(null);
      setMobileScreen('home');
    }, 700);
  };

  return (
    <div className="space-y-3.5 pb-3">
      {/* Brand Header */}
      <div className="text-center pt-1 space-y-1">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
          <TurtleIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Masseko Pointe-Noire
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Protection des tortues marines et du littoral
          </p>
        </div>
      </div>

      {/* Auth Mode Switch Tabs */}
      <div className="flex rounded-2xl p-0.5 bg-slate-100 border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setAuthMode('login');
            setLoginError(null);
            setRegisterError(null);
          }}
          className={`w-1/2 py-2 rounded-xl font-medium text-xs transition-all whitespace-nowrap cursor-pointer ${
            authMode === 'login'
              ? 'bg-white text-teal-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 font-normal'
          }`}
        >
          Se Connecter
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('register');
            setLoginError(null);
            setRegisterError(null);
          }}
          className={`w-1/2 py-2 rounded-xl font-medium text-xs transition-all whitespace-nowrap cursor-pointer ${
            authMode === 'register'
              ? 'bg-white text-teal-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 font-normal'
          }`}
        >
          Créer un Compte
        </button>
      </div>

      {/* Success Notification Alert */}
      {authSuccess && (
        <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="font-medium">{authSuccess}</span>
        </div>
      )}

      {/* ================= LOGIN FORM ================= */}
      {authMode === 'login' && (
        <form onSubmit={handleSubmitLogin} className="space-y-3 animate-in fade-in">
          {loginError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl border bg-white border-slate-200 text-slate-900 shadow-xs space-y-3">
            {/* Phone or Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 block">
                Téléphone (+242) ou Email :
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginPhoneOrEmail}
                  onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                  placeholder="+242 06 123 45 67"
                  className="w-full h-10 pl-9 pr-3 rounded-xl text-xs font-normal border border-slate-200 bg-slate-50 focus:border-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* PIN Code / Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 block">
                Mot de passe ou Code PIN :
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full h-10 pl-9 pr-10 rounded-xl text-xs font-normal border border-slate-200 bg-slate-50 focus:border-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Lock className="w-4 h-4 text-teal-200 shrink-0" />
            <span className="whitespace-nowrap">Se Connecter</span>
          </button>
        </form>
      )}

      {/* ================= REGISTER FORM ================= */}
      {authMode === 'register' && (
        <form onSubmit={handleSubmitRegister} className="space-y-3 animate-in fade-in">
          {registerError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{registerError}</span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl border bg-white border-slate-200 text-slate-900 shadow-xs space-y-3">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 block">
                Nom complet ou Pseudonyme :
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ex: Mireille Ngoma"
                  className="w-full h-10 pl-9 pr-3 rounded-xl text-xs font-normal border border-slate-200 bg-slate-50 focus:border-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 block">
                Numéro de Téléphone :
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+242 06 123 45 67"
                  className="w-full h-10 pl-9 pr-3 rounded-xl text-xs font-normal border border-slate-200 bg-slate-50 focus:border-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Neighborhood Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 block">
                Quartier de Résidence :
              </label>
              <ModernSelect
                value={regNeighborhood}
                onChange={(val) => setRegNeighborhood(val)}
                themeMode={themeMode}
                size="sm"
                icon={<MapPin className="w-4 h-4 text-teal-600" />}
                options={POINTE_NOIRE_NEIGHBORHOODS.map((nh) => ({
                  value: nh,
                  label: nh,
                  subtitle: 'Pointe-Noire',
                  badge: nh.includes('Sanctuaire') || nh.includes('Luth') ? 'Zone Protégée' : undefined,
                  badgeColor: 'emerald',
                }))}
              />
            </div>

            {/* Profile Category Dropdown (Crucial for Impact Analytics) */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                  <span>Profil & Catégorie Socio-Professionnelle :</span>
                </label>
                <span className="text-[10px] text-teal-700 font-medium bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded-md">
                  Analyses d'Impact
                </span>
              </div>

              <ModernSelect
                value={regCategory}
                onChange={(val) => {
                  const cat = val as UserCategory;
                  setRegCategory(cat);
                  const def = USER_CATEGORIES_DEFINITIONS.find((d) => d.id === cat);
                  if (def?.organizationPlaceholder) {
                    setRegOrganization(def.organizationPlaceholder.split(',')[0].replace('Ex: ', '').trim());
                  }
                }}
                themeMode={themeMode}
                size="md"
                icon={<GraduationCap className="w-4 h-4 text-teal-600" />}
                options={USER_CATEGORIES_DEFINITIONS.map((cat) => ({
                  value: cat.id,
                  label: cat.label,
                  subtitle: cat.description,
                  badge: cat.shortLabel,
                  badgeColor: (cat.id === 'student' || cat.id === 'association_member'
                    ? 'emerald'
                    : cat.id === 'coastal_pro'
                    ? 'blue'
                    : cat.id === 'fisherman' || cat.id === 'recycler'
                    ? 'teal'
                    : cat.id === 'scientist'
                    ? 'purple'
                    : 'amber') as ModernSelectOption['badgeColor'],
                }))}
              />

              {/* Dynamic Analysis Utility Explanation */}
              {(() => {
                const currentDef = USER_CATEGORIES_DEFINITIONS.find((d) => d.id === regCategory) || USER_CATEGORIES_DEFINITIONS[0];
                return (
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-[11px] space-y-1">
                    <p className="text-teal-950 font-medium">
                      {currentDef.description}
                    </p>
                    <p className="text-slate-600 font-normal flex items-start gap-1">
                      <Info className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span><strong>Pertinence Analyses :</strong> {currentDef.analysisUtility}</span>
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Organization / School / Company Name */}
            {(() => {
              const currentDef = USER_CATEGORIES_DEFINITIONS.find((d) => d.id === regCategory) || USER_CATEGORIES_DEFINITIONS[0];
              return (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    {currentDef.organizationLabel || 'Établissement, Entreprise ou Structure :'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regOrganization}
                      onChange={(e) => setRegOrganization(e.target.value)}
                      placeholder={currentDef.organizationPlaceholder || 'Ex: Lycée Victor Augagneur, Palm Beach...'}
                      className="w-full h-10 pl-9 pr-3 rounded-xl text-xs font-normal border border-slate-200 bg-slate-50 focus:border-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                    />
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              );
            })()}

            {/* PIN Code */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 block">
                Créer un Mot de passe ou PIN :
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full h-10 pl-9 pr-3 rounded-xl text-xs font-normal border border-slate-200 bg-slate-50 focus:border-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 outline-hidden transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Charter Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="charter"
                checked={regAcceptedCharter}
                onChange={(e) => setRegAcceptedCharter(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 mt-0.5 cursor-pointer"
              />
              <label htmlFor="charter" className="text-xs text-slate-600 font-normal leading-tight cursor-pointer">
                J'accepte de participer activement à la protection des plages et des tortues marines de Pointe-Noire.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Créer Mon Compte</span>
          </button>
        </form>
      )}
    </div>
  );
};
