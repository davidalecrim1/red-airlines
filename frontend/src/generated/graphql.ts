import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Time: { input: any; output: any; }
};

export type Booking = {
  __typename?: 'Booking';
  bookedAt: Scalars['Time']['output'];
  bookingReference: Scalars['String']['output'];
  bookingStatus: Scalars['String']['output'];
  fare: Fare;
  fareId: Scalars['ID']['output'];
  flight: Flight;
  flightId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  passengerEmail: Scalars['String']['output'];
  passengerName: Scalars['String']['output'];
  passengerPhone?: Maybe<Scalars['String']['output']>;
  seatNumber?: Maybe<Scalars['String']['output']>;
  totalPrice: Scalars['Float']['output'];
};

export type CreateBookingInput = {
  fareId: Scalars['ID']['input'];
  flightId: Scalars['ID']['input'];
  passengerEmail: Scalars['String']['input'];
  passengerName: Scalars['String']['input'];
  passengerPhone?: InputMaybe<Scalars['String']['input']>;
  seatNumber?: InputMaybe<Scalars['String']['input']>;
};

export type Fare = {
  __typename?: 'Fare';
  availableSeats: Scalars['Int']['output'];
  baggageAllowance: Scalars['Int']['output'];
  bookings: Array<Booking>;
  fareClass: Scalars['String']['output'];
  flight: Flight;
  flightId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isChangeable: Scalars['Boolean']['output'];
  isRefundable: Scalars['Boolean']['output'];
  price: Scalars['Float']['output'];
};

export type Flight = {
  __typename?: 'Flight';
  aircraftType: Scalars['String']['output'];
  arrivalTime: Scalars['Time']['output'];
  availableSeats: Scalars['Int']['output'];
  bookings: Array<Booking>;
  departureTime: Scalars['Time']['output'];
  destination: Scalars['String']['output'];
  fares: Array<Fare>;
  flightNumber: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  origin: Scalars['String']['output'];
  status: Scalars['String']['output'];
  totalSeats: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBooking: Booking;
};


export type MutationCreateBookingArgs = {
  input: CreateBookingInput;
};

export type Query = {
  __typename?: 'Query';
  airports: Array<Scalars['String']['output']>;
  booking?: Maybe<Booking>;
  bookings: Array<Booking>;
  flight?: Maybe<Flight>;
  flights: Array<Flight>;
};


export type QueryBookingArgs = {
  bookingReference: Scalars['String']['input'];
};


export type QueryBookingsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  passengerEmail?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFlightArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFlightsArgs = {
  destination?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  origin?: InputMaybe<Scalars['String']['input']>;
};

export type SearchFlightsQueryVariables = Exact<{
  origin?: InputMaybe<Scalars['String']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchFlightsQuery = { __typename?: 'Query', flights: Array<{ __typename?: 'Flight', id: string, flightNumber: string, origin: string, destination: string, departureTime: any, arrivalTime: any, aircraftType: string, availableSeats: number, status: string, fares: Array<{ __typename?: 'Fare', id: string, fareClass: string, price: number, availableSeats: number }> }> };

export type GetFlightDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFlightDetailsQuery = { __typename?: 'Query', flight?: { __typename?: 'Flight', id: string, flightNumber: string, origin: string, destination: string, departureTime: any, arrivalTime: any, aircraftType: string, totalSeats: number, availableSeats: number, status: string, fares: Array<{ __typename?: 'Fare', id: string, fareClass: string, price: number, baggageAllowance: number, isRefundable: boolean, isChangeable: boolean, availableSeats: number }> } | null };

export type GetAirportsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAirportsQuery = { __typename?: 'Query', airports: Array<string> };

export type GetFlightWithBookingsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFlightWithBookingsQuery = { __typename?: 'Query', flight?: { __typename?: 'Flight', id: string, flightNumber: string, origin: string, destination: string, departureTime: any, arrivalTime: any, aircraftType: string, totalSeats: number, availableSeats: number, status: string, bookings: Array<{ __typename?: 'Booking', id: string, bookingReference: string, passengerName: string, passengerEmail: string, passengerPhone?: string | null, seatNumber?: string | null, totalPrice: number, bookingStatus: string, bookedAt: any, fare: { __typename?: 'Fare', fareClass: string, price: number } }> } | null };

export type GetBookingByReferenceQueryVariables = Exact<{
  bookingReference: Scalars['String']['input'];
}>;


export type GetBookingByReferenceQuery = { __typename?: 'Query', booking?: { __typename?: 'Booking', id: string, bookingReference: string, passengerName: string, passengerEmail: string, passengerPhone?: string | null, seatNumber?: string | null, totalPrice: number, bookingStatus: string, bookedAt: any, flight: { __typename?: 'Flight', flightNumber: string, origin: string, destination: string, departureTime: any, arrivalTime: any, aircraftType: string, status: string }, fare: { __typename?: 'Fare', fareClass: string, price: number, baggageAllowance: number, isRefundable: boolean, isChangeable: boolean } } | null };

export type CreateBookingMutationVariables = Exact<{
  input: CreateBookingInput;
}>;


export type CreateBookingMutation = { __typename?: 'Mutation', createBooking: { __typename?: 'Booking', id: string, bookingReference: string, passengerName: string, passengerEmail: string, passengerPhone?: string | null, seatNumber?: string | null, totalPrice: number, bookingStatus: string, bookedAt: any, flight: { __typename?: 'Flight', id: string, flightNumber: string, origin: string, destination: string, departureTime: any, arrivalTime: any, aircraftType: string }, fare: { __typename?: 'Fare', id: string, fareClass: string, price: number, baggageAllowance: number, isRefundable: boolean, isChangeable: boolean } } };


export const SearchFlightsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchFlights"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"origin"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"destination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"origin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"origin"}}},{"kind":"Argument","name":{"kind":"Name","value":"destination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"destination"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"flightNumber"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"departureTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"aircraftType"}},{"kind":"Field","name":{"kind":"Name","value":"availableSeats"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fares"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fareClass"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"availableSeats"}}]}}]}}]}}]} as unknown as DocumentNode<SearchFlightsQuery, SearchFlightsQueryVariables>;
export const GetFlightDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFlightDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"flightNumber"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"departureTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"aircraftType"}},{"kind":"Field","name":{"kind":"Name","value":"totalSeats"}},{"kind":"Field","name":{"kind":"Name","value":"availableSeats"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fares"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fareClass"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"baggageAllowance"}},{"kind":"Field","name":{"kind":"Name","value":"isRefundable"}},{"kind":"Field","name":{"kind":"Name","value":"isChangeable"}},{"kind":"Field","name":{"kind":"Name","value":"availableSeats"}}]}}]}}]}}]} as unknown as DocumentNode<GetFlightDetailsQuery, GetFlightDetailsQueryVariables>;
export const GetAirportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAirports"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"airports"}}]}}]} as unknown as DocumentNode<GetAirportsQuery, GetAirportsQueryVariables>;
export const GetFlightWithBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFlightWithBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"flightNumber"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"departureTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"aircraftType"}},{"kind":"Field","name":{"kind":"Name","value":"totalSeats"}},{"kind":"Field","name":{"kind":"Name","value":"availableSeats"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bookingReference"}},{"kind":"Field","name":{"kind":"Name","value":"passengerName"}},{"kind":"Field","name":{"kind":"Name","value":"passengerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"passengerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"seatNumber"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"bookingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"bookedAt"}},{"kind":"Field","name":{"kind":"Name","value":"fare"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fareClass"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetFlightWithBookingsQuery, GetFlightWithBookingsQueryVariables>;
export const GetBookingByReferenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBookingByReference"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bookingReference"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"booking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bookingReference"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bookingReference"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bookingReference"}},{"kind":"Field","name":{"kind":"Name","value":"passengerName"}},{"kind":"Field","name":{"kind":"Name","value":"passengerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"passengerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"seatNumber"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"bookingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"bookedAt"}},{"kind":"Field","name":{"kind":"Name","value":"flight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flightNumber"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"departureTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"aircraftType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fare"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fareClass"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"baggageAllowance"}},{"kind":"Field","name":{"kind":"Name","value":"isRefundable"}},{"kind":"Field","name":{"kind":"Name","value":"isChangeable"}}]}}]}}]}}]} as unknown as DocumentNode<GetBookingByReferenceQuery, GetBookingByReferenceQueryVariables>;
export const CreateBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bookingReference"}},{"kind":"Field","name":{"kind":"Name","value":"passengerName"}},{"kind":"Field","name":{"kind":"Name","value":"passengerEmail"}},{"kind":"Field","name":{"kind":"Name","value":"passengerPhone"}},{"kind":"Field","name":{"kind":"Name","value":"seatNumber"}},{"kind":"Field","name":{"kind":"Name","value":"totalPrice"}},{"kind":"Field","name":{"kind":"Name","value":"bookingStatus"}},{"kind":"Field","name":{"kind":"Name","value":"bookedAt"}},{"kind":"Field","name":{"kind":"Name","value":"flight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"flightNumber"}},{"kind":"Field","name":{"kind":"Name","value":"origin"}},{"kind":"Field","name":{"kind":"Name","value":"destination"}},{"kind":"Field","name":{"kind":"Name","value":"departureTime"}},{"kind":"Field","name":{"kind":"Name","value":"arrivalTime"}},{"kind":"Field","name":{"kind":"Name","value":"aircraftType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fare"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fareClass"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"baggageAllowance"}},{"kind":"Field","name":{"kind":"Name","value":"isRefundable"}},{"kind":"Field","name":{"kind":"Name","value":"isChangeable"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBookingMutation, CreateBookingMutationVariables>;