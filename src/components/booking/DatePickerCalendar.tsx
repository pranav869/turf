'use client';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerCalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

export default function DatePickerCalendar({ selectedDate, onSelect }: DatePickerCalendarProps) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startPadding = getDay(monthStart);
  const paddingDays = Array.from({ length: startPadding });

  const isPast = (date: Date) => isBefore(startOfDay(date), today);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {format(viewMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-7 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map(day => {
            const past = isPast(day);
            const selected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isToday = isSameDay(day, today);

            return (
              <button
                key={day.toISOString()}
                onClick={() => !past && onSelect(day)}
                disabled={past}
                className={cn(
                  'h-9 w-full rounded-lg text-sm transition-all',
                  selected
                    ? 'bg-green-600 text-white font-semibold'
                    : isToday
                    ? 'border border-green-400 text-green-700 font-semibold hover:bg-green-50'
                    : past
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
