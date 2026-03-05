import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:reservation_frontend/core/utils/app_formatters.dart';
import 'package:reservation_frontend/features/booking/domain/entities/appointment_booking.dart';
import 'package:reservation_frontend/features/booking/presentation/providers/bookings_providers.dart';

class BookingsScreen extends ConsumerWidget {
  const BookingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final upcoming = ref.watch(upcomingBookingsProvider);
    final past = ref.watch(pastBookingsProvider);

    return DefaultTabController(
      length: 2,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 18, 24, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Your bookings', style: theme.textTheme.headlineMedium),
            const SizedBox(height: 8),
            Text(
              'Keep track of upcoming visits and your recent history.',
              style: theme.textTheme.bodyLarge,
            ),
            const SizedBox(height: 24),
            Container(
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(24),
              ),
              child: TabBar(
                dividerColor: Colors.transparent,
                indicator: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: theme.colorScheme.primary.withValues(alpha: 0.12),
                ),
                labelColor: theme.colorScheme.primary,
                unselectedLabelColor: theme.colorScheme.onSurfaceVariant,
                tabs: const [
                  Tab(text: 'Upcoming'),
                  Tab(text: 'Past'),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: TabBarView(
                children: [
                  _BookingList(
                    items: upcoming,
                    emptyTitle: 'Nothing upcoming',
                    emptySubtitle:
                        'Your next confirmed appointment will appear here.',
                  ),
                  _BookingList(
                    items: past,
                    emptyTitle: 'No past appointments',
                    emptySubtitle:
                        'Completed visits will show up here once you book.',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _BookingList extends StatelessWidget {
  const _BookingList({
    required this.items,
    required this.emptyTitle,
    required this.emptySubtitle,
  });

  final List<AppointmentBooking> items;
  final String emptyTitle;
  final String emptySubtitle;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (items.isEmpty) {
      return ListView(
        children: [
          Container(
            margin: const EdgeInsets.only(top: 12),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(28),
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surfaceContainer,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.calendar_month_outlined,
                    size: 38,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 22),
                Text(
                  emptyTitle,
                  style: theme.textTheme.titleLarge,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                Text(
                  emptySubtitle,
                  style: theme.textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ],
      );
    }

    return ListView.separated(
      itemCount: items.length,
      padding: const EdgeInsets.only(bottom: 120),
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final booking = items[index];

        return ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: Stack(
            children: [
              Positioned(
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                child: ColoredBox(
                  color: booking.isUpcoming
                      ? theme.colorScheme.secondary
                      : theme.colorScheme.outline.withValues(alpha: 0.3),
                ),
              ),
              Container(
          padding: const EdgeInsets.fromLTRB(22, 18, 18, 18),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
          ),
          child: Column(
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundImage: NetworkImage(booking.professionalImageUrl),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          booking.professionalName,
                          style: theme.textTheme.titleLarge,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          booking.professionalSpecialty,
                          style: theme.textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: booking.isUpcoming
                          ? theme.colorScheme.secondary.withValues(alpha: 0.12)
                          : theme.colorScheme.surfaceContainer,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      booking.isUpcoming ? 'Upcoming' : 'Completed',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: booking.isUpcoming
                            ? theme.colorScheme.secondary
                            : theme.colorScheme.onSurface,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 18),
              _MetaLine(
                icon: Icons.design_services_outlined,
                label: booking.serviceTitle,
              ),
              _MetaLine(
                icon: Icons.calendar_today_outlined,
                label:
                    '${AppFormatters.fullDate(booking.startAt)} at ${AppFormatters.time(booking.startAt)}',
              ),
              _MetaLine(
                icon: Icons.place_outlined,
                label: booking.location,
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Text(
                    AppFormatters.currency(booking.price),
                    style: theme.textTheme.titleLarge,
                  ),
                  const Spacer(),
                  if (booking.isUpcoming)
                    FilledButton.tonal(
                      onPressed: () => context.push('/professional/${booking.professionalId}'),
                      child: const Text('View Pro'),
                    ),
                ],
              ),
            ],
          ),
        ),
            ],
          ),
        );
      },
    );
  }
}

class _MetaLine extends StatelessWidget {
  const _MetaLine({
    required this.icon,
    required this.label,
  });

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Icon(icon, size: 18, color: theme.colorScheme.onSurfaceVariant),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              label,
              style: theme.textTheme.bodyLarge,
            ),
          ),
        ],
      ),
    );
  }
}
