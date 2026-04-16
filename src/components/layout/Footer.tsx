import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">
                Turf<span className="text-green-400">Book</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Book sports turfs in Chennai instantly. No calls, no hassle — just pick a slot and play.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/turfs" className="hover:text-white transition-colors">Browse Turfs</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Sports</h3>
            <ul className="space-y-2 text-sm">
              {['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Multi-sport'].map(s => (
                <li key={s}>
                  <Link href={`/turfs?sport=${s.toLowerCase()}`} className="hover:text-white transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <a href="mailto:hello@turfbook.in" className="hover:text-white transition-colors">
                  hello@turfbook.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2024 TurfBook. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cancellation Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
