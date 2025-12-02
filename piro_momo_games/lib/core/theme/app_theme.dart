import 'package:flutter/material.dart';

import 'app_palette.dart';
import 'app_typography.dart';

class GradientTheme extends ThemeExtension<GradientTheme> {
  const GradientTheme({required this.hero, required this.card});

  final LinearGradient hero;
  final LinearGradient card;

  @override
  ThemeExtension<GradientTheme> copyWith({
    LinearGradient? hero,
    LinearGradient? card,
  }) {
    return GradientTheme(hero: hero ?? this.hero, card: card ?? this.card);
  }

  @override
  ThemeExtension<GradientTheme> lerp(
    covariant ThemeExtension<GradientTheme>? other,
    double t,
  ) {
    if (other is! GradientTheme) {
      return this;
    }
    return GradientTheme(
      hero: LinearGradient.lerp(hero, other.hero, t)!,
      card: LinearGradient.lerp(card, other.card, t)!,
    );
  }
}

class AppTheme {
  const AppTheme._();

  static ThemeData light() => _themeFrom(_lightColorScheme, Brightness.light);

  static ThemeData dark() => _themeFrom(_darkColorScheme, Brightness.dark);

  static ThemeData _themeFrom(ColorScheme colorScheme, Brightness brightness) {
    final textTheme = AppTypography.textTheme(colorScheme, brightness);

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colorScheme.surface,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: colorScheme.onSurface,
        elevation: 0,
        titleTextStyle: textTheme.titleLarge,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: colorScheme.surface,
        elevation: brightness == Brightness.light ? 6 : 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        margin: const EdgeInsets.all(0),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: brightness == Brightness.light
            ? AppPalette.lightBlue.withValues(alpha: 0.4)
            : colorScheme.surfaceContainerHighest,
        selectedColor: colorScheme.primary,
        disabledColor: colorScheme.surfaceContainerHighest,
        labelStyle: textTheme.labelMedium!,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      sliderTheme: const SliderThemeData(
        overlayShape: RoundSliderOverlayShape(overlayRadius: 18),
        trackHeight: 4,
      ),
      dividerTheme: DividerThemeData(
        color: colorScheme.outlineVariant,
        thickness: 1,
        space: 32,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: brightness == Brightness.light
            ? colorScheme.surface
            : colorScheme.surfaceContainerHighest,
        labelStyle: textTheme.bodyMedium,
        hintStyle: textTheme.bodyMedium?.copyWith(
          color: colorScheme.onSurfaceVariant,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide(
            color: colorScheme.outline.withValues(alpha: 0.4),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide(
            color: colorScheme.outline.withValues(alpha: 0.25),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide(color: colorScheme.primary),
        ),
      ),
      extensions: const [
        GradientTheme(
          hero: AppPalette.heroGradient,
          card: AppPalette.cardGradient,
        ),
      ],
    );
  }

  static final ColorScheme _lightColorScheme = ColorScheme.fromSeed(
    brightness: Brightness.light,
    seedColor: AppPalette.primaryBlue,
    primary: AppPalette.primaryBlue,
    secondary: AppPalette.primaryPurple,
    tertiary: AppPalette.primaryPink,
    surface: AppPalette.lightSurface,
  ).copyWith(
    onPrimary: Colors.white,
    primaryContainer: const Color(0xFF1E40AF),
    onPrimaryContainer: Colors.white,
    secondaryContainer: const Color(0xFFE9D5FF),
    onSecondaryContainer: const Color(0xFF4C1D95),
    tertiaryContainer: const Color(0xFFFFD1DC),
    onTertiaryContainer: const Color(0xFF831843),
    error: const Color(0xFFDC2626),
    onError: Colors.white,
    errorContainer: const Color(0xFFFFE2E2),
    onErrorContainer: const Color(0xFF7F1D1D),
    surfaceTint: AppPalette.primaryBlue,
  );

  static final ColorScheme _darkColorScheme = ColorScheme.fromSeed(
    brightness: Brightness.dark,
    seedColor: AppPalette.primaryBlue,
    primary: const Color(0xFF93C5FD),
    secondary: const Color(0xFFC4B5FD),
    tertiary: const Color(0xFFFBCFE8),
    surface: AppPalette.darkSurface,
  ).copyWith(
    onPrimary: const Color(0xFF0B1B3B),
    primaryContainer: const Color(0xFF1E3A8A),
    onPrimaryContainer: const Color(0xFFDDE7FF),
    onSecondary: const Color(0xFF1B0A47),
    secondaryContainer: const Color(0xFF4338CA),
    onSecondaryContainer: const Color(0xFFE9E7FF),
    onTertiary: const Color(0xFF3B0B32),
    tertiaryContainer: const Color(0xFF831843),
    onTertiaryContainer: const Color(0xFFFFE4F1),
    error: const Color(0xFFFCA5A5),
    onError: const Color(0xFF450A0A),
    errorContainer: const Color(0xFF7F1D1D),
    onErrorContainer: const Color(0xFFFFE2E5),
    outlineVariant: const Color(0xFF1F2937),
    surfaceTint: const Color(0xFF93C5FD),
  );
}
