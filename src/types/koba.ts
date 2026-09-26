export type MassekoRole = 'citizen' | 'fisherman' | 'school' | 'association' | 'collector' | 'admin' | 'recycler';
export type KobaRole = MassekoRole;

export type UserCategory = 
  | 'student'             // Élève / Étudiant (Lycées, Universités)
  | 'coastal_pro'         // Professionnel du Littoral / Entreprise / Tourisme
  | 'fisherman'           // Pêcheur Artisanal / Mareyeur
  | 'association_member'  // Membre ONG / Éco-Bénévole
  | 'citizen'             // Citoyen & Résident Sentinelle
  | 'municipal_agent'     // Agent Municipal / Brigade de Salubrité
  | 'scientist'           // Scientifique / Chercheur en Biologie Marine
  | 'recycler';           // Industriel / Recycleur de Plastique

export interface UserCategoryDefinition {
  id: UserCategory;
  label: string;
  shortLabel: string;
  badge: string;
  iconName: string;
  description: string;
  analysisUtility: string;
  organizationLabel?: string;
  organizationPlaceholder?: string;
}

export type WasteType = 'plastic_bottle' | 'plastic_bag' | 'fishing_net' | 'fishing_gear' | 'mixed_plastic' | 'other';

export type WasteVolume = 'small' | 'medium' | 'large' | 'very_large';

export type PriorityLevel = 'CRITIQUE' | 'HAUTE' | 'MOYENNE' | 'BASSE';

export type ReportStatus = 
  | 'reported'
  | 'pending_validation'
  | 'validated'
  | 'assigned'
  | 'in_collection'
  | 'collected'
  | 'transported'
  | 'received'
  | 'valorized'
  | 'rejected';

export type SyncState = 'pending' | 'syncing' | 'synced' | 'error';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: MassekoRole;
  category?: UserCategory; // Catégorie socio-professionnelle (étudiant, professionnel, pêcheur...)
  organizationOrSchool?: string; // Nom de l'établissement, entreprise, coopérative ou ONG
  neighborhood: string; // e.g. "Côte Sauvage", "Tié-Tié", "Loandjili", "Mpita"
  points: number;
  levelName: string; // e.g. "Sentinelle", "Gardien du Littoral"
  avatarUrl?: string;
  schoolName?: string;
}

export interface WasteReport {
  id: string;
  authorId?: string;
  guestIdentifier?: string;
  latitude: number;
  longitude: number;
  locationName: string; // e.g. "Plage de la Côte Sauvage - Secteur 2"
  wasteType: WasteType;
  estimatedVolume: WasteVolume;
  estimatedWeightKg: number;
  actualWeightKg?: number;
  photoUrl: string;
  description: string;
  status: ReportStatus;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  turtleDangerLevel?: 'EXTRÊME (INGESTION/ÉTOUFFEMENT)' | 'HAUT (ENCHEVÊTREMENT)' | 'SÉCURISÉ';
  isNestingZone?: boolean; // Zone de ponte des tortues Luth & Olivier
  collectionType?: 'simple_tour' | 'turtle_nest' | 'urgent_intervention'; // Type de collecte (Tournée simple de récupération ou Zone de nid)
  duplicateOfId?: string;
  syncState: SyncState;
  createdAt: string;
  validatedAt?: string;
  collectedAt?: string;
}

export interface CollectionTour {
  id: string;
  collectorId: string;
  collectorName: string;
  status: 'planned' | 'in_progress' | 'completed';
  reportIds: string[];
  totalEstimatedWeightKg: number;
  totalActualWeightKg: number;
  optimizedDistanceKm: number;
  createdAt: string;
  completedAt?: string;
}

export interface WasteLot {
  id: string; // e.g. "MASSEKO-2026-000127"
  tourId: string;
  collectorId: string;
  collectorName: string;
  recyclerId?: string;
  recyclerName?: string;
  actualWeightKg: number;
  wasteType: WasteType;
  originDescription: string;
  status: 'created' | 'transported' | 'received' | 'valorized';
  valorizationType?: 'mechanical_recycling' | 'reuse' | 'transformation' | 'other';
  qrCodeUrl: string;
  createdAt: string;
  receivedAt?: string;
  valorizedAt?: string;
}

export interface TraceabilityEvent {
  id: string;
  lotId: string;
  eventType: 'reported' | 'validated' | 'assigned' | 'collected' | 'weighed' | 'transported' | 'received' | 'valorized';
  actorName: string;
  actorRole: MassekoRole;
  timestamp: string;
  latitude: number;
  longitude: number;
  details: string;
  photoUrl?: string;
}

export interface RecyclerPartner {
  id: string;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  capacityTonPerMonth: number;
  valorizationTypes: string[];
  contactPhone: string;
}

export interface MassekoKPIs {
  totalKgCollected: number;
  cleanedZonesCount: number;
  totalReportsCount: number;
  valorizedLotsCount: number;
  activeCollectorsCount: number;
  partnerRecyclersCount: number;
  co2AvoidedKg: number;
  avgTimeToCleanDays: number;
  valorizationRatePercent: number;
  protectedTurtleNestsCount: number; // Nids de tortues sauvés / sécurisés
  estimatedTurtlesSaved: number; // Tortues marines préservées du plastique
}
export type KobaKPIs = MassekoKPIs;

export interface UserNotification {
  id: string;
  reportId?: string;
  type: 'collected' | 'reported' | 'bonus' | 'nest_protected';
  title: string;
  message: string;
  locationName?: string;
  weightKg?: number;
  pointsEarned?: number;
  timestamp: string;
  isRead: boolean;
}
