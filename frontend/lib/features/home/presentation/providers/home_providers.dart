import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../professionals/domain/entities/professional.dart';
import '../../../professionals/domain/entities/service_category.dart';
import '../../../professionals/presentation/providers/professionals_providers.dart';

enum HomeDiscoveryMode { search, map }

final selectedCategoryProvider = StateProvider<ServiceCategory?>(
  (ref) => null,
);

final homeSearchQueryProvider = StateProvider<String>((ref) => '');

final homeDiscoveryModeProvider = StateProvider<HomeDiscoveryMode>(
  (ref) => HomeDiscoveryMode.search,
);

final filteredProfessionalsProvider = Provider<List<Professional>>((ref) {
  final professionals = ref.watch(professionalsProvider);
  final selectedCategory = ref.watch(selectedCategoryProvider);
  final query = ref.watch(homeSearchQueryProvider).trim().toLowerCase();

  return professionals.where((professional) {
    final matchesCategory = selectedCategory == null ||
        professional.categories.contains(selectedCategory);
    final matchesQuery = query.isEmpty ||
        professional.name.toLowerCase().contains(query) ||
        professional.specialty.toLowerCase().contains(query) ||
        professional.location.toLowerCase().contains(query);
    return matchesCategory && matchesQuery;
  }).toList();
});

final nearbyProfessionalsProvider = Provider<List<Professional>>((ref) {
  final items = [...ref.watch(filteredProfessionalsProvider)]
    ..sort((left, right) => left.distanceKm.compareTo(right.distanceKm));
  return items.take(4).toList();
});

final featuredProfessionalsProvider = Provider<List<Professional>>((ref) {
  final items = ref.watch(filteredProfessionalsProvider);
  return items.where((professional) => professional.isFeatured).toList();
});
