import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import 'package:reservation_frontend/core/utils/app_formatters.dart';
import 'package:reservation_frontend/features/professionals/domain/entities/professional.dart';

class DiscoveryMap extends StatefulWidget {
  const DiscoveryMap({
    required this.professionals,
    required this.onProfessionalTap,
    super.key,
  });

  final List<Professional> professionals;
  final ValueChanged<Professional> onProfessionalTap;

  @override
  State<DiscoveryMap> createState() => _DiscoveryMapState();
}

class _DiscoveryMapState extends State<DiscoveryMap> {
  late final MapController _mapController;
  String? _selectedProfessionalId;

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
    _selectedProfessionalId = widget.professionals.firstOrNull?.id;
  }

  @override
  void didUpdateWidget(covariant DiscoveryMap oldWidget) {
    super.didUpdateWidget(oldWidget);
    final hasSelectedProfessional = widget.professionals.any(
      (professional) => professional.id == _selectedProfessionalId,
    );

    if (!hasSelectedProfessional) {
      _selectedProfessionalId = widget.professionals.firstOrNull?.id;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (widget.professionals.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('No professionals found', style: theme.textTheme.titleLarge),
            const SizedBox(height: 8),
            Text(
              'Adjust the search or category filters to load locations on the map.',
              style: theme.textTheme.bodyMedium,
            ),
          ],
        ),
      );
    }

    final selectedProfessional = widget.professionals.firstWhere(
      (professional) => professional.id == _selectedProfessionalId,
      orElse: () => widget.professionals.first,
    );
    final initialCenter = _averageCenter(widget.professionals);

    return Container(
      height: 470,
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.07),
            blurRadius: 28,
            offset: const Offset(0, 14),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: Stack(
          children: [
            FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: initialCenter,
                initialZoom: 13.2,
                interactionOptions: const InteractionOptions(
                  flags: InteractiveFlag.drag | InteractiveFlag.pinchZoom,
                ),
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                  userAgentPackageName: 'com.reservation.frontend',
                ),
                MarkerLayer(
                  markers: widget.professionals.map((professional) {
                    final isSelected =
                        professional.id == selectedProfessional.id;
                    return Marker(
                      point: LatLng(
                        professional.latitude,
                        professional.longitude,
                      ),
                      width: isSelected ? 92 : 82,
                      height: 48,
                      child: _MapMarker(
                        professional: professional,
                        isSelected: isSelected,
                        onTap: () => _selectProfessional(professional),
                      ),
                    );
                  }).toList(),
                ),
                RichAttributionWidget(
                  alignment: AttributionAlignment.bottomRight,
                  popupBackgroundColor:
                      theme.colorScheme.surface.withValues(alpha: 0.96),
                  attributions: const [
                    TextSourceAttribution('OpenStreetMap contributors'),
                  ],
                ),
              ],
            ),
            Positioned(
              top: 18,
              left: 18,
              right: 18,
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface.withValues(alpha: 0.92),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.near_me_rounded,
                          size: 16,
                          color: theme.colorScheme.onSurface,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${widget.professionals.length} locations',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurface,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface.withValues(alpha: 0.92),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      'Tap a pin',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurface,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Positioned(
              left: 18,
              right: 18,
              bottom: 18,
              child: _SelectedProfessionalCard(
                professional: selectedProfessional,
                onTap: () => widget.onProfessionalTap(selectedProfessional),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _selectProfessional(Professional professional) {
    setState(() => _selectedProfessionalId = professional.id);
    _mapController.move(
      LatLng(professional.latitude, professional.longitude),
      14.2,
    );
  }

  LatLng _averageCenter(List<Professional> professionals) {
    if (professionals.isEmpty) {
      return const LatLng(48.8566, 2.3522);
    }

    final totalLatitude = professionals.fold<double>(
      0,
      (sum, professional) => sum + professional.latitude,
    );
    final totalLongitude = professionals.fold<double>(
      0,
      (sum, professional) => sum + professional.longitude,
    );

    return LatLng(
      totalLatitude / professionals.length,
      totalLongitude / professionals.length,
    );
  }
}

class _MapMarker extends StatelessWidget {
  const _MapMarker({
    required this.professional,
    required this.isSelected,
    required this.onTap,
  });

  final Professional professional;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOutCubic,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? theme.colorScheme.primary
              : theme.colorScheme.surface.withValues(alpha: 0.96),
          borderRadius: BorderRadius.circular(999),
          border: Border.all(
            color: isSelected
                ? theme.colorScheme.primary
                : theme.colorScheme.outline.withValues(alpha: 0.16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.10),
              blurRadius: 14,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Center(
          child: Text(
            AppFormatters.currency(professional.startingPrice),
            style: theme.textTheme.bodyMedium?.copyWith(
              color: isSelected
                  ? theme.colorScheme.onPrimary
                  : theme.colorScheme.onSurface,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ),
    );
  }
}

class _SelectedProfessionalCard extends StatelessWidget {
  const _SelectedProfessionalCard({
    required this.professional,
    required this.onTap,
  });

  final Professional professional;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Material(
      color: theme.colorScheme.surface.withValues(alpha: 0.97),
      borderRadius: BorderRadius.circular(26),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(26),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.network(
                  professional.coverImageUrl,
                  width: 84,
                  height: 96,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      professional.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      professional.location,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      professional.specialty,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodyLarge,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Text(
                          AppFormatters.distance(professional.distanceKm),
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onSurface,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'From ${AppFormatters.currency(professional.startingPrice)}',
                          style: theme.textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.arrow_forward_rounded,
                  color: theme.colorScheme.onPrimary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
