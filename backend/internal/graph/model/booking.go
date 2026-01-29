package model

import "time"

type Booking struct {
	ID               string    `db:"id"`
	BookingReference string    `db:"booking_reference"`
	FlightID         string    `db:"flight_id"`
	FareID           string    `db:"fare_id"`
	PassengerName    string    `db:"passenger_name"`
	PassengerEmail   string    `db:"passenger_email"`
	PassengerPhone   string    `db:"passenger_phone"`
	SeatNumber       string    `db:"seat_number"`
	BookingStatus    string    `db:"booking_status"`
	TotalPrice       float64   `db:"total_price"`
	BookedAt         time.Time `db:"booked_at"`
	CreatedAt        time.Time `db:"created_at"`
	UpdatedAt        time.Time `db:"updated_at"`
}
