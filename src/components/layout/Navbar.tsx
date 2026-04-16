'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/');
  };

  const isActive = (href: string) =>
    pathname === href ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600';

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Turf<span className="text-green-600">Book</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm transition-colors ${isActive('/')}`}>
              Home
            </Link>
            <Link href="/turfs" className={`text-sm transition-colors ${isActive('/turfs')}`}>
              Browse Turfs
            </Link>
            {user?.isAdmin && (
              <Link href="/admin" className={`text-sm transition-colors ${isActive('/admin')}`}>
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
                >
                  <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-700" />
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Bookings
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/turfs"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Browse Turfs
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                My Bookings
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-lg bg-green-600 text-sm font-medium text-white hover:bg-green-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
