'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { FiZap, FiClock } from 'react-icons/fi';
import { useState } from 'react';

export default function DealsPage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 59, seconds: 59 });

  const { data, isLoading } = useProducts({
    sort: 'price-asc',
    limit: 30, 
  });

  // Countdown timer
  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  });

  const products = data?.products || [];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
        <div className="relative py-12 md:py-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4">
            <FiZap className="h-4 w-4" />
            Limited Time Offers
          </div>
          <h1 className="text-4xl font-black text-white sm:text-5xl md:text-6xl">
            Flash Deals
          </h1>
          <p className="mt-3 text-lg text-white/90 max-w-xl mx-auto">
            Grab these amazing deals before they're gone!
          </p>

          {/* Countdown Timer */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</p>
              <p className="text-xs text-white/70 uppercase">Hours</p>
            </div>
            <span className="text-2xl font-bold text-white">:</span>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</p>
              <p className="text-xs text-white/70 uppercase">Mins</p>
            </div>
            <span className="text-2xl font-bold text-white">:</span>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</p>
              <p className="text-xs text-white/70 uppercase">Secs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Deals</h2>
              <p className="text-sm text-gray-500">{products.length} products with special prices</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-16">
              <FiClock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No deals available right now</p>
              <a href="/shop" className="mt-4 inline-block text-emerald-600 font-medium hover:underline">
                Browse all products →
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
