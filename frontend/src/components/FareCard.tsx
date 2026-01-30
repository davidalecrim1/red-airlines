import { formatPrice } from '../utils/formatters';

interface FareCardProps {
  fareClass: string;
  price: number;
  baggageAllowance: number;
  isRefundable: boolean;
  isChangeable: boolean;
  availableSeats: number;
}

export function FareCard({
  fareClass,
  price,
  baggageAllowance,
  isRefundable,
  isChangeable,
  availableSeats,
}: FareCardProps) {
  return (
    <div className={`fare-card fare-card-${fareClass.toLowerCase()}`}>
      <div className="fare-card-header">
        <h3>{fareClass.charAt(0).toUpperCase() + fareClass.slice(1)}</h3>
      </div>
      <div className="fare-card-price">
        <span className="price">{formatPrice(price)}</span>
      </div>
      <div className="fare-features">
        <ul>
          <li>Baggage: {baggageAllowance} kg</li>
          <li>{isRefundable ? 'Refundable' : 'Non-refundable'}</li>
          <li>{isChangeable ? 'Changeable' : 'Non-changeable'}</li>
          <li>{availableSeats} seats available</li>
        </ul>
      </div>
      <button className="btn btn-primary">Select</button>
    </div>
  );
}
