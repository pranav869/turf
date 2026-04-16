'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, TrendingUp, Users, MapPin, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useBookingStore } from '@/lib/store/bookingStore';
import { formatCurrency, formatDate, bookingStatusColor } from '@/lib/utils';
import { TURFS } from '@/lib/data/turfs';

export default function AdminPage() {
  const { user } = useAuthStore();
  const { bookings, cancelBooking } = useBookingStore();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [activeTab, setActiveTab] = useState<'bookings' | 'turfs'>('bookings');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (!user.isAdmin) { router.push('/'); return; }
  }, [user, router]);

  if (!user?.isAdmin) return null;

  const allBookings = [...bookings].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filtered = allBookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.turfName.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const confirmed = allBookings.filter(b => b.status === 'confirmed');
  const totalRevenue = confirmed.reduce((s, b) => s + b.totalAmount, 0);
  const uniqueUsers = new Set(allBookings.map(b => b.userId)).size;

  const peakHours: Record<number, number> = {};
  confirmed.forEach(b => {
    b.slots.forEach(slotId => {
      const hour = parseInt(slotId.split('-')[2]);
      peakHours[hour] = (peakHours[hour] || 0) + 1;
    });
  });
  const topHours = Object.entries(peakHours)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([h, count]) => ({
      label: `${parseInt(h) > 12 ? parseInt(h) - 12 : h}:00 ${parseInt(h) >= 12 ? 'PM' : 'AM'}`,
      count,
    }));

  const turfBookingCount = (turfId: string) =>
    confirmed.filter(b => b.turfId === turfId).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Manage bookings and monitor turf performance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Bookings', value: allBookings.length, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
          { label: 'Confirmed', value: confirmed.length, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
          { label: 'Unique Users', value: uniqueUsers, icon: Users, color: 'bg-yellow-50 text-yellow-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            Peak Booking Hours
          </h2>
          {topHours.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet</p>
          ) : (
            <div className="space-y-3">
              {topHours.map(({ label, count }) => {
                const max = topHours[0].count;
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-gray-900">{count} bookings</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            Turf Performance
          </h2>
          <div className="space-y-3">
            {TURFS.map(turf => {
              const count = turfBookingCount(turf.id);
              const revenue = confirmed.filter(b => b.turfId === turf.id).reduce((s, b) => s + b.totalAmount, 0);
              return (
                <div key={turf.id} className="flex items-center gap-4">
                  <img src={turf.image} alt={turf.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{turf.name}</p>
                    <p className="text-xs text-gray-500 truncate">{turf.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-gray-900">{count} bookings</div>
                    <div className="text-xs text-green-600">{formatCurrency(revenue)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="font-semibold text-gray-900">All Bookings</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full sm:w-48 pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No bookings found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Booking</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Turf</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date & Slots</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{booking.id}</td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">{booking.userName}</div>
                      <div className="text-xs text-gray-400">{booking.userPhone}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900 whitespace-nowrap">{booking.turfName}</div>
                      <div className="text-xs text-gray-400">{booking.turfLocation}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-gray-900">{formatDate(booking.date)}</div>
                      <div className="text-xs text-gray-400">{booking.slots.length} slot{booking.slots.length > 1 ? 's' : ''}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(booking.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bookingStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => cancelBooking(booking.id, 'admin-1')}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
