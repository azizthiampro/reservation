# AGENTS.md

This file defines the minimum security and implementation rules for any human or AI agent working in this Flutter app.

Read [APP_OVERVIEW.md](./APP_OVERVIEW.md) before making structural changes.

If a request conflicts with these rules, stop and ask before proceeding.

## Project Scope

- This directory is a Flutter frontend for the `Reserve` mobile booking app.
- The active app code lives under `lib/`, `ios/`, and `test/`.
- Do not assume legacy non-Flutter artifacts in or around this repo define the current product architecture.

## Security Rules

### Secrets And Credentials

- Never hardcode API keys, client secrets, tokens, passwords, signing material, or private endpoints in source files.
- Never commit `.env` secrets, service account files, private certificates, or copied dashboard credentials.
- If secrets are needed, use environment-based or platform-secure injection outside source control.
- Never print secrets in logs, debug output, or test snapshots.

### Authentication

- Use official sign-in flows for Google and Apple.
- Do not build custom password storage or unsupported OAuth shortcuts.
- Treat the client as untrusted. Authorization must always be enforced server-side.
- Do not add hidden login bypasses, admin shortcuts, or mock auth overrides in production paths.

### Payments

- Never collect, store, transmit, or log raw card numbers, CVVs, expiry values, or equivalent payment data.
- Payment integrations must use official provider SDKs and tokenized flows only.
- Do not present mock payment behavior as real production payment handling.

### Personal Data

- Minimize collection of profile and booking data.
- Do not log names, email addresses, phone numbers, booking notes, or payment metadata by default.
- Do not store sensitive user data or session tokens in plain text local storage.
- Use secure storage for auth/session material if persistence is added.

### Networking

- Use HTTPS only for production traffic.
- Never disable TLS verification or add insecure certificate bypasses.
- Keep network logic in repositories or data sources, not widgets.
- Avoid scattering environment-specific base URLs through presentation code.

### Permissions

- Request only the minimum permissions needed for a user-facing feature.
- Do not add camera, photo, location, contacts, microphone, calendar, or notification permissions without clear product need.
- Ask for permissions contextually, not blindly at app launch.

### Logging And Debugging

- Keep logs free of PII and secrets.
- Do not leave verbose payload logging enabled by default.
- Remove debug-only shortcuts and test hooks from release-facing flows.
- Do not surface raw backend or platform errors directly to end users.

## Architecture Guardrails

- Keep security-sensitive logic out of UI widgets.
- Preserve the feature-based clean architecture structure:
  - `domain` for entities and repository interfaces
  - `data` for implementations
  - `presentation` for screens and state
- Do not bypass repository abstractions for convenience.
- Validate and sanitize user input before sending it to any backend.

## Dependency Rules

- Prefer official Flutter or vendor-maintained packages for auth, storage, networking, and payments.
- Do not add abandoned or weakly maintained dependencies without explicit justification.
- Review platform implications before adding packages that require entitlements, URL schemes, or sensitive permissions.

## Release Safety

- Keep `flutter analyze` and `flutter test` green before considering work complete.
- If platform code changes touch signing, entitlements, associated domains, keychain access, or URL schemes, document the change clearly.
- Do not change bundle identifiers or sign-in configuration without explicit intent.

## Product Integrity

- Keep the app honest about what is real versus mocked.
- Do not add fake trust indicators, fake verification, or misleading security claims.
- Current booking, profile, and auth behavior are demo-backed unless explicitly replaced with real integrations.
- Remote image URLs in mock data are presentation-only and must not be treated as trusted storage.

## Agent Workflow

- Read the existing code before editing.
- Prefer small, reviewable changes over broad rewrites.
- Do not weaken security, validation, or permissions to “make it work.”
- If a task involves real credentials, payments, private APIs, or sensitive data handling, stop and ask for the approved integration path.
- If unsure whether a change is security-sensitive, treat it as security-sensitive.
