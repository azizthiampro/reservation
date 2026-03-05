import '../../domain/entities/appointment_booking.dart';
import '../../domain/entities/booking_slot.dart';
import '../../domain/repositories/bookings_repository.dart';
import '../../../professionals/domain/entities/professional.dart';
import '../../../professionals/domain/entities/service.dart';

class DemoBookingsRepository implements BookingsRepository {
  static const _slotTemplates = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '13:30',
    '14:00',
  ];

  @override
  List<AppointmentBooking> fetchBookings() => [
        AppointmentBooking(
          id: 'b1',
          professionalId: 'leila-haddad',
          professionalName: 'Leila Haddad',
          professionalImageUrl:
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
          professionalSpecialty: 'Minimal nail art and soft gel sets',
          serviceTitle: 'Micro French Set',
          startAt: DateTime.now().add(const Duration(days: 2, hours: 3)),
          durationMinutes: 85,
          price: 56,
          location: 'Atelier Fleur',
        ),
        AppointmentBooking(
          id: 'b2',
          professionalId: 'mason-reed',
          professionalName: 'Mason Reed',
          professionalImageUrl:
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
          professionalSpecialty: 'Precision fades and beard sculpting',
          serviceTitle: 'Signature Cut',
          startAt: DateTime.now().add(const Duration(days: 6, hours: 5)),
          durationMinutes: 60,
          price: 46,
          location: 'Le Marais Studio',
        ),
        AppointmentBooking(
          id: 'b3',
          professionalId: 'amira-bennett',
          professionalName: 'Amira Bennett',
          professionalImageUrl:
              'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
          professionalSpecialty: 'Brows, skin prep, and event-ready makeup',
          serviceTitle: 'Skin Prep Facial',
          startAt: DateTime.now().subtract(const Duration(days: 5, hours: 2)),
          durationMinutes: 45,
          price: 44,
          location: 'Maison Glow',
        ),
      ];

  @override
  Set<DateTime> fetchAvailableDates({
    required Professional professional,
    required DateTime month,
  }) {
    final today = _dateOnly(DateTime.now());
    final firstDay = DateTime(month.year, month.month);
    final lastDay = DateTime(month.year, month.month + 1, 0);
    final availableDates = <DateTime>{};

    for (var day = firstDay.day; day <= lastDay.day; day++) {
      final date = DateTime(month.year, month.month, day);
      if (date.isBefore(today)) {
        continue;
      }

      final slots = _buildSlots(professional: professional, date: date);
      if (slots.any((slot) => slot.isAvailable)) {
        availableDates.add(_dateOnly(date));
      }
    }

    return availableDates;
  }

  @override
  Future<List<BookingSlot>> fetchAvailableSlots({
    required Professional professional,
    required DateTime date,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 420));
    return _buildSlots(professional: professional, date: date);
  }

  @override
  AppointmentBooking createBooking({
    required Professional professional,
    required Service service,
    required DateTime startAt,
  }) {
    return AppointmentBooking(
      id: 'booking-${DateTime.now().millisecondsSinceEpoch}',
      professionalId: professional.id,
      professionalName: professional.name,
      professionalImageUrl: professional.portraitImageUrl,
      professionalSpecialty: professional.specialty,
      serviceTitle: service.title,
      startAt: startAt,
      durationMinutes: service.durationMinutes,
      price: service.price,
      location: professional.location,
    );
  }

  List<BookingSlot> _buildSlots({
    required Professional professional,
    required DateTime date,
  }) {
    final today = _dateOnly(DateTime.now());
    final slotDate = _dateOnly(date);

    if (slotDate.isBefore(today) || slotDate.weekday == DateTime.sunday) {
      return const [];
    }

    final professionalSeed = professional.id.codeUnits.fold<int>(
      0,
      (sum, codeUnit) => sum + codeUnit,
    );

    return _slotTemplates.map((label) {
      final startAt = _combineDateAndTime(slotDate, label);
      final seed = professionalSeed +
          (slotDate.day * 13) +
          (slotDate.month * 29) +
          (slotDate.weekday * 7) +
          label.codeUnits.fold<int>(0, (sum, codeUnit) => sum + codeUnit);
      final isAvailable = seed % 5 != 0 && seed % 11 != 0;

      return BookingSlot(
        startAt: startAt,
        isAvailable: isAvailable,
      );
    }).toList();
  }

  DateTime _combineDateAndTime(DateTime date, String label) {
    final parts = label.split(':');
    return DateTime(
      date.year,
      date.month,
      date.day,
      int.parse(parts[0]),
      int.parse(parts[1]),
    );
  }

  DateTime _dateOnly(DateTime value) => DateTime(
        value.year,
        value.month,
        value.day,
      );
}
