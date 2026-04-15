'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getItemCount = useCartStore((state) => state.getItemCount);
  const [isOrderRedirecting, setIsOrderRedirecting] = useState(false);

  // Redirect to cart if empty
  useEffect(() => {
    const latestOrder = typeof window !== 'undefined' ? sessionStorage.getItem('latest-order') : null;

    if (latestOrder) {
      setIsOrderRedirecting(true);
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0 && !isOrderRedirecting) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <FiArrowLeft size={16} />
          Back to Cart
        </Link>
        <h1 className="mt-2 text-2xl font-black text-text-primary md:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {getItemCount()} {getItemCount() === 1 ? 'item' : 'items'} in your order
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6">
            <h2 className="mb-4 text-lg font-bold text-text-primary">
              Delivery Information
            </h2>
            <CheckoutForm />
          </div>

          {/* Trust Section */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-100 bg-white p-3 text-center">
              <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-text-primary">Secure</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3 text-center">
              <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <p className="text-xs font-medium text-text-primary">Fast Delivery</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3 text-center">
              <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </div>
              <p className="text-xs font-medium text-text-primary">Easy Returns</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <OrderSummary variant="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}
