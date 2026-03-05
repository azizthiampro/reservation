import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:reservation_frontend/features/home/presentation/providers/home_providers.dart';
import 'package:reservation_frontend/features/home/presentation/widgets/discovery_map.dart';
import 'package:reservation_frontend/features/profile/presentation/providers/profile_providers.dart';
import 'package:reservation_frontend/features/professionals/domain/entities/service_category.dart';
import 'package:reservation_frontend/shared/widgets/category_chip.dart';
import 'package:reservation_frontend/shared/widgets/professional_card.dart';
import 'package:reservation_frontend/shared/widgets/section_header.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final user = ref.watch(profileProvider);
    final discoveryMode = ref.watch(homeDiscoveryModeProvider);
    final selectedCategory = ref.watch(selectedCategoryProvider);
    final filtered = ref.watch(filteredProfessionalsProvider);
    final nearby = ref.watch(nearbyProfessionalsProvider);
    final featured = ref.watch(featuredProfessionalsProvider);

    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 18, 24, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hello, ${user.name.split(' ').first}',
                            style: theme.textTheme.headlineMedium,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Find your next premium appointment nearby.',
                            style: theme.textTheme.bodyLarge,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    CircleAvatar(
                      radius: 28,
                      backgroundImage: NetworkImage(user.avatarUrl),
                    ),
                  ],
                ),
                const SizedBox(height: 28),
                TextField(
                  onChanged: (value) => ref
                      .read(homeSearchQueryProvider.notifier)
                      .state = value,
                  decoration: const InputDecoration(
                    hintText: 'Search pros, styles, or studios',
                    prefixIcon: Icon(Icons.search_rounded),
                    suffixIcon: Icon(Icons.tune_rounded),
                  ),
                ),
                const SizedBox(height: 24),
                _DiscoveryModeSwitch(
                  selectedMode: discoveryMode,
                  onModeChanged: (mode) =>
                      ref.read(homeDiscoveryModeProvider.notifier).state = mode,
                ),
                const SizedBox(height: 24),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _AllCategoryChip(
                        isSelected: selectedCategory == null,
                        onTap: () =>
                            ref.read(selectedCategoryProvider.notifier).state =
                                null,
                      ),
                      const SizedBox(width: 10),
                      ...ServiceCategory.values.map(
                        (category) => Padding(
                          padding: const EdgeInsets.only(right: 10),
                          child: CategoryChip(
                            category: category,
                            isSelected: selectedCategory == category,
                            onTap: () =>
                                ref.read(selectedCategoryProvider.notifier).state =
                                    category,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 220),
                  reverseDuration: const Duration(milliseconds: 180),
                  switchInCurve: Curves.easeOutCubic,
                  switchOutCurve: Curves.easeInCubic,
                  transitionBuilder: (child, animation) {
                    final offsetAnimation = Tween<Offset>(
                      begin: const Offset(0, 0.015),
                      end: Offset.zero,
                    ).animate(animation);

                    return FadeTransition(
                      opacity: animation,
                      child: SlideTransition(
                        position: offsetAnimation,
                        child: child,
                      ),
                    );
                  },
                  child: KeyedSubtree(
                    key: ValueKey(discoveryMode),
                    child: discoveryMode == HomeDiscoveryMode.search
                        ? const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              SectionHeader(
                                title: 'Nearby professionals',
                                subtitle: 'Fastest options with strong reviews',
                              ),
                              SizedBox(height: 18),
                            ],
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SectionHeader(
                                title: 'Explore on map',
                                subtitle:
                                    'Search, filter, then pick a location directly on the map',
                              ),
                              const SizedBox(height: 18),
                              DiscoveryMap(
                                professionals: filtered,
                                onProfessionalTap: (professional) => context
                                    .push('/professional/${professional.id}'),
                              ),
                              const SizedBox(height: 120),
                            ],
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
        if (discoveryMode == HomeDiscoveryMode.search && nearby.isNotEmpty)
          SliverToBoxAdapter(
            child: SizedBox(
              height: 320,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                scrollDirection: Axis.horizontal,
                itemCount: nearby.length,
                separatorBuilder: (_, __) => const SizedBox(width: 16),
                itemBuilder: (context, index) {
                  final professional = nearby[index];
                  return ProfessionalCard(
                    professional: professional,
                    compact: true,
                    onTap: () => context.push('/professional/${professional.id}'),
                  );
                },
              ),
            ),
          ),
        if (discoveryMode == HomeDiscoveryMode.search)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 32, 24, 20),
              child: SectionHeader(
                title: 'Featured this week',
                subtitle: 'Editorial picks for clean craft and consistency',
                actionLabel: featured.isNotEmpty ? 'See all' : null,
              ),
            ),
          ),
        if (discoveryMode == HomeDiscoveryMode.search && featured.isEmpty)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 120),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface,
                  borderRadius: BorderRadius.circular(28),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('No matches yet', style: theme.textTheme.titleLarge),
                    const SizedBox(height: 10),
                    Text(
                      'Try another category or broaden the search terms.',
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
            ),
          )
        else if (discoveryMode == HomeDiscoveryMode.search)
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 120),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final professional = featured[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: ProfessionalCard(
                      professional: professional,
                      onTap: () => context.push('/professional/${professional.id}'),
                    ),
                  );
                },
                childCount: featured.length,
              ),
            ),
          ),
      ],
    );
  }
}

class _DiscoveryModeSwitch extends StatelessWidget {
  const _DiscoveryModeSwitch({
    required this.selectedMode,
    required this.onModeChanged,
  });

  final HomeDiscoveryMode selectedMode;
  final ValueChanged<HomeDiscoveryMode> onModeChanged;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
      ),
      child: SegmentedButton<HomeDiscoveryMode>(
        showSelectedIcon: false,
        segments: const [
          ButtonSegment(
            value: HomeDiscoveryMode.search,
            icon: Icon(Icons.search_rounded),
            label: Text('Search'),
          ),
          ButtonSegment(
            value: HomeDiscoveryMode.map,
            icon: Icon(Icons.map_outlined),
            label: Text('Map'),
          ),
        ],
        selected: {selectedMode},
        onSelectionChanged: (selection) => onModeChanged(selection.first),
        style: ButtonStyle(
          side: const WidgetStatePropertyAll(BorderSide.none),
          padding: const WidgetStatePropertyAll(
            EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          ),
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return theme.colorScheme.primary;
            }
            return theme.colorScheme.surface;
          }),
          foregroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return theme.colorScheme.onPrimary;
            }
            return theme.colorScheme.onSurfaceVariant;
          }),
          textStyle: WidgetStatePropertyAll(
            theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w700),
          ),
          shape: WidgetStatePropertyAll(
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          ),
        ),
      ),
    );
  }
}

class _AllCategoryChip extends StatelessWidget {
  const _AllCategoryChip({
    required this.isSelected,
    required this.onTap,
  });

  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      curve: Curves.easeOutCubic,
      decoration: BoxDecoration(
        color: isSelected
            ? theme.colorScheme.primary
            : theme.colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(22),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(22),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Text(
            'All',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: isSelected
                  ? theme.colorScheme.onPrimary
                  : theme.colorScheme.onSurface,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }
}
