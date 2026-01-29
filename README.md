# Red Airlines

A learning project demonstrating a full-stack application with React, Go, GraphQL, and PostgreSQL.

## Tech Stack

**Frontend**
- React 18+ with TypeScript
- Vite for build tooling
- GraphQL client for API communication

**Backend**
- Go with [gqlgen](https://gqlgen.com/) for GraphQL API
- [sqlx](https://github.com/jmoiron/sqlx) for database queries
- PostgreSQL with raw SQL queries
- No ORM, direct database access

**Database**
- PostgreSQL

## Project Structure

```
red-airlines/
├── backend/          # Go GraphQL API
├── frontend/         # React TypeScript application
├── docs/            # Project documentation
└── migrations/      # Database migration scripts
```

## Domain Model

The application manages flight information with three fare types:
- **Promo**: Economy pricing with restrictions
- **Basic**: Standard pricing and flexibility
- **Pro**: Premium pricing with full flexibility

## Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 14+

### Development Setup

See `docs/tasks.md` for the implementation roadmap.

## Project Goals

This is a learning project focused on:
- Building a GraphQL API with Go and gqlgen
- Using raw SQL queries effectively
- Integrating React with GraphQL
- Understanding full-stack TypeScript workflows
