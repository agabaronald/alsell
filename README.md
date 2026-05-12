# Alsel

> A modern peer-to-peer classifieds and buy-and-sell marketplace platform.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Alsel is a full-stack marketplace web application that allows users to buy and sell items locally. Sellers can post listings with photos, set prices, and negotiate with buyers through built-in chat and offer flows. Buyers can search, filter, favourite items, and make offers — all in one place.

---

## Features

### For buyers
- Browse listings by category (Electronics, Fashion, Cars, Property, and more)
- Full-text search with filters for price, condition, and location
- "Near me" radius search powered by PostGIS
- Save favourites and receive alerts on price drops
- Make offers and negotiate directly with sellers via in-app chat
- Push and email notifications for offer updates

### For sellers
- Post listings in minutes with photo uploads, description, category, and price
- Manage listing status (active, reserved, sold)
- Accept, decline, or counter offers
- Seller profile with ratings and review history

### Platform
- JWT-based authentication with Google/Facebook OAuth support
- Real-time chat powered by WebSockets
- Mobile-responsive React frontend
- Secure image uploads via S3 presigned URLs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS |
| API | Node.js, Express.js |
| Database | PostgreSQL (with PostGIS) |
| Cache / Sessions | Redis |
| Real-time | Socket.io |
| Search | Elasticsearch |
| File storage | AWS S3 |
| Auth | JWT, OAuth 2.0 (Google, Facebook) |
| Email | SendGrid |
| Push notifications | Firebase Cloud Messaging (FCM) |

---

## Architecture

```
Client (React SPA)
        │
        ▼
API Gateway (Express)
  ├── Rate limiting
  ├── JWT authentication
  └── Request routing
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
  Core Services                     WebSocket Server
  ├── Listings Service               └── Chat rooms
  ├── Users Service                  └── Offer threads
  ├── Offers Service
  └── Chat Service
        │
        ├─────────────────────────────┐
        ▼                             ▼
  PostgreSQL                        Redis
  (primary data store)              (sessions, cache, pub/sub)
        │
        ▼
  Elasticsearch           AWS S3
  (listing search)        (images)
```

---

## Database Schema

### Core tables

**users** — `id`, `email`, `username`, `avatar_url`, `location`, `created_at`

**listings** — `id`, `user_id` (FK), `category_id` (FK), `title`, `description`, `price_cents`, `condition`, `status`, `geo_location`, `created_at`

**categories** — `id`, `name`, `slug`, `icon`

**listing_images** — `id`, `listing_id` (FK), `url`, `sort_order`

**offers** — `id`, `listing_id` (FK), `buyer_id` (FK), `amount_cents`, `status`, `created_at`

**messages** — `id`, `offer_id` (FK), `sender_id` (FK), `body`, `sent_at`

> Prices are stored as integers in cents to avoid floating-point rounding issues. Locations use PostGIS `point` type for efficient radius queries.

---

## Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL 15+ with PostGIS extension
- Redis 7+
- An AWS S3 bucket
- Elasticsearch 8+

### 1. Clone the repository

```bash
git clone https://github.com/your-org/alsel.git
cd alsel
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Set up the database

```bash
# Create the database and run migrations
cd server
npm run db:create
npm run db:migrate
npm run db:seed   # optional: load sample listings
```

### 4. Configure environment variables

Copy the example env files and fill in your values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

See [Environment Variables](#environment-variables) below for details.

### 5. Start the development servers

```bash
# In one terminal — backend
cd server
npm run dev

# In another terminal — frontend
cd client
npm run dev
```

The app will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

---

## Environment Variables

### Server (`server/.env`)

```env
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/alsel

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d

# AWS S3
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=alsel-images

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@alsel.com

# Push notifications
FCM_SERVER_KEY=your-fcm-key
```

### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register with email and password |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/google` | Initiate Google OAuth |
| GET | `/api/auth/facebook` | Initiate Facebook OAuth |
| POST | `/api/auth/refresh` | Refresh access token |

### Listings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | Get listings (supports filters) |
| GET | `/api/listings/:id` | Get a single listing |
| POST | `/api/listings` | Create a listing (auth required) |
| PATCH | `/api/listings/:id` | Update a listing (owner only) |
| DELETE | `/api/listings/:id` | Delete a listing (owner only) |
| GET | `/api/listings/search?q=` | Full-text search |

### Offers

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/offers` | Make an offer on a listing |
| GET | `/api/offers/:id` | Get offer details |
| PATCH | `/api/offers/:id/accept` | Accept an offer |
| PATCH | `/api/offers/:id/decline` | Decline an offer |
| PATCH | `/api/offers/:id/counter` | Counter an offer |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/:id` | Get public profile |
| PATCH | `/api/users/me` | Update your profile |
| GET | `/api/users/me/listings` | Your listings |
| GET | `/api/users/me/favourites` | Your saved listings |

### Images

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/images/presign` | Get a presigned S3 upload URL |

---

## Project Structure

```
alsel/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── pages/            # Route-level pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # Global state
│   │   └── utils/            # Helpers
│   └── package.json
│
├── server/                   # Express backend
│   ├── src/
│   │   ├── routes/           # API route handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── middleware/       # Auth, rate limiting, etc.
│   │   ├── sockets/          # WebSocket event handlers
│   │   └── utils/            # Helpers
│   ├── migrations/           # Database migrations
│   ├── seeds/                # Sample data
│   └── package.json
│
└── README.md
```

---

## Roadmap

- [ ] Mobile apps (React Native)
- [ ] In-app payment escrow
- [ ] Verified seller badges
- [ ] AI-assisted listing description generation
- [ ] Delivery / courier integration
- [ ] Bulk listing import (for dealers)
- [ ] Admin dashboard with moderation tools

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

Please make sure tests pass before submitting: `npm run test`

---

## License

MIT © Alsel
