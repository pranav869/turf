import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isBefore, startOfDay, parseISO, addDays } from 'date-fns';
import type { Turf, TimeSlot, Booking } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE, d MMM yyyy');
}

export function formatSlotTime(slot: string): string {
  const [start, end] = slot.split('-');
  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export function generateSlots(turf: Turf, date: string, bookings: Booking[]): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();
  const selectedDate = parseISO(date);
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');

  const bookedSlotIds = new Set<string>();
  bookings
    .filter(b => b.turfId === turf.id && b.date === date && b.status === 'confirmed')
    .forEach(b => b.slots.forEach(s => bookedSlotIds.add(s)));

  for (let hour = turf.openTime; hour < turf.closeTime; hour++) {
    const startTime = `${String(hour).padStart(2, '0')}:00`;
    const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
    const slotId = `${startTime}-${endTime}`;

    let status: TimeSlot['status'] = 'available';

    if (isToday && hour <= now.getHours()) {
      status = 'past';
    } else if (bookedSlotIds.has(slotId)) {
      status = 'booked';
    }

    slots.push({ id: slotId, startTime, endTime, status });
  }

  return slots;
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getDateString(daysFromToday: number): string {
  return format(addDays(new Date(), daysFromToday), 'yyyy-MM-dd');
}

export function isDateBookable(dateStr: string): boolean {
  const date = parseISO(dateStr);
  const today = startOfDay(new Date());
  return !isBefore(date, today);
}

export function getBookingStatusColor(status: Booking['status']): string {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-700';
    case 'cancelled': return 'bg-red-100 text-red-600';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

export const bookingStatusColor = getBookingStatusColor;

export function sportLabel(sport: string): string {
  const labels: Record<string, string> = {
    cricket: 'Cricket',
    football: 'Football',
    basketball: 'Basketball',
    tennis: 'Tennis',
    badminton: 'Badminton',
    'multi-sport': 'Multi-sport',
  };
  return labels[sport] || sport;
}
