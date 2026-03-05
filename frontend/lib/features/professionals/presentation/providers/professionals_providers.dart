import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../data/repositories/demo_professionals_repository.dart';
import '../../domain/entities/professional.dart';
import '../../domain/repositories/professionals_repository.dart';

final professionalsRepositoryProvider = Provider<ProfessionalsRepository>(
  (ref) => DemoProfessionalsRepository(),
);

final professionalsProvider = Provider<List<Professional>>(
  (ref) => ref.watch(professionalsRepositoryProvider).fetchProfessionals(),
);

final professionalProvider = Provider.family<Professional, String>(
  (ref, id) => ref.watch(professionalsRepositoryProvider).getById(id),
);
