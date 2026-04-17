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
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
        <FiPackage size={40} className="mx-auto text-gray-300" />
        <p className="mt-3 text-sm text-text-secondary">No items in cart</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6">
      <h3 className="mb-4 text-lg font-bold text-text-primary">Order Summary</h3>

      {/* Items */}
      <div className="mb-4 max-h-48 overflow-y-auto divide-y divide-gray-50">
        {items.map((item) => (
          <CartItemCompact key={item.product} item={item} />
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Delivery</span>
          <span className={deliveryFee === 0 ? 'font-semibold text-primary' : ''}>
            {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
          </span>
        </div>
        {deliveryFee > 0 && (
          <p className="text-xs text-primary">
            Add {formatPrice(2000 - subtotal)} more for free delivery
          </p>
        )}
        <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-text-primary">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
