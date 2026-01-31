import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'urql';
import { Loading } from '../components/Loading';
import { formatDateTime, formatPrice, formatStatus } from '../utils/formatters';
import { GetBookingByReferenceDocument } from '../generated/graphql';

export function BookingConfirmation() {
  const { bookingReference } = useParams<{ bookingReference: string }>();
  const navigate = useNavigate();

  const [result] = useQuery({
    query: GetBookingByReferenceDocument,
    variables: { bookingReference: bookingReference || '' },
    pause: !bookingReference,
  });

  const { data, fetching, error } = result;

  if (fetching) return <Loading />;

  if (error || !data || !data.booking) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Booking Not Found</h2>
          <p>
            {error
              ? `Error loading booking: ${error.message}`
              : 'We could not find a booking with that reference number.'}
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Search for Flights
          </button>
        </div>
      </div>
    );
  }

  const booking = data.booking;
  const { flight, fare } = booking;

  return (
    <div className="container">
      <div className="confirmation-box">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h1>Booking Confirmed!</h1>
          <p>Your flight has been successfully booked.</p>
        </div>

        <div className="booking-reference">
          <span className="label">Booking Reference</span>
          <span className="reference-number">{booking.bookingReference}</span>
        </div>

        <div className="flight-info-section">
          <h2>Passenger Information</h2>
          <div className="info-row">
            <div className="info-item">
              <span className="label">Name</span>
              <span className="value">{booking.passengerName}</span>
            </div>
            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{booking.passengerEmail}</span>
            </div>
          </div>
          {booking.passengerPhone && (
            <div className="info-row">
              <div className="info-item">
                <span className="label">Phone</span>
                <span className="value">{booking.passengerPhone}</span>
              </div>
            </div>
          )}
          {booking.seatNumber && (
            <div className="info-row">
              <div className="info-item">
                <span className="label">Seat</span>
                <span className="value">{booking.seatNumber}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flight-info-section">
          <h2>Flight Details</h2>
          <div className="info-row">
            <div className="info-item">
              <span className="label">Flight Number</span>
              <span className="value">{flight.flightNumber}</span>
            </div>
            <div className="info-item">
              <span className="label">Aircraft</span>
              <span className="value">{flight.aircraftType}</span>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <span className="label">From</span>
              <span className="value">{flight.origin}</span>
            </div>
            <div className="info-item">
              <span className="label">To</span>
              <span className="value">{flight.destination}</span>
            </div>
          </div>
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
        </div>

        <div className="flight-info-section">
          <h2>Fare Information</h2>
          <div className="info-row">
            <div className="info-item">
              <span className="label">Fare Class</span>
              <span className="value">{fare.fareClass.toUpperCase()}</span>
            </div>
            <div className="info-item">
              <span className="label">Baggage</span>
              <span className="value">{fare.baggageAllowance} kg</span>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <span className="label">Refundable</span>
              <span className="value">{fare.isRefundable ? 'Yes' : 'No'}</span>
            </div>
            <div className="info-item">
              <span className="label">Changeable</span>
              <span className="value">{fare.isChangeable ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <span className="label">Total Price</span>
              <span className="value price-highlight">{formatPrice(booking.totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="flight-info-section">
          <div className="info-row">
            <div className="info-item">
              <span className="label">Booking Status</span>
              <span className="value">{formatStatus(booking.bookingStatus)}</span>
            </div>
            <div className="info-item">
              <span className="label">Booked On</span>
              <span className="value">{formatDateTime(booking.bookedAt)}</span>
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/')} className="btn btn-primary">
          Search for Another Flight
        </button>
      </div>
    </div>
  );
}
