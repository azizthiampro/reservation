import 'package:flutter/material.dart';

import '../../features/professionals/domain/entities/service_category.dart';

class CategoryChip extends StatelessWidget {
  const CategoryChip({
    required this.category,
    required this.isSelected,
    required this.onTap,
    super.key,
  });

  final ServiceCategory category;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final icon = switch (category) {
      ServiceCategory.barber => Icons.content_cut_rounded,
      ServiceCategory.nails => Icons.back_hand_rounded,
      ServiceCategory.hair => Icons.air_rounded,
      ServiceCategory.beauty => Icons.spa_rounded,
    };

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
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected
                    ? theme.colorScheme.onPrimary
                    : theme.colorScheme.onSurface,
              ),
              const SizedBox(width: 10),
              Text(
                category.label,
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: isSelected
                      ? theme.colorScheme.onPrimary
                      : theme.colorScheme.onSurface,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
