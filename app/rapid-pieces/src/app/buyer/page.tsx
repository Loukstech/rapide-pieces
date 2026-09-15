'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyerPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/'); }, [router]);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-rp-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
