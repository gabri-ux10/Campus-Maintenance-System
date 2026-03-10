# Backend (Spring Boot)

This service provides authentication, ticket management, analytics, notifications, and email flows for CampusFix.

## Tech Stack

- Java 21
- Spring Boot 3.5
- Spring Security + JWT
- Spring Data JPA
- MySQL 8 (primary) or H2 (fallback)

## Prerequisites

- Java 21+
- Maven 3.9+
- MySQL 8+ (recommended)

## Local Setup

### 1. Configure environment

```bash
cp .env.example .env
# Windows PowerShell: copy .env.example .env
```

Set at least:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `APP_ADMIN_USERNAME`
- `APP_ADMIN_EMAIL`
- `APP_ADMIN_PASSWORD`
- `SPRING_PROFILES_ACTIVE=dev`

### 2. Run backend

```bash
mvn spring-boot:run
```

API base URL: `http://localhost:8080/api`

## Key Environment Variables

- `DB_URL=jdbc:mysql://localhost:3306/Campus_Fix?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC`
- `DB_USERNAME=root`
- `DB_PASSWORD=...`
- `JWT_SECRET=...`
- `JWT_EXPIRATION_MS=86400000`
- `FRONTEND_BASE_URL=http://localhost:5173`
- `APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`
- `APP_UPLOAD_DIR=uploads`

Admin bootstrap:

- `APP_ADMIN_USERNAME`
- `APP_ADMIN_EMAIL`
- `APP_ADMIN_FULL_NAME`
- `APP_ADMIN_PASSWORD`

Email system:

- `APP_EMAIL_ENABLED=false` (set `true` only after your sender domain and SMTP credentials are verified)
- `APP_EMAIL_FROM=no-reply@mail.example.com`
- `APP_EMAIL_SUPPORT_INBOX=support@example.com`
- `MAIL_HOST=smtp.resend.com`
- `MAIL_PORT`
- `MAIL_USERNAME=resend`
- `MAIL_PASSWORD`

Recommended production provider:

- Use Resend via SMTP with a custom sender domain.
- Keep Gmail only as an optional local/dev fallback with an app password.
- Configure SPF, DKIM, and DMARC before enabling real sends.

Auth timing:

- `APP_AUTH_VERIFICATION_CODE_TTL_MINUTES`
- `APP_AUTH_RESET_TOKEN_TTL_MINUTES`
- `APP_AUTH_VERIFICATION_CODE_MAX_ATTEMPTS`
- `APP_AUTH_VERIFICATION_RESEND_COOLDOWN_SECONDS`
- `APP_AUTH_RESET_REQUEST_COOLDOWN_SECONDS`
- `APP_AUTH_PUBLIC_REQUEST_MIN_DELAY_MS`
- `APP_AUTH_TOKEN_CLEANUP_CRON`
- `APP_AUTH_USED_TOKEN_RETENTION_HOURS`

## Auth Flow

- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

## Build and Test

```bash
mvn -q -DskipTests compile
mvn -q test
```

## Notes

- Default profile is `dev`; set `SPRING_PROFILES_ACTIVE=prod` in real deployments.
- CORS is environment-driven through `APP_CORS_ALLOWED_ORIGINS`.
- Uploaded files are served under `/uploads/**`.
- Production startup now fails fast on unsafe defaults such as placeholder JWT secrets, H2 fallback, or demo seeding.
- Transactional email is provider-agnostic in code; production examples in this repo assume Resend SMTP.
- If DB schema is managed manually, run scripts from `../database/` first.

## Related Docs

- `../documentation/guides/setup-guide.md`
- `../documentation/guides/admin-credentials-setup.md`
- `../documentation/guides/troubleshooting.md`
- `../documentation/guides/email-production-checklist.md`
