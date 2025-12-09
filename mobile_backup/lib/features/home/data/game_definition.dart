import 'package:flutter/material.dart';

import '../../../core/theme/app_palette.dart';
import '../../games/festival/view/festival_shell_screen.dart';
import '../../games/general_knowledge/view/general_knowledge_shell_screen.dart';
import '../../games/gau_khane_katha/view/gau_khane_katha_shell_screen.dart';
import '../../games/name_district/view/name_district_shell_screen.dart';
import '../../games/kings/view/kings_shell_screen.dart';

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
  });

  final String id;
  final String routePath;
  final String title;
  final String eyebrow;
  final String description;
  final String assetPath;
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
        'Spot Nepal\'s vibrant celebrations through quick cultural hints.',
    assetPath: 'assets/images/guess-festival.png',
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
    description: 'Crack Nepali riddles fast and keep your streak alive.',
    assetPath: 'assets/images/gau-khane-katha.png',
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
        'Tackle Nepal\'s history, geography, and civic trivia in minutes.',
    assetPath: 'assets/images/general-knowledge.png',
    accentColors: <Color>[
      AppPalette.nepalBlue,
      AppPalette.primaryPurple,
      AppPalette.primaryPink,
    ],
    tags: <String>['Multiple choice', 'Timed vibe', 'Learn & share'],
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
  ),
];
