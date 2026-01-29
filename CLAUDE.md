# Project Guidelines

## Architecture
- **Frontend**: React + TypeScript + Vite
- **Backend**: Go with GraphQL (gqlgen)
- **Database**: PostgreSQL with raw SQL queries
- **API**: GraphQL for all client-server communication

## Code Standards

### Backend (Go)
- Use sqlx for database queries (raw SQL, no ORM)
- Keep the backend minimal and focused
- Follow gqlgen conventions for GraphQL schema and resolvers
- Use clear, descriptive function names
- **IMPORTANT**: Run `make lint` after completing any backend task to ensure code quality

### Frontend (React/TypeScript)
- Use TypeScript strict mode
- Functional components with hooks
- Keep components small and focused
- Type all GraphQL queries and responses

### Database
- Use migrations for schema changes
- Write clear, readable SQL
- Index appropriately for query performance

## Development Workflow
1. Define domain model first
2. Implement backend (database + GraphQL API)
3. Build frontend UI
4. Test integration between layers

## Comments
Only add comments to explain business logic (WHY), not implementation details (HOW).
