import 'game_locale.dart';

class FestivalQuestion {
  FestivalQuestion({
    required this.id,
    required this.name,
    required this.question,
    required this.fact,
    required this.locale,
  });

  final String id;
  final String name;
  final String question;
  final String fact;
  final GameLocale locale;

  factory FestivalQuestion.fromJson(
    Map<String, dynamic> json,
    GameLocale locale,
  ) {
    return FestivalQuestion(
      id: json['id'] as String,
      name: json['name'] as String,
      question: json['question'] as String,
      fact: json['fact'] as String,
      locale: locale,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'name': name,
      'question': question,
      'fact': fact,
      'locale': locale.languageCode,
    };
  }
}
