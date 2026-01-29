# Domain Model Proposal

## Overview

The Red Airlines domain model consists of three core entities: Flights, Fares, and Bookings. This structure allows exploration of GraphQL relationships, joins, and different query patterns.

## Entities

### 1. Flight

Represents a scheduled flight between two airports.

**Attributes:**
- `id` (UUID, PK): Unique identifier
- `flight_number` (VARCHAR): Flight code (e.g., "RA101")
- `origin` (VARCHAR): Departure airport code (e.g., "JFK")
- `destination` (VARCHAR): Arrival airport code (e.g., "LAX")
- `departure_time` (TIMESTAMP): Scheduled departure
- `arrival_time` (TIMESTAMP): Scheduled arrival
- `aircraft_type` (VARCHAR): Aircraft model (e.g., "Boeing 737")
- `total_seats` (INTEGER): Total capacity
- `available_seats` (INTEGER): Remaining seats
- `status` (VARCHAR): Flight status (scheduled, boarding, departed, arrived, cancelled)
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

**Business Rules:**
- Flight number must be unique per departure date
- Available seats cannot exceed total seats
- Departure time must be before arrival time

### 2. Fare

Represents pricing tiers for flights. Each flight can have multiple fare types with different prices and conditions.

**Attributes:**
- `id` (UUID, PK): Unique identifier
- `flight_id` (UUID, FK): References Flight
- `fare_class` (VARCHAR): Fare type (promo, basic, pro)
- `price` (DECIMAL): Price in USD
- `baggage_allowance` (INTEGER): Checked bags included
- `is_refundable` (BOOLEAN): Can be refunded
- `is_changeable` (BOOLEAN): Can be changed
- `available_seats` (INTEGER): Seats allocated to this fare class
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

**Fare Classes:**
- **Promo**: Lowest price, no refunds, no changes, no baggage, limited seats
- **Basic**: Standard price, no refunds, changeable with fee, 1 bag, moderate availability
- **Pro**: Premium price, fully refundable, free changes, 2 bags, best availability

**Business Rules:**
- Each flight must have at least one fare
- Sum of all fare available_seats should not exceed flight available_seats
- Price must be positive

### 3. Booking

Represents a customer reservation for a specific fare on a flight.

**Attributes:**
- `id` (UUID, PK): Unique identifier
- `booking_reference` (VARCHAR): Human-readable booking code (e.g., "ABC123")
- `flight_id` (UUID, FK): References Flight
- `fare_id` (UUID, FK): References Fare
- `passenger_name` (VARCHAR): Full name
- `passenger_email` (VARCHAR): Contact email
- `passenger_phone` (VARCHAR): Contact phone
- `seat_number` (VARCHAR): Assigned seat (e.g., "12A")
- `booking_status` (VARCHAR): Status (confirmed, cancelled, checked_in, completed)
- `total_price` (DECIMAL): Final price paid
- `booked_at` (TIMESTAMP): When booking was made
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

**Business Rules:**
- Booking reference must be unique
- Cannot book cancelled flights
- Seat number must be unique per flight
- Total price should match fare price (or include modifications)

## Entity Relationships

```
Flight (1) ──→ (N) Fare
  ↓
  └──→ (N) Booking

Fare (1) ──→ (N) Booking
```

- One Flight has many Fares (one-to-many)
- One Flight has many Bookings (one-to-many)
- One Fare has many Bookings (one-to-many)
- One Booking belongs to one Flight and one Fare (many-to-one)

## GraphQL Schema Implications

This model enables interesting GraphQL queries:

**Query Examples:**
```graphql
# Get flight with all fares
query {
  flight(id: "...") {
    flightNumber
    origin
    destination
    fares {
      fareClass
      price
      isRefundable
    }
  }
}

# Get bookings with nested flight and fare details
query {
  bookings {
    bookingReference
    passengerName
    flight {
      flightNumber
      departureTime
    }
    fare {
      fareClass
      price
    }
  }
}

# Search flights with fare filtering
query {
  flights(origin: "JFK", destination: "LAX") {
    flightNumber
    departureTime
    fares(fareClass: PROMO) {
      price
      availableSeats
    }
  }
}
```

## Database Indexes

**Recommended indexes for query performance:**

Flights:
- `idx_flights_route` on (origin, destination, departure_time)
- `idx_flights_number` on (flight_number)
- `idx_flights_status` on (status)

Fares:
- `idx_fares_flight_id` on (flight_id)
- `idx_fares_class` on (fare_class)

Bookings:
- `idx_bookings_reference` on (booking_reference) - unique
- `idx_bookings_flight_id` on (flight_id)
- `idx_bookings_fare_id` on (fare_id)
- `idx_bookings_email` on (passenger_email)

## Sample Data Scenarios

**Scenario 1: Cross-country flight**
- Flight: RA101, JFK → LAX, Boeing 737, 180 seats
- Fares: Promo ($199, 30 seats), Basic ($299, 100 seats), Pro ($499, 50 seats)
- Bookings: Various passengers across different fare classes

**Scenario 2: Short regional flight**
- Flight: RA205, BOS → NYC, Airbus A320, 150 seats
- Fares: Basic ($149, 100 seats), Pro ($249, 50 seats)
- Bookings: Mostly business travelers in Pro class

**Scenario 3: Red-eye flight**
- Flight: RA888, LAX → JFK, Boeing 777, 300 seats
- Fares: Promo ($179, 50 seats), Basic ($279, 200 seats), Pro ($449, 50 seats)
- Bookings: Mix of leisure and business travelers

## Next Steps

1. Review and approve this domain model
2. Create SQL migration scripts for table creation
3. Define GraphQL schema types matching these entities
4. Implement seed data based on sample scenarios
5. Build resolvers to handle entity relationships
