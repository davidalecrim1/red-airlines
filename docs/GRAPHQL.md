# GraphQL Backend Guide

This document explains core GraphQL concepts and implementation patterns used in this project.

## Core Concepts

### Schema-First Development

GraphQL uses a **schema** as the contract between client and server. The schema defines:
- **Types**: Data structures (Flight, Fare, Booking)
- **Queries**: Read operations clients can perform
- **Fields**: Properties on each type, including relationships

Example:
```graphql
type Flight {
  id: ID!
  flightNumber: String!
  fares: [Fare!]!        # Relationship to Fare type
}

type Query {
  flights(origin: String): [Flight!]!
}
```

The schema lives in `backend/internal/graph/schema.graphqls` and drives code generation.

### Resolvers

**Resolvers** are functions that fetch data for each field in your schema. They answer: "How do I get this data?"

```go
// Query resolver: How to get flights
func (r *queryResolver) Flights(ctx, origin, destination, limit) ([]*model.Flight, error) {
    // Execute SQL query
    return r.DB.SelectContext(ctx, &flights, query, args...)
}

// Field resolver: How to get fares for a flight
func (r *flightResolver) Fares(ctx, obj *model.Flight) ([]*model.Fare, error) {
    // Use DataLoader to batch fetch
    return r.Loaders.FaresByFlightLoader.Load(ctx, obj.ID)()
}
```

**Location**: `backend/internal/graph/resolver/schema.resolvers.go`

### The N+1 Problem

Without optimization, nested GraphQL queries cause exponential database queries:

```graphql
query {
  flights(limit: 10) {     # 1 query: SELECT * FROM flights
    fares {                 # 10 queries: SELECT * FROM fares WHERE flight_id = ?
      bookings {            # 30+ queries: SELECT * FROM bookings WHERE fare_id = ?
      }
    }
  }
}
```

**Total: 41+ queries** for a simple nested query.

### DataLoaders (The Solution)

**DataLoaders** solve N+1 by **batching** and **caching** within a request:

#### How It Works

1. **Batching Window** (16ms): Collects multiple individual requests
2. **Single Query**: Executes one query with all IDs: `WHERE id IN (?, ?, ...)`
3. **Result Distribution**: Returns each result to its original caller
4. **Caching**: Stores results for the request duration

```go
// Individual resolver calls get batched automatically
func (r *flightResolver) Fares(ctx, obj) {
    return r.Loaders.FaresByFlightLoader.Load(ctx, obj.ID)()
}

// Behind the scenes: ONE batched query
// SELECT * FROM fares WHERE flight_id IN (id1, id2, id3, ...)
```

**Result: 3 queries** (flights → fares → bookings) instead of 41+

#### DataLoader Types

| Loader | Purpose | Query Pattern |
|--------|---------|---------------|
| **By ID** | Load single entity | `WHERE id = ?` |
| **By Foreign Key** | Load related entities | `WHERE parent_id IN (...)` |

**Location**: `backend/internal/graph/dataloader/loaders.go`

### Models

Models represent domain entities and map directly to database tables using `db` tags:

```go
type Flight struct {
    ID             string    `db:"id"`
    FlightNumber   string    `db:"flight_number"`
    Origin         string    `db:"origin"`
    DepartureTime  time.Time `db:"departure_time"`
    // ...
}
```

**No ORM** - models couple directly with the database for simplicity and performance.

**Location**: `backend/internal/graph/model/`

### Code Generation (gqlgen)

gqlgen reads your schema and generates:

1. **GraphQL Execution Engine** (`generated/graphql.go`)
   - Request parsing
   - Query execution
   - Type marshaling/unmarshaling

2. **Type Definitions** (`generated/models.go`)
   - GraphQL-specific types not defined in your models

3. **Resolver Stubs** (`resolver/schema.resolvers.go`)
   - Function signatures for you to implement
   - **Preserves your implementations** on regeneration

**Command**: `make generate`

**Never edit generated files** - changes will be overwritten.

## Development Workflow

### 1. Modify Schema

Edit `internal/graph/schema.graphqls`:

```graphql
type Query {
  # Add new query
  searchBookings(email: String!): [Booking!]!
}
```

### 2. Generate Code

```bash
make generate
```

This creates resolver stubs in `schema.resolvers.go`:

```go
func (r *queryResolver) SearchBookings(ctx, email string) ([]*model.Booking, error) {
    panic(fmt.Errorf("not implemented"))
}
```

### 3. Implement Resolver

Replace the panic with your implementation:

```go
func (r *queryResolver) SearchBookings(ctx, email string) ([]*model.Booking, error) {
    var bookings []*model.Booking
    query := "SELECT * FROM bookings WHERE passenger_email = $1"
    err := r.DB.SelectContext(ctx, &bookings, query, email)
    return bookings, err
}
```

### 4. Verify Code Quality

```bash
make lint
```

## Common Patterns

### Adding a Query

**Schema**:
```graphql
type Query {
  flight(id: ID!): Flight
}
```

**Resolver**:
```go
func (r *queryResolver) Flight(ctx, id string) (*model.Flight, error) {
    var flight model.Flight
    err := r.DB.GetContext(ctx, &flight, "SELECT * FROM flights WHERE id = $1", id)
    return &flight, err
}
```

### Adding a Relationship

**Schema**:
```graphql
type Flight {
  fares: [Fare!]!    # Add relationship
}
```

**DataLoader** (in `dataloader/loaders.go`):
```go
func batchFaresByFlight(db *sqlx.DB) dataloader.BatchFunc[string, []*model.Fare] {
    return func(ctx context.Context, flightIDs []string) []*dataloader.Result[[]*model.Fare] {
        // Batch query
        query, args, _ := sqlx.In("SELECT * FROM fares WHERE flight_id IN (?)", flightIDs)
        query = db.Rebind(query)

        var fares []*model.Fare
        db.SelectContext(ctx, &fares, query, args...)

        // Group by flight_id and return in order
        // ...
    }
}
```

**Resolver**:
```go
func (r *flightResolver) Fares(ctx, obj *model.Flight) ([]*model.Fare, error) {
    return r.Loaders.FaresByFlightLoader.Load(ctx, obj.ID)()
}
```

### Query with Filters

**Schema**:
```graphql
type Query {
  flights(origin: String, destination: String, limit: Int): [Flight!]!
}
```

**Resolver**:
```go
func (r *queryResolver) Flights(ctx, origin, destination, limit) ([]*model.Flight, error) {
    query := "SELECT * FROM flights WHERE 1=1"
    args := []interface{}{}

    if origin != nil {
        query += " AND origin = ?"
        args = append(args, *origin)
    }
    if destination != nil {
        query += " AND destination = ?"
        args = append(args, *destination)
    }

    query += " ORDER BY departure_time"

    if limit != nil && *limit > 0 {
        query += " LIMIT ?"
        args = append(args, *limit)
    }

    query = r.DB.Rebind(query)

    var flights []*model.Flight
    err := r.DB.SelectContext(ctx, &flights, query, args...)
    return flights, err
}
```

## Testing GraphQL Queries

### Start the Server

```bash
make postgres-up
make postgres-migrate
make seed
make server
```

Server runs at: http://localhost:8080

### GraphQL Playground

Built-in playground: http://localhost:8080

Or external playground:
```bash
make playground-up
```
Access at: http://localhost:4000

### Example Query

```graphql
query SearchFlights {
  flights(origin: "JFK", destination: "LAX", limit: 5) {
    id
    flightNumber
    departureTime
    availableSeats
    fares {
      fareClass
      price
      availableSeats
      bookings {
        passengerName
        bookingStatus
      }
    }
  }
}
```

**Performance**: 3 queries total (flights → fares → bookings)

## Performance Characteristics

| Pattern | Queries | Performance |
|---------|---------|-------------|
| Without DataLoaders | O(N × M) | Exponential |
| With DataLoaders | O(depth) | Linear per nesting level |
| Batch Window | 16ms | Configurable in `loaders.go` |
| Caching | Per-request | No cross-request cache |

## Best Practices

### Always Use DataLoaders for Relationships

❌ **Don't**:
```go
func (r *flightResolver) Fares(ctx, obj) {
    var fares []*model.Fare
    r.DB.Select(&fares, "SELECT * FROM fares WHERE flight_id = ?", obj.ID)
    return fares, nil
}
```

✅ **Do**:
```go
func (r *flightResolver) Fares(ctx, obj) {
    return r.Loaders.FaresByFlightLoader.Load(ctx, obj.ID)()
}
```

### Keep Resolvers Thin

Resolvers should only:
- Call the database (via DataLoaders)
- Transform data minimally
- Handle errors

Complex business logic belongs in service layers.

### Run Linting After Changes

```bash
make lint
```

Ensures:
- Code formatting (gofumpt)
- Import organization (goimports)
- Modern Go patterns (modernize)
- Linting rules (golangci-lint)

### Document Complex Queries

Use GraphQL comments for queries that aren't self-explanatory:

```graphql
"""
Search for available flights between two airports.
Returns only scheduled flights with available seats.
"""
flights(
  origin: String!
  destination: String!
  limit: Int
): [Flight!]!
```

## Configuration

### gqlgen.yml

Controls code generation:

```yaml
schema:
  - internal/graph/schema.graphqls

exec:
  filename: internal/graph/generated/graphql.go    # Execution engine
  package: generated

model:
  filename: internal/graph/generated/models.go     # Generated models
  package: generated

resolver:
  layout: follow-schema                             # One file per schema file
  dir: internal/graph/resolver
  package: resolver

models:
  # Map GraphQL types to Go types
  Flight:
    model: github.com/davidalecrim/red-airlines/internal/graph/model.Flight
  Time:
    model: github.com/99designs/gqlgen/graphql.Time
```

### DataLoader Configuration

Adjust batching window in `dataloader/loaders.go`:

```go
const batchWindow = 16 * time.Millisecond  // Default: 16ms
```

**Tradeoffs**:
- **Shorter window**: Lower latency, less batching
- **Longer window**: More batching, higher latency

## Troubleshooting

### "not implemented" Panic

You haven't implemented a resolver. Run `make generate` to see stub, then implement it.

### Too Many Database Queries

You're not using DataLoaders for relationships. Check the resolver and add DataLoader calls.

### Type Mismatch Errors

Your domain models don't match the GraphQL schema. Either:
1. Update the model
2. Map to a different type in `gqlgen.yml`
3. Use a custom scalar

### Stale Generated Code

After schema changes, always run:
```bash
make generate
make lint
```
