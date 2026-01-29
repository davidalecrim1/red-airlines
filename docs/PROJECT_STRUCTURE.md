# Red Airlines - Project Structure

Monorepo containing frontend and backend for flight booking system.

```
red-airlines/
├── backend/              # Go GraphQL API + PostgreSQL
│   ├── docker-compose.yml
│   ├── migrations/       # Database schema
│   ├── scripts/          # DB setup and seed scripts
│   ├── go.mod
│   ├── main.go
│   └── Makefile
│
├── frontend/             # React + TypeScript UI
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docs/                 # Documentation
│   ├── domain-model.md
│   └── PROJECT_STRUCTURE.md (this file)
│
├── README.md
└── CLAUDE.md
```

## Backend Setup

```bash
cd backend
make db-up                # Start PostgreSQL
make db-migrate           # Run migrations
make generate-sample-data # Seed data (1000 flights, 100k bookings)
make db-shell             # Open psql
```

Database: PostgreSQL with 3 tables (flights, fares, bookings)

## Frontend Setup

```bash
cd frontend
npm install
npm run dev    # Development server
npm run build  # Production build
```

Stack: React 18+, TypeScript, Vite, GraphQL client (TBD)

## Quick Start

```bash
# Terminal 1: Database + Backend
cd backend && make db-up && make db-migrate && make generate-sample-data
go run main.go

# Terminal 2: Frontend
cd frontend && npm install && npm run dev
```
