import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/demo_profile_repository.dart';
import '../../domain/entities/app_user.dart';
import '../../domain/repositories/profile_repository.dart';

final profileRepositoryProvider = Provider<ProfileRepository>(
  (ref) => DemoProfileRepository(),
);

final profileProvider = Provider<AppUser>(
  (ref) => ref.watch(profileRepositoryProvider).fetchProfile(),
);

final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

final notificationsEnabledProvider = StateProvider<bool>((ref) => true);

final smartRemindersProvider = StateProvider<bool>((ref) => true);
