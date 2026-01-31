-- Update flight status from 'scheduled' to 'SCHEDULED'
UPDATE flights
SET status = UPPER(status)
WHERE status IS NOT NULL;

-- Update default value for future inserts
ALTER TABLE flights
ALTER COLUMN status SET DEFAULT 'SCHEDULED';

-- Update booking status from lowercase to uppercase
UPDATE bookings
SET booking_status = UPPER(booking_status)
WHERE booking_status IS NOT NULL;

-- Update default value for future inserts
ALTER TABLE bookings
ALTER COLUMN booking_status SET DEFAULT 'CONFIRMED';
