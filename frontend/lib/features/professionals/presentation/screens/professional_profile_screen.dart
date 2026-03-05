import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:reservation_frontend/core/utils/app_formatters.dart';
import 'package:reservation_frontend/features/professionals/presentation/providers/professionals_providers.dart';
import 'package:reservation_frontend/shared/widgets/gallery_grid.dart';
import 'package:reservation_frontend/shared/widgets/rating_stars.dart';
import 'package:reservation_frontend/shared/widgets/section_header.dart';
import 'package:reservation_frontend/shared/widgets/service_card.dart';

class ProfessionalProfileScreen extends ConsumerWidget {
  const ProfessionalProfileScreen({
    required this.professionalId,
    super.key,
  });

  final String professionalId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final professional = ref.watch(professionalProvider(professionalId));

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            leading: Padding(
              padding: const EdgeInsets.all(8),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: theme.colorScheme.surface.withValues(alpha: 0.9),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  onPressed: () => context.pop(),
                  icon: const Icon(Icons.arrow_back_rounded),
                ),
              ),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    professional.coverImageUrl,
                    fit: BoxFit.cover,
                  ),
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.46),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 120),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 34,
                        backgroundImage: NetworkImage(professional.portraitImageUrl),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              professional.name,
                              style: theme.textTheme.headlineMedium,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              professional.specialty,
                              style: theme.textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _InfoPill(
                        icon: Icons.star_rounded,
                        label:
                            '${professional.rating.toStringAsFixed(1)} (${professional.reviewCount})',
                      ),
                      _InfoPill(
                        icon: Icons.place_outlined,
                        label: professional.location,
                      ),
                      _InfoPill(
                        icon: Icons.sell_outlined,
                        label:
                            'From ${AppFormatters.currency(professional.startingPrice)}',
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),
                  Text(
                    professional.about,
                    style: theme.textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 32),
                  const SectionHeader(
                    title: 'Recent work',
                    subtitle: 'A quick look at the style and finish',
                  ),
                  const SizedBox(height: 18),
                  GalleryGrid(images: professional.galleryImages),
                  const SizedBox(height: 32),
                  const SectionHeader(
                    title: 'Services',
                    subtitle: 'Transparent pricing with realistic durations',
                  ),
                  const SizedBox(height: 18),
                  ...professional.services.map(
                    (service) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: ServiceCard(service: service),
                    ),
                  ),
                  const SizedBox(height: 32),
                  SectionHeader(
                    title: 'Ratings and reviews',
                    subtitle: '${professional.reviewCount} trusted opinions',
                    actionLabel: 'View all',
                  ),
                  const SizedBox(height: 18),
                  ...professional.reviews.take(2).map(
                    (review) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  backgroundImage:
                                      NetworkImage(review.authorAvatarUrl),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        review.authorName,
                                        style: theme.textTheme.titleMedium,
                                      ),
                                      Text(
                                        AppFormatters.monthDay(review.createdAt),
                                        style: theme.textTheme.bodyMedium,
                                      ),
                                    ],
                                  ),
                                ),
                                RatingStars(
                                  rating: review.rating,
                                  showLabel: false,
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            Text(review.comment, style: theme.textTheme.bodyLarge),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        top: false,
        minimum: const EdgeInsets.fromLTRB(24, 0, 24, 24),
        child: FilledButton.icon(
          onPressed: () => context.push('/booking/${professional.id}'),
          icon: const Icon(Icons.calendar_month_rounded),
          label: const Text('Book Appointment'),
        ),
      ),
    );
  }
}

class _InfoPill extends StatelessWidget {
  const _InfoPill({
    required this.icon,
    required this.label,
  });

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18, color: theme.colorScheme.onSurface),
          const SizedBox(width: 8),
          Text(
            label,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
