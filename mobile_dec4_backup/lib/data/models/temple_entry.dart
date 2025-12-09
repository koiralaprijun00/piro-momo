class TempleEntry {
  const TempleEntry({
    required this.id,
    required this.name,
    required this.district,
    required this.type,
    required this.imagePath,
    this.built,
    this.deity,
    this.description,
    this.alternativeNames = const <String>[],
    this.acceptableAnswers = const <String>[],
    this.points = 10,
  });

  final String id;
  final String name;
  final String district;
  final String type;
  final String imagePath;
  final String? built;
  final String? deity;
  final String? description;
  final List<String> alternativeNames;
  final List<String> acceptableAnswers;
  final int points;

  factory TempleEntry.fromJson(Map<String, dynamic> json) {
    return TempleEntry(
      id: json['id'] as String,
      name: json['name'] as String,
      district: json['district'] as String,
      type: json['type'] as String,
      imagePath: json['imagePath'] as String,
      built: json['built'] as String?,
      deity: json['deity'] as String?,
      description: json['description'] as String?,
      alternativeNames: (json['alternativeNames'] as List<dynamic>?)
              ?.cast<String>() ??
          const <String>[],
      acceptableAnswers: (json['acceptableAnswers'] as List<dynamic>?)
              ?.cast<String>() ??
          const <String>[],
      points: (json['points'] as num?)?.toInt() ?? 10,
    );
  }
}
