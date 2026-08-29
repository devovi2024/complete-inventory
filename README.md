# Two M-s Veil Factory API

MERN backend for factory management, built with Express, MongoDB/Mongoose, and JWT authentication.

## Run

1. Copy `.env.example` to `.env` and set `MONGO_URI` and a strong `JWT_SECRET`.
2. Start MongoDB.
3. Run `npm install`.
4. Use `npm run dev` for development or `npm start` for production.

The API listens on `PORT` (default `5000`). Health check: `GET /health`.

## Authentication

Register and login return a bearer token. Send it as `Authorization: Bearer <token>` to protected `/api` routes. Public registration creates `staff` users; elevated roles should be assigned by an administrator through a controlled database/admin workflow.

## FIFO

Create inventory with `quantity` and `unitCost`, or call `POST /api/inventory/:id/layers`. `POST /api/orders/:id/process-fifo` consumes the oldest available layers, updates inventory, calculates COGS/profit/margin, and moves the order to `Ready`.

All successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "message": "..." }`.

## Production hardening included

The API supports `/api/v1` aliases, strict CORS allowlisting, Helmet, XSS sanitization, compression, request logs, validation errors, short-lived access tokens with refresh rotation, account lockout, soft deletes, indexed queries, bounded pagination, audit logging, graceful shutdown, and transactional FIFO processing. OpenAPI is in `docs/openapi.yaml`; the user manual, contribution guide, and ER diagram are in `docs/`.

Run `npm test` for focused business-logic tests, `npm run seed` for a local dataset, and `npm run backup` for a manual `mongodump` backup.

## Scope requiring infrastructure or product decisions

Redis session/cache/Bull queues, TOTP 2FA, double-entry accounting, GST/VAT rules, scheduled reports, Excel/PDF generation, granular admin permission screens, PWA offline synchronization, and full API/UI coverage tests are separate production workstreams. They should be added with the deployment provider, tax jurisdiction, permission matrix, and recovery policy agreed first; the current app does not pretend those external contracts are implemented.
