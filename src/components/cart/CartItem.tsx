'use client';

import Link from 'next/link';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, cn } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';
import { motion } from 'framer-motion';
import { SafeImage } from '@/components/ui/SafeImage';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className="flex gap-2 rounded-xl border border-gray-100 bg-white p-2 shadow-sm"
    >
      {/* Image */}
      <Link
        href={`/product/${item.product}`}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-24 md:w-24"
      >
        <SafeImage
          src={item.image || '/images/placeholder.png'}
          alt={item.title}
          fill
          className="object-cover"
        />
      </Link>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={`/product/${item.product}`}
          className="line-clamp-2 text-xs font-medium text-text-primary hover:text-primary"
        >
          {item.title}
        </Link>

        <span className="mt-0.5 text-sm font-bold text-text-primary md:text-lg">
          {formatPrice(item.price)}
        </span>

        {/* Quantity Controls */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => updateQuantity(item.product, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-l-lg text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
              aria-label="Decrease quantity"
            >
              <FiMinus size={12} />
            </button>
            <span className="flex h-7 w-8 items-center justify-center text-xs font-semibold text-text-primary">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-r-lg text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
              aria-label="Increase quantity"
            >
              <FiPlus size={12} />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.product)}
            className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="Remove item"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function CartItemCompact({ item }: { item: CartItemType }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-gray-100">
        <SafeImage src={item.image || '/images/placeholder.png'} alt={item.title} fill className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-text-primary leading-tight">{item.title}</p>
        <p className="text-[10px] text-text-secondary">Qty: {item.quantity}</p>
      </div>
      <span className="text-xs font-semibold text-text-primary">{formatPrice(item.price * item.quantity)}</span>
    </div>
  );
}
