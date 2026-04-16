'use client';
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  once?: boolean;
  threshold?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 500,
  direction = 'up',
  className = '',
  once = true,
  threshold = 0.15,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const offsetMap: Record<string, string> = {
    up:    'translateY(24px)',
    down:  'translateY(-24px)',
    left:  'translateX(24px)',
    right: 'translateX(-24px)',
    none:  'translateY(0)',
  };

  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' : offsetMap[direction],
    transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
