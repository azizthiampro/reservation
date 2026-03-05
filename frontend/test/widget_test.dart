import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:reservation_frontend/app.dart';

void main() {
  testWidgets('shows onboarding flow on launch', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: BookingApp()));
    await tester.pumpAndSettle();

    expect(find.text('Continue'), findsOneWidget);
    expect(find.textContaining('Book the best local talent'), findsOneWidget);
  });
}
