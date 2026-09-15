import type { ReactNode } from 'react';

interface BottomActionBarProps {
  children: ReactNode;
  className?: string;
}

export default function BottomActionBar({ children, className = '' }: BottomActionBarProps) {
  return (
    <div
      className={`sticky bottom-16 lg:bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 ${className}`}
    >
      <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">{children}</div>
    </div>
  );
}