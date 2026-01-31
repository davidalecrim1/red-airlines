import { useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'urql';
import { Loading } from '../components/Loading';
import { formatDateTime, formatPrice } from '../utils/formatters';
import { GetFlightDetailsDocument, CreateBookingDocument } from '../generated/graphql';

export function BookingForm() {
  const { flightId, fareId } = useParams<{ flightId: string; fareId: string }>();
  const navigate = useNavigate();

  const [result] = useQuery({
    query: GetFlightDetailsDocument,
    variables: { id: flightId || '' },
    pause: !flightId,
  });

  const [, createBooking] = useMutation(CreateBookingDocument);

  const [formData, setFormData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    seatNumber: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const selectedFare = flight.fares?.find((f) => f.id === fareId);

  if (!selectedFare) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Fare not found.</p>
          <Link to={`/flights/${flightId}`} className="btn btn-secondary">
            Back to Flight Details
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.passengerName || formData.passengerName.trim().length < 2) {
      errors.passengerName = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.passengerEmail || !emailRegex.test(formData.passengerEmail)) {
      errors.passengerEmail = 'Please enter a valid email address';
    }

    if (formData.passengerPhone && formData.passengerPhone.trim().length > 0) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.passengerPhone)) {
        errors.passengerPhone = 'Please enter a valid phone number';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        input: {
          flightId: flightId!,
          fareId: fareId!,
          passengerName: formData.passengerName.trim(),
          passengerEmail: formData.passengerEmail.trim(),
          passengerPhone: formData.passengerPhone.trim() || undefined,
          seatNumber: formData.seatNumber.trim() || undefined,
        },
      });

      if (result.error) {
        setSubmitError(result.error.message);
        setIsSubmitting(false);
        return;
      }

      if (result.data?.createBooking) {
        navigate(`/confirmation/${result.data.createBooking.bookingReference}`);
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <Link to={`/flights/${flightId}`} className="back-link">
        ← Back to Flight Details
      </Link>

      <h1>Complete Your Booking</h1>

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="flight-info-section">
          <div className="info-row">
            <div className="info-item">
              <span className="label">Flight</span>
              <span className="value">{flight.flightNumber}</span>
            </div>
            <div className="info-item">
              <span className="label">Route</span>
              <span className="value">
                {flight.origin} → {flight.destination}
              </span>
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
          <div className="info-row">
            <div className="info-item">
              <span className="label">Fare Class</span>
              <span className="value">{selectedFare.fareClass.toUpperCase()}</span>
            </div>
            <div className="info-item">
              <span className="label">Price</span>
              <span className="value">{formatPrice(selectedFare.price)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-form-container">
        <h2>Passenger Information</h2>

        {submitError && <div className="error-message">{submitError}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="passengerName">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="passengerName"
              value={formData.passengerName}
              onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
              required
              disabled={isSubmitting}
            />
            {formErrors.passengerName && (
              <span className="error-message">{formErrors.passengerName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="passengerEmail">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="passengerEmail"
              value={formData.passengerEmail}
              onChange={(e) => setFormData({ ...formData, passengerEmail: e.target.value })}
              required
              disabled={isSubmitting}
            />
            {formErrors.passengerEmail && (
              <span className="error-message">{formErrors.passengerEmail}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="passengerPhone">Phone (Optional)</label>
            <input
              type="tel"
              id="passengerPhone"
              value={formData.passengerPhone}
              onChange={(e) => setFormData({ ...formData, passengerPhone: e.target.value })}
              disabled={isSubmitting}
            />
            {formErrors.passengerPhone && (
              <span className="error-message">{formErrors.passengerPhone}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="seatNumber">Seat Preference (Optional)</label>
            <input
              type="text"
              id="seatNumber"
              placeholder="e.g., 12A"
              value={formData.seatNumber}
              onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
