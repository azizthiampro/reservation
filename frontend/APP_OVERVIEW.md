# Reserve App Overview

## Product Summary

`Reserve` is a modern mobile booking application for beauty and grooming services. It helps users discover barbers, nail artists, hair stylists, and beauty professionals, inspect their work, review services and pricing, and book appointments through a clean mobile-first flow.

The product direction is intentionally minimal, premium, and friction-light. The UX is inspired by the clarity of apps like Fresha, Booksy, and Uber: strong hierarchy, quick scanning, clear calls to action, and fast booking decisions.

## Main User Journey

1. The user lands on a short onboarding flow that explains the value of the app.
2. The user signs in with email, Google, or Apple.
3. The user reaches the home screen, where they can search and filter by category.
4. The user explores nearby and featured professionals.
5. The user opens a professional profile to view gallery work, reviews, and service pricing.
6. The user selects a service, date, and time slot on the booking screen.
7. The user confirms the appointment and sees it in the bookings screen.
8. The user manages preferences, theme mode, payment methods, and logout from the profile screen.

## Core Screens

### Onboarding

- Three slides explain discovery, instant booking, and appointment management.
- A primary CTA moves the user into authentication.
- The artwork is designed to feel editorial and premium while staying responsive.

### Authentication

- Supports email continuation plus Google and Apple entry points.
- The current implementation is frontend-only and routes directly into the app shell.

### Home

- Greets the user and shows search.
- Lets the user filter by `Barber`, `Nails`, `Hair`, and `Beauty`.
- Surfaces nearby professionals and featured professionals.
- Uses rich cards with cover image, rating, distance, specialty, and starting price.

### Professional Profile

- Shows a hero image, portrait, specialty, about section, recent work gallery, services, and reviews.
- Provides a single high-visibility `Book Appointment` CTA.

### Booking

- Lets the user choose one service, a date, and a time slot.
- Shows a summary panel before confirmation.
- Creates a mocked booking and routes to the bookings screen.

### Bookings

- Splits appointments into `Upcoming` and `Past`.
- Presents each booking as a rich card with service, date, location, and price.

### Profile

- Shows profile details, membership, payment methods, notification settings, reminder settings, theme mode, and logout.

## Design System

The UI uses Material 3 with a custom brand treatment:

- Soft neutral background surfaces with warm premium accents
- Manrope typography via `google_fonts`
- Rounded cards, chips, and form fields
- Motion through route transitions, animated chips, button states, and selection changes
- Light and dark mode support

Theme primitives live in:

- `lib/core/theme/app_theme.dart`
- `lib/core/theme/app_colors.dart`
- `lib/core/theme/app_spacing.dart`

## Architecture

The frontend follows a feature-based clean architecture structure.

### Core

- `lib/core/navigation/`
  - App routing with `go_router`
- `lib/core/theme/`
  - Global visual language and theme definitions
- `lib/core/utils/`
  - Formatting helpers for dates, prices, durations, and distance

### Features

- `auth`
- `home`
- `booking`
- `bookings`
- `onboarding`
- `professionals`
- `profile`

Each feature is organized around:

- `domain`
  - Entities and repository interfaces
- `data`
  - Demo repository implementations
- `presentation`
  - Screens and Riverpod providers/controllers

### Shared UI

Reusable components live in `lib/shared/widgets/`:

- `ProfessionalCard`
- `ServiceCard`
- `CategoryChip`
- `BookingTimeSlot`
- `RatingStars`
- `GalleryGrid`
- `SectionHeader`
- `AppShell`

## State Management

The app uses `flutter_riverpod`.

Main state responsibilities:

- `home_providers.dart`
  - Search and category filtering
- `professionals_providers.dart`
  - Professional listing and detail lookup
- `bookings_providers.dart`
  - Booking selection flow and confirmed bookings list
- `profile_providers.dart`
  - User profile, theme mode, and settings toggles

## Data Model Summary

Current domain entities:

- `Professional`
- `Service`
- `Review`
- `ServiceCategory`
- `AppointmentBooking`
- `AppUser`
- `PaymentMethod`

The app is currently powered by mocked repositories:

- `DemoProfessionalsRepository`
- `DemoBookingsRepository`
- `DemoProfileRepository`

This keeps the UI production-structured while remaining backend-independent.

## Navigation Model

`go_router` drives the app flow:

- `/onboarding`
- `/auth`
- `/home`
- `/professional/:id`
- `/booking/:professionalId`
- `/bookings`
- `/profile`

The main authenticated experience is wrapped in a shell with bottom navigation for:

- Home
- Bookings
- Profile

## Current Technical Status

The frontend is production-leaning in structure, but still demo-backed in behavior.

Implemented:

- Modular Flutter structure
- Material 3 theme and dark mode
- Main booking flow UI
- Navigation and reusable widgets
- Dummy repositories and test coverage for app boot

Not yet implemented:

- Real authentication
- Backend APIs
- Persistent user session
- Real payment processing
- Secure storage
- Real image hosting under app control
- Push notifications
- Analytics and crash reporting

## Development Notes

- The app runs as a Flutter iOS project and can also target macOS or web through Flutter.
- The current implementation was created inside a repo that also contains legacy web artifacts; the Flutter app itself is centered in this `frontend/` directory.
- `flutter analyze` and `flutter test` should stay green before shipping changes.

## Intent For Future Work

The current frontend should be treated as a scalable base for:

- plugging in real auth and booking APIs,
- adding favorites, availability syncing, and checkout,
- introducing production-grade persistence and security hardening,
- and expanding from demo UX to a full booking product.
