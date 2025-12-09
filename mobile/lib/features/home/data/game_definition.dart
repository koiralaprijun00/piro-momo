import 'package:flutter/material.dart';

import '../../../core/theme/app_palette.dart';
import '../../games/festival/view/festival_shell_screen.dart';
import '../../games/general_knowledge/view/general_knowledge_shell_screen.dart';
import '../../games/gau_khane_katha/view/gau_khane_katha_shell_screen.dart';
import '../../games/name_district/view/name_district_shell_screen.dart';
import '../../games/kings/view/kings_shell_screen.dart';
import '../../games/temple/view/temple_shell_screen.dart';
import '../../games/logo_quiz/view/logo_quiz_screen.dart';

class GameDefinition {
  const GameDefinition({
    required this.id,
    required this.routePath,
    required this.title,
    required this.eyebrow,
    required this.description,
    required this.assetPath,
    required this.accentColors,
    this.tags = const <String>[],
    required this.metadata,
    required this.difficulty,
    required this.features,
  });

  final String id;
  final String routePath;
  final String title;
  final String eyebrow;
  final String description;
  final String assetPath;
  final List<Color> accentColors;
  final List<String> tags;
  final String metadata;
  final String difficulty;
  final List<GameFeature> features;
}

class GameFeature {
  const GameFeature({
    required this.icon,
    required this.label,
    required this.color,
  });

  final IconData icon;
  final String label;
  final Color color;
}

const List<GameDefinition> homeGames = <GameDefinition>[
  GameDefinition(
    id: 'guess-festival',
    routePath: FestivalShellScreen.routePath,
    title: 'Guess the Festival',
    eyebrow: 'Festival Stories',
    description:
        'Spot Nepal\'s vibrant celebrations through quick cultural hints.',
    assetPath: 'assets/images/guess-festival.png',
    accentColors: <Color>[
      AppPalette.primaryBlue,
      AppPalette.primaryPurple,
      AppPalette.primaryPink,
    ],
    tags: <String>['Daily quiz', 'Cultural facts', 'Family friendly'],
    metadata: '12 festivals',
    difficulty: 'Easy',
    features: [
      GameFeature(
        icon: Icons.celebration_rounded,
        label: '12 major Nepali festivals',
        color: AppPalette.primaryPink,
      ),
      GameFeature(
        icon: Icons.timer_rounded,
        label: 'Quick cultural challenges',
        color: AppPalette.primaryPurple,
      ),
      GameFeature(
        icon: Icons.emoji_events_rounded,
        label: 'Build streaks & learn facts',
        color: AppPalette.primaryBlue,
      ),
    ],
  ),
  GameDefinition(
    id: TempleShellScreen.gameId,
    routePath: TempleShellScreen.routePath,
    title: 'Guess the Temple',
    eyebrow: 'Sacred Sites',
    description: 'Identify temples from Nepal with quick photo prompts.',
    assetPath: 'assets/images/guess-the-temple.png',
    accentColors: <Color>[
      AppPalette.primaryBlue,
      AppPalette.primaryPurple,
      AppPalette.primaryPink,
    ],
    tags: <String>['Typing', 'Culture', 'Photo quiz'],
    metadata: '45+ temples',
    difficulty: 'Medium',
    features: [
      GameFeature(
        icon: Icons.temple_buddhist_rounded,
        label: 'Guess iconic temples',
        color: AppPalette.primaryPurple,
      ),
      GameFeature(
        icon: Icons.spellcheck_rounded,
        label: 'Handles spelling variants',
        color: AppPalette.primaryBlue,
      ),
      GameFeature(
        icon: Icons.bolt_rounded,
        label: 'Reach 100 points to win',
        color: AppPalette.primaryPink,
      ),
    ],
  ),
  GameDefinition(
    id: 'gau-khane-katha',
    routePath: GauKhaneKathaShellScreen.routePath,
    title: 'Gau Khane Katha',
    eyebrow: 'Riddles & Wit',
    description: 'Crack Nepali riddles fast and keep your streak alive.',
    assetPath: 'assets/images/gau-khane-katha.png',
    accentColors: <Color>[
      AppPalette.nepalBlue,
      AppPalette.nepalGreen,
      AppPalette.lightGreen,
    ],
    tags: <String>['Brain teaser', 'Nepali & English', 'All ages'],
    metadata: '50+ riddles',
    difficulty: 'Medium',
    features: [
      GameFeature(
        icon: Icons.psychology_rounded,
        label: '50+ traditional Nepali riddles',
        color: AppPalette.nepalRed,
      ),
      GameFeature(
        icon: Icons.bolt_rounded,
        label: 'Quick challenges under 2 minutes',
        color: AppPalette.primaryPurple,
      ),
      GameFeature(
        icon: Icons.emoji_events_rounded,
        label: 'Build streaks & earn achievements',
        color: AppPalette.nepalGreen,
      ),
    ],
  ),
  GameDefinition(
    id: 'general-knowledge',
    routePath: GeneralKnowledgeShellScreen.routePath,
    title: 'Nepal General Knowledge',
    eyebrow: 'Trivia Highlights',
    description:
        'Tackle Nepal\'s history, geography, and civic trivia in minutes.',
    assetPath: 'assets/images/general-knowledge.png',
    accentColors: <Color>[
      AppPalette.nepalBlue,
      AppPalette.primaryPurple,
      AppPalette.primaryPink,
    ],
    tags: <String>['Multiple choice', 'Timed vibe', 'Learn & share'],
    metadata: '100+ questions',
    difficulty: 'All levels',
    features: [], // General Knowledge doesn't use this onboarding yet
  ),
  GameDefinition(
    id: KingsShellScreen.gameId,
    routePath: KingsShellScreen.routePath,
    title: 'Kings of Nepal',
    eyebrow: 'Royal Recall',
    description:
        'Type every Shah monarch using reign years and cultural clues.',
    assetPath: 'assets/images/kings-of-nepal.png',
    accentColors: <Color>[
      AppPalette.nepalRed,
      AppPalette.primaryPurple,
      AppPalette.lightBlue,
    ],
    tags: <String>['Typing', 'History', 'Cultural legends'],
    metadata: '10 monarchs',
    difficulty: 'Hard',
    features: [
      GameFeature(
        icon: Icons.history_edu_rounded,
        label: 'Recall all Shah monarchs',
        color: AppPalette.nepalRed,
      ),
      GameFeature(
        icon: Icons.keyboard_rounded,
        label: 'Type names to verify knowledge',
        color: AppPalette.primaryPurple,
      ),
      GameFeature(
        icon: Icons.school_rounded,
        label: 'Learn reign years & history',
        color: AppPalette.lightBlue,
      ),
    ],
  ),
  GameDefinition(
    id: NameDistrictShellScreen.gameId,
    routePath: NameDistrictShellScreen.routePath,
    title: 'Name the District',
    eyebrow: 'Map Mastery',
    description: 'Identify Nepal\'s 77 districts by silhouette and clues.',
    assetPath: 'assets/images/name-district.png',
    accentColors: <Color>[
      AppPalette.primaryBlue,
      AppPalette.nepalGreen,
      AppPalette.lightBlue,
    ],
    tags: <String>['Geography', 'Typing', 'Challenge'],
    metadata: '77 districts',
    difficulty: 'Medium',
    features: [
      GameFeature(
        icon: Icons.map_rounded,
        label: 'Identify all 77 districts',
        color: AppPalette.primaryBlue,
      ),
      GameFeature(
        icon: Icons.shape_line_rounded,
        label: 'Recognize districts by shape',
        color: AppPalette.nepalGreen,
      ),
      GameFeature(
        icon: Icons.explore_rounded,
        label: 'Master Nepal\'s geography',
        color: AppPalette.lightBlue,
      ),
    ],
  ),
  GameDefinition(
    id: 'logo-quiz',
    routePath: LogoQuizScreen.routePath,
    title: 'Logo Quiz',
    eyebrow: 'Brand Master',
    description: 'Guess famous Nepali brands from their logos.',
    assetPath: 'assets/images/logo-quiz.png',
    accentColors: <Color>[
      AppPalette.primaryBlue,
      AppPalette.nepalRed,
      AppPalette.primaryPink,
    ],
    tags: <String>['Visual', 'Brands', 'Quiz'],
    metadata: '20+ logos',
    difficulty: 'Easy/Medium',
    features: [
      GameFeature(
        icon: Icons.image_rounded,
        label: 'Identify blurred logos',
        color: AppPalette.primaryBlue,
      ),
      GameFeature(
        icon: Icons.access_time_filled_rounded,
        label: 'Beat the clock',
        color: AppPalette.nepalRed,
      ),
      GameFeature(
        icon: Icons.check_circle_rounded,
        label: 'Test your brand IQ',
        color: AppPalette.primaryPink,
      ),
    ],
  ),
];
