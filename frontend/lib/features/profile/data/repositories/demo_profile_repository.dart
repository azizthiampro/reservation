import '../../domain/entities/app_user.dart';
import '../../domain/repositories/profile_repository.dart';

class DemoProfileRepository implements ProfileRepository {
  @override
  AppUser fetchProfile() {
    return const AppUser(
      name: 'Ava Thompson',
      email: 'ava.thompson@example.com',
      phone: '+1 202 555 0148',
      avatarUrl:
          'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
      membershipTier: 'Gold Member',
      paymentMethods: [
        PaymentMethod(
          id: 'card-1',
          label: 'Visa',
          detail: '•••• 1842',
          isPrimary: true,
        ),
        PaymentMethod(
          id: 'card-2',
          label: 'Apple Pay',
          detail: 'Connected',
          isPrimary: false,
        ),
      ],
    );
  }
}
