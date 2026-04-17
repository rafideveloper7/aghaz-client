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
        className="flex flex-col h-full overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
          <SafeImage
            src={product.images[0] || '/images/placeholder.png'}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {discount && discount > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white md:text-xs">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-white md:text-xs">
              Out of Stock
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 p-1.5 md:p-3">
          <h3 className="line-clamp-2 text-xs font-medium text-text-primary md:text-sm flex-1 leading-tight">
            {product.title}
          </h3>

          <div className="mt-0.5 flex items-baseline gap-1.5 md:mt-2">
            <span className="text-sm font-bold text-text-primary md:text-base">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="hidden text-xs text-text-secondary line-through md:inline">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={cn(
              'mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg py-1 text-xs font-semibold transition-all duration-200 md:mt-3 md:h-11 md:py-0 md:text-sm flex-shrink-0',
              inStock
                ? 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark'
                : 'cursor-not-allowed bg-gray-100 text-text-secondary',
              isAdding && 'scale-95'
            )}
            aria-label={`Add ${product.title} to cart`}
          >
            {isAdding ? (
              <FiShoppingCart size={14} />
            ) : (
              <FiPlus size={14} />
            )}
            <span className="hidden md:inline">
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </span>
          </button>
        </div>
      </motion.div>
    </Link>
  );
}