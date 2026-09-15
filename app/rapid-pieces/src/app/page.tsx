'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getHomeRoute } from '@/lib/auth';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace('/welcome'); return; }
    if (user.role === 'buyer') { router.replace('/requests/new'); return; }
    router.replace(getHomeRoute(user.role));
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
