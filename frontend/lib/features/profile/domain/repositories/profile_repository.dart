import '../entities/app_user.dart';

abstract class ProfileRepository {
  AppUser fetchProfile();
}
