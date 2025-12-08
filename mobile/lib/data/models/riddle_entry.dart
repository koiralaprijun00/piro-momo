class RiddleEntry {
  RiddleEntry({
    required this.id,
    required this.question,
    required this.answer,
    this.translation,
    Map<String, dynamic>? metadata,
  }) : metadata = metadata ?? const <String, dynamic>{};

  final String id;
  final String question;
  final String answer;
  final String? translation;
  final Map<String, dynamic> metadata;

  factory RiddleEntry.fromJson(Map<String, dynamic> json) {
    final Map<String, dynamic> metadata = Map<String, dynamic>.from(json)
      ..removeWhere((String key, dynamic _) {
        return key == 'id' ||
            key == 'question' ||
            key == 'answer' ||
            key == 'answerNp' ||
            key == 'answerEn';
      });

    return RiddleEntry(
      id: json['id'] as String,
      question: json['question'] as String,
      answer: json['answer'] as String,
      translation: (json['answerNp'] ?? json['answerEn']) as String?,
      metadata: metadata,
    );
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'question': question,
      'answer': answer,
      if (translation != null) 'translation': translation,
      if (metadata.isNotEmpty) 'metadata': metadata,
    };
  }
}
