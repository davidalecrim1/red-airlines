package dataloader

import (
	"context"
	"time"

	"github.com/graph-gophers/dataloader/v7"
	"github.com/jmoiron/sqlx"

	"github.com/davidalecrim/red-airlines/internal/graph/model"
)

const batchWindow = 16 * time.Millisecond

type Loaders struct {
	FlightLoader           *dataloader.Loader[string, *model.Flight]
	FareLoader             *dataloader.Loader[string, *model.Fare]
	FaresByFlightLoader    *dataloader.Loader[string, []*model.Fare]
	BookingsByFlightLoader *dataloader.Loader[string, []*model.Booking]
	BookingsByFareLoader   *dataloader.Loader[string, []*model.Booking]
}

func NewLoaders(db *sqlx.DB) *Loaders {
	return &Loaders{
		FlightLoader:           dataloader.NewBatchedLoader(batchFlights(db), dataloader.WithWait[string, *model.Flight](batchWindow)),
		FareLoader:             dataloader.NewBatchedLoader(batchFares(db), dataloader.WithWait[string, *model.Fare](batchWindow)),
		FaresByFlightLoader:    dataloader.NewBatchedLoader(batchFaresByFlight(db), dataloader.WithWait[string, []*model.Fare](batchWindow)),
		BookingsByFlightLoader: dataloader.NewBatchedLoader(batchBookingsByFlight(db), dataloader.WithWait[string, []*model.Booking](batchWindow)),
		BookingsByFareLoader:   dataloader.NewBatchedLoader(batchBookingsByFare(db), dataloader.WithWait[string, []*model.Booking](batchWindow)),
	}
}

func batchFlights(db *sqlx.DB) dataloader.BatchFunc[string, *model.Flight] {
	return func(ctx context.Context, ids []string) []*dataloader.Result[*model.Flight] {
		results := make([]*dataloader.Result[*model.Flight], len(ids))

		query, args, err := sqlx.In("SELECT * FROM flights WHERE id IN (?)", ids)
		if err != nil {
			for i := range results {
				results[i] = &dataloader.Result[*model.Flight]{Error: err}
			}
			return results
		}

		query = db.Rebind(query)
		var flights []*model.Flight
		if err := db.SelectContext(ctx, &flights, query, args...); err != nil {
			for i := range results {
				results[i] = &dataloader.Result[*model.Flight]{Error: err}
			}
			return results
		}

		flightMap := make(map[string]*model.Flight, len(flights))
		for _, f := range flights {
			flightMap[f.ID] = f
		}

		for i, id := range ids {
			if flight, ok := flightMap[id]; ok {
				results[i] = &dataloader.Result[*model.Flight]{Data: flight}
			} else {
				results[i] = &dataloader.Result[*model.Flight]{Data: nil}
			}
		}

		return results
	}
}

func batchFares(db *sqlx.DB) dataloader.BatchFunc[string, *model.Fare] {
	return func(ctx context.Context, ids []string) []*dataloader.Result[*model.Fare] {
		results := make([]*dataloader.Result[*model.Fare], len(ids))

		query, args, err := sqlx.In("SELECT * FROM fares WHERE id IN (?)", ids)
		if err != nil {
			for i := range results {
				results[i] = &dataloader.Result[*model.Fare]{Error: err}
			}
			return results
		}

		query = db.Rebind(query)
		var fares []*model.Fare
		if err := db.SelectContext(ctx, &fares, query, args...); err != nil {
			for i := range results {
				results[i] = &dataloader.Result[*model.Fare]{Error: err}
			}
			return results
		}

		fareMap := make(map[string]*model.Fare, len(fares))
		for _, f := range fares {
			fareMap[f.ID] = f
		}

		for i, id := range ids {
			if fare, ok := fareMap[id]; ok {
				results[i] = &dataloader.Result[*model.Fare]{Data: fare}
			} else {
				results[i] = &dataloader.Result[*model.Fare]{Data: nil}
			}
		}

		return results
	}
}

func batchFaresByFlight(db *sqlx.DB) dataloader.BatchFunc[string, []*model.Fare] {
	return func(ctx context.Context, flightIDs []string) []*dataloader.Result[[]*model.Fare] {
		results := make([]*dataloader.Result[[]*model.Fare], len(flightIDs))

		query, args, err := sqlx.In("SELECT * FROM fares WHERE flight_id IN (?)", flightIDs)
		if err != nil {
			for i := range results {
				results[i] = &dataloader.Result[[]*model.Fare]{Error: err}
			}
			return results
		}

		query = db.Rebind(query)
		var fares []*model.Fare
		if err := db.SelectContext(ctx, &fares, query, args...); err != nil {
			for i := range results {
				results[i] = &dataloader.Result[[]*model.Fare]{Error: err}
			}
			return results
		}

		faresByFlight := make(map[string][]*model.Fare)
		for _, fare := range fares {
			faresByFlight[fare.FlightID] = append(faresByFlight[fare.FlightID], fare)
		}

		for i, flightID := range flightIDs {
			if fares, ok := faresByFlight[flightID]; ok {
				results[i] = &dataloader.Result[[]*model.Fare]{Data: fares}
			} else {
				results[i] = &dataloader.Result[[]*model.Fare]{Data: []*model.Fare{}}
			}
		}

		return results
	}
}

func batchBookingsByFlight(db *sqlx.DB) dataloader.BatchFunc[string, []*model.Booking] {
	return func(ctx context.Context, flightIDs []string) []*dataloader.Result[[]*model.Booking] {
		results := make([]*dataloader.Result[[]*model.Booking], len(flightIDs))

		query, args, err := sqlx.In("SELECT * FROM bookings WHERE flight_id IN (?)", flightIDs)
		if err != nil {
			for i := range results {
				results[i] = &dataloader.Result[[]*model.Booking]{Error: err}
			}
			return results
		}

		query = db.Rebind(query)
		var bookings []*model.Booking
		if err := db.SelectContext(ctx, &bookings, query, args...); err != nil {
			for i := range results {
				results[i] = &dataloader.Result[[]*model.Booking]{Error: err}
			}
			return results
		}

		bookingsByFlight := make(map[string][]*model.Booking)
		for _, booking := range bookings {
			bookingsByFlight[booking.FlightID] = append(bookingsByFlight[booking.FlightID], booking)
		}

		for i, flightID := range flightIDs {
			if bookings, ok := bookingsByFlight[flightID]; ok {
				results[i] = &dataloader.Result[[]*model.Booking]{Data: bookings}
			} else {
				results[i] = &dataloader.Result[[]*model.Booking]{Data: []*model.Booking{}}
			}
		}

		return results
	}
}

func batchBookingsByFare(db *sqlx.DB) dataloader.BatchFunc[string, []*model.Booking] {
	return func(ctx context.Context, fareIDs []string) []*dataloader.Result[[]*model.Booking] {
		results := make([]*dataloader.Result[[]*model.Booking], len(fareIDs))

		query, args, err := sqlx.In("SELECT * FROM bookings WHERE fare_id IN (?)", fareIDs)
		if err != nil {
			for i := range results {
				results[i] = &dataloader.Result[[]*model.Booking]{Error: err}
			}
			return results
		}

		query = db.Rebind(query)
		var bookings []*model.Booking
		if err := db.SelectContext(ctx, &bookings, query, args...); err != nil {
			for i := range results {
				results[i] = &dataloader.Result[[]*model.Booking]{Error: err}
			}
			return results
		}

		bookingsByFare := make(map[string][]*model.Booking)
		for _, booking := range bookings {
			bookingsByFare[booking.FareID] = append(bookingsByFare[booking.FareID], booking)
		}

		for i, fareID := range fareIDs {
			if bookings, ok := bookingsByFare[fareID]; ok {
				results[i] = &dataloader.Result[[]*model.Booking]{Data: bookings}
			} else {
				results[i] = &dataloader.Result[[]*model.Booking]{Data: []*model.Booking{}}
			}
		}

		return results
	}
}
