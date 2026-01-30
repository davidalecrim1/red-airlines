import { useState, type FormEvent } from 'react';
import { useQuery } from 'urql';
import { GetAirportsDocument } from '../generated/graphql';

interface SearchFormProps {
  onSearch: (origin: string, destination: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [{ data: airportsData }] = useQuery({
    query: GetAirportsDocument,
  });

  const airports = airportsData?.airports || [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(origin, destination);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-group">
        <label htmlFor="origin">Origin</label>
        <select id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} required>
          <option value="">Select origin</option>
          {airports.map((airport) => (
            <option key={airport} value={airport}>
              {airport}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <select
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        >
          <option value="">Select destination</option>
          {airports.map((airport) => (
            <option key={airport} value={airport}>
              {airport}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Search Flights
      </button>
    </form>
  );
}
