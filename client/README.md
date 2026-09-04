# MDDS Location Hierarchy API
A production-ready B2B API providing complete Indian MDDS (Ministry of Electronics and Information Technology- Master Data Directory) location data, supporting real-time autocomplete and structured hierarchy matching.

## Features
- **Hierarchical Location Data:** States, Districts, Sub-Districts, and Villages mapping.
- **B2B Autocomplete Engine:** High-speed location suggestions with auto-fill support.
- **Tiered Rate Limiting:** Powered by Upstash Redis (Sliding Window Algorithm).
- **Audit Logging:** Logs request time, response codes, and endpoints using Neon PostgreSQL and Prisma ORM.
- **Security:** Strict headers via Helmet middleware and API Key validation. 

## Tech Stack
- **Backend:** Node.js (ES Modules), Express.js
- **Database:** Neon PostgreSQL, Prisma ORM
- **Caching & Rate Limiting:** Upstash Redis
- **Frontend Demo:** React, Vite, Tailwind CSS

## Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL= your_neon_postgres_url
UPSTASH_REDIS_REST_URL = your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN= your_upstash_redis_token
PORT = 5000