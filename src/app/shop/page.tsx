'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryFilter } from '@/components/common/CategoryFilter';
import { ProductGrid } from '@/components/product/ProductGrid';
import { InfiniteScroll } from '@/components/common/InfiniteScroll';
import { useInfiniteProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { FiSliders, FiGrid, FiPackage, FiSmartphone, FiHome, FiHeart, FiSun, FiStar, FiBox, FiShoppingBag } from 'react-icons/fi';
import { useState } from 'react';
import type { SortOption } from '@/types';

const iconPool = [FiGrid, FiPackage, FiSmartphone, FiHome, FiHeart, FiSun, FiStar, FiBox];

function ShopBanner() {
  const { data: categories } = useCategories();
  const { data: settings } = useSiteSettings();
  const shopHero = settings?.shopHero;

  const bgColor = shopHero?.bgColor || '#1a1a2e';
  const bgGradient = shopHero?.bgGradient || 'from-purple-700 via-indigo-600 to-blue-500';
  const title = shopHero?.title || 'All Products';
  const subtitle = shopHero?.subtitle || 'Discover amazing deals on our curated collection';

  return (
    <div className="relative overflow-hidden mt-8" style={{ background: bgColor }}>
      <div className={`absolute inset-0 bg-gradient-to-r ${bgGradient}`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-12 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative py-10 md:py-14 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-4">
            <FiShoppingBag className="h-4 w-4" />
            {categories?.length || 0} Categories
          </div>
          <h1 className="text-3xl font-black text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-3 text-base md:text-lg text-white/80 max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Categories Marquee */}
        {categories && categories.length > 0 && (
          <div className="mt-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16  z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 z-10 pointer-events-none" />
            
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-3 whitespace-nowrap py-2"
                animate={{
                  x: [0, -50 * (categories.length || 1)]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                {[...categories, ...categories, ...categories].map((category: { _id: string; name: string; slug: string }, index: number) => {
                  const Icon = iconPool[index % iconPool.length];
                  return (
                    <Link
                      key={`${category._id}-${index}`}
                      href={`/shop?category=${category.slug}`}
                      className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 md:px-5 py-2 text-xs md:text-sm font-medium text-white transition-all hover:bg-white/25 hover:border-white/30 hover:scale-105"
                    >
                      <Icon size={14} className="md:w-4 md:h-4" />
                      {category.name}
                    </Link>
                  );
                })}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const filter = searchParams.get('filter') || '';
  const search = searchParams.get('search') || '';
  const [sort, setSort] = useState<SortOption>('latest');
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const selectedCategory = categories?.find((item) => item.slug === category);
  const resolvedCategory = category ? selectedCategory?._id : undefined;

  let queryParams: Parameters<typeof useInfiniteProducts>[0] = {
    sort,
    limit: 20,
  };

  if (filter === 'hot') {
    queryParams = { ...queryParams, isHot: true };
  } else if (filter === 'deal') {
    queryParams = { ...queryParams, isDeal: true };
  } else if (filter === 'offer') {
    queryParams = { ...queryParams, isOffer: true };
  } else if (filter === 'newArrival') {
    queryParams = { ...queryParams, isNewArrival: true };
  }

  if (resolvedCategory) {
    queryParams = { ...queryParams, category: resolvedCategory };
  }
  if (search) {
    queryParams = { ...queryParams, search };
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts(queryParams);

  const allProducts = data?.pages.flatMap((page) => page) || [];
  const isResolvingCategory = Boolean(category) && isCategoriesLoading;

  const getPageTitle = () => {
    if (search) return `Search: "${search}"`;
    if (category) return category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    if (filter === 'hot') return '🔥 Hot Products';
    if (filter === 'deal') return '⚡ Flash Deals';
    if (filter === 'offer') return '🎁 Special Offers';
    if (filter === 'newArrival') return '✨ New Arrivals';
    return 'All Products';
  };

  return (
    <div className=" mx-auto max-w-7xl px-4 py-6 md:py-8 ">
      {/* Header */}
      <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:p-6">
        <h1 className="text-2xl font-black text-text-primary md:text-3xl mt-6">
          {getPageTitle()}
        </h1>
        <p className="mt-1 text-sm text-text-secondary ">
          {allProducts.length} products found
        </p>
        <div className="mt-4 space-y-3">
          <SearchBar initialValue={search} />
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <CategoryFilter className="min-w-0 flex-1" />
            <div className="relative w-full shrink-0 md:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-11 w-full appearance-none rounded-2xl border border-white/70 bg-white px-4 pr-10 text-sm font-medium text-text-primary shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 md:w-[220px]"
                aria-label="Sort products"
              >
                <option value="latest">Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <FiSliders
                size={14}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <InfiniteScroll
        onLoadMore={() => fetchNextPage()}
        hasNextPage={hasNextPage || false}
        isFetchingNextPage={isFetchingNextPage}
      >
        <ProductGrid
          products={allProducts}
          isLoading={(isLoading || isResolvingCategory) && allProducts.length === 0}
        />
      </InfiniteScroll>

      {/* Loading more indicator */}
      {allProducts.length > 0 && isFetchingNextPage && (
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={`load-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <ShopBanner />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
            <div className="mb-6">
              <div className="h-8 w-48 rounded-lg bg-gray-200 animate-pulse" />
              <div className="mt-2 h-4 w-32 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="mb-4 h-12 rounded-xl bg-gray-200 animate-pulse" />
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 15 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }
      >
        <ShopContent />
      </Suspense>
    </>
  );
}
