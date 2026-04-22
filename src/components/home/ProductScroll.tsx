'use client';

import { motion } from 'framer-motion';
import { useFeaturedProducts, useHotProducts, useDealProducts, useOfferProducts, useNewArrivalProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export type ProductFilterType = 'featured' | 'hot' | 'deal' | 'offer' | 'newArrival';

interface ProductScrollProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  limit?: number;
  filterType?: ProductFilterType;
}

function useProductFilter(filterType: ProductFilterType | undefined, limit: number) {
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts(limit);
  const { data: hotData, isLoading: hotLoading } = useHotProducts(limit);
  const { data: dealData, isLoading: dealLoading } = useDealProducts(limit);
  const { data: offerData, isLoading: offerLoading } = useOfferProducts(limit);
  const { data: newArrivalData, isLoading: newArrivalLoading } = useNewArrivalProducts(limit);

  switch (filterType) {
    case 'hot':
      return { data: hotData, isLoading: hotLoading };
    case 'deal':
      return { data: dealData, isLoading: dealLoading };
    case 'offer':
      return { data: offerData, isLoading: offerLoading };
    case 'newArrival':
      return { data: newArrivalData, isLoading: newArrivalLoading };
    default:
      return { data: featuredData, isLoading: featuredLoading };
  }
}

export function ProductScroll({
  title,
  subtitle,
  viewAllHref,
  limit = 10,
  filterType = 'featured',
}: ProductScrollProps) {
  const { data: products, isLoading } = useProductFilter(filterType, limit);

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
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: limit }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
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
