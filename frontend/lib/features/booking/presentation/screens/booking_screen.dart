import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:reservation_frontend/core/utils/app_formatters.dart';
import 'package:reservation_frontend/features/booking/domain/entities/booking_slot.dart';
import 'package:reservation_frontend/features/booking/presentation/providers/bookings_providers.dart';
import 'package:reservation_frontend/features/booking/presentation/widgets/booking_calendar.dart';
import 'package:reservation_frontend/features/booking/presentation/widgets/time_slot_chip.dart';
import 'package:reservation_frontend/features/professionals/presentation/providers/professionals_providers.dart';
import 'package:reservation_frontend/shared/widgets/section_header.dart';
import 'package:reservation_frontend/shared/widgets/service_card.dart';

class BookingScreen extends ConsumerWidget {
  const BookingScreen({
    required this.professionalId,
    super.key,
  });

  final String professionalId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final professional = ref.watch(professionalProvider(professionalId));
    final selection = ref.watch(bookingSelectionProvider(professionalId));
    final selectionNotifier =
        ref.read(bookingSelectionProvider(professionalId).notifier);
    final availableDates = ref.watch(
      availableBookingDaysProvider(
        (
          professionalId: professionalId,
          month: selection.focusedMonth,
        ),
      ),
    );
    final slotsAsync = ref.watch(
      availableBookingSlotsProvider(
        (
          professionalId: professionalId,
          date: selection.selectedDate,
        ),
      ),
    );

    final selectedService = selection.selectedServiceId == null
        ? null
        : professional.services.firstWhere(
            (service) => service.id == selection.selectedServiceId,
          );

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.arrow_back_rounded),
        ),
        title: const Text('Book Appointment'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 156),
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              borderRadius: BorderRadius.circular(28),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(22),
                  child: Image.network(
                    professional.coverImageUrl,
                    width: 78,
                    height: 92,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(professional.name, style: theme.textTheme.titleLarge),
                      const SizedBox(height: 4),
                      Text(
                        professional.specialty,
                        style: theme.textTheme.bodyMedium,
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Icon(
                            Icons.place_outlined,
                            size: 16,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              professional.location,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: theme.textTheme.bodyMedium,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),
          const SectionHeader(
            title: '1. Choose a service',
            subtitle: 'Pick the treatment before selecting a time',
          ),
          const SizedBox(height: 18),
          ...professional.services.map(
            (service) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: ServiceCard(
                service: service,
                isSelected: selection.selectedServiceId == service.id,
                onTap: () => selectionNotifier.selectService(service.id),
              ),
            ),
          ),
          const SizedBox(height: 28),
          const SectionHeader(
            title: '2. Select a date',
            subtitle: 'Only available booking days are enabled',
          ),
          const SizedBox(height: 18),
          BookingCalendar(
            focusedMonth: selection.focusedMonth,
            selectedDate: selection.selectedDate,
            availableDates: availableDates,
            onDateSelected: selectionNotifier.selectDate,
            onMonthChanged: selectionNotifier.focusMonth,
          ),
          const SizedBox(height: 28),
          SectionHeader(
            title: '3. Pick a time',
            subtitle:
                'Available slots for ${AppFormatters.fullDate(selection.selectedDate)}',
          ),
          const SizedBox(height: 18),
          slotsAsync.when(
            loading: () => const _TimeSlotsLoading(),
            error: (_, __) => _TimeSlotsError(
              onRetry: () {
                ref.invalidate(
                  availableBookingSlotsProvider(
                    (
                      professionalId: professionalId,
                      date: selection.selectedDate,
                    ),
                  ),
                );
              },
            ),
            data: (slots) => _TimeSlotsSection(
              slots: slots,
              selectedSlotStart: selection.selectedSlotStart,
              onSlotSelected: selectionNotifier.selectTime,
            ),
          ),
          const SizedBox(height: 28),
          const SectionHeader(
            title: '4. Booking summary',
            subtitle: 'Review the appointment details before confirming',
          ),
          const SizedBox(height: 18),
          _BookingSummaryCard(
            serviceTitle: selectedService?.title,
            durationLabel: selectedService == null
                ? null
                : AppFormatters.duration(selectedService.durationMinutes),
            dateLabel: AppFormatters.fullDate(selection.selectedDate),
            timeLabel: selection.selectedSlotStart == null
                ? null
                : AppFormatters.timeCompact(selection.selectedSlotStart!),
            priceLabel: selectedService == null
                ? null
                : AppFormatters.currency(selectedService.price),
          ),
        ],
      ),
      bottomNavigationBar: SafeArea(
        top: false,
        minimum: const EdgeInsets.fromLTRB(20, 0, 20, 20),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface.withValues(alpha: 0.98),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.08),
                blurRadius: 22,
                offset: const Offset(0, 12),
              ),
            ],
          ),
          child: FilledButton.icon(
            onPressed: selection.canConfirm && selectedService != null
                ? () async {
                    final startAt = selection.selectedSlotStart!;

                    ref.read(bookingsControllerProvider.notifier).confirmBooking(
                          professional: professional,
                          service: selectedService,
                          startAt: startAt,
                        );

                    final shouldOpenBookings = await _showConfirmationSheet(
                      context,
                      serviceTitle: selectedService.title,
                      dateLabel: AppFormatters.fullDate(startAt),
                      timeLabel: AppFormatters.timeCompact(startAt),
                    );

                    if (context.mounted && shouldOpenBookings) {
                      context.go('/bookings');
                    }
                  }
                : null,
            icon: const Icon(Icons.check_circle_outline_rounded),
            label: const Text('Confirm Appointment'),
          ),
        ),
      ),
    );
  }

  Future<bool> _showConfirmationSheet(
    BuildContext context, {
    required String serviceTitle,
    required String dateLabel,
    required String timeLabel,
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) {
        final theme = Theme.of(sheetContext);

        return SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 42,
                  height: 4,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.outline.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
                const SizedBox(height: 24),
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.check_rounded,
                    size: 34,
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Appointment confirmed',
                  style: theme.textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  '$serviceTitle on $dateLabel at $timeLabel.',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.bodyLarge,
                ),
                const SizedBox(height: 24),
                FilledButton(
                  onPressed: () {
                    Navigator.of(sheetContext).pop(true);
                  },
                  child: const Text('View Bookings'),
                ),
              ],
            ),
          ),
        );
      },
    ).then((value) => value ?? false);
  }
}

class _TimeSlotsSection extends StatelessWidget {
  const _TimeSlotsSection({
    required this.slots,
    required this.selectedSlotStart,
    required this.onSlotSelected,
  });

  final List<BookingSlot> slots;
  final DateTime? selectedSlotStart;
  final ValueChanged<DateTime> onSlotSelected;

  @override
  Widget build(BuildContext context) {
    final availableSlots = slots.where((slot) => slot.isAvailable).toList();

    if (slots.isEmpty || availableSlots.isEmpty) {
      final theme = Theme.of(context);

      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Text(
          'No slots left for this day. Pick another date to continue.',
          style: theme.textTheme.bodyLarge,
        ),
      );
    }

    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: slots.map((slot) {
        final isSelected = selectedSlotStart != null &&
            selectedSlotStart!.year == slot.startAt.year &&
            selectedSlotStart!.month == slot.startAt.month &&
            selectedSlotStart!.day == slot.startAt.day &&
            selectedSlotStart!.hour == slot.startAt.hour &&
            selectedSlotStart!.minute == slot.startAt.minute;

        return TimeSlotChip(
          label: AppFormatters.timeCompact(slot.startAt),
          isSelected: isSelected,
          isAvailable: slot.isAvailable,
          onTap: () => onSlotSelected(slot.startAt),
        );
      }).toList(),
    );
  }
}

class _TimeSlotsLoading extends StatelessWidget {
  const _TimeSlotsLoading();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: List.generate(
        6,
        (_) => Container(
          width: 96,
          height: 50,
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(18),
          ),
        ),
      ),
    );
  }
}

class _TimeSlotsError extends StatelessWidget {
  const _TimeSlotsError({required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Unable to load slots', style: theme.textTheme.titleMedium),
          const SizedBox(height: 8),
          Text(
            'Please try again to refresh the availability for this date.',
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          OutlinedButton(
            onPressed: onRetry,
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }
}

class _BookingSummaryCard extends StatelessWidget {
  const _BookingSummaryCard({
    required this.serviceTitle,
    required this.durationLabel,
    required this.dateLabel,
    required this.timeLabel,
    required this.priceLabel,
  });

  final String? serviceTitle;
  final String? durationLabel;
  final String dateLabel;
  final String? timeLabel;
  final String? priceLabel;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          _SummaryRow(
            label: 'Service',
            value: serviceTitle ?? 'Select a service',
          ),
          _SummaryRow(
            label: 'Duration',
            value: durationLabel ?? 'Select a service',
          ),
          _SummaryRow(
            label: 'Date',
            value: dateLabel,
          ),
          _SummaryRow(
            label: 'Time',
            value: timeLabel ?? 'Choose a slot',
          ),
          _SummaryRow(
            label: 'Price',
            value: priceLabel ?? 'Select a service',
            isEmphasized: true,
          ),
        ],
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  const _SummaryRow({
    required this.label,
    required this.value,
    this.isEmphasized = false,
  });

  final String label;
  final String value;
  final bool isEmphasized;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Text(label, style: theme.textTheme.bodyMedium),
          const Spacer(),
          Flexible(
            child: Text(
              value,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.right,
              style: (isEmphasized
                      ? theme.textTheme.titleMedium
                      : theme.textTheme.bodyLarge)
                  ?.copyWith(
                    fontWeight: isEmphasized ? FontWeight.w800 : FontWeight.w600,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}
