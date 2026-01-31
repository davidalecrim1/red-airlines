import { useState } from 'react';
import { useQuery } from 'urql';
import { SearchForm } from '../components/SearchForm';
import { Loading } from '../components/Loading';
import { SearchFlightsDocument, GetFlightWithBookingsDocument } from '../generated/graphql';
import { formatDateTime, formatPrice, formatTime, formatStatus } from '../utils/formatters';

export function AdminBookings() {
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  const [destination, setDestination] = useState<string | undefined>(undefined);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

  const [flightsResult] = useQuery({
    query: SearchFlightsDocument,
    variables: { origin, destination, limit: 50 },
    pause: !origin && !destination,
  });

  const [flightWithBookingsResult] = useQuery({
    query: GetFlightWithBookingsDocument,
    variables: { id: selectedFlightId! },
    pause: !selectedFlightId,
  });

  const handleSearch = (searchOrigin: string, searchDestination: string) => {
    setOrigin(searchOrigin || undefined);
    setDestination(searchDestination || undefined);
    setSelectedFlightId(null);
  };

  const handleFlightSelect = (flightId: string) => {
    setSelectedFlightId(flightId);
  };

  const handleBackToSearch = () => {
    setSelectedFlightId(null);
  };

  if (selectedFlightId) {
    const { data, fetching, error } = flightWithBookingsResult;

    if (fetching) return <Loading />;

    if (error) {
      return (
        <div className="admin-container">
          <div className="error-message">
            <p>Error loading flight bookings: {error.message}</p>
            <button onClick={handleBackToSearch} className="btn btn-secondary">
              Back to Search
            </button>
          </div>
        </div>
      );
    }

    if (!data?.flight) {
      return (
        <div className="admin-container">
          <div className="error-message">
            <p>Flight not found</p>
            <button onClick={handleBackToSearch} className="btn btn-secondary">
              Back to Search
            </button>
          </div>
        </div>
      );
    }

    const flight = data.flight;
    const bookings = flight.bookings || [];

    return (
      <div className="admin-container">
        <div className="bookings-container">
          <div className="bookings-header">
            <div>
              <button onClick={handleBackToSearch} className="btn btn-secondary btn-sm">
                ← Back to Search
              </button>
              <h2 style={{ marginTop: '1rem' }}>
                Flight {flight.flightNumber} - {flight.origin} to {flight.destination}
              </h2>
              <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                {formatDateTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
              </p>
            </div>
            <div className="bookings-count">
              {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings for this flight yet.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <div className="booking-main-info">
                      <span className="booking-reference">{booking.bookingReference}</span>
                    </div>
                    <div className="booking-header-right">
                      <span
                        className="booking-status-badge"
                        data-status={booking.bookingStatus.toLowerCase()}
                      >
                        {formatStatus(booking.bookingStatus)}
                      </span>
                      <div className="booking-price">{formatPrice(booking.totalPrice)}</div>
                    </div>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-info-grid">
                      <div className="booking-info-item">
                        <span className="booking-info-label">Passenger</span>
                        <span className="booking-info-value">{booking.passengerName}</span>
                      </div>
                      <div className="booking-info-item">
                        <span className="booking-info-label">Email</span>
                        <span className="booking-info-value">{booking.passengerEmail}</span>
                      </div>
                      <div className="booking-info-item">
                        <span className="booking-info-label">Phone</span>
                        <span className="booking-info-value">
                          {booking.passengerPhone || 'Not provided'}
                        </span>
                      </div>
                      <div className="booking-info-item">
                        <span className="booking-info-label">Seat</span>
                        <span className="booking-info-value">
                          {booking.seatNumber || 'Not assigned'}
                        </span>
                      </div>
                      <div className="booking-info-item">
                        <span className="booking-info-label">Class</span>
                        <span className="booking-info-value">{booking.fare.fareClass}</span>
                      </div>
                      <div className="booking-info-item">
                        <span className="booking-info-label">Booked</span>
                        <span className="booking-info-value">
                          {formatDateTime(booking.bookedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin - Flight Bookings</h1>
        <p>Search for a flight to view all bookings</p>
      </div>

      <SearchForm onSearch={handleSearch} />

      {!flightsResult.data && !flightsResult.fetching && !flightsResult.error && (
        <div className="welcome-section">
          <div className="airplane-icon">✈</div>
          <h2>Select a Flight</h2>
          <p>Search for flights to view their bookings</p>
        </div>
      )}

      {flightsResult.fetching && <Loading />}

      {flightsResult.error && (
        <div className="error-message">
          <p>Error loading flights: {flightsResult.error.message}</p>
        </div>
      )}

      {flightsResult.data &&
        flightsResult.data.flights &&
        flightsResult.data.flights.length === 0 && (
          <div className="empty-state">
            <p>No flights found matching your search criteria.</p>
          </div>
        )}

      {flightsResult.data &&
        flightsResult.data.flights &&
        flightsResult.data.flights.length > 0 && (
          <div className="admin-flights-section">
            <h2>Select a Flight</h2>
            <div className="admin-flights-table-container">
              <table className="admin-flights-table">
                <thead>
                  <tr>
                    <th>Flight Number</th>
                    <th>Route</th>
                    <th>Departure</th>
                    <th>Aircraft</th>
                    <th>Available Seats</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {flightsResult.data.flights.map((flight) => (
                    <tr key={flight.id} className="admin-flight-row">
                      <td className="flight-number-cell">{flight.flightNumber}</td>
                      <td className="route-cell">
                        <strong>{flight.origin}</strong> → <strong>{flight.destination}</strong>
                      </td>
                      <td>{formatDateTime(flight.departureTime)}</td>
                      <td>{flight.aircraftType}</td>
                      <td>{flight.availableSeats}</td>
                      <td>
                        <span className={`status-badge status-${flight.status.toLowerCase()}`}>
                          {formatStatus(flight.status)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleFlightSelect(flight.id)}
                          className="btn btn-primary btn-sm"
                        >
                          View Bookings
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}
