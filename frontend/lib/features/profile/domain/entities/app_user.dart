class PaymentMethod {
  const PaymentMethod({
    required this.id,
    required this.label,
    required this.detail,
    required this.isPrimary,
  });

  final String id;
  final String label;
  final String detail;
  final bool isPrimary;
}

class AppUser {
  const AppUser({
    required this.name,
    required this.email,
    required this.phone,
    required this.avatarUrl,
    required this.membershipTier,
    required this.paymentMethods,
  });

  final String name;
  final String email;
  final String phone;
  final String avatarUrl;
  final String membershipTier;
  final List<PaymentMethod> paymentMethods;
}
