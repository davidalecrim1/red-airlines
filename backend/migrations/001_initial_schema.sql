-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_number VARCHAR(10) NOT NULL UNIQUE,
    origin VARCHAR(3) NOT NULL,
    destination VARCHAR(3) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    aircraft_type VARCHAR(50) NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Fares table
CREATE TABLE IF NOT EXISTS fares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
    fare_class VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    baggage_allowance INTEGER NOT NULL,
    is_refundable BOOLEAN NOT NULL DEFAULT false,
    is_changeable BOOLEAN NOT NULL DEFAULT false,
    available_seats INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(flight_id, fare_class)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(10) NOT NULL UNIQUE,
    flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
    fare_id UUID NOT NULL REFERENCES fares(id) ON DELETE CASCADE,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(100) NOT NULL,
    passenger_phone VARCHAR(20),
    seat_number VARCHAR(5),
    booking_status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    total_price DECIMAL(10, 2) NOT NULL,
    booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for flights
CREATE INDEX IF NOT EXISTS idx_flights_departure_time ON flights(departure_time);
CREATE INDEX IF NOT EXISTS idx_flights_origin_destination ON flights(origin, destination);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);
CREATE INDEX IF NOT EXISTS idx_flights_flight_number ON flights(flight_number);

-- Indexes for fares
CREATE INDEX IF NOT EXISTS idx_fares_flight_id ON fares(flight_id);
CREATE INDEX IF NOT EXISTS idx_fares_fare_class ON fares(fare_class);
CREATE INDEX IF NOT EXISTS idx_fares_flight_fare_class ON fares(flight_id, fare_class);

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_flight_id ON bookings(flight_id);
CREATE INDEX IF NOT EXISTS idx_bookings_fare_id ON bookings(fare_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger_email ON bookings(passenger_email);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booked_at ON bookings(booked_at);
