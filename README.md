<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AudioWave

## Run locally

Prerequisite: Node.js

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `GEMINI_API_KEY`, `DATABASE_URL`, and the Mailtrap SMTP values in `.env.local`.
4. Run `npm run dev`.

## Mailtrap SMTP

The backend mailer accepts Mailtrap-specific env vars and falls back to generic SMTP vars.

Use these values in `.env.local`:

```env
MAILTRAP_HOST=live.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_SECURE=false
MAILTRAP_USER=api
MAILTRAP_TOKEN=your-mailtrap-smtp-password-or-token
SMTP_FROM="AudioWerkhaus <noreply@audiowerkhaus.com>"
ADMIN_EMAIL=info@audiowerkhaus.com
```

If you prefer, you can still use `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` instead.
