import { useState, type FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (origin: string, destination: string) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(origin.toUpperCase(), destination.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-group">
        <label htmlFor="origin">Origin</label>
        <input
          id="origin"
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          placeholder="e.g., JFK"
          style={{ textTransform: 'uppercase' }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          placeholder="e.g., LAX"
          style={{ textTransform: 'uppercase' }}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Search Flights
      </button>
    </form>
  );
}
