# Frontend Pages Design

## Overview

The Red Airlines frontend consists of 5 main pages following a linear user journey from flight search to booking confirmation.

## Pages

### 1. Flight Search / Home Page

**Route:** `/`

**Purpose:** Allow users to search for available flights and view results.

**Components:**
- Search form with inputs:
  - Origin airport (dropdown or autocomplete)
  - Destination airport (dropdown or autocomplete)
  - Departure date (date picker)
- Flight results list with cards showing:
  - Flight number
  - Route (origin → destination)
  - Departure and arrival times
  - Aircraft type
  - Available seats
  - Quick fare preview (Promo/Basic/Pro with prices)
- Click on flight card navigates to Flight Details page

**GraphQL Query:**
```graphql
query SearchFlights($origin: String!, $destination: String!) {
  flights(origin: $origin, destination: $destination) {
    id
    flightNumber
    origin
    destination
    departureTime
    arrivalTime
    aircraftType
    availableSeats
    status
    fares {
      id
      fareClass
      price
      availableSeats
    }
  }
}
```

### 2. Flight Details Page

**Route:** `/flights/:flightId`

**Purpose:** Display comprehensive flight information and detailed fare comparison.

**Components:**
- Flight information header:
  - Flight number, route, times
  - Aircraft type, total/available seats
  - Flight status
- Fare comparison table (side-by-side):
  - Promo, Basic, Pro columns
  - Price
  - Baggage allowance
  - Refundable status
  - Changeable status
  - Available seats per class
  - "Select" button for each fare class
- Clicking "Select" navigates to Booking Form with selected fare

**GraphQL Query:**
```graphql
query FlightDetails($id: ID!) {
  flight(id: $id) {
    id
    flightNumber
    origin
    destination
    departureTime
    arrivalTime
    aircraftType
    totalSeats
    availableSeats
    status
    fares {
      id
      fareClass
      price
      baggageAllowance
      isRefundable
      isChangeable
      availableSeats
    }
  }
}
```

### 3. Booking Form Page

**Route:** `/book/:flightId/:fareId`

**Purpose:** Collect passenger information and confirm booking details.

**Components:**
- Booking summary (sticky header or sidebar):
  - Flight information
  - Selected fare class and price
- Passenger information form:
  - Full name (text input)
  - Email (email input)
  - Phone (tel input)
  - Seat number (text input or seat map selection)
- Price breakdown
- "Confirm Booking" button
- Form validation

**GraphQL Mutation:**
```graphql
mutation CreateBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    id
    bookingReference
    passengerName
    passengerEmail
    passengerPhone
    seatNumber
    totalPrice
    bookingStatus
    flight {
      flightNumber
      origin
      destination
      departureTime
    }
    fare {
      fareClass
      price
    }
  }
}
```

### 4. Booking Confirmation Page

**Route:** `/confirmation/:bookingReference`

**Purpose:** Display booking confirmation and details.

**Components:**
- Success message
- Booking reference (prominently displayed)
- Complete booking details:
  - Flight information (number, route, times)
  - Passenger details (name, email, phone)
  - Fare class and features
  - Seat assignment
  - Total price paid
  - Booking status
- Next steps/instructions
- "Search for another flight" button

**GraphQL Query:**
```graphql
query BookingDetails($bookingReference: String!) {
  booking(bookingReference: $bookingReference) {
    id
    bookingReference
    passengerName
    passengerEmail
    passengerPhone
    seatNumber
    totalPrice
    bookingStatus
    bookedAt
    flight {
      flightNumber
      origin
      destination
      departureTime
      arrivalTime
      aircraftType
    }
    fare {
      fareClass
      price
      baggageAllowance
      isRefundable
      isChangeable
    }
  }
}
```

### 5. Booking Lookup Page (Optional)

**Route:** `/lookup`

**Purpose:** Allow users to search for existing bookings.

**Components:**
- Search form with options:
  - Search by booking reference
  - Search by email
- Booking details display (same as confirmation page)
- Error handling for not found bookings

**GraphQL Query:**
```graphql
query LookupBooking($bookingReference: String, $email: String) {
  booking(bookingReference: $bookingReference, email: $email) {
    id
    bookingReference
    passengerName
    passengerEmail
    seatNumber
    totalPrice
    bookingStatus
    flight {
      flightNumber
      origin
      destination
      departureTime
    }
    fare {
      fareClass
      price
    }
  }
}
```

## User Journey Flow

```
Search Page → Flight Details → Booking Form → Confirmation
     ↓              ↑              ↑
  (results)    (select fare)  (fill form)
                                   ↓
                            (mutation success)
```

## Design Principles

1. **Progressive Disclosure:** Show essential information first, details on demand
2. **Clear CTAs:** Prominent action buttons guide users through the flow
3. **Responsive Design:** Mobile-first approach with tablet/desktop enhancements
4. **Loading States:** Show skeleton loaders while data is fetching
5. **Error Handling:** Clear error messages with recovery actions
6. **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation

## Color Scheme (Avianca-inspired)

- Primary Red: `#D71920` (Avianca red)
- Dark Red: `#A01419` (hover states, emphasis)
- Light Red: `#F8E5E6` (backgrounds, highlights)
- Neutral Gray: `#F5F5F5` (page background)
- Text Dark: `#333333` (primary text)
- Text Light: `#666666` (secondary text)
- White: `#FFFFFF` (cards, surfaces)
