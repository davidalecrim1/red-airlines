package model

import "time"

type Flight struct {
	ID             string    `db:"id"`
	FlightNumber   string    `db:"flight_number"`
	Origin         string    `db:"origin"`
	Destination    string    `db:"destination"`
	DepartureTime  time.Time `db:"departure_time"`
	ArrivalTime    time.Time `db:"arrival_time"`
	AircraftType   string    `db:"aircraft_type"`
	TotalSeats     int       `db:"total_seats"`
	AvailableSeats int       `db:"available_seats"`
	Status         string    `db:"status"`
	CreatedAt      time.Time `db:"created_at"`
	UpdatedAt      time.Time `db:"updated_at"`
}
