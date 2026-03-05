import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'package:reservation_frontend/features/profile/domain/entities/app_user.dart';
import 'package:reservation_frontend/features/profile/presentation/providers/profile_providers.dart';
import 'package:reservation_frontend/shared/widgets/section_header.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final user = ref.watch(profileProvider);
    final themeMode = ref.watch(themeModeProvider);
    final notificationsEnabled = ref.watch(notificationsEnabledProvider);
    final smartReminders = ref.watch(smartRemindersProvider);

    return ListView(
      padding: const EdgeInsets.fromLTRB(24, 18, 24, 120),
      children: [
        Text('Profile', style: theme.textTheme.headlineMedium),
        const SizedBox(height: 8),
        Text(
          'Manage your account, cards, and app preferences.',
          style: theme.textTheme.bodyLarge,
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                theme.colorScheme.primary.withValues(alpha: 0.10),
                theme.colorScheme.secondary.withValues(alpha: 0.06),
                theme.colorScheme.surface,
              ],
            ),
            borderRadius: BorderRadius.circular(30),
            border: Border.all(
              color: theme.colorScheme.primary.withValues(alpha: 0.10),
            ),
          ),
          child: Row(
            children: [
              Stack(
                children: [
                  CircleAvatar(
                    radius: 34,
                    backgroundImage: NetworkImage(user.avatarUrl),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: 18,
                      height: 18,
                      decoration: BoxDecoration(
                        color: theme.colorScheme.secondary,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: theme.colorScheme.surface,
                          width: 2,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(user.name, style: theme.textTheme.titleLarge),
                    const SizedBox(height: 4),
                    Text(user.email, style: theme.textTheme.bodyMedium),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        user.membershipTier,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.primary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        const SectionHeader(
          title: 'Payment methods',
          subtitle: 'Securely stored checkout options',
        ),
        const SizedBox(height: 18),
        ...user.paymentMethods.map(
          (paymentMethod) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: _PaymentMethodCard(paymentMethod: paymentMethod),
          ),
        ),
        const SizedBox(height: 28),
        const SectionHeader(
          title: 'Preferences',
          subtitle: 'Tailor notifications and appearance',
        ),
        const SizedBox(height: 18),
        _SettingTile(
          title: 'Push notifications',
          subtitle: 'Booking confirmations and changes',
          trailing: Switch(
            value: notificationsEnabled,
            onChanged: (value) =>
                ref.read(notificationsEnabledProvider.notifier).state = value,
          ),
        ),
        const SizedBox(height: 12),
        _SettingTile(
          title: 'Smart reminders',
          subtitle: 'Helpful nudges before each appointment',
          trailing: Switch(
            value: smartReminders,
            onChanged: (value) =>
                ref.read(smartRemindersProvider.notifier).state = value,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Theme mode', style: theme.textTheme.titleMedium),
              const SizedBox(height: 12),
              SegmentedButton<ThemeMode>(
                segments: const [
                  ButtonSegment(
                    value: ThemeMode.system,
                    label: Text('System'),
                    icon: Icon(Icons.phone_android_rounded),
                  ),
                  ButtonSegment(
                    value: ThemeMode.light,
                    label: Text('Light'),
                    icon: Icon(Icons.light_mode_rounded),
                  ),
                  ButtonSegment(
                    value: ThemeMode.dark,
                    label: Text('Dark'),
                    icon: Icon(Icons.dark_mode_rounded),
                  ),
                ],
                selected: {themeMode},
                onSelectionChanged: (selection) {
                  ref.read(themeModeProvider.notifier).state = selection.first;
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 28),
        _SettingTile(
          title: 'Phone number',
          subtitle: user.phone,
          trailing: const Icon(Icons.chevron_right_rounded),
        ),
        const SizedBox(height: 12),
        _SettingTile(
          title: 'Support',
          subtitle: 'Help center, policies, and contact',
          trailing: const Icon(Icons.open_in_new_rounded),
        ),
        const SizedBox(height: 28),
        OutlinedButton.icon(
          onPressed: () => context.go('/auth'),
          icon: const Icon(Icons.logout_rounded),
          label: const Text('Logout'),
        ),
      ],
    );
  }
}

class _PaymentMethodCard extends StatelessWidget {
  const _PaymentMethodCard({required this.paymentMethod});

  final PaymentMethod paymentMethod;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          Container(
            height: 48,
            width: 48,
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceContainer,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              paymentMethod.label == 'Apple Pay'
                  ? Icons.apple_rounded
                  : Icons.credit_card_rounded,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(paymentMethod.label, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 4),
                Text(paymentMethod.detail, style: theme.textTheme.bodyMedium),
              ],
            ),
          ),
          if (paymentMethod.isPrimary)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: theme.colorScheme.secondary.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                'Primary',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.secondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _SettingTile extends StatelessWidget {
  const _SettingTile({
    required this.title,
    required this.subtitle,
    required this.trailing,
  });

  final String title;
  final String subtitle;
  final Widget trailing;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: theme.textTheme.titleMedium),
                const SizedBox(height: 4),
                Text(subtitle, style: theme.textTheme.bodyMedium),
              ],
            ),
          ),
          const SizedBox(width: 12),
          trailing,
        ],
      ),
    );
  }
}
