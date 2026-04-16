import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'gray' | 'yellow' | 'blue' | 'purple';
  className?: string;
}

export default function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
