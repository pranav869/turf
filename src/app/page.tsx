'use client';
import Link from 'next/link';
import { Search, ArrowRight, Calendar, CheckCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TurfCard from '@/components/turfs/TurfCard';
import FadeIn from '@/components/ui/FadeIn';
import { TURFS } from '@/lib/data/turfs';

const STATS = [
  { value: '500+', label: 'Games Played' },
  { value: '5', label: 'Turfs Listed' },
  { value: '4.8★', label: 'Avg Rating' },
  { value: '1000+', label: 'Happy Players' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Find a Turf',
    desc: 'Browse turfs by sport, price, or location. See real-time availability.',
  },
  {
    step: '02',
    icon: Calendar,
    title: 'Pick Your Slot',
    desc: 'Select your date and time. Available and booked slots are clearly shown.',
  },
  {
    step: '03',
    icon: CheckCircle,
    title: 'Pay & Play',
    desc: 'Confirm with UPI or card. Get instant booking confirmation.',
  },
];

const SPORT_FILTERS = ['All', 'Cricket', 'Football', 'Basketball', 'Tennis'];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [activeSport, setActiveSport] = useState('All');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (activeSport !== 'All') params.set('sport', activeSport.toLowerCase());
    router.push(`/turfs?${params.toString()}`);
  };

  const featuredTurfs = TURFS.filter(t => t.featured);

  return (
    <div className="bg-gray-50">
      <section className="bg-white border-b border-gray-100" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full mb-5 animate-fade-in">
              <Zap className="w-4 h-4" aria-hidden="true" />
              Instant booking confirmation
            </div>
            <h1 id="hero-heading" className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4 animate-fade-up">
              Book Your Perfect<br />
              <span className="text-green-600">Sports Turf</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Find and book cricket, football, basketball & tennis turfs in Chennai. No calls, no waiting — just pick and play.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto mb-5" role="search" aria-label="Search turfs">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by sport, location, or turf name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
              >
                Search
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {SPORT_FILTERS.map(sport => (
                <button
                  key={sport}
                  onClick={() => setActiveSport(sport)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeSport === sport
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-600" aria-label="Platform statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
                <div className="text-sm text-green-100 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" aria-labelledby="popular-heading">
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="popular-heading" className="text-2xl font-bold text-gray-900">Popular Turfs</h2>
              <p className="text-gray-500 text-sm mt-1">Most booked this week</p>
            </div>
            <Link
              href="/turfs"
              className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 min-h-[44px] py-2"
            >
              View all <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTurfs.map((turf, i) => (
            <FadeIn key={turf.id} delay={i * 80}>
              <TurfCard turf={turf} priority={i < 2} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-gray-100 content-auto" aria-labelledby="how-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 id="how-heading" className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
              <p className="text-gray-500 text-sm">Three steps to get on the field</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <FadeIn key={step} delay={i * 100}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-bold text-green-600 mb-1">STEP {step}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 content-auto" aria-labelledby="all-turfs-heading">
        <FadeIn>
          <h2 id="all-turfs-heading" className="text-2xl font-bold text-gray-900 mb-6">All Turfs in Chennai</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TURFS.map((turf, i) => (
            <FadeIn key={turf.id} delay={i * 60}>
              <TurfCard turf={turf} />
            </FadeIn>
          ))}
        </div>
      </section>

      <FadeIn className="mx-4 sm:mx-6 mb-10">
        <section className="bg-green-600 rounded-2xl" aria-labelledby="cta-heading">
          <div className="max-w-2xl mx-auto px-6 py-12 text-center">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Play?</h2>
            <p className="text-green-100 mb-6">
              Join hundreds of players already booking through TurfBook. It takes less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/turfs"
                className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 active:scale-95 transition-all duration-150 text-sm min-h-[44px] inline-flex items-center justify-center"
              >
                Browse Turfs
              </Link>
              <Link
                href="/auth/signup"
                className="bg-green-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800 active:scale-95 transition-all duration-150 text-sm border border-green-500 min-h-[44px] inline-flex items-center justify-center"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
