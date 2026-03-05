import 'package:flutter/material.dart';

import 'package:reservation_frontend/core/utils/app_formatters.dart';

class BookingCalendar extends StatelessWidget {
  const BookingCalendar({
    required this.focusedMonth,
    required this.selectedDate,
    required this.availableDates,
    required this.onDateSelected,
    required this.onMonthChanged,
    super.key,
  });

  final DateTime focusedMonth;
  final DateTime selectedDate;
  final Set<DateTime> availableDates;
  final ValueChanged<DateTime> onDateSelected;
  final ValueChanged<DateTime> onMonthChanged;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final firstDayOfMonth = DateTime(focusedMonth.year, focusedMonth.month);
    final lastDayOfMonth = DateTime(focusedMonth.year, focusedMonth.month + 1, 0);
    final leadingEmptyCells = (firstDayOfMonth.weekday + 6) % 7;
    final days = <DateTime?>[
      ...List<DateTime?>.filled(leadingEmptyCells, null),
      ...List.generate(
        lastDayOfMonth.day,
        (index) => DateTime(focusedMonth.year, focusedMonth.month, index + 1),
      ),
    ];

    while (days.length % 7 != 0) {
      days.add(null);
    }

    final isCurrentMonth = focusedMonth.year == DateTime.now().year &&
        focusedMonth.month == DateTime.now().month;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Text(
                AppFormatters.monthYear(focusedMonth),
                style: theme.textTheme.titleLarge,
              ),
              const Spacer(),
              _MonthButton(
                icon: Icons.chevron_left_rounded,
                isEnabled: !isCurrentMonth,
                onTap: () => onMonthChanged(
                  DateTime(focusedMonth.year, focusedMonth.month - 1),
                ),
              ),
              const SizedBox(width: 8),
              _MonthButton(
                icon: Icons.chevron_right_rounded,
                isEnabled: true,
                onTap: () => onMonthChanged(
                  DateTime(focusedMonth.year, focusedMonth.month + 1),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Row(
            children: List.generate(7, (index) {
              final date = DateTime(2026, 3, index + 2);
              return Expanded(
                child: Center(
                  child: Text(
                    AppFormatters.weekdayNarrow(date),
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: days.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              mainAxisExtent: 54,
            ),
            itemBuilder: (context, index) {
              final date = days[index];
              if (date == null) {
                return const SizedBox.shrink();
              }

              final normalizedDate = DateUtils.dateOnly(date);
              final isSelected = DateUtils.isSameDay(normalizedDate, selectedDate);
              final isAvailable = availableDates.contains(normalizedDate);
              final isPast = normalizedDate.isBefore(DateUtils.dateOnly(DateTime.now()));

              return _DayCell(
                date: normalizedDate,
                isSelected: isSelected,
                isAvailable: isAvailable && !isPast,
                onTap: () => onDateSelected(normalizedDate),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _MonthButton extends StatelessWidget {
  const _MonthButton({
    required this.icon,
    required this.isEnabled,
    required this.onTap,
  });

  final IconData icon;
  final bool isEnabled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Opacity(
      opacity: isEnabled ? 1 : 0.35,
      child: InkWell(
        onTap: isEnabled ? onTap : null,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceContainer,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: theme.colorScheme.onSurface),
        ),
      ),
    );
  }
}

class _DayCell extends StatelessWidget {
  const _DayCell({
    required this.date,
    required this.isSelected,
    required this.isAvailable,
    required this.onTap,
  });

  final DateTime date;
  final bool isSelected;
  final bool isAvailable;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return AnimatedScale(
      duration: const Duration(milliseconds: 220),
      scale: isSelected ? 1 : 0.98,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOutCubic,
        decoration: BoxDecoration(
          color: isSelected
              ? theme.colorScheme.primary
              : isAvailable
                  ? theme.colorScheme.surfaceContainer.withValues(alpha: 0.55)
                  : theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected
                ? theme.colorScheme.primary
                : isAvailable
                    ? theme.colorScheme.outline.withValues(alpha: 0.16)
                    : Colors.transparent,
          ),
        ),
        child: InkWell(
          onTap: isAvailable ? onTap : null,
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '${date.day}',
                  style: theme.textTheme.titleSmall?.copyWith(
                    color: isSelected
                        ? theme.colorScheme.onPrimary
                        : isAvailable
                            ? theme.colorScheme.onSurface
                            : theme.colorScheme.onSurfaceVariant
                                .withValues(alpha: 0.45),
                  ),
                ),
                const SizedBox(height: 4),
                AnimatedContainer(
                  duration: const Duration(milliseconds: 220),
                  width: 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? theme.colorScheme.onPrimary
                        : isAvailable
                            ? theme.colorScheme.secondary
                            : Colors.transparent,
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
