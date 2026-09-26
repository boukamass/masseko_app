export interface RoadmapStage {
  step: number;
  title: string;
  description: string;
  deliverables: string[];
  validationCriteria: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export const kobaImplementationRoadmap: RoadmapStage[] = [
  {
    step: 1,
    title: "Étape 1 — Architecture, Schéma DB Supabase & PowerSync",
    description: "Mise en place de l'arborescence modulaire Flutter, pubspec.yaml, extensions PostGIS, tables PostgreSQL, politiques RLS, règles PowerSync et modèles Dart.",
    deliverables: [
      "Architecture Flutter sous lib/ (Core, Data, Features, Widgets)",
      "Configuration pubspec.yaml avec PowerSync, Google Maps, Geolocator, QR Code",
      "Schéma SQL Supabase complet avec PostGIS + Fonctions spatiales",
      "Politiques Row Level Security (RLS) pour 7 rôles et invités",
      "Règles de synchronisation PowerSync (powersync.yaml & SQLite schema)",
      "Modèles de données Dart strongly typed avec adaptateurs SQLite"
    ],
    validationCriteria: "Validation de la structure par l'utilisateur avant le lancement de l'Étape 2.",
    status: 'completed'
  },
  {
    step: 2,
    title: "Étape 2 — Charte Graphique, Navigation & Auth/Invité",
    description: "Implémentation du thème Masseko (Deep Ocean Blue #0A3D62, Turquoise #1BA9C5, Fixora Cream & Forest), du routeur de navigation réactif, de l'onboarding en 3 étapes et du mode invité immédiat.",
    deliverables: [
      "ThemeData Flutter avec contrastes élevés pour terrain et fort ensoleillement",
      "Onboarding interactif en 3 étapes avec illustrations littoral & bouton COMMENCER",
      "Authentification Supabase Auth + Mode Invité instantané sans compte obligatoire"
    ],
    validationCriteria: "Navigation fluide, accès immédiat au signalement sans blocage d'inscription.",
    status: 'completed'
  },
  {
    step: 3,
    title: "Étape 3 — Moteur Offline-First PowerSync & SyncStatusBadge",
    description: "Connexion du service PowerSync avec SQLite local, gestion des transactions offline-first, file d'attente des photos et badge de synchronisation.",
    deliverables: [
      "Single-instance PowerSyncDatabase avec schéma SQLite miroir",
      "Composant réutilisable SyncStatusBadge (En attente / Synchronisation / Synchronisé)",
      "OfflinePhotoQueueService pour téléversement automatique des photos dès reconnexion"
    ],
    validationCriteria: "Ajout et modification de signalement 100% fonctionnels en mode avion.",
    status: 'completed'
  },
  {
    step: 4,
    title: "Étape 4 — Cartographie Interactive & Formulaire de Signalement",
    description: "Intégration de Google Maps avec clustering, hotspots de pollution à Pointe-Noire, géolocalisation GPS et formulaire de signalement en 5 étapes rapides.",
    deliverables: [
      "Carte Google Maps interactive avec filtres par statut (À valider, Prioritaires, Collectés, Nids de Tortues)",
      "Visualisation des hotspots de pollution sur Pointe-Noire (Côte Sauvage, Songolo, Djeno, Mvassa)",
      "Formulaire de signalement photo + GPS + pictogrammes plastiques + Priority Score (0-100)"
    ],
    validationCriteria: "Prise de photo GPS + calcul automatique du priority score (1 à 100).",
    status: 'completed'
  },
  {
    step: 5,
    title: "Étape 5 — Espace Collecteur & Optimisation des Tournées",
    description: "Interface dédiée au collecteur de terrain, liste des points optimisés, itinéraire conseillé et module de preuve de collecte avec pesée réelle.",
    deliverables: [
      "Écran 'Ma tournée du jour' avec carte des points et barre de progression (ex: 2/5 Points Collectés)",
      "Algorithme d'optimisation de tournée (Nearest Neighbor + Priority Score)",
      "Validation de collecte avec photo de preuve + saisie du poids réel en kg avec horodatage immuable"
    ],
    validationCriteria: "Conversion de l'estimation initiale en poids réel mesuré immuable.",
    status: 'completed'
  },
  {
    step: 6,
    title: "Étape 6 — Traçabilité, Lots Masseko & Scanner QR Code",
    description: "Création automatique des lots de déchets plastiques (MASSEKO-2026-XXXXXX), génération de QR Code, scanner mobile et timeline d'événements immuables.",
    deliverables: [
      "Générateur de Lot unique avec identifiant MASSEKO-2026-XXXXXX et QR Code vectoriel",
      "Module Scanner QR Code interactif pour les recycleurs partenaires (Congo Plastic Eco-Recycling)",
      "Timeline de traçabilité complète immuable: Origine (Côte Sauvage) -> Signalement -> Pesée -> Valorisation"
    ],
    validationCriteria: "Le scan du QR Code affiche instantanément la fiche publique du lot.",
    status: 'completed'
  },
  {
    step: 7,
    title: "Étape 7 — Tableau de Bord d'Impact, Gamification & Écoles",
    description: "Dashboard analytique (Kg collectés, CO₂ évité, Time to Clean, Taux de valorisation %), système de points, niveaux, badges et challenge des écoles.",
    deliverables: [
      "KPIs stratégiques: 1 485.5 kg collectés, 3 119.5 kg CO₂ évité, 382 tortues sauvées, 84.6% valorisation",
      "Système de gamification (Rang Gardien du Littoral, 1 250 PTS, Badges Luth/Nids/Mvassa)",
      "Challenge Inter-Écoles de Pointe-Noire (Lycée Augagneur, Collège Mayoch, Lycée Poaty Bernard, Primaire Mvassa)"
    ],
    validationCriteria: "Mise à jour en temps réel des graphiques lors des pesées réelles.",
    status: 'completed'
  },
  {
    step: 8,
    title: "Étape 8 — Mode Démo Hackathon, Tests & Polissage final",
    description: "Création du mode démo guidé hors-ligne pour le jury (50 signalements réalistes sur Pointe-Noire), tests d'intégration et préparation du build Android bundle.",
    deliverables: [
      "Bouton 'DÉMO GUIDÉE' permettant de présenter la chaîne complète en 3 minutes sans réseau",
      "Jeu de données fictif crédible Pointe-Noire (Côte Sauvage, Port de Pêche, Marché Tié-Tié)",
      "Guide complet README, documentation d'installation et checklist Google Play Store"
    ],
    validationCriteria: "Démonstration d'une fluidité parfaite sans dépendance réseau.",
    status: 'completed'
  },
];
