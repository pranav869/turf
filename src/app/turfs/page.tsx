'use client';
import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import TurfCard from '@/components/turfs/TurfCard';
import { TURFS } from '@/lib/data/turfs';
import type { SportType } from '@/lib/types';

const SPORTS: { value: SportType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sports' },
  { value: 'cricket', label: 'Cricket' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'badminton', label: 'Badminton' },
  { value: 'multi-sport', label: 'Multi-sport' },
];

function TurfsContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const sportParam = searchParams.get('sport') || 'all';

  const [sport, setSport] = useState<SportType | 'all'>(sportParam as SportType | 'all');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');
  const [search, setSearch] = useState(qParam);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let turfs = TURFS.filter(t => {
      if (sport !== 'all' && !t.sport.includes(sport)) return false;
      if (t.pricePerHour > maxPrice) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !t.location.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    turfs = [...turfs].sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerHour - b.pricePerHour;
      if (sortBy === 'price-desc') return b.pricePerHour - a.pricePerHour;
      return b.rating - a.rating;
    });

    return turfs;
  }, [sport, maxPrice, sortBy, search]);

  const activeFilters = (sport !== 'all' ? 1 : 0) + (maxPrice < 2000 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Turfs</h1>
        <p className="text-gray-500 text-sm mt-1">{filtered.length} turfs found in Chennai</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="rating">Sort: Top Rated</option>
          <option value="price-asc">Sort: Price Low–High</option>
          <option value="price-desc">Sort: Price High–Low</option>
        </select>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${
            activeFilters > 0
              ? 'bg-green-50 border-green-400 text-green-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilters > 0 && (
            <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {filtersOpen && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
            <button
              onClick={() => { setSport('all'); setMaxPrice(2000); }}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              Clear all
            </button>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Sport</p>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSport(value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    sport === value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Max Price</p>
              <span className="text-sm font-semibold text-green-700">₹{maxPrice}/hr</span>
            </div>
            <input
              type="range"
              min={500}
              max={2000}
              step={100}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹500</span>
              <span>₹2000</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {sport !== 'all' && (
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
            {SPORTS.find(s => s.value === sport)?.label}
            <button onClick={() => setSport('all')}><X className="w-3 h-3" /></button>
          </div>
        )}
        {maxPrice < 2000 && (
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
            Under ₹{maxPrice}/hr
            <button onClick={() => setMaxPrice(2000)}><X className="w-3 h-3" /></button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium text-gray-600">No turfs match your filters</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
          <button
            onClick={() => { setSport('all'); setMaxPrice(2000); setSearch(''); }}
            className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(turf => (
            <TurfCard key={turf.id} turf={turf} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TurfsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-gray-500 text-sm">Loading...</div>}>
      <TurfsContent />
    </Suspense>
  );
}
