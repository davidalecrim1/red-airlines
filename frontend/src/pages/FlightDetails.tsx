import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'urql';
import { FareCard } from '../components/FareCard';
import { Loading } from '../components/Loading';
import { formatDateTime } from '../utils/formatters';
import { GetFlightDetailsDocument } from '../generated/graphql';

export function FlightDetails() {
  const { flightId } = useParams<{ flightId: string }>();

  const [result] = useQuery({
    query: GetFlightDetailsDocument,
    variables: { id: flightId || '' },
    pause: !flightId,
  });

  const { data, fetching, error } = result;

  if (fetching) return <Loading />;

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <p>Error loading flight details: {error.message}</p>
          <Link to="/" className="btn btn-secondary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (!data || !data.flight) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Flight not found.</p>
          <Link to="/" className="btn btn-secondary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const flight = data.flight;

  const sortedFares = [...(flight.fares || [])].sort((a, b) => {
    const order = { promo: 1, basic: 2, pro: 3 };
    return (
      (order[a.fareClass as keyof typeof order] || 999) -
      (order[b.fareClass as keyof typeof order] || 999)
    );
  });

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Back to Search
      </Link>

      <div className="flight-details-header">
        <h1>Flight {flight.flightNumber}</h1>
        <div className="flight-route-large">
          <span className="airport">{flight.origin}</span>
          <span className="arrow">→</span>
          <span className="airport">{flight.destination}</span>
        </div>
      </div>

      <div className="flight-info-section">
        <div className="info-row">
          <div className="info-item">
            <span className="label">Departure</span>
            <span className="value">{formatDateTime(flight.departureTime)}</span>
          </div>
          <div className="info-item">
            <span className="label">Arrival</span>
            <span className="value">{formatDateTime(flight.arrivalTime)}</span>
          </div>
        </div>
        <div className="info-row">
          <div className="info-item">
            <span className="label">Aircraft</span>
            <span className="value">{flight.aircraftType}</span>
          </div>
          <div className="info-item">
            <span className="label">Total Seats</span>
            <span className="value">{flight.totalSeats}</span>
          </div>
          <div className="info-item">
            <span className="label">Available Seats</span>
            <span className="value">{flight.availableSeats}</span>
          </div>
          <div className="info-item">
            <span className="label">Status</span>
            <span className="value">{flight.status}</span>
          </div>
        </div>
      </div>

      <h2>Select Your Fare</h2>
      <div className="fare-comparison">
        {sortedFares.map((fare) => (
          <FareCard
            key={fare.id}
            flightId={flight.id}
            fareId={fare.id}
            fareClass={fare.fareClass}
            price={fare.price}
            baggageAllowance={fare.baggageAllowance}
            isRefundable={fare.isRefundable}
            isChangeable={fare.isChangeable}
            availableSeats={fare.availableSeats}
          />
        ))}
      </div>
    </div>
  );
}
