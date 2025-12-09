class KingEntry {
  KingEntry({
    required this.id,
    required this.name,
    required this.reignYears,
    required this.summary,
    required this.aliases,
    this.image,
  });

  final String id;
  final String name;
  final String reignYears;
  final String summary;
  final List<String> aliases;
  final String? image;

  factory KingEntry.fromJson(Map<String, dynamic> json) {
    return KingEntry(
      id: json['id'] as String,
      name: json['name'] as String,
      reignYears: json['reignYears'] as String? ??
          (json['reign_years'] as String? ?? ''),
      summary: json['summary'] as String? ??
          (json['description'] as String? ?? ''),
      aliases: (json['aliases'] as List<dynamic>? ?? <dynamic>[])
          .map((dynamic value) => value.toString())
          .where((String value) => value.trim().isNotEmpty)
          .toList(growable: false),
      image: json['image'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'reignYears': reignYears,
      'summary': summary,
      'aliases': aliases,
      'image': image,
    };
  }
}
