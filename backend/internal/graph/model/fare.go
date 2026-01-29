package model

import "time"

type Fare struct {
	ID               string    `db:"id"`
	FlightID         string    `db:"flight_id"`
	FareClass        string    `db:"fare_class"`
	Price            float64   `db:"price"`
	BaggageAllowance int       `db:"baggage_allowance"`
	IsRefundable     bool      `db:"is_refundable"`
	IsChangeable     bool      `db:"is_changeable"`
	AvailableSeats   int       `db:"available_seats"`
	CreatedAt        time.Time `db:"created_at"`
	UpdatedAt        time.Time `db:"updated_at"`
}
