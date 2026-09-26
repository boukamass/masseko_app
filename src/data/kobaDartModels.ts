export const dartReportModelCode = `// lib/data/models/report_model.dart

enum WasteType {
  plasticBottle,
  plasticBag,
  fishingNet,
  fishingGear,
  mixedPlastic,
  other,
}

enum WasteVolume {
  small,
  medium,
  large,
  veryLarge,
}

enum ReportStatus {
  reported,
  pendingValidation,
  validated,
  assigned,
  inCollection,
  collected,
  transported,
  received,
  valorized,
  rejected,
}

class ReportModel {
  final String id;
  final String? authorId;
  final String? guestIdentifier;
  final double latitude;
  final double longitude;
  final String locationName;
  final WasteType wasteType;
  final WasteVolume estimatedVolume;
  final double estimatedWeightKg;
  final double? actualWeightKg;
  final String photoPath;
  final String description;
  final ReportStatus status;
  final int priorityScore;
  final String priorityLevel; // CRITIQUE, HAUTE, MOYENNE, BASSE
  final String? duplicateOfId;
  final String createdAt;
  final String? validatedAt;
  final String? collectedAt;

  ReportModel({
    required this.id,
    this.authorId,
    this.guestIdentifier,
    required this.latitude,
    required this.longitude,
    required this.locationName,
    required this.wasteType,
    required this.estimatedVolume,
    required this.estimatedWeightKg,
    this.actualWeightKg,
    required this.photoPath,
    required this.description,
    required this.status,
    required this.priorityScore,
    required this.priorityLevel,
    this.duplicateOfId,
    required this.createdAt,
    this.validatedAt,
    this.collectedAt,
  });

  factory ReportModel.fromSqliteMap(Map<String, dynamic> map) {
    return ReportModel(
      id: map['id'] as String,
      authorId: map['author_id'] as String?,
      guestIdentifier: map['guest_identifier'] as String?,
      latitude: (map['latitude'] as num).toDouble(),
      longitude: (map['longitude'] as num).toDouble(),
      locationName: map['location_name'] ?? 'Pointe-Noire',
      wasteType: _parseWasteType(map['waste_type']),
      estimatedVolume: _parseWasteVolume(map['estimated_volume']),
      estimatedWeightKg: (map['estimated_weight_kg'] as num? ?? 5.0).toDouble(),
      actualWeightKg: map['actual_weight_kg'] != null ? (map['actual_weight_kg'] as num).toDouble() : null,
      photoPath: map['photo_path'] as String,
      description: map['description'] ?? '',
      status: _parseReportStatus(map['status']),
      priorityScore: map['priority_score'] as int? ?? 50,
      priorityLevel: map['priority_level'] ?? 'MOYENNE',
      duplicateOfId: map['duplicate_of_id'] as String?,
      createdAt: map['created_at'] as String,
      validatedAt: map['validated_at'] as String?,
      collectedAt: map['collected_at'] as String?,
    );
  }

  Map<String, dynamic> toSqliteMap() {
    return {
      'id': id,
      'author_id': authorId,
      'guest_identifier': guestIdentifier,
      'latitude': latitude,
      'longitude': longitude,
      'location_name': locationName,
      'waste_type': wasteType.name,
      'estimated_volume': estimatedVolume.name,
      'estimated_weight_kg': estimatedWeightKg,
      'actual_weight_kg': actualWeightKg,
      'photo_path': photoPath,
      'description': description,
      'status': status.name,
      'priority_score': priorityScore,
      'priority_level': priorityLevel,
      'duplicate_of_id': duplicateOfId,
      'created_at': createdAt,
      'validated_at': validatedAt,
      'collected_at': collectedAt,
    };
  }

  static WasteType _parseWasteType(dynamic val) {
    if (val == null) return WasteType.mixedPlastic;
    final str = val.toString().toLowerCase();
    if (str.contains('bottle')) return WasteType.plasticBottle;
    if (str.contains('bag')) return WasteType.plasticBag;
    if (str.contains('net')) return WasteType.fishingNet;
    if (str.contains('gear')) return WasteType.fishingGear;
    return WasteType.mixedPlastic;
  }

  static WasteVolume _parseWasteVolume(dynamic val) {
    if (val == null) return WasteVolume.medium;
    final str = val.toString().toLowerCase();
    if (str.contains('very')) return WasteVolume.veryLarge;
    if (str.contains('large')) return WasteVolume.large;
    if (str.contains('small')) return WasteVolume.small;
    return WasteVolume.medium;
  }

  static ReportStatus _parseReportStatus(dynamic val) {
    if (val == null) return ReportStatus.reported;
    final str = val.toString().toLowerCase();
    if (str.contains('valida')) return ReportStatus.validated;
    if (str.contains('assign')) return ReportStatus.assigned;
    if (str.contains('collect')) return ReportStatus.collected;
    if (str.contains('valoriz')) return ReportStatus.valorized;
    return ReportStatus.reported;
  }
}
`;

export const dartWasteLotModelCode = `// lib/data/models/waste_lot_model.dart

class WasteLotModel {
  final String id; // e.g. MASSEKO-2026-000127
  final String tourId;
  final String collectorId;
  final String collectorName;
  final String? recyclerId;
  final String? recyclerName;
  final double actualWeightKg;
  final String wasteType;
  final String originDescription;
  final String status; // created, transported, received, valorized
  final String? valorizationType;
  final String qrCodeUrl;
  final String createdAt;
  final String? receivedAt;
  final String? valorizedAt;

  WasteLotModel({
    required this.id,
    required this.tourId,
    required this.collectorId,
    required this.collectorName,
    this.recyclerId,
    this.recyclerName,
    required this.actualWeightKg,
    required this.wasteType,
    required this.originDescription,
    required this.status,
    this.valorizationType,
    required this.qrCodeUrl,
    required this.createdAt,
    this.receivedAt,
    this.valorizedAt,
  });

  factory WasteLotModel.fromSqliteMap(Map<String, dynamic> map) {
    return WasteLotModel(
      id: map['id'] as String,
      tourId: map['tour_id'] as String,
      collectorId: map['collector_id'] as String,
      collectorName: map['collector_name'] ?? 'Collecteur Masseko',
      recyclerId: map['recycler_id'] as String?,
      recyclerName: map['recycler_name'] as String?,
      actualWeightKg: (map['actual_weight_kg'] as num).toDouble(),
      wasteType: map['waste_type'] as String,
      originDescription: map['origin_description'] ?? 'Pointe-Noire',
      status: map['status'] as String? ?? 'created',
      valorizationType: map['valorization_type'] as String?,
      qrCodeUrl: map['qr_code_url'] as String,
      createdAt: map['created_at'] as String,
      receivedAt: map['received_at'] as String?,
      valorizedAt: map['valorized_at'] as String?,
    );
  }

  Map<String, dynamic> toSqliteMap() {
    return {
      'id': id,
      'tour_id': tourId,
      'collector_id': collectorId,
      'collector_name': collectorName,
      'recycler_id': recyclerId,
      'recycler_name': recyclerName,
      'actual_weight_kg': actualWeightKg,
      'waste_type': wasteType,
      'origin_description': originDescription,
      'status': status,
      'valorization_type': valorizationType,
      'qr_code_url': qrCodeUrl,
      'created_at': createdAt,
      'received_at': receivedAt,
      'valorized_at': valorizedAt,
    };
  }
}
`;
