'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = getTotal();
  const deliveryFee = subtotal >= 2000 ? 0 : 150;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <FiShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Your cart is empty</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/shop" className="mt-6">
            <Button variant="primary" size="lg" asMotion>
              <FiShoppingBag size={18} />
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary md:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <button
          onClick={() => clearCart()}
          className="text-sm font-medium text-red-500 hover:text-red-600"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.product} item={item} />
              ))}
            </div>
          </AnimatePresence>

          {/* Continue Shopping */}
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
          >
            <FiArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary variant="sidebar" />

            {/* Totals */}
            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'font-semibold text-primary' : ''}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-lg font-bold text-text-primary">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="mt-4 block">
                <Button variant="primary" size="lg" fullWidth asMotion>
                  Proceed to Checkout
                </Button>
              </Link>

              {/* COD Badge */}
              <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary-50 py-2">
                <span className="text-xs font-semibold text-primary-700">
                  Cash on Delivery Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
