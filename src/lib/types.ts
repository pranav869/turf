export type SportType = 'cricket' | 'football' | 'basketball' | 'tennis' | 'badminton' | 'multi-sport';

export interface Turf {
  id: string;
  name: string;
  location: string;
  area: string;
  sport: SportType[];
  pricePerHour: number;
  image: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  description: string;
  openTime: number;
  closeTime: number;
  featured: boolean;
  availableDays: number[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'blocked' | 'past';
}

export interface Booking {
  id: string;
  userId: string;
  turfId: string;
  turfName: string;
  turfLocation: string;
  date: string;
  slots: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  paymentMethod: 'upi' | 'card' | 'cash';
  paymentStatus: 'paid' | 'pending';
  sport: SportType;
  createdAt: string;
  userName: string;
  userPhone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface BookingFormData {
  turfId: string;
  date: string;
  slots: string[];
  paymentMethod: 'upi' | 'card' | 'cash';
  upiId?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export interface FilterState {
  sport: SportType | 'all';
  maxPrice: number;
  availability: 'all' | 'available-today';
  sortBy: 'price-asc' | 'price-desc' | 'rating';
}
