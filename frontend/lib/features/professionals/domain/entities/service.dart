import 'service_category.dart';

class Service {
  const Service({
    required this.id,
    required this.title,
    required this.description,
    required this.durationMinutes,
    required this.price,
    required this.category,
  });

  final String id;
  final String title;
  final String description;
  final int durationMinutes;
  final double price;
  final ServiceCategory category;
}
