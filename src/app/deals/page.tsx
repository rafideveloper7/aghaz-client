'use client';

import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { FiZap, FiClock } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function DealsPage() {
  const { data: settings } = useSiteSettings();
  const dealsHero = settings?.dealsHero;
  
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const { data, isLoading } = useProducts({
    sort: 'price-asc',
    limit: 30, 
  });

  useEffect(() => {
    const endTimeStr = dealsHero?.timerEndTime;
    if (!endTimeStr) return;
    
    const updateTimer = () => {
      const now = Date.now();
      const endTime = new Date(endTimeStr).getTime();
      const diff = endTime - now;
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [dealsHero?.timerEndTime]);

  const products = data?.products || [];

  const bgGradient = dealsHero?.bgGradient || 'from-red-600 via-orange-500 to-yellow-500';
  const bgColor = dealsHero?.bgColor || '#ea580c';
  const bgImage = dealsHero?.bgImage || '';
  const title = dealsHero?.title || 'Flash Deals';
  const subtitle = dealsHero?.subtitle || 'Grab these amazing deals before they are gone!';
  const titleColor = dealsHero?.titleColor || '#ffffff';
  const subtitleColor = dealsHero?.subtitleColor || '#ffffff';
  const titleFontSize = dealsHero?.titleFontSize || 48;
  const subtitleFontSize = dealsHero?.subtitleFontSize || 18;
  const rightSideImage = dealsHero?.rightSideImage || '';

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: bgColor }}>
        {bgImage && (
          <div className="absolute inset-0">
            <Image 
              src={bgImage} 
              alt="Background" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-r ${!bgImage ? bgGradient : ''}`}>
          {!bgImage && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
            </div>
          )}
        </div>
        
        <div className="relative flex items-center justify-between px-4 md:px-8 lg:px-12 py-12 md:py-16 max-w-7xl mx-auto">
          {/* Left Side Content */}
          <div className={`flex-1 ${rightSideImage ? 'lg:max-w-[60%]' : ''} text-center lg:text-left`}>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4">
              <FiZap className="h-4 w-4" />
              Limited Time Offers
            </div>
            <h1 
              className="font-black text-white sm:text-5xl md:text-6xl"
              style={{ 
                fontSize: `${titleFontSize}px`,
                color: titleColor,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              {title}
            </h1>
            <p 
              className="mt-3 max-w-xl mx-auto lg:mx-0"
              style={{ 
                fontSize: `${subtitleFontSize}px`,
                color: subtitleColor
              }}
            >
              {subtitle}
            </p>

            {(timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
              <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
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
            )}
          </div>

          {/* Right Side Image - Desktop Only */}
          {rightSideImage && (
            <div className="hidden lg:block flex-shrink-0 w-[300px] xl:w-[400px]">
              <div className="relative w-full aspect-square">
                <Image 
                  src={rightSideImage} 
                  alt="Right side" 
                  fill 
                  className="object-contain"
                />
              </div>
            </div>
          )}
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
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