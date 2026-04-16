'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking } from '../types';
import { SEED_BOOKINGS } from '../data/seedBookings';

interface BookingState {
  bookings: Booking[];
  addBooking: (
    data: Omit<Booking, 'id' | 'createdAt'>
  ) => { success: boolean; error?: string; bookingId?: string };
  cancelBooking: (bookingId: string, requesterId: string) => { success: boolean; error?: string };
  getBookingsByUser: (userId: string) => Booking[];
  getBookedSlots: (turfId: string, date: string) => string[];
  isSlotAvailable: (turfId: string, date: string, slot: string) => boolean;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: SEED_BOOKINGS,

      addBooking: data => {
        const { bookings } = get();

        const conflict = bookings.some(
          b =>
            b.turfId === data.turfId &&
            b.date === data.date &&
            b.status === 'confirmed' &&
            b.slots.some(s => data.slots.includes(s))
        );

        if (conflict) {
          return {
            success: false,
            error: 'One or more selected slots were just booked by someone else. Please re-select.',
          };
        }

        const bookingId = `BK${Date.now()}`;
        const newBooking: Booking = {
          ...data,
          id: bookingId,
          createdAt: new Date().toISOString(),
        };

        set({ bookings: [...bookings, newBooking] });
        return { success: true, bookingId };
      },

      cancelBooking: (bookingId, requesterId) => {
        const { bookings } = get();
        const booking = bookings.find(b => b.id === bookingId);

        if (!booking) return { success: false, error: 'Booking not found' };

        const isOwner = booking.userId === requesterId;
        const isAdmin = requesterId === 'admin-1';

        if (!isOwner && !isAdmin) {
          return { success: false, error: 'You are not authorised to cancel this booking' };
        }

        set({
          bookings: bookings.map(b =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          ),
        });
        return { success: true };
      },

      getBookingsByUser: userId => get().bookings.filter(b => b.userId === userId),

      getBookedSlots: (turfId, date) => {
        const booked: string[] = [];
        get()
          .bookings.filter(
            b => b.turfId === turfId && b.date === date && b.status === 'confirmed'
          )
          .forEach(b => booked.push(...b.slots));
        return booked;
      },

      isSlotAvailable: (turfId, date, slot) => {
        return !get().bookings.some(
          b =>
            b.turfId === turfId &&
            b.date === date &&
            b.status === 'confirmed' &&
            b.slots.includes(slot)
        );
      },
    }),
    { name: 'turf-booking-store' }
  )
);
