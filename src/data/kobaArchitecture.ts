export const flutterTreeStructure = `lib/
├── main.dart                          # Point d'entrée de l'application (Init PowerSync, Supabase, Theme)
├── core/
│   ├── constants/
│   │   ├── app_colors.dart            # Couleurs charte Masseko (#0A3D62 Deep Ocean Blue, #1BA9C5 Turquoise, Verts, Alertes)
│   │   ├── app_theme.dart             # ThemeData Flutter clair, gros touch targets, haute lisibilité
│   │   └── app_keys.dart              # Clés de configuration (Google Maps API, Supabase URL, PowerSync Endpoint)
│   ├── routing/
│   │   └── app_router.dart            # Navigation réactive (GoRouter ou Named Routes avec contrôles d'accès)
│   ├── errors/
│   │   ├── failure.dart               # Adaptateurs d'erreurs (Réseau, SQLite, Supabase, Permissions)
│   │   └── app_exception.dart
│   ├── services/
│   │   ├── powersync_service.dart     # Single-instance de PowerSync Database & Sync Engine
│   │   ├── location_service.dart      # Module Geolocator avec gestion haute précision & mode dégradé
│   │   ├── camera_service.dart        # Prise de photo offline & compression locale automatisée
│   │   ├── qr_service.dart            # Génération & Scan réactif de QR Code pour traçabilité de lot
│   │   └── priority_engine.dart       # Algorithme local de calcul du Priority Score Masseko
│   └── utils/
│       ├── formatters.dart            # Formateurs de date, poids en kg, badges de statut, CO2 évité
│       └── sync_status_badge.dart     # Composant réutilisable (Hors connexion / En attente / Synchronisé)
├── data/
│   ├── local/
│   │   ├── powersync_schema.dart      # Définition des tables SQLite miroirs PowerSync
│   │   └── offline_photo_queue.dart   # File d'attente d'upload des photos capturées hors-ligne
│   ├── remote/
│   │   ├── supabase_client.dart       # Client Supabase Auth & Storage (sans clés service_role)
│   │   └── waste_classification_service.dart# Service de validation et classification des types de polymères
│   ├── models/
│   │   ├── user_model.dart            # Modèle Utilisateur / Profil
│   │   ├── report_model.dart          # Modèle Signalement avec latitude/longitude & priority score
│   │   ├── tour_model.dart            # Modèle Tournée de collecte optimisée
│   │   ├── waste_lot_model.dart       # Modèle Lot traçable avec QR Code & Poids vérifié
│   │   ├── recycler_model.dart        # Modèle Recycleur partenaire
│   │   └── traceability_event_model.dart # Journal d'événements immuables
│   └── repositories/
│       ├── report_repository.dart     # Interface unifiée CRUD via PowerSync SQLite (Offline-First)
│       ├── tour_repository.dart       # Gestion des tournées de collecte
│       ├── lot_repository.dart        # Traçabilité des lots et QR Codes
│       └── auth_repository.dart       # Gestion Authentification & Mode Invité
├── features/
│   ├── onboarding/
│   │   └── presentation/pages/onboarding_page.dart # 3 écrans pédagogiques avec action "COMMENCER"
│   ├── auth/
│   │   └── presentation/pages/login_guest_page.dart # Auth Supabase + Mode Invité immédiat
│   ├── home/
│   │   └── presentation/pages/home_page.dart        # Dashboard principal ("Que voulez-vous faire ?")
│   ├── reports/
│   │   ├── presentation/pages/create_report_page.dart # Formulaire photo + GPS + types de plastiques
│   │   ├── presentation/pages/report_detail_page.dart # Vue détaillée + Timeline de traçabilité
│   │   └── presentation/widgets/report_card.dart
│   ├── map/
│   │   └── presentation/pages/masseko_map_page.dart     # Carte Google Maps interactive Pointe-Noire + Filtres + Hotspots
│   ├── collections/
│   │   ├── presentation/pages/collector_tour_page.dart# Espace Collecteur: Tournée optimisée & Preuve de collecte
│   │   └── presentation/pages/weighing_lot_page.dart  # Pesée réelle & Création de Lot Masseko
│   ├── traceability/
│   │   ├── presentation/pages/qr_scanner_page.dart    # Scanner de QR Code pour Recycleur / Public
│   │   └── presentation/pages/lot_history_page.dart   # Timeline complète: Origine -> Signalement -> Pesée -> Valorisation
│   ├── impact/
│   │   └── presentation/pages/impact_dashboard_page.dart # Dashboard d'impact: Kg, CO2, Time to Clean, Taux Valorisation
│   ├── gamification/
│   │   └── presentation/pages/leaderboard_page.dart   # Niveaux (Sentinelle, Gardien du Littoral), Badges & Défis Écoles
│   └── demo/
│       └── presentation/pages/guided_demo_page.dart   # Mode démonstration hors-ligne guidé pour le jury
└── widgets/
    ├── custom_button.dart
    ├── masseko_bottom_nav.dart
    └── status_pill.dart
`;

export const pubspecYamlContent = `name: masseko_app
description: "MASSEKO - Plateforme de terrain pour la collecte, traçabilité et valorisation des déchets plastiques à Pointe-Noire, Congo."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # --- OFFLINE-FIRST & DATABASE (MANDATORY) ---
  powersync: ^1.7.1
  powersync_flutter: ^1.10.0
  sqlite3: ^2.4.1
  supabase_flutter: ^2.3.4

  # --- CARTOGRAPHIE & GÉOLOCALISATION ---
  google_maps_flutter: ^2.5.3
  geolocator: ^10.1.0

  # --- MÉDIAS & PHOTOS OFFLINE ---
  image_picker: ^1.0.7
  cached_network_image: ^3.3.1
  path_provider: ^2.1.2

  # --- TRAÇABILITÉ & QR CODE ---
  qr_flutter: ^4.1.0
  mobile_scanner: ^5.0.0

  # --- DATA VISUALIZATION & CHARTS ---
  fl_chart: ^0.66.2

  # --- UTILS & NATIVE INTEGRATIONS ---
  intl: ^0.19.0
  uuid: ^4.3.3
  flutter_svg: ^2.0.10+1
  share_plus: ^8.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true

  assets:
    - assets/images/
    - assets/icons/
    - assets/demo_data/pointe_noire_hotspots.json
`;
