import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTypography {
  const AppTypography._();

  static TextTheme textTheme(ColorScheme colorScheme, Brightness brightness) {
    final base = GoogleFonts.dmSansTextTheme();
    final onSurface = colorScheme.onSurface;
    final onBackground = colorScheme.onBackground;

    return base.copyWith(
      displayLarge: base.displayLarge?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
        color: onBackground,
      ),
      displayMedium: base.displayMedium?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: -0.25,
        color: onBackground,
      ),
      displaySmall: base.displaySmall?.copyWith(
        fontWeight: FontWeight.w600,
        color: onBackground,
      ),
      headlineLarge: base.headlineLarge?.copyWith(
        fontWeight: FontWeight.w700,
        color: onSurface,
      ),
      headlineMedium: base.headlineMedium?.copyWith(
        fontWeight: FontWeight.w600,
        color: onSurface,
      ),
      headlineSmall: base.headlineSmall?.copyWith(
        fontWeight: FontWeight.w600,
        color: onSurface,
      ),
      titleLarge: base.titleLarge?.copyWith(
        fontWeight: FontWeight.w600,
        color: onSurface,
      ),
      titleMedium: base.titleMedium?.copyWith(
        fontWeight: FontWeight.w600,
        letterSpacing: 0.1,
        color: onSurface,
      ),
      titleSmall: base.titleSmall?.copyWith(
        fontWeight: FontWeight.w600,
        letterSpacing: 0.1,
        color: onSurface.withOpacity(0.92),
      ),
      bodyLarge: base.bodyLarge?.copyWith(
        fontWeight: FontWeight.w500,
        color: onSurface,
        height: 1.45,
      ),
      bodyMedium: base.bodyMedium?.copyWith(
        fontWeight: FontWeight.w500,
        color: onSurface.withOpacity(0.9),
        height: 1.5,
      ),
      bodySmall: base.bodySmall?.copyWith(
        fontWeight: FontWeight.w500,
        color: onSurface.withOpacity(0.8),
        height: 1.4,
      ),
      labelLarge: base.labelLarge?.copyWith(
        fontWeight: FontWeight.w700,
        letterSpacing: 0.2,
        color: colorScheme.onPrimary,
      ),
      labelMedium: base.labelMedium?.copyWith(
        fontWeight: FontWeight.w600,
        letterSpacing: 0.3,
        color: onSurface.withOpacity(0.9),
      ),
      labelSmall: base.labelSmall?.copyWith(
        fontWeight: FontWeight.w600,
        letterSpacing: 0.4,
        color: onSurface.withOpacity(0.8),
      ),
    );
  }

  static TextStyle nepaliDisplay(ColorScheme colorScheme) {
    return GoogleFonts.notoSerifDevanagari(
      fontSize: 32,
      fontWeight: FontWeight.w700,
      color: colorScheme.onBackground,
      height: 1.25,
    );
  }

  static TextStyle nepaliBody(ColorScheme colorScheme) {
    return GoogleFonts.notoSerifDevanagari(
      fontSize: 18,
      fontWeight: FontWeight.w500,
      color: colorScheme.onSurface,
      height: 1.5,
    );
  }
}
