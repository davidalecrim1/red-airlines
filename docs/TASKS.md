# Red Airlines - Project Tasks

## Phase 1: Domain Model Design
- [ ] Define Flight entity (id, number, origin, destination, departure, arrival, price)
- [ ] Define Fare types (Promo, Basic, Pro) and pricing rules
- [ ] Define database schema with tables and relationships
- [ ] Create database migration scripts

## Phase 2: Backend Development
- [ ] Initialize Go project with go.mod
- [ ] Install dependencies (gqlgen, sqlx, postgres driver)
- [ ] Setup PostgreSQL connection with sqlx
- [ ] Implement database migrations
- [ ] Configure gqlgen and generate GraphQL boilerplate
- [ ] Define GraphQL schema (queries, types)
- [ ] Implement resolvers for flight queries
- [ ] Write SQL queries using sqlx
- [ ] Add seed data for initial flights
- [ ] Test GraphQL API with GraphQL playground

## Phase 3: Frontend Development
- [ ] Initialize React + TypeScript + Vite project
- [ ] Setup GraphQL client (Apollo or urql)
- [ ] Create Flight list component
- [ ] Create Fare display component
- [ ] Implement GraphQL queries from frontend
- [ ] Style the UI with basic CSS
- [ ] Add error handling and loading states

## Phase 4: Integration & Testing
- [ ] Add a Docker compose to run everything.
- [ ] Test end-to-end flow
- [ ] Verify data consistency
- [ ] Add development setup instructions
