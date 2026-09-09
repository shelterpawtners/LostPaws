---
applyTo: "**/*"
---

# ShelterPawtners Security Instructions

Treat security/privacy as implementation requirements, not later cleanup.

- Least privilege by default.
- Authorization must be enforced server-side/database-side, not only in UI.
- Private Passport data is private by default.
- A Partner never receives broad Guardian Passport access merely because a redemption occurred.
- Full microchip identifiers are not public by default.
- QR codes/tokens must not directly encode sensitive PII.
- Token flows should support expiration/revocation/single-use where appropriate.
- Do not log secrets or complete sensitive payloads.
- Do not commit credentials.
- Preserve audit history for privileged actions.
- Demo/test records must never trigger real money movement or real external notifications.
