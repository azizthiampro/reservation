import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _pageIndex = 0;

  static const _slides = [
    _OnboardingSlide(
      title: 'Book the best local talent in minutes',
      description:
          'Discover premium barbers, nail artists, and beauty professionals with refined service details and real reviews.',
      accent: Color(0xFFB87463),
      icon: Icons.storefront_rounded,
    ),
    _OnboardingSlide(
      title: 'Choose services, slots, and confirm instantly',
      description:
          'A fast flow inspired by the best ride-hailing and beauty apps: clear choices, effortless timing, and no friction.',
      accent: Color(0xFF6D8A73),
      icon: Icons.event_available_rounded,
    ),
    _OnboardingSlide(
      title: 'Keep every appointment in one elegant place',
      description:
          'Track upcoming bookings, review past visits, and manage payment preferences with a polished mobile-first experience.',
      accent: Color(0xFF8FA8BF),
      icon: Icons.mobile_friendly_rounded,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _nextStep() async {
    if (_pageIndex == _slides.length - 1) {
      context.go('/auth');
      return;
    }

    await _pageController.nextPage(
      duration: const Duration(milliseconds: 320),
      curve: Curves.easeOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final slide = _slides[_pageIndex];

    return Scaffold(
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              theme.colorScheme.surface,
              theme.scaffoldBackgroundColor,
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surfaceContainer,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        'Reserve',
                        style: theme.textTheme.titleMedium,
                      ),
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: () => context.go('/auth'),
                      child: const Text('Skip'),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    itemCount: _slides.length,
                    onPageChanged: (index) => setState(() => _pageIndex = index),
                    itemBuilder: (context, index) {
                      final item = _slides[index];
                      return LayoutBuilder(
                        builder: (context, constraints) {
                          final compact = constraints.maxHeight < 620;

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: _OnboardingArtwork(
                                  slide: item,
                                  compact: compact,
                                ),
                              ),
                              SizedBox(height: compact ? 18 : 28),
                              Text(
                                item.title,
                                style: theme.textTheme.displayLarge?.copyWith(
                                  fontSize: compact ? 29 : 34,
                                  height: 1.05,
                                ),
                              ),
                              SizedBox(height: compact ? 12 : 16),
                              Text(
                                item.description,
                                style: theme.textTheme.bodyLarge?.copyWith(
                                  fontSize: compact ? 14 : 15,
                                ),
                              ),
                            ],
                          );
                        },
                      );
                    },
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  children: List.generate(
                    _slides.length,
                    (index) => AnimatedContainer(
                      duration: const Duration(milliseconds: 240),
                      margin: const EdgeInsets.only(right: 8),
                      height: 8,
                      width: _pageIndex == index ? 26 : 8,
                      decoration: BoxDecoration(
                        color: _pageIndex == index
                            ? slide.accent
                            : theme.colorScheme.surfaceContainerHighest,
                        borderRadius: BorderRadius.circular(999),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: _nextStep,
                    icon: Icon(
                      _pageIndex == _slides.length - 1
                          ? Icons.arrow_forward_rounded
                          : Icons.north_east_rounded,
                    ),
                    label: Text(
                      _pageIndex == _slides.length - 1
                          ? 'Get Started'
                          : 'Continue',
                    ),
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

class _OnboardingArtwork extends StatelessWidget {
  const _OnboardingArtwork({
    required this.slide,
    required this.compact,
  });

  final _OnboardingSlide slide;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final headerAvatarSize = compact ? 20.0 : 24.0;

    return LayoutBuilder(
      builder: (context, constraints) {
        final showFloatingBadge = constraints.maxHeight > 240;

        return Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned.fill(
              child: Padding(
                padding: EdgeInsets.fromLTRB(
                  12,
                  compact ? 12 : 28,
                  12,
                  compact ? 20 : 52,
                ),
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(compact ? 30 : 40),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        slide.accent.withValues(alpha: 0.24),
                        theme.colorScheme.surface,
                      ],
                    ),
                  ),
                ),
              ),
            ),
            Positioned.fill(
              child: Padding(
                padding: EdgeInsets.fromLTRB(
                  compact ? 16 : 30,
                  compact ? 22 : 62,
                  compact ? 16 : 30,
                  showFloatingBadge
                      ? (compact ? 42 : 92)
                      : (compact ? 16 : 24),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(compact ? 26 : 34),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 26,
                        offset: const Offset(0, 18),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(compact ? 16 : 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: headerAvatarSize,
                              backgroundColor:
                                  slide.accent.withValues(alpha: 0.12),
                              child: Icon(
                                slide.icon,
                                color: slide.accent,
                                size: headerAvatarSize,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: EdgeInsets.symmetric(
                                horizontal: compact ? 10 : 12,
                                vertical: compact ? 6 : 8,
                              ),
                              decoration: BoxDecoration(
                                color: theme.colorScheme.surfaceContainer,
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Text(
                                '4.9 Avg Rating',
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  color: theme.colorScheme.onSurface,
                                  fontWeight: FontWeight.w700,
                                  fontSize: compact ? 11 : null,
                                ),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: compact ? 12 : 20),
                        const Spacer(),
                        _InsightTile(
                          label: 'Beauty pros nearby',
                          value: '240+',
                          accent: slide.accent,
                          compact: compact,
                        ),
                        SizedBox(height: compact ? 8 : 12),
                        _InsightTile(
                          label: 'Instant slots available',
                          value: 'Today',
                          accent: theme.colorScheme.secondary,
                          compact: compact,
                        ),
                        if (!compact) ...[
                          const SizedBox(height: 12),
                          _InsightTile(
                            label: 'Average confirmation',
                            value: '< 10 min',
                            accent: theme.colorScheme.tertiary,
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ),
            ),
            if (showFloatingBadge)
              Positioned(
                bottom: compact ? 16 : 28,
                right: compact ? 16 : 28,
                child: Transform.rotate(
                  angle: -0.08,
                  child: Container(
                    width: compact ? 132 : 160,
                    padding: EdgeInsets.all(compact ? 14 : 18),
                    decoration: BoxDecoration(
                      color: slide.accent,
                      borderRadius: BorderRadius.circular(compact ? 22 : 28),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.flash_on_rounded, color: Colors.white),
                        SizedBox(height: compact ? 10 : 18),
                        Text(
                          'Simple, polished, and fast.',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: Colors.white,
                            fontSize: compact ? 13 : 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}

class _InsightTile extends StatelessWidget {
  const _InsightTile({
    required this.label,
    required this.value,
    required this.accent,
    this.compact = false,
  });

  final String label;
  final String value;
  final Color accent;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: EdgeInsets.all(compact ? 12 : 16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Row(
        children: [
          Container(
            height: compact ? 8 : 10,
            width: compact ? 8 : 10,
            decoration: BoxDecoration(color: accent, shape: BoxShape.circle),
          ),
          SizedBox(width: compact ? 10 : 12),
          Expanded(
            child: Text(
              label,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontSize: compact ? 11 : null,
              ),
            ),
          ),
          Text(
            value,
            style: theme.textTheme.titleMedium?.copyWith(
              fontSize: compact ? 14 : null,
            ),
          ),
        ],
      ),
    );
  }
}

class _OnboardingSlide {
  const _OnboardingSlide({
    required this.title,
    required this.description,
    required this.accent,
    required this.icon,
  });

  final String title;
  final String description;
  final Color accent;
  final IconData icon;
}
