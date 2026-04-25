'use client';

import { useCartStore } from '@/store/cartStore';
import { calculateDeliveryFee, formatPrice } from '@/lib/utils';
import { CartItemCompact } from '@/components/cart/CartItem';
import { FiPackage } from 'react-icons/fi';

interface OrderSummaryProps {
  variant?: 'sidebar' | 'page';
}

export function OrderSummary({ variant = 'sidebar' }: OrderSummaryProps) {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const subtotal = getTotal();
  const itemCount = getItemCount();
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
        <FiPackage size={32} className="mx-auto text-gray-300" />
        <p className="mt-2 text-sm text-text-secondary">No items in cart</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 md:p-6">
      <h3 className="mb-3 text-base font-bold text-text-primary md:mb-4 md:text-lg">Order Summary</h3>

      {/* Items */}
      <div className="mb-3 max-h-40 overflow-y-auto divide-y divide-gray-50 md:max-h-48">
        {items.map((item) => (
          <CartItemCompact key={item.product} item={item} />
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-1.5 border-t border-gray-100 pt-3 text-sm md:space-y-2 md:pt-4">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-text-primary md:text-lg md:pt-3">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
