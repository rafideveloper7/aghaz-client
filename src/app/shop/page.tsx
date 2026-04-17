'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/common/SearchBar';
import { CategoryFilter } from '@/components/common/CategoryFilter';
import { ProductGrid } from '@/components/product/ProductGrid';
import { InfiniteScroll } from '@/components/common/InfiniteScroll';
import { useInfiniteProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { FiSliders } from 'react-icons/fi';
import { useState } from 'react';
import type { SortOption } from '@/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const [sort, setSort] = useState<SortOption>('latest');
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const selectedCategory = categories?.find((item) => item.slug === category);
  const resolvedCategory = category ? selectedCategory?._id : undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts({
    category: resolvedCategory,
    search: search || undefined,
    sort,
    limit: 20,
  });

  const allProducts = data?.pages.flatMap((page) => page) || [];
  const isResolvingCategory = Boolean(category) && isCategoriesLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
      {/* Header */}
      <div className="mb-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:p-6">
        <h1 className="text-2xl font-black text-text-primary md:text-3xl">
          {search ? `Search: "${search}"` : category ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All Products'}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
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
        <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5">
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
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
          <div className="mb-6">
            <div className="h-8 w-48 rounded-lg bg-gray-200 animate-pulse" />
            <div className="mt-2 h-4 w-32 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="mb-4 h-12 rounded-xl bg-gray-200 animate-pulse" />
          <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
