# Factory Management User Manual

## Start

Copy `.env.example` to `.env`, set `MONGO_URI` and a strong `JWT_SECRET`, start MongoDB, then run `npm install` and `npm start`. Run the React client with `cd frontend`, `npm install`, and `npm run dev`.

## Daily workflow

1. Register a staff account or sign in with an existing account.
2. Add customers and inventory lots.
3. Create an order and select its inventory product.
4. Process FIFO when production consumes material. The system calculates COGS, profit, margin, and updates stock atomically.
5. Update order status and record attendance.
6. Review financial and valuation reports.

## Operational notes

Access tokens are short-lived. Store the refresh token securely and rotate it through `POST /api/v1/auth/refresh`. Never expose MongoDB credentials or JWT secrets in browser code. Run `npm run backup` only where the MongoDB Database Tools (`mongodump`) are installed.
