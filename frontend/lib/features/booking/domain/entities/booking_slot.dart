class BookingSlot {
  const BookingSlot({
    required this.startAt,
    required this.isAvailable,
  });

  final DateTime startAt;
  final bool isAvailable;

  BookingSlot copyWith({
    DateTime? startAt,
    bool? isAvailable,
  }) {
    return BookingSlot(
      startAt: startAt ?? this.startAt,
      isAvailable: isAvailable ?? this.isAvailable,
    );
  }
}
