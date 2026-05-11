# Cash Transactions App

A full-stack wallet application with end-to-end account management, multi-type transactions, two-factor authentication, KYC, scheduled and recurring transfers, admin tooling, webhooks, and CSV statement exports. Built with **React**, **Node.js**, **Express**, **Sequelize**, **PostgreSQL**, and **Docker**.

---

## Features

### Auth & Account Security
- Registration & login with **bcrypt**-hashed passwords (legacy MD5 hashes are auto-upgraded on next login)
- **Short-lived access tokens (15m) + opaque refresh tokens (7d)** with rotation on every refresh
- **TOTP-based 2FA** (compatible with Google Authenticator / 1Password); QR code returned on enrollment
- **Rate limiting** on login, registration, and password-reset endpoints
- Forgot Password & Reset via Email (with refresh-token revocation on reset)

### Wallets & Transactions
- Account balance lookup
- **Transfers, deposits, and withdrawals** as first-class transaction types
- Transaction **metadata**: description, category, reference, idempotency key
- Daily & monthly **spending limits** (users can lower their own)
- Filterable + paginated transaction list (`type`, `status`, `category`, `minAmount`, `maxAmount`, `from`, `to`, `direction`, `page`, `pageSize`)
- **CSV statement export** with the same filters
- **Idempotency** via `Idempotency-Key` header on all write endpoints

### Wallet Features
- **Beneficiaries** — saved recipients with optional labels
- **Transfer requests** — request payment from another user; approve / decline / cancel
- **Scheduled & recurring transfers** — ONCE / DAILY / WEEKLY / MONTHLY cadence with in-process runner
- **Multi-currency** ledger (USD, EUR, GBP, NGN seeded; conversion helper provided)

### Identity, Compliance, & Admin
- **KYC submission** flow (full name, date of birth, document number)
- **Admin endpoints** — list users, freeze/unfreeze accounts, approve/reject KYC, reverse transactions, view audit logs
- **Audit log** for all sensitive events (logins, 2FA changes, KYC, money movement, admin actions)

### Integrations
- **Email notifications** on transfers sent, received, deposits, withdrawals, and incoming payment requests
- **Webhooks** with HMAC-SHA256 signed delivery (subscribe to `transaction.created`, `transaction.reversed`, `transfer_request.*` events)

### Other
- Swagger API Docs at `/docs`
- Seed Data for Demo
- Fully Dockerized Setup

---

## Tech Stack

| Layer        | Technology                                       |
|--------------|--------------------------------------------------|
| Frontend     | React                                            |
| Backend      | Node.js, Express, TypeScript                     |
| Database     | PostgreSQL (via Sequelize)                       |
| Auth         | JWT (access), opaque refresh tokens, bcryptjs    |
| 2FA          | speakeasy (TOTP) + qrcode                        |
| Rate Limit   | express-rate-limit                               |
| Email        | Nodemailer                                       |
| Webhooks     | axios + HMAC-SHA256                              |
| Validation   | Joi + Zod                                        |
| CSV Export   | json2csv                                         |
| Docs         | Swagger                                          |
| Containers   | Docker, Docker Compose                           |

---

## API Overview

All authenticated endpoints expect `Authorization: Bearer <accessToken>`.

### Auth
| Method | Path                    | Description                                       |
|--------|-------------------------|---------------------------------------------------|
| POST   | `/register`             | Create user + account                             |
| POST   | `/login`                | Returns `{ user, accessToken, refreshToken }`. Requires `totp` if 2FA enabled. |
| POST   | `/refresh`              | Exchange refresh token for a new pair (rotated)   |
| POST   | `/logout`               | Revoke a refresh token                            |
| POST   | `/forgot-password`      | Email reset token                                 |
| POST   | `/verify-reset-token`   | Validate reset token without consuming            |
| POST   | `/reset-password`       | Consume reset token                               |

### Profile
| Method | Path                       | Description                            |
|--------|----------------------------|----------------------------------------|
| GET    | `/profile`                 | Get authenticated user profile         |
| POST   | `/profile/2fa/setup`       | Returns base32 secret + QR data URL    |
| POST   | `/profile/2fa/enable`      | `{ token }` to confirm and enable      |
| POST   | `/profile/2fa/disable`     | `{ token }` to disable                 |
| POST   | `/profile/kyc`             | Submit KYC info                        |
| PATCH  | `/profile/limits`          | Lower daily/monthly limits             |

### Wallet
| Method | Path                          | Description                            |
|--------|-------------------------------|----------------------------------------|
| GET    | `/account/:id`                | Balance lookup                         |
| POST   | `/transactions/new`           | Transfer to another user               |
| POST   | `/transactions/deposit`       | Deposit to your account                |
| POST   | `/transactions/withdraw`      | Withdraw from your account             |
| GET    | `/transactions`               | Filtered + paginated transaction list  |
| GET    | `/transactions/cashin`        | Inbound transactions                   |
| GET    | `/transactions/cashout`       | Outbound transactions                  |
| GET    | `/transactions/export`        | CSV export with same filters           |

### Beneficiaries / Transfer Requests / Scheduled
| Method | Path                                      |
|--------|-------------------------------------------|
| GET/POST/DELETE | `/beneficiaries[/:id]`           |
| POST   | `/transfer-requests`                      |
| GET    | `/transfer-requests/inbound`              |
| GET    | `/transfer-requests/outbound`             |
| POST   | `/transfer-requests/:id/approve`          |
| POST   | `/transfer-requests/:id/decline`          |
| POST   | `/transfer-requests/:id/cancel`           |
| GET/POST/DELETE | `/scheduled-transfers[/:id]`     |

### Currencies / Webhooks
| Method | Path                                      |
|--------|-------------------------------------------|
| GET    | `/currencies`                             |
| GET    | `/currencies/convert?amount&from&to`      |
| GET/POST/DELETE | `/webhooks[/:id]`                |

### Admin (requires `role = ADMIN`)
| Method | Path                                                |
|--------|-----------------------------------------------------|
| GET    | `/admin/users`                                      |
| GET    | `/admin/users/:id`                                  |
| POST   | `/admin/users/:id/freeze`                           |
| POST   | `/admin/users/:id/unfreeze`                         |
| POST   | `/admin/users/:id/kyc/approve`                      |
| POST   | `/admin/users/:id/kyc/reject`                       |
| POST   | `/admin/transactions/:id/reverse`                   |
| GET    | `/admin/audit-logs`                                 |

---

## Getting Started with Docker

Make sure [Docker](https://www.docker.com/) is installed.

### 1. Clone the Repository

```bash
git clone https://github.com/ayobamiseun/fullstack-wallet-app-typescript-docker.git
cd fullstack-wallet-app-typescript-docker
```

### 2. Configure Environment

Create a `.env` file in `backend/` with:

```env
APP_PORT=3001
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=e-transfer
POSTGRES_HOST=db
POSTGRES_PORT=5432

JWT_SECRET=replace-me-with-a-long-random-string
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL_DAYS=7

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000

SCHEDULED_TICK_MS=60000
```

### 3. Build & Run

```bash
docker compose up --build
```

The backend will run migrations and seed data automatically.

---

## Seeded Test Users

All seeded users share the dev password **`Test1234!`**.

| Username      | Account ID | Email                |
|---------------|------------|----------------------|
| test1         | 1          | test1@example.com    |
| ayobami       | 2          | test2@example.com    |
| victorseun    | 3          | test3@example.com    |
| seunayobami   | 4          | test4@example.com    |
| adegoke       | 5          | test5@example.com    |

To promote a user to admin:

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'test1';
```

---

## Project Layout

```
backend/src/
├── app.ts                     # Express app + middleware + router wiring
├── index.ts                   # Server + scheduled-transfer ticker
├── controllers/               # HTTP layer
├── services/                  # Business logic
├── middlewares/               # auth, admin, rate limiters, errors
├── database/
│   ├── config/
│   ├── models/                # Sequelize models
│   ├── migrations/
│   └── seeders/
├── interfaces/                # Shared TS types
├── errors/catalog.ts          # Mapped error codes -> HTTP statuses
└── types/express.d.ts         # Augments Request with req.user
```

---

## Notes on Production Hardening

This codebase is MVP-quality. Before going to production:

- **Webhook delivery** has no retry/queue — failures are logged only. Add a queue (Bull/Redis) with retries + dead-letter handling.
- **Scheduled transfers** run in-process via `setInterval`. Move this to a separate worker so HTTP and background work don't share an event loop.
- **TOTP secrets** are stored in plaintext. Encrypt them with a KMS-managed key.
- **Multi-currency transfers** use the sender's currency; cross-currency conversion isn't auto-applied. Wire `CurrencyService.convert` into the transfer path if you need that.
- **FX rates** are static seed data. Hook in a live rate provider (e.g., exchangerate.host) on a cron tick.
- **Statements** export as CSV only. Add PDF if needed.
- **No tests** yet — add Jest + supertest for service and HTTP coverage.

---

## API Docs

Once the server is running, browse interactive docs at:

```
http://localhost:3001/docs
```
