'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiGrid, FiShoppingCart } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { cn, getWhatsAppUrl } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', icon: FiHome, label: 'Home' },
  { href: '/shop', icon: FiGrid, label: 'Categories' },
  { href: '/cart', icon: FiShoppingCart, label: 'Cart' },
];

export function MobileBottomBar() {
  const pathname = usePathname();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const cartCount = getItemCount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === '/checkout' || pathname === '/order-success') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="border-t border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-center py-2 transition-colors',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.href === '/cart' && mounted && cartCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="mt-0.5 text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {/* WhatsApp */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 flex-col items-center justify-center py-2 text-text-secondary transition-colors hover:text-primary"
          >
            <FaWhatsapp size={22} />
            <span className="mt-0.5 text-[10px] font-medium">WhatsApp</span>
          </a>
        </div>
      </div>
      {/* Safe area padding for modern phones */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white/95" />
    </div>
  );
}
