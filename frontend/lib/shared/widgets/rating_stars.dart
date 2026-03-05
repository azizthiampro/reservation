import 'package:flutter/material.dart';

class RatingStars extends StatelessWidget {
  const RatingStars({
    required this.rating,
    this.size = 16,
    this.showLabel = true,
    super.key,
  });

  final double rating;
  final double size;
  final bool showLabel;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final stars = List.generate(5, (index) {
      final icon = rating >= index + 1
          ? Icons.star_rounded
          : rating > index
              ? Icons.star_half_rounded
              : Icons.star_outline_rounded;
      return Icon(icon, size: size, color: const Color(0xFFFFB34D));
    });

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        ...stars,
        if (showLabel) ...[
          const SizedBox(width: 6),
          Text(
            rating.toStringAsFixed(1),
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ],
    );
  }
}
