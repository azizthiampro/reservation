import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:reservation_frontend/features/auth/presentation/screens/auth_screen.dart';
import 'package:reservation_frontend/features/booking/presentation/screens/booking_screen.dart';
import 'package:reservation_frontend/features/bookings/presentation/screens/bookings_screen.dart';
import 'package:reservation_frontend/features/home/presentation/screens/home_screen.dart';
import 'package:reservation_frontend/features/onboarding/presentation/screens/onboarding_screen.dart';
import 'package:reservation_frontend/features/profile/presentation/screens/profile_screen.dart';
import 'package:reservation_frontend/features/professionals/presentation/screens/professional_profile_screen.dart';
import 'package:reservation_frontend/shared/widgets/app_shell.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/onboarding',
    routes: [
      GoRoute(
        path: '/onboarding',
        pageBuilder: (context, state) => _buildTransitionPage(
          state: state,
          child: const OnboardingScreen(),
        ),
      ),
      GoRoute(
        path: '/auth',
        pageBuilder: (context, state) => _buildTransitionPage(
          state: state,
          child: const AuthScreen(),
        ),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => AppShell(
          navigationShell: navigationShell,
        ),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/home',
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/bookings',
                builder: (context, state) => const BookingsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        path: '/professional/:id',
        pageBuilder: (context, state) => _buildTransitionPage(
          state: state,
          child: ProfessionalProfileScreen(
            professionalId: state.pathParameters['id']!,
          ),
        ),
      ),
      GoRoute(
        path: '/booking/:professionalId',
        pageBuilder: (context, state) => _buildTransitionPage(
          state: state,
          child: BookingScreen(
            professionalId: state.pathParameters['professionalId']!,
          ),
        ),
      ),
    ],
  );
});

CustomTransitionPage<void> _buildTransitionPage({
  required GoRouterState state,
  required Widget child,
}) {
  return CustomTransitionPage<void>(
    key: state.pageKey,
    child: child,
    transitionDuration: const Duration(milliseconds: 220),
    reverseTransitionDuration: const Duration(milliseconds: 180),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final curved = CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
        reverseCurve: Curves.easeInCubic,
      );
      final offsetAnimation = Tween<Offset>(
        begin: const Offset(0, 0.02),
        end: Offset.zero,
      ).animate(curved);

      return FadeTransition(
        opacity: curved,
        child: SlideTransition(
          position: offsetAnimation,
          child: child,
        ),
      );
    },
  );
}
