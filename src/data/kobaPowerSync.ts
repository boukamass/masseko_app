export const powerSyncYamlRules = `
# ====================================================================
# POWERSYNC SYNC RULES (powersync.yaml)
# Offline-first bi-directional sync rules between PostgreSQL and SQLite
# ====================================================================

bucket_definitions:
  # 1. GLOBAL BUCKET: Shared data needed offline (Reports, Recyclers, Schools)
  global_public_data:
    parameters: []
    data_queries:
      - SELECT * FROM public.reports WHERE status != 'rejected'
      - SELECT * FROM public.recyclers
      - SELECT * FROM public.schools
      - SELECT * FROM public.system_config
      - SELECT * FROM public.waste_lots
      - SELECT * FROM public.traceability_events

  # 2. USER BUCKET: User specific profile & data
  user_private_data:
    parameters:
      - SELECT auth.uid() as user_id
    data_queries:
      - SELECT * FROM public.profiles WHERE id = bucket.user_id
      - SELECT * FROM public.tours WHERE collector_id = bucket.user_id
      - SELECT ts.* FROM public.tour_stops ts INNER JOIN public.tours t ON ts.tour_id = t.id WHERE t.collector_id = bucket.user_id
`;

export const dartPowerSyncSchemaCode = `// lib/data/local/powersync_schema.dart
import 'package:powersync/powersync.dart';

const massekoSqliteSchema = Schema([
  Table('profiles', [
    Column.text('full_name'),
    Column.text('email'),
    Column.text('phone'),
    Column.text('role'),
    Column.text('neighborhood'),
    Column.integer('points'),
    Column.text('level_name'),
    Column.text('avatar_url'),
    Column.text('school_id'),
    Column.text('created_at'),
    Column.text('updated_at'),
  ]),
  Table('reports', [
    Column.text('author_id'),
    Column.text('guest_identifier'),
    Column.real('latitude'),
    Column.real('longitude'),
    Column.text('location_name'),
    Column.text('waste_type'),
    Column.text('estimated_volume'),
    Column.real('estimated_weight_kg'),
    Column.real('actual_weight_kg'),
    Column.text('photo_path'),
    Column.text('description'),
    Column.text('status'),
    Column.integer('priority_score'),
    Column.text('priority_level'),
    Column.text('duplicate_of_id'),
    Column.text('created_at'),
    Column.text('updated_at'),
    Column.text('validated_at'),
    Column.text('collected_at'),
  ]),
  Table('tours', [
    Column.text('collector_id'),
    Column.text('collector_name'),
    Column.text('status'),
    Column.real('total_estimated_weight_kg'),
    Column.real('total_actual_weight_kg'),
    Column.real('optimized_distance_km'),
    Column.text('created_at'),
    Column.text('completed_at'),
  ]),
  Table('tour_stops', [
    Column.text('tour_id'),
    Column.text('report_id'),
    Column.integer('stop_order'),
    Column.integer('is_collected'),
    Column.text('collected_at'),
  ]),
  Table('waste_lots', [
    Column.text('tour_id'),
    Column.text('collector_id'),
    Column.text('collector_name'),
    Column.text('recycler_id'),
    Column.text('recycler_name'),
    Column.real('actual_weight_kg'),
    Column.text('waste_type'),
    Column.text('origin_description'),
    Column.text('status'),
    Column.text('valorization_type'),
    Column.text('qr_code_url'),
    Column.text('created_at'),
    Column.text('received_at'),
    Column.text('valorized_at'),
  ]),
  Table('traceability_events', [
    Column.text('lot_id'),
    Column.text('event_type'),
    Column.text('actor_name'),
    Column.text('actor_role'),
    Column.real('latitude'),
    Column.real('longitude'),
    Column.text('details'),
    Column.text('photo_url'),
    Column.text('created_at'),
  ]),
  Table('recyclers', [
    Column.text('name'),
    Column.text('location_name'),
    Column.real('latitude'),
    Column.real('longitude'),
    Column.real('capacity_ton_per_month'),
    Column.text('contact_phone'),
    Column.text('created_at'),
  ]),
]);
`;

export const offlinePhotoStrategyExplanation = `
### Stratégie Offline-First & Gestion des Photos Masseko

1. **Transaction Local-First Imédiate**:
   Lorsqu'un citoyen ou collecteur prend une photo hors connexion:
   - La photo est enregistrée localement dans le stockage sécurisé de l'appareil (\`app_doc_dir/photos/<uuid>.jpg\`).
   - Le chemin local est immédiatement écrit dans la base SQLite locale PowerSync.
   - L'interface Flutter se rafraîchit à **0 millisonde** de latence et affiche l'indicateur:
     \`SyncStatusBadge(state: SyncState.pending)\` -> **"Enregistré hors connexion"**.

2. **File d'Attente d'Upload Automatisée (Background Upload Queue)**:
   - Un listener réactif PowerSync écoute l'état du réseau (\`ConnectivityResult\`).
   - Dès la détection d'une connexion Internet, PowerSync synchronise les données structurées.
   - En parallèle, le \`OfflinePhotoQueueService\` téléverse la photo vers Supabase Storage (\`bucket: waste-photos\`).
   - Dès l'obtention de l'URL publique Supabase, le champ \`photo_path\` est mis à jour en arrière-plan.

3. **Résolution des Conflits (Conflict Resolution Strategy)**:
   - **Reports & Signalements**: Modèle "Last Write Wins" (LWW) basé sur le timestamp UTC de mise à jour locale.
   - **Poids & Pesée Collecteur**: Les données mesurées par le collecteur (\`actual_weight_kg\`) sont rendues immuables et prévalent sur l'estimation initiale.
   - **Events de Traçabilité**: Inscription en mode append-only dans \`traceability_events\` pour garantir un historique non altérable.
`;
