# AudioWerkhaus Laravel

This repository now runs the AudioWerkhaus site on Laravel.

## What changed

- The public site and admin UI still live in the existing React app under `src/`.
- Laravel now serves the app shell, handles product CRUD, stores consultation requests, and sends email.
- The API contract remains the same:
  - `GET /api/products`
  - `POST /api/products`
  - `PUT /api/products?id=...`
  - `DELETE /api/products?id=...`
  - `GET /api/consultation-requests`
  - `POST /api/consultation-requests`
  - `PUT /api/consultation-requests?id=...`
  - `DELETE /api/consultation-requests?id=...`

## Local setup

1. Copy `.env.example` to `.env` if needed.
2. Set your database and mail credentials in `.env`.
3. Run `composer install`.
4. Run `npm install`.
5. Run migrations with `php artisan migrate`.
6. Start the app with `php artisan serve` and `npm run dev` in separate terminals.

## Notes

- Product images are still accepted the same way as before: the admin upload preview is turned into an image payload and stored in the database.
- Consultation emails use Laravel mailables and the `ADMIN_EMAIL` address from `.env`.
- If you use a fresh checkout, generate an app key with `php artisan key:generate`.
