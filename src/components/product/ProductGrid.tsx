'use client';

import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: '2' | '3' | '4' | '5';
}

export function ProductGrid({
  products,
  isLoading = false,
  columns = '2',
}: ProductGridProps) {
  const colClasses = {
    '2': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    '3': 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    '4': 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    '5': 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  };

  if (isLoading) {
    return (
      <div className={`grid ${colClasses[columns]} gap-2 md:gap-4`}>
        {Array.from({ length: 15 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-text-secondary">No products found</p>
        <p className="mt-1 text-sm text-text-secondary/70">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClasses[columns]} gap-2 md:gap-4 auto-rows-fr`}>
      {products.filter(Boolean).map((product) => (
        <div key={product._id} className="flex">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
