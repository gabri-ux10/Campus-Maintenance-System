# Email Production Checklist

Use this checklist before going live with real users.

## Application Controls (implemented)

- Password reset does not send email for unknown addresses.
- Forgot-password and verification resend endpoints use generic responses.
- Minimum response delay added for public auth email endpoints to reduce timing enumeration.
- Verification code attempts are capped.
- Reset/verification requests have cooldown windows.
- Reset tokens are stored hashed (SHA-256) and are single-use with expiry.
- Password reset increments user token version, invalidating older JWTs.
- Scheduled cleanup removes expired/old used auth tokens.

## Infrastructure Controls (you must configure)

- Configure SPF, DKIM, and DMARC for your sender domain.
- Use a dedicated transactional email provider or properly secured SMTP account.
- Monitor bounces, complaints, and send reputation.
- Set `APP_EMAIL_ENABLED=true` only after SMTP credentials are validated.
- Keep `JWT_SECRET` and SMTP secrets in a secret manager (not plain git files).

## Recommended Provider Baseline

- Use Resend via SMTP for production unless you have a stronger deliverability or AWS-cost reason to choose another provider.
- Set `MAIL_HOST=smtp.resend.com`, `MAIL_PORT=587`, `MAIL_USERNAME=resend`, and `MAIL_PASSWORD=<Resend API key>`.
- Send from a verified custom domain address such as `no-reply@mail.example.com`, not from a personal mailbox.
- Route support replies to `APP_EMAIL_SUPPORT_INBOX=support@example.com` or your real support desk.

## DNS Rollout

- Verify the sender domain in Resend before enabling `APP_EMAIL_ENABLED=true`.
- Add the provider-issued SPF and DKIM records exactly as shown in the Resend dashboard.
- Publish DMARC with `p=none` first, observe alignment and delivery, then move to a stricter policy when stable.
- Re-test registration, verification resend, password reset, staff invite, ticket notifications, and support forwarding after DNS changes propagate.

## Optional Hardening

- Add CAPTCHA on `forgot-password` and `resend-verification` endpoints.
- Add distributed rate limiting (Redis/API gateway) for multi-instance deployments.
- Outbox queue + scheduler retries are implemented; tune retry/backoff and alerting thresholds for production.
