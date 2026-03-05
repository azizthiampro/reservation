enum ServiceCategory {
  barber,
  nails,
  hair,
  beauty,
}

extension ServiceCategoryX on ServiceCategory {
  String get label => switch (this) {
        ServiceCategory.barber => 'Barber',
        ServiceCategory.nails => 'Nails',
        ServiceCategory.hair => 'Hair',
        ServiceCategory.beauty => 'Beauty',
      };
}
