'use client';

import { motion } from 'framer-motion';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface ProductScrollProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  limit?: number;
}

export function ProductScroll({
  title,
  subtitle,
  viewAllHref,
  limit = 10,
}: ProductScrollProps) {
  const { data: products, isLoading } = useFeaturedProducts(limit);

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-black text-text-primary md:text-2xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View All
              <FiArrowRight size={16} />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[calc(33.333%-8px)] md:min-w-[calc(25%-9px)]">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="min-w-[calc(33.333%-8px)] md:min-w-[calc(25%-9px)] lg:min-w-[calc(20%-12px)]"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center justify-center py-12 text-sm text-text-secondary">
            No products available
          </div>
        )}
      </div>
    </section>
  );
}
