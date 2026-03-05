class AppointmentBooking {
  const AppointmentBooking({
    required this.id,
    required this.professionalId,
    required this.professionalName,
    required this.professionalImageUrl,
    required this.professionalSpecialty,
    required this.serviceTitle,
    required this.startAt,
    required this.durationMinutes,
    required this.price,
    required this.location,
  });

  final String id;
  final String professionalId;
  final String professionalName;
  final String professionalImageUrl;
  final String professionalSpecialty;
  final String serviceTitle;
  final DateTime startAt;
  final int durationMinutes;
  final double price;
  final String location;

  bool get isUpcoming => startAt.isAfter(DateTime.now());
}
