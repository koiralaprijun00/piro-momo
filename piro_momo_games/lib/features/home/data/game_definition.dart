import 'package:flutter/material.dart';

import '../../../core/theme/app_palette.dart';
import '../../games/festival/view/festival_shell_screen.dart';
import '../../games/general_knowledge/view/general_knowledge_shell_screen.dart';
import '../../games/gau_khane_katha/view/gau_khane_katha_shell_screen.dart';

class GameDefinition {
  const GameDefinition({
    required this.id,
    required this.routePath,
    required this.title,
    required this.eyebrow,
    required this.description,
    required this.icon,
    required this.accentColors,
    this.tags = const <String>[],
  });

  final String id;
  final String routePath;
  final String title;
  final String eyebrow;
  final String description;
  final IconData icon;
  final List<Color> accentColors;
  final List<String> tags;
}

const List<GameDefinition> homeGames = <GameDefinition>[
  GameDefinition(
    id: 'guess-festival',
    routePath: FestivalShellScreen.routePath,
    title: 'Guess the Festival',
    eyebrow: 'Festival Stories',
    description:
        'Identify Nepal’s vibrant celebrations through daily questions, hints, and cultural nuggets.',
    icon: Icons.celebration_rounded,
    accentColors: <Color>[
      AppPalette.primaryBlue,
      AppPalette.primaryPurple,
      AppPalette.primaryPink,
    ],
    tags: <String>['Daily quiz', 'Cultural facts', 'Family friendly'],
  ),
  GameDefinition(
    id: 'gau-khane-katha',
    routePath: GauKhaneKathaShellScreen.routePath,
    title: 'Gau Khane Katha',
    eyebrow: 'Riddles & Wit',
    description:
        'Crack classic Nepali riddles, track your streak, and uncover the stories behind each answer.',
    icon: Icons.psychology_rounded,
    accentColors: <Color>[
      AppPalette.nepalBlue,
      AppPalette.nepalGreen,
      AppPalette.lightGreen,
    ],
    tags: <String>['Brain teaser', 'Nepali & English', 'All ages'],
  ),
  GameDefinition(
    id: 'general-knowledge',
    routePath: GeneralKnowledgeShellScreen.routePath,
    title: 'Nepal General Knowledge',
    eyebrow: 'Trivia Highlights',
    description:
        'Test yourself with curated facts about Nepal’s history, geography, culture, and more.',
    icon: Icons.quiz_rounded,
    accentColors: <Color>[
      AppPalette.nepalBlue,
      AppPalette.primaryPurple,
      AppPalette.primaryPink,
    ],
    tags: <String>['Multiple choice', 'Timed vibe', 'Learn & share'],
  ),
];
