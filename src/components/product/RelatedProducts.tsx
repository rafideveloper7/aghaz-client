'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  currentSlug: string;
  category?: string;
}

export function RelatedProducts({ currentSlug, category }: RelatedProductsProps) {
  const { data, isLoading } = useProducts({
    limit: 6,
    category,
    sort: 'latest',
  });

  const relatedProducts = data?.products?.filter(
    (p) => p.slug !== currentSlug
  ) || [];

  if (relatedProducts.length === 0 && !isLoading) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-black text-text-primary md:text-2xl">
              You May Also Like
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Similar products you might be interested in
            </p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            View All
            <FiArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedProducts.slice(0, 6).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="min-w-[calc(33.333%-8px)] md:min-w-[calc(25%-9px)] lg:min-w-[calc(16.666%-10px)]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
