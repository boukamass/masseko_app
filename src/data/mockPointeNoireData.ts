import { WasteReport, CollectionTour, WasteLot, RecyclerPartner, MassekoKPIs, UserProfile, UserCategory, UserCategoryDefinition } from '../types/koba';

export const mockReports: WasteReport[] = [
  {
    id: 'rep-pn-001',
    authorId: 'user-001',
    locationName: 'Plage Côte Sauvage - Zone de Ponte Luth (Pointe-Noire)',
    latitude: -4.7985,
    longitude: 11.8290,
    wasteType: 'plastic_bottle',
    estimatedVolume: 'large',
    estimatedWeightKg: 45.0,
    actualWeightKg: 48.5,
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    description: 'Bouteilles d’eau et emballages plastique ramenés par la marée sur la plage de ponte des Tortues Luth (Djeno / Côte Sauvage).',
    status: 'collected',
    priorityScore: 88,
    priorityLevel: 'CRITIQUE',
    turtleDangerLevel: 'EXTRÊME (INGESTION/ÉTOUFFEMENT)',
    isNestingZone: true,
    collectionType: 'turtle_nest',
    syncState: 'synced',
    createdAt: '2026-09-14T08:30:00Z',
    validatedAt: '2026-09-14T09:00:00Z',
    collectedAt: '2026-09-14T14:15:00Z',
  },
  {
    id: 'rep-pn-002',
    authorId: 'user-002',
    locationName: 'Embouchure Rivière Songolo (Zone Tortues Olivier)',
    latitude: -4.7720,
    longitude: 11.8540,
    wasteType: 'fishing_net',
    estimatedVolume: 'very_large',
    estimatedWeightKg: 120.0,
    actualWeightKg: 135.0,
    photoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    description: 'Ancien filet de pêche synthétique "fantôme" piégeant les tortues marines cherchant à gagner le rivage.',
    status: 'valorized',
    priorityScore: 95,
    priorityLevel: 'CRITIQUE',
    turtleDangerLevel: 'HAUT (ENCHEVÊTREMENT)',
    isNestingZone: true,
    collectionType: 'turtle_nest',
    syncState: 'synced',
    createdAt: '2026-09-13T10:15:00Z',
    validatedAt: '2026-09-13T11:00:00Z',
    collectedAt: '2026-09-13T16:00:00Z',
  },
  {
    id: 'rep-pn-003',
    authorId: 'user-003',
    locationName: 'Plage de Djeno - Littoral Sud (Accès Nids)',
    latitude: -4.7645,
    longitude: 11.8890,
    wasteType: 'plastic_bag',
    estimatedVolume: 'medium',
    estimatedWeightKg: 25.0,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    description: 'Sacs plastiques transparents dérivant en bord de plage, souvent confondus avec des méduses par les tortues.',
    status: 'assigned',
    priorityScore: 92,
    priorityLevel: 'CRITIQUE',
    turtleDangerLevel: 'EXTRÊME (INGESTION/ÉTOUFFEMENT)',
    isNestingZone: true,
    collectionType: 'turtle_nest',
    syncState: 'synced',
    createdAt: '2026-09-15T06:10:00Z',
    validatedAt: '2026-09-15T07:00:00Z',
  },
  {
    id: 'rep-pn-004',
    authorId: undefined,
    guestIdentifier: 'guest-pn-9823',
    locationName: 'Plage Mvassa (Zone Archipel Tortues)',
    latitude: -4.7510,
    longitude: 11.8670,
    wasteType: 'mixed_plastic',
    estimatedVolume: 'medium',
    estimatedWeightKg: 18.0,
    photoUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=800&q=80',
    description: 'Signalement invité : canal et haut de plage encombrés de débris plastiques obstruant la frayère.',
    status: 'pending_validation',
    priorityScore: 78,
    priorityLevel: 'HAUTE',
    turtleDangerLevel: 'HAUT (ENCHEVÊTREMENT)',
    isNestingZone: true,
    collectionType: 'turtle_nest',
    syncState: 'pending',
    createdAt: '2026-09-15T07:45:00Z',
  },
  {
    id: 'rep-pn-005',
    authorId: 'user-004',
    locationName: 'Port de Pêche de Pointe-Noire (Bordure Roches)',
    latitude: -4.7870,
    longitude: 11.8380,
    wasteType: 'fishing_gear',
    estimatedVolume: 'large',
    estimatedWeightKg: 65.0,
    photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Cordages en polypropylène et casiers abandonnés près du bord de quai. Facilement récupérable.',
    status: 'validated',
    priorityScore: 85,
    priorityLevel: 'CRITIQUE',
    isNestingZone: false,
    collectionType: 'simple_tour',
    syncState: 'synced',
    createdAt: '2026-09-15T05:20:00Z',
    validatedAt: '2026-09-15T06:00:00Z',
  },
  {
    id: 'rep-pn-006',
    authorId: 'user-001',
    locationName: 'Avenue Côte Sauvage (Axe Hôtelier)',
    latitude: -4.7890,
    longitude: 11.8310,
    wasteType: 'plastic_bottle',
    estimatedVolume: 'medium',
    estimatedWeightKg: 32.0,
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    description: 'Déchet simple : Amas de bouteilles PET en bordure d’accès plage. Ramassage direct recommandé lors de la tournée ordinaire.',
    status: 'reported',
    priorityScore: 62,
    priorityLevel: 'HAUTE',
    isNestingZone: false,
    collectionType: 'simple_tour',
    syncState: 'synced',
    createdAt: '2026-09-15T08:15:00Z',
  },
  {
    id: 'rep-pn-007',
    authorId: 'user-003',
    locationName: 'Point d\'Apport Débarcadère Songolo',
    latitude: -4.7750,
    longitude: 11.8490,
    wasteType: 'mixed_plastic',
    estimatedVolume: 'large',
    estimatedWeightKg: 52.0,
    photoUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=800&q=80',
    description: 'Déchet simple : Sacs de plastiques triés et rassemblés par les pêcheurs. Prêt à être enlevé par le tricycle de tournée.',
    status: 'validated',
    priorityScore: 70,
    priorityLevel: 'HAUTE',
    isNestingZone: false,
    collectionType: 'simple_tour',
    syncState: 'synced',
    createdAt: '2026-09-15T09:00:00Z',
    validatedAt: '2026-09-15T09:30:00Z',
  },
  {
    id: 'rep-pn-008',
    authorId: 'user-002',
    locationName: 'Rond-Point Tié-Tié & Canal Marché',
    latitude: -4.7850,
    longitude: 11.8720,
    wasteType: 'plastic_bag',
    estimatedVolume: 'small',
    estimatedWeightKg: 14.0,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    description: 'Déchet simple : Dépôt sauvage de emballages plastiques le long du trottoir, passage benne municipal très facile.',
    status: 'reported',
    priorityScore: 45,
    priorityLevel: 'MOYENNE',
    isNestingZone: false,
    collectionType: 'simple_tour',
    syncState: 'synced',
    createdAt: '2026-09-15T10:10:00Z',
  }
];

export const mockTours: CollectionTour[] = [
  {
    id: 'tour-pn-101',
    collectorId: 'coll-01',
    collectorName: 'Jean-Baptiste Mabiala (Collecteur Masseko)',
    status: 'in_progress',
    reportIds: ['rep-pn-003', 'rep-pn-005', 'rep-pn-004'],
    totalEstimatedWeightKg: 108.0,
    totalActualWeightKg: 48.5,
    optimizedDistanceKm: 8.4,
    createdAt: '2026-09-15T07:00:00Z',
  }
];

export const mockLots: WasteLot[] = [
  {
    id: 'MASSEKO-2026-000127',
    tourId: 'tour-pn-100',
    collectorId: 'coll-01',
    collectorName: 'Jean-Baptiste Mabiala',
    recyclerId: 'rec-01',
    recyclerName: 'Congo Plastic Eco-Recycling (Loandjili)',
    actualWeightKg: 183.5,
    wasteType: 'plastic_bottle',
    originDescription: 'Littoral Côte Sauvage & Embouchure Songolo',
    status: 'valorized',
    valorizationType: 'mechanical_recycling',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MASSEKO-2026-000127',
    createdAt: '2026-09-14T15:00:00Z',
    receivedAt: '2026-09-14T17:30:00Z',
    valorizedAt: '2026-09-15T08:00:00Z',
  }
];

export const mockRecyclers: RecyclerPartner[] = [
  {
    id: 'rec-01',
    name: 'Congo Plastic Eco-Recycling (Loandjili)',
    locationName: 'Zone Industrielle Loandjili, Pointe-Noire',
    latitude: -4.7420,
    longitude: 11.8750,
    capacityTonPerMonth: 85.0,
    valorizationTypes: ['Broyage PET', 'Granulés PEHD', 'Pavés en plastique'],
    contactPhone: '+242 06 600 00 00',
  },
  {
    id: 'rec-02',
    name: 'Clean Ocean Tech Congo (Mpita)',
    locationName: 'Avenue Moe Vangoula, Mpita',
    latitude: -4.7790,
    longitude: 11.8620,
    capacityTonPerMonth: 45.0,
    valorizationTypes: ['Réutilisation filet', 'Fils extrudés'],
    contactPhone: '+242 05 555 11 22',
  },
  {
    id: 'rec-03',
    name: 'TotalEnergies E&P Congo Valorisation (Djeno)',
    locationName: 'Centre de Tri Environnemental Djeno',
    latitude: -4.7640,
    longitude: 11.8880,
    capacityTonPerMonth: 120.0,
    valorizationTypes: ['Tri sélectif industriel', 'Valorisation énergétique & mécanique'],
    contactPhone: '+242 06 999 44 33',
  },
  {
    id: 'rec-04',
    name: 'Atelier Municipal de Pavage Écologique (Tié-Tié)',
    locationName: 'Quartier Fond Tié-Tié, Arrondissement 3',
    latitude: -4.7850,
    longitude: 11.8720,
    capacityTonPerMonth: 30.0,
    valorizationTypes: ['Pavés écologiques', 'Dalles de construction recyclées'],
    contactPhone: '+242 05 678 90 12',
  },
  {
    id: 'rec-05',
    name: 'Coopérative Féminine de Valorisation Plastique (Songolo)',
    locationName: 'Débarcadère Pirogues Songolo',
    latitude: -4.7740,
    longitude: 11.8510,
    capacityTonPerMonth: 18.0,
    valorizationTypes: ['Collecte artisanale', 'Lavage & Pré-compactage PET'],
    contactPhone: '+242 06 432 10 98',
  }
];

export interface RealCoastalSite {
  id: string;
  name: string;
  sector: string;
  latitude: number;
  longitude: number;
  turtleSpecies: string;
  isNestingZone: boolean;
  threatLevel: 'CRITIQUE' | 'HAUTE' | 'MODÉRÉE';
  description: string;
}

export const POINTE_NOIRE_COASTAL_SITES: RealCoastalSite[] = [
  {
    id: 'site-cote-sauvage-phare',
    name: 'Plage Côte Sauvage (Secteur Phare - Sanctuaire Luth)',
    sector: 'Côte Sauvage & Centre',
    latitude: -4.7985,
    longitude: 11.8290,
    turtleSpecies: 'Tortue Luth (Dermochelys coriacea)',
    isNestingZone: true,
    threatLevel: 'CRITIQUE',
    description: 'Bande d’estran sableux de 6 km, principale zone de ponte des Tortues Luth à Pointe-Noire sous suivi des éco-gardes locaux.'
  },
  {
    id: 'site-cote-sauvage-pyramide',
    name: 'Plage Côte Sauvage (Secteur Pyramide / Mondaine)',
    sector: 'Côte Sauvage & Centre',
    latitude: -4.7890,
    longitude: 11.8310,
    turtleSpecies: 'Tortue Luth & Tortue Verte',
    isNestingZone: true,
    threatLevel: 'HAUTE',
    description: 'Zone de forte fréquentation citoyenne le week-end, accumulation de bouteilles PET et emballages.'
  },
  {
    id: 'site-djeno-frayere',
    name: 'Plage de Djeno (Littoral Sud - Nids Tortues Olivier)',
    sector: 'Littoral Sud & Djeno',
    latitude: -4.7645,
    longitude: 11.8890,
    turtleSpecies: 'Tortue Olivier (Lepidochelys olivacea)',
    isNestingZone: true,
    threatLevel: 'CRITIQUE',
    description: 'Plage sauvage isolée au sud de la ville, zone d’émergence massive de nouveau-nés tortues olivâtres.'
  },
  {
    id: 'site-mvassa-sanctuaire',
    name: 'Plage de Mvassa (Littoral Sud - Réserve Communautaire)',
    sector: 'Littoral Sud & Djeno',
    latitude: -4.7510,
    longitude: 11.8670,
    turtleSpecies: 'Tortue Olivier & Tortue Luth',
    isNestingZone: true,
    threatLevel: 'CRITIQUE',
    description: 'Village côtier engagé avec les éco-gardes pour la surveillance nocturne des pontes.'
  },
  {
    id: 'site-songolo-estuaire',
    name: 'Embouchure Rivière Songolo (Estuaire & Mangrove)',
    sector: 'Songolo & Estuaires',
    latitude: -4.7720,
    longitude: 11.8540,
    turtleSpecies: 'Tortue Verte (Chelonia mydas) - Frayère juvéniles',
    isNestingZone: true,
    threatLevel: 'CRITIQUE',
    description: 'Point de déversement fluvial majeur charriant des macro-déchets plastiques directement sur la plage.'
  },
  {
    id: 'site-tchinouka-embouchure',
    name: 'Embouchure Rivière Tchinouka (Zone Centre Urbain)',
    sector: 'Songolo & Estuaires',
    latitude: -4.7830,
    longitude: 11.8420,
    turtleSpecies: 'Passage marin & estuaire',
    isNestingZone: false,
    threatLevel: 'HAUTE',
    description: 'Canal d’évacuation urbain de Pointe-Noire, retenue de sacs plastiques avant dispersion en mer.'
  },
  {
    id: 'site-songolo-port-peche',
    name: 'Port des Pêcheurs de Songolo (Débarcadère Pirogues)',
    sector: 'Zones Portuaires & Pêche',
    latitude: -4.7750,
    longitude: 11.8490,
    turtleSpecies: 'Zone à risque d’enchevêtrement',
    isNestingZone: false,
    threatLevel: 'HAUTE',
    description: 'Débarcadère artisanal avec présence fréquente de filets de pêche synthétiques usagés (filets fantômes).'
  },
  {
    id: 'site-port-autonome',
    name: 'Port Autonome de Pointe-Noire (Digue Océane & Quai)',
    sector: 'Zones Portuaires & Pêche',
    latitude: -4.7870,
    longitude: 11.8380,
    turtleSpecies: 'Zone de transit océanique',
    isNestingZone: false,
    threatLevel: 'MODÉRÉE',
    description: 'Zone portuaire industrielle profonde protégée par la digue extérieure.'
  },
  {
    id: 'site-pointe-indienne',
    name: 'Plage de Pointe-Indienne (Estran Récifal & Baie Nord)',
    sector: 'Littoral Nord & Kouilou',
    latitude: -4.7120,
    longitude: 11.8150,
    turtleSpecies: 'Tortue Imbriquée & Tortue Verte',
    isNestingZone: true,
    threatLevel: 'HAUTE',
    description: 'Récifs coralliens et platiers rocheux au nord de Pointe-Noire, zone de nourrissage des tortues.'
  },
  {
    id: 'site-baie-loango',
    name: 'Baie de Loango (Falaises de Diosso & Frayères)',
    sector: 'Littoral Nord & Kouilou',
    latitude: -4.6530,
    longitude: 11.8240,
    turtleSpecies: 'Tortue Luth (Dermochelys coriacea)',
    isNestingZone: true,
    threatLevel: 'CRITIQUE',
    description: 'Site historique et naturel d’importance internationale pour la ponte des tortues luth.'
  },
  {
    id: 'site-matombi',
    name: 'Plage de Matombi (Littoral Nord Kouilou)',
    sector: 'Littoral Nord & Kouilou',
    latitude: -4.6210,
    longitude: 11.8110,
    turtleSpecies: 'Tortue Olivier & Tortue Luth',
    isNestingZone: true,
    threatLevel: 'HAUTE',
    description: 'Plage vierge bordée de savane côtière et lagunes saumâtres.'
  },
  {
    id: 'site-conkouati',
    name: 'Réserve Nationale de Conkouati-Douli (Parc Marin)',
    sector: 'Aires Marines Protégées',
    latitude: -3.9820,
    longitude: 11.2850,
    turtleSpecies: 'Sanctuaire Intégral Luth & Olivier',
    isNestingZone: true,
    threatLevel: 'CRITIQUE',
    description: 'Parc national transfrontalier hébergeant la plus forte densité de nids de tortues de la sous-région.'
  },
  {
    id: 'site-ngoyo-plage',
    name: 'Plage de Ngoyo (Bordure Côtière Sud & Chenal)',
    sector: 'Littoral Sud & Djeno',
    latitude: -4.8120,
    longitude: 11.8630,
    turtleSpecies: 'Tortue Luth',
    isNestingZone: true,
    threatLevel: 'HAUTE',
    description: 'Accès sablonneux bordant les quartiers résidentiels sud de Pointe-Noire.'
  }
];

export interface RealTurtleThreat {
  id: string;
  label: string;
  shortLabel: string;
  dangerLevel: 'EXTRÊME' | 'HAUT' | 'MODÉRÉ';
  impactDescription: string;
  speciesConcerned: string;
}

export const REAL_TURTLE_THREATS: RealTurtleThreat[] = [
  {
    id: 'ingestion_plastic_bags',
    label: 'Ingestion létale de films & sacs plastiques (Confusion méduses)',
    shortLabel: 'Ingestion Mortelle (Sacs plastiques)',
    dangerLevel: 'EXTRÊME',
    impactDescription: 'Les Tortues Luth confondent les sacs transparents avec leur proie exclusive (méduses), provoquant occlusion digestive et mort par étouffement.',
    speciesConcerned: 'Tortue Luth (Dermochelys coriacea)'
  },
  {
    id: 'entanglement_ghost_nets',
    label: 'Enchevêtrement mortel dans filets fantômes & cordages synthétiques abandonnés',
    shortLabel: 'Enchevêtrement (Filets fantômes / Lignes)',
    dangerLevel: 'EXTRÊME',
    impactDescription: 'Les filets dérivants piègent les nageoires des tortues adultes et nouveau-nés, les empêchant de remonter respirer en surface.',
    speciesConcerned: 'Toutes espèces (Luth, Olivier, Verte)'
  },
  {
    id: 'physical_obstacle_nesting',
    label: 'Obstacle physique majeur sur l’estran bloquant la montée des femelles pondeuses',
    shortLabel: 'Obstacle Physique Frayère (Montée Estran)',
    dangerLevel: 'HAUT',
    impactDescription: 'Les amas de bidons et débris empêchent les tortues de creuser leurs nids au-dessus de la ligne de haute marée.',
    speciesConcerned: 'Femelles pondeuses Luth & Olivier'
  },
  {
    id: 'hatchling_trapping',
    label: 'Blocage & piégeage des nouveau-nés lors de la course nocturne vers l’océan',
    shortLabel: 'Piège Nouveau-nés (Course vers Mer)',
    dangerLevel: 'EXTRÊME',
    impactDescription: 'Les bébés tortues restent coincés dans les bouteilles et contenants plastiques et périssent déshydratés avant l’aube.',
    speciesConcerned: 'Nouveau-nés émergents'
  },
  {
    id: 'microplastics_sand_heating',
    label: 'Contamination microplastiques & modification thermique du sable des nids',
    shortLabel: 'Contamination & Surchauffe Sable Nids',
    dangerLevel: 'HAUT',
    impactDescription: 'Les micro-fragments altèrent la perméabilité et la température du sable, faussant le ratio sexuel des embryons.',
    speciesConcerned: 'Incubation des œufs'
  },
  {
    id: 'chemical_toxicity_containers',
    label: 'Risque d’intoxication chimique par bidons d’hydrocarbures & solvants PEHD',
    shortLabel: 'Intoxication Chimique (Bidons & Solvants)',
    dangerLevel: 'HAUT',
    impactDescription: 'Fuite de résidus toxiques dans les eaux littorales et les zones estuaires de frayères.',
    speciesConcerned: 'Faune marine & Tortues juvéniles'
  },
  {
    id: 'predation_barrier',
    label: 'Aggravation de la prédation par enclavement dans les laisses de mer plastifiées',
    shortLabel: 'Vulnérabilité Prédation (Chiens / Crabes)',
    dangerLevel: 'MODÉRÉ',
    impactDescription: 'Ralentissement des déplacements exposant les tortues aux prédateurs terrestres.',
    speciesConcerned: 'Nouveau-nés et juvéniles'
  }
];

export interface RealCollectionRoute {
  id: string;
  code: string;
  name: string;
  driverName: string;
  vehicleType: string;
  zone: string;
  distanceKm: number;
  stopsCount: number;
  priorityLevel: 'CRITIQUE' | 'HAUTE' | 'STANDARD';
}

export const REAL_COLLECTION_ROUTES: RealCollectionRoute[] = [
  {
    id: 'route-pn-101',
    code: 'TOUR-PN-101',
    name: 'Côte Sauvage & Songolo (Priorité Sanctuaire Nids Luth)',
    driverName: 'Jean-Baptiste Mabiala',
    vehicleType: 'Camion Benne Écologique 3.5T',
    zone: 'Secteur Ouest / Phare',
    distanceKm: 8.4,
    stopsCount: 5,
    priorityLevel: 'CRITIQUE'
  },
  {
    id: 'route-pn-102',
    code: 'TOUR-PN-102',
    name: 'Djeno Littoral & Mvassa (Frayères Tortues Olivier Sud)',
    driverName: 'Alphonse Tchicaya',
    vehicleType: 'Tricycle Tout-Terrain 800 kg',
    zone: 'Secteur Sud Littoral',
    distanceKm: 12.1,
    stopsCount: 6,
    priorityLevel: 'CRITIQUE'
  },
  {
    id: 'route-pn-103',
    code: 'TOUR-PN-103',
    name: 'Port de Pêche Artisanal & Rivière Tchinouka',
    driverName: 'Patrick Moukala',
    vehicleType: 'Tricycle Électrique Benne',
    zone: 'Secteur Centre / Port',
    distanceKm: 6.8,
    stopsCount: 4,
    priorityLevel: 'HAUTE'
  },
  {
    id: 'route-pn-104',
    code: 'TOUR-PN-104',
    name: 'Pointe-Indienne & Baie de Loango (Estran Nord & Échouages)',
    driverName: 'Gervais Loembe',
    vehicleType: 'Véhicule 4x4 Plateau d’Intervention',
    zone: 'Secteur Nord Kouilou',
    distanceKm: 15.3,
    stopsCount: 7,
    priorityLevel: 'HAUTE'
  },
  {
    id: 'route-pn-105',
    code: 'TOUR-PN-105',
    name: 'Ngoyo Côtière & Plage Mondaine (Urgence Marée Haute)',
    driverName: 'Christian Makosso',
    vehicleType: 'Tricycle Cargo de Ramassage',
    zone: 'Secteur Sud Urbain',
    distanceKm: 9.2,
    stopsCount: 4,
    priorityLevel: 'STANDARD'
  }
];

export interface RealImpactCampaign {
  id: string;
  title: string;
  partner: string;
  season: string;
  targetObjectiveKg: number;
  actualAchievedKg: number;
}

export const REAL_IMPACT_CAMPAIGNS: RealImpactCampaign[] = [
  {
    id: 'camp-2026-ponte',
    title: 'Saison de Ponte 2026 : Zéro Plastique sur les Nids Luth',
    partner: 'Collectif Littoral & Éco-Gardes Côtiers',
    season: 'Octobre 2025 – Avril 2026',
    targetObjectiveKg: 5000,
    actualAchievedKg: 3840
  },
  {
    id: 'camp-2026-ecoles',
    title: 'Challenge Inter-Écoles & Universités de Pointe-Noire 2026',
    partner: 'Ministère de l’Économie Forestière & Mairie de Pointe-Noire',
    season: 'Février – Juin 2026',
    targetObjectiveKg: 2500,
    actualAchievedKg: 1895
  },
  {
    id: 'camp-2025-songolo',
    title: 'Campagne Estuaire Propre Songolo-Tchinouka',
    partner: 'Programme Régional Environnement & Littoral',
    season: 'Septembre – Décembre 2025',
    targetObjectiveKg: 3000,
    actualAchievedKg: 3120
  },
  {
    id: 'camp-2025-pecheurs',
    title: 'Opération Filets Fantômes & Éco-Gardiens de la Mer',
    partner: 'Groupements de Pêcheurs de Songolo & Mpita',
    season: 'Année 2025-2026',
    targetObjectiveKg: 1500,
    actualAchievedKg: 1420
  }
];

export const mockKPIs: MassekoKPIs = {
  totalKgCollected: 1485.5,
  cleanedZonesCount: 42,
  totalReportsCount: 68,
  valorizedLotsCount: 29,
  activeCollectorsCount: 12,
  partnerRecyclersCount: 5,
  co2AvoidedKg: 3119.55,
  avgTimeToCleanDays: 2.1,
  valorizationRatePercent: 84.6,
  protectedTurtleNestsCount: 148,
  estimatedTurtlesSaved: 382,
};

export const POINTE_NOIRE_NEIGHBORHOODS: string[] = [
  'Côte Sauvage (Sanctuaire)',
  'Songolo & Estuaire',
  'Mpita & Port de Pêche',
  'Tié-Tié (Arrondissement 3)',
  'Loandjili (Zone Industrielle)',
  'Lumumba (Centre-Ville)',
  'Mvou-Mvou (Arrondissement 2)',
  'Ngoyo (Littoral Sud)',
  'Djeno (Frayère Luth)',
  'Pointe-Indienne & Kouilou',
];

export const USER_CATEGORIES_DEFINITIONS: UserCategoryDefinition[] = [
  {
    id: 'student',
    label: 'Élève / Étudiant (Lycée, Université)',
    shortLabel: 'Étudiant / Élève',
    badge: '🎓 Scolaire & Universitaire',
    iconName: 'GraduationCap',
    description: 'Jeunesse scolarisée ou universitaire participant aux challenges inter-établissements et sorties éducatives.',
    analysisUtility: 'Mesure la pénétration de l’éducation environnementale, le taux de mobilisation de la jeunesse et l’impact des défis scolaires.',
    organizationLabel: 'Établissement scolaire ou universitaire',
    organizationPlaceholder: 'Ex: Lycée Victor Augagneur, EST-Littoral, Univ. Marien Ngouabi...',
  },
  {
    id: 'coastal_pro',
    label: 'Professionnel du Littoral / Entreprise / Tourisme',
    shortLabel: 'Professionnel / Entreprise',
    badge: '💼 Professionnel Littoral',
    iconName: 'Briefcase',
    description: 'Gérant ou employé d’hôtel, restaurant de plage, club nautique, entreprise portuaire ou mécène RSE.',
    analysisUtility: 'Évalue la responsabilité sociétale (RSE) des commerces côtiers et la propreté des concessions privées et hôtelières.',
    organizationLabel: 'Entreprise, hôtel ou établissement',
    organizationPlaceholder: 'Ex: Hôtel Palm Beach, Restaurant Côte Sauvage, Bolloré/Congo Terminal...',
  },
  {
    id: 'fisherman',
    label: 'Pêcheur Artisanal / Mareyeur / Travailleur de la Mer',
    shortLabel: 'Pêcheur Artisanal',
    badge: '⚓ Travailleur de la Mer',
    iconName: 'Anchor',
    description: 'Pêcheurs côtiers en pirogue, mareyeurs et débarqueurs des sites de Songolo, Mpita et Djeno.',
    analysisUtility: 'Indicateur clé pour cartographier les filets fantômes dérivants, les captures accidentelles de tortues et les débris plastiques en mer.',
    organizationLabel: 'Port d’attache ou coopérative de pêche',
    organizationPlaceholder: 'Ex: Coopérative des Pêcheurs de Songolo, Débarcadère Port...',
  },
  {
    id: 'association_member',
    label: 'Membre ONG / Association Environnementale',
    shortLabel: 'Membre ONG / Écolo',
    badge: '🌱 ONG & Société Civile',
    iconName: 'HeartHandshake',
    description: 'Volontaires et permanents d’organisations de conservation (Renatura, associations locales de jeunesse).',
    analysisUtility: 'Quantifie le relais bénévole sur le terrain, la fiabilité des signalements et la couverture des patrouilles citoyennes.',
    organizationLabel: 'Nom de l’association ou ONG',
    organizationPlaceholder: 'Ex: Renatura Congo, Sentinelles du Littoral, Jeunesse Verte...',
  },
  {
    id: 'citizen',
    label: 'Citoyen & Résident Sentinelle',
    shortLabel: 'Citoyen Sentinelle',
    badge: '👤 Citoyen Sentinelle',
    iconName: 'User',
    description: 'Habitant des arrondissements de Pointe-Noire, promeneur régulier, famille profitant de la plage le weekend.',
    analysisUtility: 'Reflète la veille citoyenne spontanée, la propreté perçue des plages et l’appropriation publique du littoral.',
    organizationLabel: 'Quartier ou groupe citoyen (optionnel)',
    organizationPlaceholder: 'Ex: Collectif Citoyen Côte Sauvage...',
  },
  {
    id: 'municipal_agent',
    label: 'Agent Municipal / Salubrité Urbaine & Voirie',
    shortLabel: 'Agent Municipal / Collecteur',
    badge: '🚜 Brigade Salubrité',
    iconName: 'ShieldAlert',
    description: 'Personnel de la Mairie de Pointe-Noire, conducteurs de tricycles de voirie et agents d’hygiène publique.',
    analysisUtility: 'Permet d’analyser les délais de ramassage opérationnel, les tonnages évacués et les points noirs récurrents.',
    organizationLabel: 'Arrondissement / Direction Municipale',
    organizationPlaceholder: 'Ex: Direction Environnement & Salubrité Mairie Centrale...',
  },
  {
    id: 'scientist',
    label: 'Scientifique / Chercheur en Biologie Marine',
    shortLabel: 'Scientifique / Biologiste',
    badge: '🔬 Chercheur Marin',
    iconName: 'Compass',
    description: 'Universitaires, chercheurs en écologie marine, experts de la faune littorale et des tortues marines.',
    analysisUtility: 'Corrèle la présence des dépôts d’ordures avec les sites de ponte des tortues Luth & Olivier et la mortalité marine.',
    organizationLabel: 'Institut de recherche ou laboratoire',
    organizationPlaceholder: 'Ex: Centre de Recherches Océanographiques (CRO), IRSEN...',
  },
  {
    id: 'recycler',
    label: 'Industriel / Recycleur & Transformateur Plastique',
    shortLabel: 'Recycleur Plastique',
    badge: '♻️ Recycleur & Usine',
    iconName: 'Factory',
    description: 'Usines de broyage, transformateurs locaux de PET/PEHD et collecteurs industriels pour valorisation circulaire.',
    analysisUtility: 'Fournit la traçabilité de l’économie circulaire : taux de recyclage effectif, volume de balles broyées et valorisées.',
    organizationLabel: 'Usine ou atelier de recyclage',
    organizationPlaceholder: 'Ex: Congo Recyclage Plastique, Plast-Eco Pointe-Noire...',
  },
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-001',
    fullName: 'Jean-Marc Makosso',
    email: 'jean.marc@masseko-congo.org',
    phone: '+242 06 812 34 56',
    role: 'citizen',
    category: 'citizen',
    organizationOrSchool: 'Sentinelles Bénévoles Côte Sauvage',
    neighborhood: 'Côte Sauvage (Sanctuaire)',
    points: 380,
    levelName: 'Sentinelle Littoral Or',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user-002',
    fullName: 'Jean-Baptiste Mabiala',
    email: 'jb.mabiala@masseko-collecte.cg',
    phone: '+242 06 910 20 30',
    role: 'collector',
    category: 'municipal_agent',
    organizationOrSchool: 'Brigade Littorale Tricycle #3',
    neighborhood: 'Songolo & Estuaire',
    points: 520,
    levelName: 'Capitaine de Tournée Homologué',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user-003',
    fullName: 'Patrick Moukala',
    email: 'patrick.moukala@pecheurs-songolo.cg',
    phone: '+242 05 520 40 60',
    role: 'fisherman',
    category: 'fisherman',
    organizationOrSchool: 'Coopérative Artisanale de Songolo',
    neighborhood: 'Mpita & Port de Pêche',
    points: 410,
    levelName: 'Éco-Pêcheur & Gardien des Mers',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user-004',
    fullName: 'Mme Sylvie Tchicaya',
    email: 'sylvie.tchicaya@lycee-victor-augagneur.cg',
    phone: '+242 06 444 88 99',
    role: 'school',
    category: 'student',
    schoolName: 'Lycée Victor Augagneur',
    organizationOrSchool: 'Lycée Victor Augagneur (Club Éco)',
    neighborhood: 'Lumumba (Centre-Ville)',
    points: 680,
    levelName: 'Ambassadrice Challenge Jeunesse',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user-005',
    fullName: 'Dr. Gervais Loembe',
    email: 'gervais.loembe@masseko-congo.org',
    phone: '+242 06 700 80 90',
    role: 'admin',
    category: 'scientist',
    organizationOrSchool: 'Centre Océanographique & Renatura',
    neighborhood: 'Djeno (Frayère Luth)',
    points: 950,
    levelName: 'Chercheur en Écologie Marine',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user-006',
    fullName: 'Arnaud Koumba',
    email: 'a.koumba@palmbeach-hotel.cg',
    phone: '+242 05 600 11 22',
    role: 'citizen',
    category: 'coastal_pro',
    organizationOrSchool: 'Hôtel Palm Beach Côte Sauvage (RSE)',
    neighborhood: 'Côte Sauvage (Sanctuaire)',
    points: 290,
    levelName: 'Partenaire Hôtelier Éco-Responsable',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  }
];



