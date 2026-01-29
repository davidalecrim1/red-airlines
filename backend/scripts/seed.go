package main

import (
	"fmt"
	"log"
	"math"
	"math/rand"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var (
	firstNames = []string{
		"John", "Jane", "Michael", "Emily", "David", "Sarah", "Robert", "Jessica",
		"James", "Maria", "William", "Lisa", "Richard", "Jennifer", "Joseph", "Karen",
	}
	lastNames = []string{
		"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
		"Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
	}
	airports = []string{
		"JFK", "LAX", "ORD", "DFW", "ATL", "BOS", "SEA", "MIA",
		"SFO", "LAS", "DEN", "PHX", "IAD", "SAN", "DAL", "EWR",
	}
	aircraftTypes = []string{"Boeing 737", "Airbus A320", "Boeing 777"}
)

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

func main() {
	rand.Seed(time.Now().UnixNano())

	db := connectDB()
	defer db.Close()

	log.Println("Generating flights...")
	flights := generateFlights(1000)
	insertFlights(db, flights)

	log.Println("Generating fares...")
	fares := generateFares(flights)
	insertFares(db, fares)

	log.Println("Generating bookings...")
	generateAndInsertBookings(db, flights, fares)

	log.Println("Seed data completed")
}

func connectDB() *sqlx.DB {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", "postgres"),
		getEnv("DB_NAME", "red_airlines"),
	)
	db, err := sqlx.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Connection failed: %v", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatalf("Ping failed: %v", err)
	}
	return db
}

func generateFlights(count int) []Flight {
	flights := make([]Flight, 0, count)
	now := time.Now()

	for i := 0; i < count; i++ {
		origin := airports[rand.Intn(len(airports))]
		dest := airports[rand.Intn(len(airports))]
		for dest == origin {
			dest = airports[rand.Intn(len(airports))]
		}

		depTime := now.AddDate(0, 0, rand.Intn(30)).Add(time.Duration(rand.Intn(24)) * time.Hour)
		arrTime := depTime.Add(time.Duration(2+rand.Intn(8)) * time.Hour)
		totalSeats := 150 + rand.Intn(151)

		flights = append(flights, Flight{
			ID:             uuid.New().String(),
			FlightNumber:   fmt.Sprintf("RA%d", 1001+i),
			Origin:         origin,
			Destination:    dest,
			DepartureTime:  depTime,
			ArrivalTime:    arrTime,
			AircraftType:   aircraftTypes[rand.Intn(len(aircraftTypes))],
			TotalSeats:     totalSeats,
			AvailableSeats: totalSeats,
			Status:         "scheduled",
			CreatedAt:      now,
			UpdatedAt:      now,
		})
	}
	return flights
}

func insertFlights(db *sqlx.DB, flights []Flight) {
	query := `INSERT INTO flights (id, flight_number, origin, destination, departure_time, arrival_time,
             aircraft_type, total_seats, available_seats, status, created_at, updated_at)
             VALUES (:id, :flight_number, :origin, :destination, :departure_time, :arrival_time,
             :aircraft_type, :total_seats, :available_seats, :status, :created_at, :updated_at)`

	for i := 0; i < len(flights); i += 500 {
		end := i + 500
		if end > len(flights) {
			end = len(flights)
		}
		tx := db.MustBegin()
		for _, f := range flights[i:end] {
			tx.NamedExec(query, f)
		}
		tx.Commit()
	}
	log.Printf("Inserted %d flights", len(flights))
}

func generateFares(flights []Flight) []Fare {
	fares := make([]Fare, 0, len(flights)*3)
	now := time.Now()

	config := map[string]struct {
		percent    float64
		multiplier float64
		refund     bool
		change     bool
		baggage    int
	}{
		"Promo": {0.15, 0.7, false, false, 1},
		"Basic": {0.65, 1.0, true, true, 2},
		"Pro":   {0.20, 1.5, true, true, 3},
	}

	for _, f := range flights {
		dist := distance(f.Origin, f.Destination)
		basePrice := 100.0 + float64(dist)/1000.0*0.5

		for _, class := range []string{"Promo", "Basic", "Pro"} {
			c := config[class]
			fares = append(fares, Fare{
				ID:               uuid.New().String(),
				FlightID:         f.ID,
				FareClass:        class,
				Price:            math.Round(basePrice*c.multiplier*100) / 100,
				BaggageAllowance: c.baggage,
				IsRefundable:     c.refund,
				IsChangeable:     c.change,
				AvailableSeats:   int(float64(f.TotalSeats) * c.percent),
				CreatedAt:        now,
				UpdatedAt:        now,
			})
		}
	}
	return fares
}

func insertFares(db *sqlx.DB, fares []Fare) {
	query := `INSERT INTO fares (id, flight_id, fare_class, price, baggage_allowance,
             is_refundable, is_changeable, available_seats, created_at, updated_at)
             VALUES (:id, :flight_id, :fare_class, :price, :baggage_allowance,
             :is_refundable, :is_changeable, :available_seats, :created_at, :updated_at)`

	for i := 0; i < len(fares); i += 500 {
		end := i + 500
		if end > len(fares) {
			end = len(fares)
		}
		tx := db.MustBegin()
		for _, f := range fares[i:end] {
			tx.NamedExec(query, f)
		}
		tx.Commit()
	}
	log.Printf("Inserted %d fares", len(fares))
}

func generateAndInsertBookings(db *sqlx.DB, flights []Flight, fares []Fare) {
	query := `INSERT INTO bookings (id, booking_reference, flight_id, fare_id, passenger_name,
             passenger_email, passenger_phone, seat_number, booking_status, total_price,
             booked_at, created_at, updated_at)
             VALUES (:id, :booking_reference, :flight_id, :fare_id, :passenger_name,
             :passenger_email, :passenger_phone, :seat_number, :booking_status, :total_price,
             :booked_at, :created_at, :updated_at)`

	faresByFlight := make(map[string][]Fare)
	for _, f := range fares {
		faresByFlight[f.FlightID] = append(faresByFlight[f.FlightID], f)
	}

	bookingStatuses := []string{"confirmed", "confirmed", "confirmed", "confirmed", "confirmed",
		"confirmed", "confirmed", "confirmed", "checked_in", "cancelled"}
	now := time.Now()
	bookingCount := 0

	for flightIdx, flight := range flights {
		flightFares := faresByFlight[flight.ID]
		if len(flightFares) == 0 {
			continue
		}

		tx := db.MustBegin()
		for i := 0; i < 100; i++ {
			firstName := firstNames[rand.Intn(len(firstNames))]
			lastName := lastNames[rand.Intn(len(lastNames))]

			fare := flightFares[selectFareIndex(len(flightFares))]

			booking := Booking{
				ID:               uuid.New().String(),
				BookingReference: generateRef(),
				FlightID:         flight.ID,
				FareID:           fare.ID,
				PassengerName:    firstName + " " + lastName,
				PassengerEmail:   fmt.Sprintf("%s.%s@example.com", toLowerCase(firstName), toLowerCase(lastName)),
				PassengerPhone:   fmt.Sprintf("(%03d) %03d-%04d", rand.Intn(1000), rand.Intn(1000), rand.Intn(10000)),
				SeatNumber:       fmt.Sprintf("%d%c", rand.Intn(30)+1, 'A'+rune(rand.Intn(6))),
				BookingStatus:    bookingStatuses[rand.Intn(len(bookingStatuses))],
				TotalPrice:       fare.Price,
				BookedAt:         now.Add(-time.Duration(rand.Intn(30*24)) * time.Hour),
				CreatedAt:        now,
				UpdatedAt:        now,
			}
			tx.NamedExec(query, booking)
			bookingCount++
		}
		tx.Commit()

		if (flightIdx+1)%100 == 0 {
			log.Printf("Processed %d flights, %d bookings", flightIdx+1, bookingCount)
		}
	}
	log.Printf("Inserted %d bookings", bookingCount)
}

func selectFareIndex(count int) int {
	weights := []int{70, 65, 20}
	total := weights[0] + weights[1] + weights[2]
	roll := rand.Intn(total)
	if roll < weights[0] {
		return 1
	} else if roll < weights[0]+weights[1] {
		return 0
	}
	return 2
}

func distance(origin, dest string) int {
	distances := map[[2]string]int{
		{"JFK", "LAX"}: 2475, {"LAX", "JFK"}: 2475,
		{"JFK", "ORD"}: 790, {"ORD", "JFK"}: 790,
		{"JFK", "DFW"}: 1391, {"DFW", "JFK"}: 1391,
		{"LAX", "ORD"}: 1745, {"ORD", "LAX"}: 1745,
	}
	if d, ok := distances[[2]string{origin, dest}]; ok {
		return d
	}
	return 1000 + rand.Intn(2000)
}

func generateRef() string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	ref := make([]byte, 10)
	for i := range ref {
		ref[i] = chars[rand.Intn(len(chars))]
	}
	return string(ref)
}

func toLowerCase(s string) string {
	result := make([]byte, len(s))
	for i := 0; i < len(s); i++ {
		if s[i] >= 'A' && s[i] <= 'Z' {
			result[i] = s[i] + 32
		} else {
			result[i] = s[i]
		}
	}
	return string(result)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
