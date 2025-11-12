import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../features/games/festival/view/festival_shell_screen.dart';
import '../features/games/general_knowledge/view/general_knowledge_shell_screen.dart';
import '../features/games/gau_khane_katha/view/gau_khane_katha_shell_screen.dart';
import '../features/home/view/home_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: <RouteBase>[
    GoRoute(
      name: HomeScreen.routeName,
      path: '/',
      pageBuilder: (BuildContext context, GoRouterState state) {
        return CustomTransitionPage<void>(
          key: state.pageKey,
          child: const HomeScreen(),
          transitionsBuilder: _fadeThroughTransition,
        );
      },
    ),
    GoRoute(
      name: 'general-knowledge',
      path: GeneralKnowledgeShellScreen.routePath,
      pageBuilder: (BuildContext context, GoRouterState state) {
        return CustomTransitionPage<void>(
          key: state.pageKey,
          child: const GeneralKnowledgeShellScreen(),
          transitionsBuilder: _slideUpTransition,
        );
      },
    ),
    GoRoute(
      name: 'guess-festival',
      path: FestivalShellScreen.routePath,
      pageBuilder: (BuildContext context, GoRouterState state) {
        return CustomTransitionPage<void>(
          key: state.pageKey,
          child: const FestivalShellScreen(),
          transitionsBuilder: _slideUpTransition,
        );
      },
    ),
    GoRoute(
      name: 'gau-khane-katha',
      path: GauKhaneKathaShellScreen.routePath,
      pageBuilder: (BuildContext context, GoRouterState state) {
        return CustomTransitionPage<void>(
          key: state.pageKey,
          child: const GauKhaneKathaShellScreen(),
          transitionsBuilder: _slideUpTransition,
        );
      },
    ),
  ],
);

Widget _fadeThroughTransition(
  BuildContext context,
  Animation<double> animation,
  Animation<double> secondaryAnimation,
  Widget child,
) {
  final CurvedAnimation curvedAnimation = CurvedAnimation(
    parent: animation,
    curve: Curves.easeInOut,
  );
  return FadeTransition(opacity: curvedAnimation, child: child);
}

Widget _slideUpTransition(
  BuildContext context,
  Animation<double> animation,
  Animation<double> secondaryAnimation,
  Widget child,
) {
  final CurvedAnimation curvedAnimation = CurvedAnimation(
    parent: animation,
    curve: Curves.easeOutCubic,
  );
  final Animation<Offset> offsetAnimation = Tween<Offset>(
    begin: const Offset(0, 0.08),
    end: Offset.zero,
  ).animate(curvedAnimation);

  return FadeTransition(
    opacity: curvedAnimation,
    child: SlideTransition(position: offsetAnimation, child: child),
  );
}
