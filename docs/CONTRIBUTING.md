# Contributing

Use Node.js 20 or newer. Run `npm test`, the syntax check, and `cd frontend && npm run build` before opening a change. Keep controllers thin, put shared business logic in `utils` or services, validate user input at route boundaries, and never commit `.env`, backups, or credentials. Add a focused test for every business-rule change.
