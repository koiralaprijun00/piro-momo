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
      scaffoldBackgroundColor: colorScheme.background,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        foregroundColor: colorScheme.onBackground,
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
            ? AppPalette.lightBlue.withOpacity(0.4)
            : colorScheme.surfaceVariant,
        selectedColor: colorScheme.primary,
        disabledColor: colorScheme.surfaceVariant,
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
            : colorScheme.surfaceVariant,
        labelStyle: textTheme.bodyMedium,
        hintStyle: textTheme.bodyMedium?.copyWith(
          color: colorScheme.onSurfaceVariant,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide(color: colorScheme.outline.withOpacity(0.4)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide(color: colorScheme.outline.withOpacity(0.25)),
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

  static const ColorScheme _lightColorScheme = ColorScheme(
    brightness: Brightness.light,
    primary: AppPalette.primaryBlue,
    onPrimary: Colors.white,
    primaryContainer: Color(0xFF1E40AF),
    onPrimaryContainer: Colors.white,
    secondary: AppPalette.primaryPurple,
    onSecondary: Colors.white,
    secondaryContainer: Color(0xFFE9D5FF),
    onSecondaryContainer: Color(0xFF4C1D95),
    tertiary: AppPalette.primaryPink,
    onTertiary: Colors.white,
    tertiaryContainer: Color(0xFFFFD1DC),
    onTertiaryContainer: Color(0xFF831843),
    error: Color(0xFFDC2626),
    onError: Colors.white,
    errorContainer: Color(0xFFFFE2E2),
    onErrorContainer: Color(0xFF7F1D1D),
    background: AppPalette.lightBackground,
    onBackground: Color(0xFF0F172A),
    surface: AppPalette.lightSurface,
    onSurface: Color(0xFF1F2937),
    surfaceVariant: Color(0xFFE2E8F0),
    onSurfaceVariant: Color(0xFF475569),
    outline: Color(0xFF94A3B8),
    outlineVariant: Color(0xFFC7D2FE),
    shadow: Color(0x1A000000),
    scrim: Color(0x66000000),
    inverseSurface: Color(0xFF1F2937),
    inversePrimary: Color(0xFF8EB6FF),
    surfaceTint: AppPalette.primaryBlue,
  );

  static const ColorScheme _darkColorScheme = ColorScheme(
    brightness: Brightness.dark,
    primary: Color(0xFF93C5FD),
    onPrimary: Color(0xFF0B1B3B),
    primaryContainer: Color(0xFF1E3A8A),
    onPrimaryContainer: Color(0xFFDDE7FF),
    secondary: Color(0xFFC4B5FD),
    onSecondary: Color(0xFF1B0A47),
    secondaryContainer: Color(0xFF4338CA),
    onSecondaryContainer: Color(0xFFE9E7FF),
    tertiary: Color(0xFFFBCFE8),
    onTertiary: Color(0xFF3B0B32),
    tertiaryContainer: Color(0xFF831843),
    onTertiaryContainer: Color(0xFFFFE4F1),
    error: Color(0xFFFCA5A5),
    onError: Color(0xFF450A0A),
    errorContainer: Color(0xFF7F1D1D),
    onErrorContainer: Color(0xFFFFE2E5),
    background: AppPalette.darkBackground,
    onBackground: Color(0xFFE2E8F0),
    surface: AppPalette.darkSurface,
    onSurface: Color(0xFFE5E7EB),
    surfaceVariant: Color(0xFF1F2937),
    onSurfaceVariant: Color(0xFFA5B4CF),
    outline: Color(0xFF64748B),
    outlineVariant: Color(0xFF1F2937),
    shadow: Color(0x66000000),
    scrim: Color(0xAA000000),
    inverseSurface: Color(0xFFE2E8F0),
    inversePrimary: AppPalette.primaryBlue,
    surfaceTint: Color(0xFF93C5FD),
  );
}
