import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/demo_bookings_repository.dart';
import '../../domain/entities/appointment_booking.dart';
import '../../domain/entities/booking_slot.dart';
import '../../domain/repositories/bookings_repository.dart';
import '../../../professionals/domain/entities/professional.dart';
import '../../../professionals/domain/entities/service.dart';
import '../../../professionals/presentation/providers/professionals_providers.dart';

class BookingsController extends StateNotifier<List<AppointmentBooking>> {
  BookingsController(this._repository)
      : super(_sortBookings(_repository.fetchBookings()));

  final BookingsRepository _repository;

  void confirmBooking({
    required Professional professional,
    required Service service,
    required DateTime startAt,
  }) {
    final booking = _repository.createBooking(
      professional: professional,
      service: service,
      startAt: startAt,
    );

    state = _sortBookings([booking, ...state]);
  }

  static List<AppointmentBooking> _sortBookings(
    List<AppointmentBooking> bookings,
  ) {
    final items = [...bookings];
    items.sort((left, right) => left.startAt.compareTo(right.startAt));
    return items;
  }
}

class BookingSelectionState {
  const BookingSelectionState({
    this.selectedServiceId,
    required this.focusedMonth,
    required this.selectedDate,
    this.selectedSlotStart,
  });

  final String? selectedServiceId;
  final DateTime focusedMonth;
  final DateTime selectedDate;
  final DateTime? selectedSlotStart;

  bool get canConfirm =>
      selectedServiceId != null && selectedSlotStart != null;

  BookingSelectionState copyWith({
    String? selectedServiceId,
    bool clearService = false,
    DateTime? focusedMonth,
    DateTime? selectedDate,
    DateTime? selectedSlotStart,
    bool clearSlot = false,
  }) {
    return BookingSelectionState(
      selectedServiceId: clearService
          ? null
          : selectedServiceId ?? this.selectedServiceId,
      focusedMonth: focusedMonth ?? this.focusedMonth,
      selectedDate: selectedDate ?? this.selectedDate,
      selectedSlotStart: clearSlot
          ? null
          : selectedSlotStart ?? this.selectedSlotStart,
    );
  }
}

class BookingSelectionController extends StateNotifier<BookingSelectionState> {
  BookingSelectionController() : super(_initialState());

  void selectService(String serviceId) {
    state = state.copyWith(selectedServiceId: serviceId);
  }

  void focusMonth(DateTime month) {
    state = state.copyWith(focusedMonth: _monthStart(month));
  }

  void selectDate(DateTime date) {
    final normalizedDate = DateUtils.dateOnly(date);
    state = state.copyWith(
      focusedMonth: _monthStart(normalizedDate),
      selectedDate: normalizedDate,
      clearSlot: true,
    );
  }

  void selectTime(DateTime startAt) {
    state = state.copyWith(selectedSlotStart: startAt);
  }

  static DateTime _initialSelectedDate() {
    final today = DateUtils.dateOnly(DateTime.now());
    return today.add(const Duration(days: 1));
  }

  static BookingSelectionState _initialState() {
    final initialDate = _initialSelectedDate();
    return BookingSelectionState(
      focusedMonth: _monthStart(initialDate),
      selectedDate: initialDate,
    );
  }

  static DateTime _monthStart(DateTime value) =>
      DateTime(value.year, value.month);
}

final bookingsRepositoryProvider = Provider<BookingsRepository>(
  (ref) => DemoBookingsRepository(),
);

final bookingsControllerProvider =
    StateNotifierProvider<BookingsController, List<AppointmentBooking>>(
  (ref) => BookingsController(ref.watch(bookingsRepositoryProvider)),
);

final bookingSelectionProvider = StateNotifierProvider.autoDispose
    .family<BookingSelectionController, BookingSelectionState, String>(
  (ref, professionalId) {
    ref.watch(professionalProvider(professionalId));
    return BookingSelectionController();
  },
);

final availableBookingDaysProvider =
    Provider.autoDispose.family<Set<DateTime>, ({String professionalId, DateTime month})>(
  (ref, request) {
    final professional = ref.watch(professionalProvider(request.professionalId));
    final repository = ref.watch(bookingsRepositoryProvider);

    return repository.fetchAvailableDates(
      professional: professional,
      month: request.month,
    );
  },
);

final availableBookingSlotsProvider = FutureProvider.autoDispose
    .family<List<BookingSlot>, ({String professionalId, DateTime date})>(
  (ref, request) async {
    final professional = ref.watch(professionalProvider(request.professionalId));
    final repository = ref.watch(bookingsRepositoryProvider);
    final existingBookings = ref.watch(bookingsControllerProvider);
    final baseSlots = await repository.fetchAvailableSlots(
      professional: professional,
      date: request.date,
    );

    return baseSlots.map((slot) {
      final alreadyBooked = existingBookings.any(
        (booking) =>
            booking.professionalId == request.professionalId &&
            booking.startAt.year == slot.startAt.year &&
            booking.startAt.month == slot.startAt.month &&
            booking.startAt.day == slot.startAt.day &&
            booking.startAt.hour == slot.startAt.hour &&
            booking.startAt.minute == slot.startAt.minute,
      );

      return slot.copyWith(isAvailable: slot.isAvailable && !alreadyBooked);
    }).toList();
  },
);

final upcomingBookingsProvider = Provider<List<AppointmentBooking>>((ref) {
  final bookings = ref.watch(bookingsControllerProvider);
  final now = DateTime.now();
  return bookings.where((booking) => booking.startAt.isAfter(now)).toList();
});

final pastBookingsProvider = Provider<List<AppointmentBooking>>((ref) {
  final bookings = ref.watch(bookingsControllerProvider);
  final now = DateTime.now();
  return bookings.where((booking) => booking.startAt.isBefore(now)).toList()
    ..sort((left, right) => right.startAt.compareTo(left.startAt));
});
