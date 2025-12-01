class FestivalQuestion {
  FestivalQuestion({
    required this.id,
    required this.name,
    required this.question,
    required this.fact,
  });

  final String id;
  final String name;
  final String question;
  final String fact;

  factory FestivalQuestion.fromJson(Map<String, dynamic> json) {
    return FestivalQuestion(
      id: json['id'] as String,
      name: json['name'] as String,
      question: json['question'] as String,
      fact: json['fact'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'question': question,
      'fact': fact,
    };
  }
}
