class Logo {
  final String id;
  final String name;
  final String imagePath;
  final String difficulty;
  final String category;
  final List<String> acceptableAnswers;

  const Logo({
    required this.id,
    required this.name,
    required this.imagePath,
    required this.difficulty,
    required this.category,
    required this.acceptableAnswers,
  });

  factory Logo.fromJson(Map<String, dynamic> json) {
    return Logo(
      id: json['id'] as String,
      name: json['name'] as String,
      imagePath: json['imagePath'] as String,
      difficulty: json['difficulty'] as String,
      category: json['category'] as String,
      acceptableAnswers: (json['acceptableAnswers'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
    );
  }
}
