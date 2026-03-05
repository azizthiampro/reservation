import 'package:intl/intl.dart';

abstract final class AppFormatters {
  static final NumberFormat _currency =
      NumberFormat.currency(locale: 'en_US', symbol: '\$', decimalDigits: 0);

  static String currency(num value) => _currency.format(value);

  static String shortDate(DateTime value) => DateFormat('EEE, MMM d').format(value);

  static String fullDate(DateTime value) =>
      DateFormat('EEEE, MMMM d').format(value);

  static String monthYear(DateTime value) =>
      DateFormat('MMMM yyyy').format(value);

  static String monthDay(DateTime value) => DateFormat('MMM d').format(value);

  static String weekdayShort(DateTime value) => DateFormat('EEE').format(value);

  static String weekdayNarrow(DateTime value) => DateFormat('EEEEE').format(value);

  static String time(DateTime value) => DateFormat('h:mm a').format(value);

  static String timeCompact(DateTime value) => DateFormat('HH:mm').format(value);

  static String distance(double kilometers) =>
      '${kilometers.toStringAsFixed(1)} km';

  static String duration(int minutes) {
    if (minutes < 60) return '${minutes}m';
    final hours = minutes ~/ 60;
    final remaining = minutes % 60;
    if (remaining == 0) return '${hours}h';
    return '${hours}h ${remaining}m';
  }
}
