import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'urql';
import { client } from './lib/urql';
import { Layout } from './components/Layout';
import { FlightSearch } from './pages/FlightSearch';
import { FlightDetails } from './pages/FlightDetails';
import { BookingForm } from './pages/BookingForm';
import { BookingConfirmation } from './pages/BookingConfirmation';
import './App.css';

function App() {
  return (
    <Provider value={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<FlightSearch />} />
            <Route path="flights/:flightId" element={<FlightDetails />} />
            <Route path="book/:flightId/:fareId" element={<BookingForm />} />
            <Route path="confirmation/:bookingReference" element={<BookingConfirmation />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
