'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, CreditCard, Smartphone, Wallet, AlertCircle, Copy, Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/authStore';
import { useBookingStore } from '@/lib/store/bookingStore';
import { formatCurrency, formatDate, formatSlotTime } from '@/lib/utils';
import type { Turf } from '@/lib/types';

type Step = 'login' | 'payment' | 'confirm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  turf: Turf;
  date: string;
  selectedSlots: string[];
  totalAmount: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  turf,
  date,
  selectedSlots,
  totalAmount,
}: BookingModalProps) {
  const { user, login, signup } = useAuthStore();
  const { addBooking } = useBookingStore();
  const router = useRouter();

  const initialStep: Step = user ? 'payment' : 'login';
  const [step, setStep] = useState<Step>(initialStep);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [copied, setCopied] = useState(false);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (authMode === 'login') {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        setStep('payment');
      }
    } else {
      if (!name || !phone) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      const result = signup(name, email, phone, password);
      if (!result.success) {
        setError(result.error || 'Signup failed');
      } else {
        setStep('payment');
      }
    }
    setLoading(false);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid 16-digit card number');
        return;
      }
      if (!cardExpiry || !cardCvv) {
        setError('Please enter card expiry and CVV');
        return;
      }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      setError('You must be logged in to book');
      setLoading(false);
      return;
    }

    const result = addBooking({
      userId: currentUser.id,
      turfId: turf.id,
      turfName: turf.name,
      turfLocation: turf.location,
      date,
      slots: selectedSlots,
      totalAmount,
      status: 'confirmed',
      paymentMethod,
      paymentStatus: 'paid',
      sport: turf.sport[0],
      userName: currentUser.name,
      userPhone: currentUser.phone,
    });

    if (!result.success) {
      setError(result.error || 'Booking failed. Please try again.');
    } else {
      setBookingId(result.bookingId!);
      setStep('confirm');
    }
    setLoading(false);
  };

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (step === 'confirm') {
      router.push('/profile');
    }
    onClose();
  };

  const title =
    step === 'login'
      ? authMode === 'login'
        ? 'Log in to continue'
        : 'Create account'
      : step === 'payment'
      ? 'Payment'
      : undefined;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      {step === 'login' && (
        <div className="p-5">
          <div className="bg-green-50 rounded-lg p-3 mb-5 text-sm text-green-700">
            Booking <strong>{selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''}</strong> at{' '}
            <strong>{turf.name}</strong> for <strong>{formatDate(date)}</strong> —{' '}
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>

          <div className="flex rounded-lg bg-gray-100 p-1 mb-5">
            <button
              onClick={() => { setAuthMode('login'); setError(''); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${authMode === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Log In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setError(''); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${authMode === 'signup' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            {authMode === 'signup' && (
              <>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              {authMode === 'login' ? 'Log In & Continue' : 'Create Account & Continue'}
            </Button>
          </form>
        </div>
      )}

      {step === 'payment' && (
        <div className="p-5">
          <div className="bg-gray-50 rounded-lg p-4 mb-5 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Turf</span>
              <span className="text-gray-800 font-medium text-right max-w-[60%] truncate">{turf.name}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Date</span>
              <span className="text-gray-800 font-medium">{formatDate(date)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Slots</span>
              <span className="text-gray-800 font-medium text-right">{selectedSlots.length}h ({selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''})</span>
            </div>
            <div className="flex justify-between text-gray-500 border-t border-gray-200 pt-2 mt-2">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-green-700 text-base">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { id: 'upi' as const, label: 'UPI', icon: Smartphone },
              { id: 'card' as const, label: 'Card', icon: CreditCard },
              { id: 'cash' as const, label: 'Cash', icon: Wallet },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPaymentMethod(id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border text-sm font-medium transition-all ${
                  paymentMethod === id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handlePayment} className="space-y-3">
            {paymentMethod === 'upi' && (
              <div>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. name@upi)"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1.5">Enter your UPI ID and confirm payment in your UPI app</p>
              </div>
            )}
            {paymentMethod === 'card' && (
              <>
                <input
                  type="text"
                  placeholder="Card number (16 digits)"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  maxLength={19}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '');
                      setCardExpiry(v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2, 4)}` : v);
                    }}
                    maxLength={5}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    maxLength={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
            {paymentMethod === 'cash' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                Pay in cash at the venue before your game. Please arrive 10 minutes early.
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              {loading ? 'Processing…' : `Pay ${formatCurrency(totalAmount)}`}
            </Button>
            <p className="text-center text-xs text-gray-400">
              🔒 Payments are simulated — no real charge
            </p>
          </form>
        </div>
      )}

      {step === 'confirm' && (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Booking Confirmed!</h2>
          <p className="text-sm text-gray-500 mb-5">You are all set. See you on the turf!</p>

          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2.5 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Booking ID</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 font-mono">{bookingId}</span>
                <button onClick={copyBookingId} className="text-gray-400 hover:text-gray-600">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Turf</span>
              <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">{turf.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-800">{formatDate(date)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time</span>
              <span className="font-medium text-gray-800">
                {selectedSlots.length > 0
                  ? `${formatSlotTime(selectedSlots[0]).split('–')[0].trim()} – ${formatSlotTime(selectedSlots[selectedSlots.length - 1]).split('–')[1].trim()}`
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-500 font-medium">Amount Paid</span>
              <span className="font-bold text-green-700">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" size="lg" className="flex-1" onClick={() => { onClose(); router.push('/profile'); }}>
              View My Bookings
            </Button>
            <Button variant="primary" size="lg" className="flex-1" onClick={() => { onClose(); }}>
              Book Another
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
