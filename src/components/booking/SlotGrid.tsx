'use client';
import { cn, formatSlotTime } from '@/lib/utils';
import type { TimeSlot } from '@/lib/types';

interface SlotGridProps {
  slots: TimeSlot[];
  selectedSlots: string[];
  onToggle: (slotId: string) => void;
}

export default function SlotGrid({ slots, selectedSlots, onToggle }: SlotGridProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No slots available for this day
      </div>
    );
  }

  const available = slots.filter(s => s.status === 'available').length;
  const booked = slots.filter(s => s.status === 'booked').length;

  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-white border-2 border-green-500" />
          <span>Available ({available})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-600" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200" />
          <span>Booked ({booked})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
          <span>Past</span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map(slot => {
          const isSelected = selectedSlots.includes(slot.id);
          const isAvailable = slot.status === 'available';
          const isBooked = slot.status === 'booked';
          const isPast = slot.status === 'past';
          const isBlocked = slot.status === 'blocked';

          return (
            <button
              key={slot.id}
              onClick={() => isAvailable && onToggle(slot.id)}
              disabled={!isAvailable}
              className={cn(
                'px-2 py-2.5 rounded-lg text-xs font-medium border text-center transition-all',
                isSelected
                  ? 'bg-green-600 border-green-600 text-white shadow-sm'
                  : isAvailable
                  ? 'bg-white border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 cursor-pointer'
                  : isBooked
                  ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed'
                  : isPast || isBlocked
                  ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                  : ''
              )}
            >
              {formatSlotTime(slot.id).split('–')[0].trim()}
              <span className="block text-[10px] mt-0.5 opacity-70">
                {isBooked ? 'Booked' : isPast ? 'Past' : isSelected ? 'Selected' : 'Available'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
