import { formatTime, formatDate, formatDuration, formatPrice } from '../utils/formatters';

interface Fare {
  id: string;
  fareClass: string;
  price: number;
  availableSeats: number;
}

interface FlightCardProps {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraftType: string;
  availableSeats: number;
  fares: Fare[];
  onClick: () => void;
}

export function FlightCard({
  flightNumber,
  origin,
  destination,
  departureTime,
  arrivalTime,
  aircraftType,
  availableSeats,
  fares,
  onClick,
}: FlightCardProps) {
  const promoFare = fares.find((f) => f.fareClass === 'promo');
  const basicFare = fares.find((f) => f.fareClass === 'basic');
  const proFare = fares.find((f) => f.fareClass === 'pro');

  return (
    <div className="flight-card" onClick={onClick}>
      <div className="flight-info">
        <div className="flight-route">
          <div className="flight-number">{flightNumber}</div>
          <div className="route">
            <span className="airport">{origin}</span>
            <span className="arrow">→</span>
            <span className="airport">{destination}</span>
          </div>
        </div>
        <div className="flight-times">
          <div className="time">
            <span className="label">Departure</span>
            <span className="value">{formatTime(departureTime)}</span>
            <span className="date">{formatDate(departureTime)}</span>
          </div>
          <div className="duration">{formatDuration(departureTime, arrivalTime)}</div>
          <div className="time">
            <span className="label">Arrival</span>
            <span className="value">{formatTime(arrivalTime)}</span>
            <span className="date">{formatDate(arrivalTime)}</span>
          </div>
        </div>
        <div className="flight-details">
          <div>{aircraftType}</div>
          <div>{availableSeats} seats available</div>
        </div>
      </div>
      <div className="fare-preview">
        {promoFare && (
          <div className="fare-option">
            <span className="fare-class">Promo</span>
            <span className="fare-price">{formatPrice(promoFare.price)}</span>
          </div>
        )}
        {basicFare && (
          <div className="fare-option">
            <span className="fare-class">Basic</span>
            <span className="fare-price">{formatPrice(basicFare.price)}</span>
          </div>
        )}
        {proFare && (
          <div className="fare-option">
            <span className="fare-class">Pro</span>
            <span className="fare-price">{formatPrice(proFare.price)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
