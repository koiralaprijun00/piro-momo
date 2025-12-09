class GeneralKnowledgeQuestion {
  GeneralKnowledgeQuestion({
    required this.id,
    required this.category,
    required this.question,
    required this.options,
    required this.correctAnswer,
    required this.fact,
  });

  final String id;
  final String category;
  final String question;
  final List<String> options;
  final String correctAnswer;
  final String fact;

  factory GeneralKnowledgeQuestion.fromJson(Map<String, dynamic> json) {
    return GeneralKnowledgeQuestion(
      id: json['id'] as String,
      category: json['category'] as String? ?? 'General Knowledge',
      question: json['question'] as String,
      options: (json['options'] as List<dynamic>).cast<String>(),
      correctAnswer: json['correctAnswer'] as String,
      fact:
          json['fact'] as String? ??
          '${json['correctAnswer']} is the correct answer.',
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'category': category,
      'question': question,
      'options': options,
      'correctAnswer': correctAnswer,
      'fact': fact,
    };
  }
}
