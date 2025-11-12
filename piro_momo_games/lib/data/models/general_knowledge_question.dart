import 'game_locale.dart';

class GeneralKnowledgeQuestion {
  GeneralKnowledgeQuestion({
    required this.id,
    required this.category,
    required this.question,
    required this.options,
    required this.correctAnswer,
    required this.fact,
    required this.locale,
  });

  final String id;
  final String category;
  final String question;
  final List<String> options;
  final String correctAnswer;
  final String fact;
  final GameLocale locale;

  factory GeneralKnowledgeQuestion.fromJson(
    Map<String, dynamic> json,
    GameLocale locale,
  ) {
    return GeneralKnowledgeQuestion(
      id: json['id'] as String,
      category: json['category'] as String? ?? 'General Knowledge',
      question: json['question'] as String,
      options: (json['options'] as List<dynamic>).cast<String>(),
      correctAnswer: json['correctAnswer'] as String,
      fact:
          json['fact'] as String? ??
          '${json['correctAnswer']} is the correct answer.',
      locale: locale,
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
      'locale': locale.languageCode,
    };
  }
}
