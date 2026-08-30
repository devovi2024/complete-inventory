# Two M-s Veil Factory API

## The Human Philosophy of Operations

---

> **Core Belief**
> 
> *"Technology should serve people, not the other way around."*

---

## People Are Not Robots

This system exists because **people need to work together**. Behind every order is a customer waiting. Behind every inventory item is someone who bought it. Behind every attendance record is a person who showed up today.

This is not abstract. **This is life.**

---

## What The System Actually Does

### Helping People Work Better

| Human Need | System Response |
|------------|-----------------|
| Security | Auth protects identity |
| Fairness | FIFO honors chronological order |
| Clarity | Status updates show progress |
| Memory | Soft deletes keep history accessible |
| Trust | Audit logs build accountability |

### The Human Meaning Behind Each Feature

```
+------------------------------------------------------------------+
|                                                                  |
|  [Materials Flow (FIFO)]                                         |
|  +-- First in, first out—not because a spreadsheet says so,     |
|       but because it is honest. If something bought first,      |
|       it should be used first. That is just fair.               |
|                                                                  |
|  [Orders Get Tracked]                                            |
|  +-- People worry. The question: "Is the order ready?          |
|       When can it be expected?" Answers are provided.           |
|                                                                  |
|  [Employees Mark Attendance]                                     |
|  +-- Presence matters. Being there for each other.              |
|       Showing up. That is the foundation of everything.         |
|                                                                  |
|  [Reports Are Generated]                                         |
|  +-- Numbers tell stories. Where is money going?               |
|       What is working? What is not? These are not abstract     |
|       questions. They affect real people.                      |
|                                                                  |
+------------------------------------------------------------------+
```

---

## The Human-Centered Architecture

### What Matters Most

```
+------------------------------------------------------------------+
|                                                                  |
|  1.  People before processes                                     |
|      +-- The system serves humans, not the other way around     |
|                                                                  |
|  2.  Fairness                                                    |
|      +-- First in, first out because it is right                |
|                                                                  |
|  3.  Transparency                                                |
|      +-- What happened, when, and why can be seen               |
|                                                                  |
|  4.  Simplicity                                                  |
|      +-- Things should make sense without a manual              |
|                                                                  |
|  5.  Resilience                                                  |
|      +-- The system should work even when things go wrong       |
|                                                                  |
+------------------------------------------------------------------+
```

---

## The Human Way of Working

### Every Action Has a Story

```
+------------------------------------------------------------------+
|                                                                  |
|  [Login]           -->  Someone is starting the day             |
|                                                                  |
|  [Create Order]    -->  Someone is making a promise             |
|                                                                  |
|  [Process FIFO]    -->  Someone is making material decisions    |
|                                                                  |
|  [Update Status]   -->  Someone is communicating progress       |
|                                                                  |
|  [Generate Report] -->  Someone is trying to understand         |
|                                                                  |
+------------------------------------------------------------------+
```

These are not "operations." These are **moments in people's lives**.

---

## The Rhythm of Work

```
+------------------------------------------------------------------+
|                                                                  |
|  Morning                                                         |
|  +-- People log in, check what needs attention                  |
|                                                                  |
|  Day                                                             |
|  +-- Orders move, inventory adjusts, problems get solved        |
|                                                                  |
|  Evening                                                         |
|  +-- Reports show what happened, what is left                   |
|                                                                  |
+------------------------------------------------------------------+
```

This is not just software. This is **the rhythm of human work**.

---

## Backend Philosophy

### Core Principles

```
+------------------------------------------------------------------+
|                                                                  |
|  [Separation of Concerns]                                        |
|  +-- Controllers are thin. Business logic lives in utils.       |
|  +-- Models define structure. Services handle operations.       |
|                                                                  |
|  [Validation at Boundaries]                                      |
|  +-- Every request is validated before reaching business logic. |
|  +-- Express-validator ensures data integrity at route level.   |
|                                                                  |
|  [State Management]                                              |
|  +-- Soft deletes (isDeleted) preserve history.                 |
|  +-- Audit logs track every change.                             |
|  +-- FIFO layers maintain inventory valuation.                  |
|                                                                  |
|  [Transaction Integrity]                                         |
|  +-- MongoDB sessions ensure atomic FIFO processing.            |
|  +-- Rollback on failure prevents partial updates.              |
|                                                                  |
|  [Security First]                                                |
|  +-- JWT with short-lived access tokens.                        |
|  +-- Refresh token rotation for secure sessions.                |
|  +-- Password hashing with bcrypt.                              |
|  +-- Account lockout after failed attempts.                     |
|                                                                  |
+------------------------------------------------------------------+
```

### Data Flow Architecture

```
+------------------------------------------------------------------+
|                                                                  |
|  Client Request                                                  |
|       |                                                          |
|       v                                                          |
|  [Route Layer]                                                   |
|  +-- Authentication middleware (protect)                         |
|  +-- Authorization middleware (authorizePermission)              |
|  +-- Validation middleware (express-validator)                  |
|       |                                                          |
|       v                                                          |
|  [Controller Layer]                                              |
|  +-- Thin request/response handling                             |
|  +-- Calls service layer or utils                               |
|       |                                                          |
|       v                                                          |
|  [Business Logic Layer]                                          |
|  +-- FIFO processing (utils/fifo.js)                            |
|  +-- Shareholder calculations (utils/shareholders.js)           |
|  +-- Token management (utils/token.js)                          |
|       |                                                          |
|       v                                                          |
|  [Data Access Layer]                                             |
|  +-- Mongoose models with schemas                               |
|  +-- Indexes for query performance                              |
|  +-- Populate for relationships                                 |
|       |                                                          |
|       v                                                          |
|  [MongoDB]                                                       |
|  +-- Collections with soft delete support                       |
|  +-- Unique constraints and partial indexes                     |
|                                                                  |
+------------------------------------------------------------------+
```

---

## Frontend Philosophy

### Core Principles

```
+------------------------------------------------------------------+
|                                                                  |
|  [State Management]                                              |
|  +-- Zustand for global state (user, theme, data).              |
|  +-- Local state for UI components (modals, filters).           |
|  +-- Persistent state in localStorage (tokens, preferences).    |
|                                                                  |
|  [Component Architecture]                                        |
|  +-- Reusable UI components (Button, Modal, FormField).         |
|  +-- Page-level components for routes.                          |
|  +-- Lazy loading for code splitting.                           |
|                                                                  |
|  [API Integration]                                               |
|  +-- Centralized request function with retry logic.             |
|  +-- Automatic token refresh on 401 responses.                  |
|  +-- Error handling with user-friendly messages.                |
|                                                                  |
|  [User Experience]                                               |
|  +-- Loading states for async operations.                       |
|  +-- Toast notifications for feedback.                          |
|  +-- Responsive design for all screen sizes.                    |
|  +-- Dark/light theme support.                                  |
|                                                                  |
|  [Performance]                                                   |
|  +-- Virtual lists for large datasets.                          |
|  +-- Debounced search inputs.                                   |
|  +-- Memoized selectors for derived data.                       |
|                                                                  |
+------------------------------------------------------------------+
```

### Component Hierarchy

```
+------------------------------------------------------------------+
|                                                                  |
|  [App]                                                           |
|  +-- ErrorBoundary                                               |
|  +-- Suspense (Loading)                                         |
|  +-- Routes                                                     |
|       |                                                          |
|       +-- [Auth] (login/register)                               |
|       |                                                          |
|       +-- [ProtectedRoute]                                      |
|            |                                                     |
|            +-- [Layout]                                         |
|                 |                                                |
|                 +-- [Header]                                    |
|                 |    +-- Brand                                  |
|                 |    +-- Theme toggle                           |
|                 |    +-- Language toggle                        |
|                 |    +-- Notifications                          |
|                 |    +-- Profile menu                           |
|                 |                                                |
|                 +-- [Sidebar]                                    |
|                 |    +-- Navigation links                       |
|                 |    +-- Logout button                          |
|                 |                                                |
|                 +-- [Outlet]                                     |
|                      |                                           |
|                      +-- [Dashboard]                            |
|                      +-- [Orders]                               |
|                      +-- [Inventory]                            |
|                      +-- [Customers]                            |
|                      +-- [Employees]                            |
|                      +-- [Attendance]                           |
|                      +-- [Shareholders]                         |
|                      +-- [Reports]                              |
|                      +-- [Settings]                             |
|                      +-- [Profile]                              |
|                      +-- [TwoFactor]                            |
|                                                                  |
+------------------------------------------------------------------+
```

### State Flow

```
+------------------------------------------------------------------+
|                                                                  |
|  [User Action]                                                   |
|       |                                                          |
|       v                                                          |
|  [Component]                                                     |
|  +-- Calls store action or API directly                         |
|       |                                                          |
|       v                                                          |
|  [Store (Zustand)]                                               |
|  +-- Updates state                                              |
|  +-- Persists to localStorage                                   |
|       |                                                          |
|       v                                                          |
|  [UI Re-render]                                                  |
|  +-- Components subscribe to state changes                      |
|  +-- Optimistic updates for better UX                           |
|                                                                  |
+------------------------------------------------------------------+
```

---

## For Developers: The Human Craft

### Code with Empathy

Before writing a line:

```
+------------------------------------------------------------------+
|                                                                  |
|  [Questions to Ask]                                              |
|                                                                  |
|  ? "Who will use this?"                                          |
|                                                                  |
|  ? "What will they feel?"                                        |
|                                                                  |
|  ? "Will this make the day easier or harder?"                   |
|                                                                  |
+------------------------------------------------------------------+
```

### The Three Practices

```
+------------------------------------------------------------------+
|                                                                  |
|  1.  Keep it simple                                              |
|      +-- Complex code confuses people                           |
|                                                                  |
|  2.  Validate inputs                                             |
|      +-- Protect people from own mistakes                       |
|                                                                  |
|  3.  Leave traces                                                |
|      +-- Make clear what happened                               |
|                                                                  |
+------------------------------------------------------------------+
```

### Never Forget

> *"Writing is for humans. Code is just the medium. The real work is helping people do work better."*

---

## The Bigger Picture

### What This System Is Part Of

```
+------------------------------------------------------------------+
|                                                                  |
|                         [Community]                              |
|                         |                                        |
|              +----------+----------+                             |
|              |          |          |                             |
|           [People]   [Work]    [Purpose]                         |
|              |          |          |                             |
|              +----------+----------+                             |
|                         |                                        |
|                    [Technology]                                  |
|                    (just the tool)                               |
|                                                                  |
+------------------------------------------------------------------+
```

The purpose is **human flourishing**.

---

## What The System Does Not Pretend To Be

```
+------------------------------------------------------------------+
|                                                                  |
|  [Not Perfect]                                                   |
|  [Not Complete]                                                  |
|  [Not Everything to Everyone]                                    |
|                                                                  |
|  [But Working]                                                   |
|  [But Useful]                                                    |
|  [But for Real People]                                           |
|                                                                  |
+------------------------------------------------------------------+
```

### Future Possibilities

| Area | Status | Trigger |
|------|--------|---------|
| Better mobile experience | Future | When needed |
| Offline capability | Future | When needed |
| More detailed permissions | Future | When needed |
| Advanced reporting | Future | When needed |
| Integration with other tools | Future | When needed |

---

## Backend-Frontend Communication

### API Contract

```
+------------------------------------------------------------------+
|                                                                  |
|  [Request Flow]                                                  |
|                                                                  |
|  Frontend (React)          Backend (Express)                    |
|       |                          |                               |
|       +-- POST /api/orders ---->+                               |
|       |                          |                               |
|       |                          +-- Validate request           |
|       |                          +-- Process business logic     |
|       |                          +-- Save to MongoDB            |
|       |                          +-- Audit log                  |
|       |                          |                               |
|       +-- <-- 201 Created ------+                               |
|       |                          |                               |
|  [Response Format]                                              |
|  +-- Success: { success: true, data: {...} }                   |
|  +-- Error:   { success: false, message: "..." }               |
|                                                                  |
+------------------------------------------------------------------+
```

### Authentication Flow

```
+------------------------------------------------------------------+
|                                                                  |
|  [Login]                                                         |
|  Frontend --> POST /api/auth/login --> Backend                  |
|       |                                                          |
|       +-- Backend validates credentials                         |
|       +-- Backend issues access token + refresh token           |
|       +-- Backend stores refresh token in database              |
|       |                                                          |
|  Frontend <-- { token, refreshToken, user } -- Backend          |
|       |                                                          |
|  Frontend stores tokens in localStorage                         |
|                                                                  |
|  [Protected Request]                                            |
|  Frontend --> GET /api/orders (Authorization: Bearer <token>)   |
|       |                                                          |
|       +-- Backend verifies token                                |
|       +-- Backend checks permissions                            |
|       +-- Backend returns data                                  |
|       |                                                          |
|  [Token Refresh]                                                |
|  If 401 response:                                               |
|  Frontend --> POST /api/auth/refresh { refreshToken }           |
|       |                                                          |
|       +-- Backend validates refresh token                       |
|       +-- Backend rotates to new token pair                     |
|       |                                                          |
|  Frontend <-- { token, refreshToken } -- Backend                |
|                                                                  |
+------------------------------------------------------------------+
```

### Real-time Communication

```
+------------------------------------------------------------------+
|                                                                  |
|  [WebSocket Connection]                                          |
|                                                                  |
|  Frontend (Socket.io)          Backend (Socket.io)              |
|       |                          |                               |
|       +-- Connect ------------> +                               |
|       |  (with auth token)      |                               |
|       |                          |                               |
|       +-- <-- Connected ------- +                               |
|       |                          |                               |
|       |                          +-- New notification           |
|       |                          +-- Emits to connected clients |
|       |                          |                               |
|       +-- <-- notification ----- +                               |
|       |                          |                               |
|  Frontend adds notification to store                            |
|                                                                  |
+------------------------------------------------------------------+
```

---

## Database Relationships

```
+------------------------------------------------------------------+
|                                                                  |
|  [ER Diagram Summary]                                            |
|                                                                  |
|  User ------ creates ------> AuditLog                            |
|  Customer ---- places -------> Order                             |
|  Inventory --- supplies -----> Order                             |
|  Employee ---- records -------> Attendance                       |
|                                                                  |
|  All entities support soft deletion:                             |
|  +-- isDeleted: boolean                                         |
|  +-- deletedAt: Date                                            |
|                                                                  |
|  Unique constraints:                                             |
|  +-- User.email                                                  |
|  +-- Account.code                                                |
|  +-- Attendance (employee_id + date) while active               |
|                                                                  |
+------------------------------------------------------------------+
```

---

## The Human Truth

```
+==================================================================+
|                                                                  |
|  "Technology should serve people,                                |
|   not the other way around."                                     |
|                                                                  |
|  +----------------------------------------------------------+   |
|  |                                                          |   |
|  |  This system is not about code.                          |   |
|  |  It is not about databases or APIs or tokens.            |   |
|  |                                                          |   |
|  |  IT IS ABOUT PEOPLE.                                    |   |
|  |                                                          |   |
|  |  People who work. People who wait.                      |   |
|  |  People who trust. People who depend on each other.     |   |
|  |                                                          |   |
|  |  That is the only thing that matters.                   |   |
|  |                                                          |   |
|  +----------------------------------------------------------+   |
|                                                                  |
+==================================================================+
```

---

## Quick Reference

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create staff account |
| POST | `/api/auth/login` | Obtain access token |
| POST | `/api/orders` | Create new order |
| POST | `/api/orders/:id/process-fifo` | Process inventory consumption |
| POST | `/api/inventory/:id/layers` | Add FIFO layer |
| GET | `/api/reports/financial` | Financial summary |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS |
| `SMTP_HOST` | Email server host |
| `REFRESH_TOKEN_DAYS` | Refresh token validity (default: 30) |

---

**Built for humans, by humans.** 