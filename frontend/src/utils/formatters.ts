import { format, parseISO, differenceInMinutes } from 'date-fns';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDateTime(date: string): string {
  return format(parseISO(date), 'MMM d, yyyy h:mm a');
}

export function formatTime(date: string): string {
  return format(parseISO(date), 'h:mm a');
}

export function formatDuration(departure: string, arrival: string): string {
  const minutes = differenceInMinutes(parseISO(arrival), parseISO(departure));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}
