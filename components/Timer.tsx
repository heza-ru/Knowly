'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
  onExpire: () => void;
  className?: string;
}

export function Timer({ seconds, onExpire, className = '' }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setTimeLeft(seconds);
    setIsExpired(false);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isExpired) {
        setIsExpired(true);
        onExpire();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isExpired, onExpire]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 10;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
        isLowTime ? 'border-[var(--theme-error)] bg-[var(--theme-surface)]' : 'border-[var(--theme-border)] bg-[var(--theme-surface)]'
      } ${className}`}
    >
      <Clock className={`w-5 h-5 ${isLowTime ? 'text-[var(--theme-error)]' : 'text-[var(--theme-text-muted)]'}`} />
      <span
        className={`font-mono font-semibold ${
          isLowTime ? 'text-[var(--theme-error)]' : 'text-[var(--theme-text)]'
        }`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
