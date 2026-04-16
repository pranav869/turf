'use client';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, notFound } from 'next/navigation';
import { MapPin, Star, Clock, Users, Check, Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import DatePickerCalendar from '@/components/booking/DatePickerCalendar';
import SlotGrid from '@/components/booking/SlotGrid';
import Badge from '@/components/ui/Badge';
import { getTurfById } from '@/lib/data/turfs';
import { useBookingStore } from '@/lib/store/bookingStore';
import { generateSlots, formatCurrency, sportLabel, getTodayString } from '@/lib/utils';
import type { TimeSlot } from '@/lib/types';

const BookingModal = lazy(() => import('@/components/booking/BookingModal'));

export default function TurfDetailPage() {
  const params = useParams();
  const turf = getTurfById(params.id as string);

  const { bookings } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (!turf) return;
    setSlots(generateSlots(turf, dateStr, bookings));
    setSelectedSlots([]);
  }, [turf, dateStr, bookings]);

  if (!turf) {
    notFound();
  }

  const toggleSlot = (slotId: string) => {
    setSelectedSlots(prev =>
      prev.includes(slotId) ? prev.filter(s => s !== slotId) : [...prev, slotId]
    );
  };

  const totalAmount = selectedSlots.length * turf.pricePerHour;

  const sportColors: Record<string, 'green' | 'blue' | 'purple' | 'yellow' | 'gray'> = {
    cricket: 'green', football: 'blue', basketball: 'yellow', tennis: 'purple', badminton: 'gray', 'multi-sport': 'green',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <Link href="/turfs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ChevronLeft className="w-4 h-4" /> Back to turfs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="relative w-full h-56 sm:h-72">
              <Image
                src={turf.image}
                alt={`${turf.name} turf in ${turf.location}, Chennai`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {turf.sport.map(s => (
                  <Badge key={s} variant={sportColors[s] || 'gray'}>
                    {sportLabel(s)}
                  </Badge>
                ))}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">{turf.name}</h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {turf.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-700">{turf.rating}</span>
                  <span>({turf.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Open {turf.openTime}:00 AM – {turf.closeTime > 12 ? `${turf.closeTime - 12}:00 PM` : `${turf.closeTime}:00 AM`}
                </div>
                <div className="text-base font-bold text-green-700">
                  {formatCurrency(turf.pricePerHour)}<span className="text-sm font-normal text-gray-400">/hr</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-5">{turf.description}</p>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {turf.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              Book This Turf
            </h2>

            <DatePickerCalendar
              selectedDate={selectedDate}
              onSelect={date => setSelectedDate(date)}
            />

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  {format(selectedDate, 'EEE, d MMM')} — Select Time Slots
                </p>
                {selectedSlots.length > 0 && (
                  <button
                    onClick={() => setSelectedSlots([])}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
              <SlotGrid
                slots={slots}
                selectedSlots={selectedSlots}
                onToggle={toggleSlot}
              />
            </div>

            {selectedSlots.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} × {formatCurrency(turf.pricePerHour)}
                  </span>
                  <span className="text-lg font-bold text-green-700">{formatCurrency(totalAmount)}</span>
                </div>
                <button
                  onClick={() => setBookingOpen(true)}
                  className="w-full mt-2 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors text-sm"
                >
                  Book {selectedSlots.length} Slot{selectedSlots.length > 1 ? 's' : ''} — {formatCurrency(totalAmount)}
                </button>
              </div>
            )}

            {selectedSlots.length === 0 && (
              <p className="text-center text-xs text-gray-400 mt-4">
                Select one or more available slots above
              </p>
            )}
          </div>
        </div>
      </div>

      {bookingOpen && (
        <Suspense fallback={null}>
          <BookingModal
            isOpen={bookingOpen}
            onClose={() => {
              setBookingOpen(false);
              setSelectedSlots([]);
            }}
            turf={turf}
            date={dateStr}
            selectedSlots={selectedSlots}
            totalAmount={totalAmount}
          />
        </Suspense>
      )}
    </div>
  );
}
