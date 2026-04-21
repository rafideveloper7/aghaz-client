'use client';

import { useProducts } from '@/hooks/useProducts';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { FiStar } from 'react-icons/fi';

export default function NewArrivalsPage() {
  const { data: settings } = useSiteSettings();
  const newArrivalsHero = settings?.newArrivalsHero;
  
  const { data, isLoading } = useProducts({
    sort: 'latest',
    limit: 30,
  });

  const products = data?.products || [];
  
  const bgGradient = newArrivalsHero?.bgGradient || 'from-violet-600 via-purple-600 to-fuchsia-600';
  const bgColor = newArrivalsHero?.bgColor || '#7c3aed';
  const title = newArrivalsHero?.title || 'New Arrivals';
  const subtitle = newArrivalsHero?.subtitle || 'Be the first to discover our latest collection of innovative products';

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: bgColor }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
        </div>
        <div className="relative py-12 md:py-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium mb-4">
            <FiStar className="h-4 w-4" />
            Just Landed
          </div>
          <h1 className="text-4xl font-black text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-3 text-lg text-white/90 max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Products */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Latest Products</h2>
              <p className="text-sm text-gray-500">{products.length} new items</p>
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
              <FiStar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No new arrivals yet</p>
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
