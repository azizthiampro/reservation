import '../entities/professional.dart';

abstract class ProfessionalsRepository {
  List<Professional> fetchProfessionals();

  Professional getById(String id);
}
