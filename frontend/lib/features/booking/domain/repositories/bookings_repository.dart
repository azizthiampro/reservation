import '../entities/appointment_booking.dart';
import '../entities/booking_slot.dart';
import '../../../professionals/domain/entities/professional.dart';
import '../../../professionals/domain/entities/service.dart';

abstract class BookingsRepository {
  List<AppointmentBooking> fetchBookings();

  Set<DateTime> fetchAvailableDates({
    required Professional professional,
    required DateTime month,
  });

  Future<List<BookingSlot>> fetchAvailableSlots({
    required Professional professional,
    required DateTime date,
  });

  AppointmentBooking createBooking({
    required Professional professional,
    required Service service,
    required DateTime startAt,
  });
}
