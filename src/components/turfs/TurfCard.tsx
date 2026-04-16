'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Clock, Users } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { Turf } from '@/lib/types';
import { formatCurrency, sportLabel } from '@/lib/utils';

const sportBadgeColor: Record<string, 'green' | 'blue' | 'purple' | 'yellow' | 'red' | 'gray'> = {
  cricket: 'green',
  football: 'blue',
  basketball: 'yellow',
  tennis: 'purple',
  badminton: 'gray',
  'multi-sport': 'green',
};

interface TurfCardProps {
  turf: Turf;
  compact?: boolean;
  priority?: boolean;
}

export default function TurfCard({ turf, compact = false, priority = false }: TurfCardProps) {
  return (
    <article
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group tap-highlight-none"
      aria-label={`${turf.name} – ${formatCurrency(turf.pricePerHour)} per hour`}
    >
      <div className={`relative overflow-hidden ${compact ? 'h-40' : 'h-48'}`}>
        <Image
          src={turf.image}
          alt={`${turf.name} sports turf in ${turf.location}, Chennai`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
        {turf.featured && (
          <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
            Popular
          </div>
        )}
        <div
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1"
          aria-label={`Rating: ${turf.rating} out of 5`}
        >
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" aria-hidden="true" />
          <span className="text-xs font-semibold text-gray-800">{turf.rating}</span>
          <span className="text-xs text-gray-500">({turf.reviewCount})</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2" role="list" aria-label="Sports available">
          {turf.sport.map(s => (
            <Badge key={s} variant={sportBadgeColor[s] || 'gray'}>
              {sportLabel(s)}
            </Badge>
          ))}
        </div>

        <h3 className="font-semibold text-gray-900 leading-snug mb-1 line-clamp-1">{turf.name}</h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{turf.location}</span>
        </div>

        {!compact && (
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {turf.openTime}:00 AM – {turf.closeTime > 12 ? `${turf.closeTime - 12}:00 PM` : `${turf.closeTime}:00 AM`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{turf.amenities.length} amenities</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(turf.pricePerHour)}</span>
            <span className="text-xs text-gray-500"> /hour</span>
          </div>
          <Link
            href={`/turfs/${turf.id}`}
            className="bg-green-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 min-h-[44px] inline-flex items-center"
            aria-label={`Book ${turf.name}`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
