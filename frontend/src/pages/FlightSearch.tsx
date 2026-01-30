import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'urql';
import { SearchForm } from '../components/SearchForm';
import { FlightCard } from '../components/FlightCard';
import { Loading } from '../components/Loading';
import { SearchFlightsDocument } from '../generated/graphql';

export function FlightSearch() {
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  const [destination, setDestination] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const [result] = useQuery({
    query: SearchFlightsDocument,
    variables: { origin, destination, limit: 50 },
    pause: !origin && !destination,
  });

  const { data, fetching, error } = result;

  const handleSearch = (searchOrigin: string, searchDestination: string) => {
    setOrigin(searchOrigin || undefined);
    setDestination(searchDestination || undefined);
  };

  return (
    <div className="container">
      <h1>Search Flights</h1>
      <SearchForm onSearch={handleSearch} />

      {!data && !fetching && !error && (
        <div className="welcome-section">
          <div className="airplane-icon">✈</div>
          <h2>Find Your Perfect Flight</h2>
          <p>Select your origin and destination to search for available flights</p>
        </div>
      )}

      {fetching && <Loading />}

      {error && (
        <div className="error-message">
          <p>Error loading flights: {error.message}</p>
        </div>
      )}

      {data && data.flights && data.flights.length === 0 && (
        <div className="empty-state">
          <p>No flights found matching your search criteria.</p>
        </div>
      )}

      {data && data.flights && data.flights.length > 0 && (
        <div className="flights-list">
          {data.flights.map((flight) => (
            <FlightCard
              key={flight.id}
              id={flight.id}
              flightNumber={flight.flightNumber}
              origin={flight.origin}
              destination={flight.destination}
              departureTime={flight.departureTime}
              arrivalTime={flight.arrivalTime}
              aircraftType={flight.aircraftType}
              availableSeats={flight.availableSeats}
              fares={flight.fares || []}
              onClick={() => navigate(`/flights/${flight.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
