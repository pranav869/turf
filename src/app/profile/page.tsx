'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useBookingStore } from '@/lib/store/bookingStore';
import { formatCurrency, formatDate, formatSlotTime, bookingStatusColor } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { getBookingsByUser, cancelBooking } = useBookingStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/auth/login');
  }, [user, router]);

  if (!user) return null;

  const bookings = getBookingsByUser(user.id).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= new Date(new Date().toDateString()));
  const past = bookings.filter(b => b.status !== 'confirmed' || new Date(b.date) < new Date(new Date().toDateString()));

  const handleCancel = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId, user!.id);
    }
  };

  const statusIcon = (status: string) => {
    if (status === 'confirmed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'cancelled') return <XCircle className="w-4 h-4 text-red-400" />;
    return <AlertCircle className="w-4 h-4 text-yellow-400" />;
  };

  const BookingCard = ({ booking }: { booking: ReturnType<typeof getBookingsByUser>[0] }) => {
    const isUpcoming = booking.status === 'confirmed' && new Date(booking.date) >= new Date(new Date().toDateString());
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {statusIcon(booking.status)}
              <h3 className="font-semibold text-gray-900 truncate">{booking.turfName}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{booking.turfLocation}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(booking.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {booking.slots.length} slot{booking.slots.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-gray-900">{formatCurrency(booking.totalAmount)}</div>
            <div className="text-xs text-gray-400 capitalize mt-0.5">{booking.paymentMethod}</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs font-mono text-gray-400">{booking.id}</span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bookingStatusColor(booking.status)}`}>
              {booking.status}
            </span>
            {isUpcoming && (
              <button
                onClick={() => handleCancel(booking.id)}
                className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-400 px-2 py-0.5 rounded-full transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email} · {user.phone}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{upcoming.length}</div>
            <div className="text-xs text-gray-500 mt-0.5">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalAmount, 0))}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Total Spent</div>
          </div>
        </div>
      </div>

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Upcoming Bookings ({upcoming.length})
          </h2>
          <div className="space-y-3">
            {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          {past.length > 0 ? `Past & Cancelled (${past.length})` : 'No past bookings'}
        </h2>
        {past.length > 0 ? (
          <div className="space-y-3">
            {past.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <div className="text-3xl mb-3">🏟️</div>
            <p className="font-medium text-gray-600">No bookings yet</p>
            <p className="text-sm mt-1 mb-4">Find a turf and make your first booking!</p>
            <Link
              href="/turfs"
              className="bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
            >
              Browse Turfs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
