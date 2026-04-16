'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import Button from '@/components/ui/Button';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = signup(name, email, phone, password);
    if (result.success) {
      router.push('/turfs');
    } else {
      setError(result.error || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <div className="text-center mb-7">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">T</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Join TurfBook and start booking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-green-600 font-medium hover:text-green-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
