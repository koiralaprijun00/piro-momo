enum GameLocale {
  english('en'),
  nepali('np');

  const GameLocale(this.languageCode);

  final String languageCode;

  static GameLocale fromLanguageCode(String code) {
    return GameLocale.values.firstWhere(
      (GameLocale locale) => locale.languageCode == code.toLowerCase(),
      orElse: () => GameLocale.english,
    );
  }

  @override
  String toString() => languageCode;
}
