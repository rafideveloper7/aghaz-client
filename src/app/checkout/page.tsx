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
      <div className="mb-6 overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(5,150,105,0.92))] p-6 text-white shadow-[0_36px_80px_-45px_rgba(15,23,42,0.85)] md:p-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          <FiArrowLeft size={16} />
          Back to Cart
        </Link>
        <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-100">
              Secure Checkout
            </span>
            <h1 className="mt-3 text-3xl font-black md:text-5xl">
              Fast checkout built to convert.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
              Cleaner steps, stronger trust cues, and flexible payment options including COD and admin-managed pay-now methods.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs md:min-w-[320px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
              <p className="text-lg font-black text-white">{getItemCount()}</p>
              <p className="mt-1 text-white/65">Items</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
              <p className="text-lg font-black text-white">24h</p>
              <p className="mt-1 text-white/65">Confirmation</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
              <p className="text-lg font-black text-white">PK</p>
              <p className="mt-1 text-white/65">Nationwide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.35)] backdrop-blur md:p-6">
            <h2 className="mb-4 text-lg font-bold text-text-primary">
              Delivery Information
            </h2>
            <CheckoutForm />
          </div>

          {/* Trust Section */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/85 p-4 text-center shadow-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-text-primary">Secure</p>
              <p className="mt-1 text-xs text-text-secondary">Protected payment choices and transparent totals.</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/85 p-4 text-center shadow-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-text-primary">Fast Delivery</p>
              <p className="mt-1 text-xs text-text-secondary">Dispatch starts quickly after confirmation.</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/85 p-4 text-center shadow-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-text-primary">Responsive Support</p>
              <p className="mt-1 text-xs text-text-secondary">Our team can confirm and guide your order on WhatsApp.</p>
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
