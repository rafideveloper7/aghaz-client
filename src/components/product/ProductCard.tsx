'use client';

import Link from 'next/link';
import { FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import type { Product } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  const discount = calculateDiscount(product.price, product.comparePrice);
  const inStock = product.stock !== undefined ? product.stock > 0 : product.inStock !== false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      product: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '',
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col h-full overflow-hidden rounded-lg sm:rounded-xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
          <SafeImage
            src={product.images[0] || '/images/placeholder.png'}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Discount Badge */}
          {discount && discount > 0 && (
            <span className="absolute left-1 top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[10px] md:text-xs">
              -{discount}%
            </span>
          )}
          {/* Out of Stock Badge */}
          {!inStock && (
            <span className="absolute left-1 top-1 rounded-full bg-gray-900 px-1.5 py-0.5 text-[9px] font-bold text-white sm:left-2 sm:top-2 sm:px-2 sm:py-1 sm:text-[10px] md:text-xs">
              Out
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-1.5 sm:p-2 md:p-3">
          <h3 className="line-clamp-2 text-[11px] font-medium text-text-primary sm:text-xs md:text-sm flex-1 leading-tight">
            {product.title}
          </h3>

          <div className="mt-0.5 flex items-baseline gap-1 sm:mt-1 md:mt-2">
            <span className="text-xs font-bold text-text-primary sm:text-sm md:text-base">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="hidden text-[10px] text-text-secondary line-through sm:inline sm:text-xs">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button - Compact on mobile */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={cn(
              'mt-1 flex w-full items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-semibold transition-all duration-200 sm:mt-1.5 sm:py-1.5 md:mt-3 md:h-11 md:py-0 md:text-sm flex-shrink-0',
              inStock
                ? 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark'
                : 'cursor-not-allowed bg-gray-100 text-text-secondary',
              isAdding && 'scale-95'
            )}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdding ? (
              <FiShoppingCart size={12} className="sm:size-14" />
            ) : (
              <FiPlus size={12} className="sm:size-14" />
            )}
            <span className="hidden sm:inline">
              {inStock ? 'Add' : 'Out'}
            </span>
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
