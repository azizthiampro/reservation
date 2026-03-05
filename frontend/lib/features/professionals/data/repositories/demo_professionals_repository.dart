import '../../domain/entities/professional.dart';
import '../../domain/entities/review.dart';
import '../../domain/entities/service.dart';
import '../../domain/entities/service_category.dart';
import '../../domain/repositories/professionals_repository.dart';

class DemoProfessionalsRepository implements ProfessionalsRepository {
  @override
  List<Professional> fetchProfessionals() => List.unmodifiable(_professionals);

  @override
  Professional getById(String id) =>
      _professionals.firstWhere((professional) => professional.id == id);
}

final List<Professional> _professionals = [
  Professional(
    id: 'mason-reed',
    name: 'Mason Reed',
    specialty: 'Precision fades and beard sculpting',
    location: 'Le Marais Studio',
    about:
        'Mason blends classic barber craft with a clean editorial finish. Clients book him for sharp fades, textured crops, and a calm premium in-chair experience.',
    rating: 4.9,
    reviewCount: 128,
    distanceKm: 1.2,
    startingPrice: 28,
    latitude: 48.8585,
    longitude: 2.3633,
    coverImageUrl:
        'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80',
    portraitImageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    galleryImages: const [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
    ],
    categories: const [ServiceCategory.barber],
    services: const [
      Service(
        id: 'skin-fade',
        title: 'Skin Fade',
        description: 'Clean taper, wash, and styling finish.',
        durationMinutes: 45,
        price: 34,
        category: ServiceCategory.barber,
      ),
      Service(
        id: 'beard-detail',
        title: 'Beard Detail',
        description: 'Shape, line-up, hot towel, and nourishing oil.',
        durationMinutes: 30,
        price: 22,
        category: ServiceCategory.barber,
      ),
      Service(
        id: 'signature-cut',
        title: 'Signature Cut',
        description: 'Consultation, scissor work, fade detail, and style.',
        durationMinutes: 60,
        price: 46,
        category: ServiceCategory.barber,
      ),
    ],
    reviews: [
      Review(
        id: 'r1',
        authorName: 'Jordan',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment:
            'Best fade I have had in months. Fast, clean, and the shop feels premium.',
        createdAt: DateTime(2026, 2, 25),
      ),
      Review(
        id: 'r2',
        authorName: 'Noah',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        comment: 'Attention to detail is excellent, especially on beard work.',
        createdAt: DateTime(2026, 2, 18),
      ),
    ],
    isFeatured: true,
  ),
  Professional(
    id: 'leila-haddad',
    name: 'Leila Haddad',
    specialty: 'Minimal nail art and soft gel sets',
    location: 'Atelier Fleur',
    about:
        'Leila is known for glossy neutrals, refined French sets, and sculpted overlays that last. Her appointments are calm, precise, and highly personalized.',
    rating: 4.95,
    reviewCount: 201,
    distanceKm: 2.8,
    startingPrice: 36,
    latitude: 48.8534,
    longitude: 2.3341,
    coverImageUrl:
        'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80',
    portraitImageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    galleryImages: const [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
    ],
    categories: const [ServiceCategory.nails, ServiceCategory.beauty],
    services: const [
      Service(
        id: 'soft-gel',
        title: 'Soft Gel Overlay',
        description: 'Short-to-medium structured gel with glossy finish.',
        durationMinutes: 70,
        price: 48,
        category: ServiceCategory.nails,
      ),
      Service(
        id: 'micro-french',
        title: 'Micro French Set',
        description: 'Soft pink base with ultra-fine French detailing.',
        durationMinutes: 85,
        price: 56,
        category: ServiceCategory.nails,
      ),
      Service(
        id: 'repair-removal',
        title: 'Repair + Removal',
        description: 'Safe soak-off, reshaping, and nail treatment.',
        durationMinutes: 45,
        price: 32,
        category: ServiceCategory.nails,
      ),
    ],
    reviews: [
      Review(
        id: 'r3',
        authorName: 'Hana',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment:
            'The clean-girl nail look exactly as I wanted. Durable and super polished.',
        createdAt: DateTime(2026, 2, 27),
      ),
      Review(
        id: 'r4',
        authorName: 'Camille',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        comment: 'Beautiful detail work and very relaxing appointment.',
        createdAt: DateTime(2026, 2, 10),
      ),
    ],
    isFeatured: true,
  ),
  Professional(
    id: 'sofia-park',
    name: 'Sofia Park',
    specialty: 'Color gloss, silk press, and movement cuts',
    location: 'Studio North',
    about:
        'Sofia focuses on healthy shine, lived-in color, and movement-first cuts. Her clients love low-maintenance styles that still feel polished every day.',
    rating: 4.87,
    reviewCount: 176,
    distanceKm: 3.4,
    startingPrice: 42,
    latitude: 48.8721,
    longitude: 2.3495,
    coverImageUrl:
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80',
    portraitImageUrl:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    galleryImages: const [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    ],
    categories: const [ServiceCategory.hair, ServiceCategory.beauty],
    services: const [
      Service(
        id: 'movement-cut',
        title: 'Movement Cut',
        description: 'Soft layers, face framing, and styling lesson.',
        durationMinutes: 60,
        price: 52,
        category: ServiceCategory.hair,
      ),
      Service(
        id: 'color-gloss',
        title: 'Color Gloss',
        description: 'Tone refresh for shine, depth, and softness.',
        durationMinutes: 75,
        price: 68,
        category: ServiceCategory.hair,
      ),
      Service(
        id: 'silk-press',
        title: 'Silk Press',
        description: 'Wash, treatment, blowout, and press finish.',
        durationMinutes: 90,
        price: 74,
        category: ServiceCategory.hair,
      ),
    ],
    reviews: [
      Review(
        id: 'r5',
        authorName: 'Avery',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        comment: 'My hair feels expensive after every appointment with Sofia.',
        createdAt: DateTime(2026, 2, 21),
      ),
      Review(
        id: 'r6',
        authorName: 'Mia',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        comment: 'Color placement is subtle and flattering. Strong recommendation.',
        createdAt: DateTime(2026, 1, 31),
      ),
    ],
    isFeatured: false,
  ),
  Professional(
    id: 'amira-bennett',
    name: 'Amira Bennett',
    specialty: 'Brows, skin prep, and event-ready makeup',
    location: 'Maison Glow',
    about:
        'Amira builds glowing skin and understated event makeup that photographs beautifully. Her brow shaping and complexion work are especially sought-after.',
    rating: 4.92,
    reviewCount: 154,
    distanceKm: 1.9,
    startingPrice: 30,
    latitude: 48.8664,
    longitude: 2.3771,
    coverImageUrl:
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80',
    portraitImageUrl:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
    galleryImages: const [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1498843053639-170ff2122f35?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=900&q=80',
    ],
    categories: const [ServiceCategory.beauty],
    services: const [
      Service(
        id: 'brow-design',
        title: 'Brow Design',
        description: 'Shape mapping, tint, and finishing serum.',
        durationMinutes: 40,
        price: 30,
        category: ServiceCategory.beauty,
      ),
      Service(
        id: 'skin-prep',
        title: 'Skin Prep Facial',
        description: 'Express prep with gentle exfoliation and hydration.',
        durationMinutes: 45,
        price: 44,
        category: ServiceCategory.beauty,
      ),
      Service(
        id: 'soft-glam',
        title: 'Soft Glam Makeup',
        description: 'Luminous complexion, lashes, and long-wear finish.',
        durationMinutes: 75,
        price: 82,
        category: ServiceCategory.beauty,
      ),
    ],
    reviews: [
      Review(
        id: 'r7',
        authorName: 'Nadia',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment: 'Brows are consistently perfect and the skin prep is excellent.',
        createdAt: DateTime(2026, 2, 16),
      ),
      Review(
        id: 'r8',
        authorName: 'Lena',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        comment: 'Soft glam without feeling overdone. Exactly the balance I wanted.',
        createdAt: DateTime(2026, 1, 29),
      ),
    ],
    isFeatured: true,
  ),
  Professional(
    id: 'nora-kim',
    name: 'Nora Kim',
    specialty: 'Editorial nail shapes and chrome finishes',
    location: 'Studio Hush',
    about:
        'Nora creates modern nail looks with sculptural shapes, clean color stories, and subtle chrome details. Expect quick execution and immaculate finish work.',
    rating: 4.84,
    reviewCount: 112,
    distanceKm: 4.1,
    startingPrice: 40,
    latitude: 48.8819,
    longitude: 2.3678,
    coverImageUrl:
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    portraitImageUrl:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    galleryImages: const [
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
    ],
    categories: const [ServiceCategory.nails],
    services: const [
      Service(
        id: 'chrome-set',
        title: 'Chrome Set',
        description: 'Full structure manicure with mirror chrome finish.',
        durationMinutes: 80,
        price: 58,
        category: ServiceCategory.nails,
      ),
      Service(
        id: 'almond-sculpt',
        title: 'Almond Sculpt',
        description: 'Sculpted extension set with modern almond shape.',
        durationMinutes: 95,
        price: 64,
        category: ServiceCategory.nails,
      ),
      Service(
        id: 'neutral-refresh',
        title: 'Neutral Refresh',
        description: 'Short structured manicure in tonal neutrals.',
        durationMinutes: 60,
        price: 42,
        category: ServiceCategory.nails,
      ),
    ],
    reviews: [
      Review(
        id: 'r9',
        authorName: 'Elsa',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        comment: 'Chrome looks unreal in person and lasts well.',
        createdAt: DateTime(2026, 2, 14),
      ),
      Review(
        id: 'r10',
        authorName: 'Jules',
        authorAvatarUrl:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        comment: 'Quick, polished, and the shape work is incredibly clean.',
        createdAt: DateTime(2026, 1, 24),
      ),
    ],
    isFeatured: false,
  ),
];
