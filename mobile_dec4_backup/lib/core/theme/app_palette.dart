import 'package:flutter/material.dart';

/// Shared color tokens mirrored from the web experience.
class AppPalette {
  const AppPalette._();

  // Core brand colors.
  static const Color primaryBlue = Color(0xFF2563EB); // Tailwind blue-600
  static const Color primaryPurple = Color(0xFFA855F7); // Tailwind purple-500
  static const Color primaryPink = Color(0xFFF472B6); // Tailwind pink-400

  static const Color nepalBlue = Color(0xFF0056A2);
  static const Color nepalRed = Color(0xFFD32F2F);
  static const Color nepalGreen = Color(0xFF388E3C);

  static const Color lightBlue = Color(0xFFC6E7FF);
  static const Color lightGreen = Color(0xFFD1FFD7);
  static const Color lightRed = Color(0xFFFFD1D1);

  // Neutral surfaces.
  static const Color lightBackground = Color(0xFFF6F8FB);
  static const Color lightSurface = Colors.white;
  static const Color darkBackground = Color(0xFF0B1220);
  static const Color darkSurface = Color(0xFF111827);

  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryBlue, primaryPurple, primaryPink],
  );

  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF3B82F6), Color(0xFFA855F7), Color(0xFFFDA4AF)],
  );
}
