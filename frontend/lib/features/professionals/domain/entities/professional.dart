import 'review.dart';
import 'service.dart';
import 'service_category.dart';

class Professional {
  const Professional({
    required this.id,
    required this.name,
    required this.specialty,
    required this.location,
    required this.about,
    required this.rating,
    required this.reviewCount,
    required this.distanceKm,
    required this.startingPrice,
    required this.latitude,
    required this.longitude,
    required this.coverImageUrl,
    required this.portraitImageUrl,
    required this.galleryImages,
    required this.categories,
    required this.services,
    required this.reviews,
    required this.isFeatured,
  });

  final String id;
  final String name;
  final String specialty;
  final String location;
  final String about;
  final double rating;
  final int reviewCount;
  final double distanceKm;
  final double startingPrice;
  final double latitude;
  final double longitude;
  final String coverImageUrl;
  final String portraitImageUrl;
  final List<String> galleryImages;
  final List<ServiceCategory> categories;
  final List<Service> services;
  final List<Review> reviews;
  final bool isFeatured;
}
