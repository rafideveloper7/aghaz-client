'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SITE_NAME } from '@/lib/constants';
import axios from 'axios';
import { API_URL } from '@/lib/constants';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
];

interface SiteLogo {
  url: string;
  width: number;
}

export function Header() {
  const pathname = usePathname();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const cartCount = getItemCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logo, setLogo] = useState<SiteLogo | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Fetch logo from settings
    axios.get(`${API_URL}/api/settings`).then(res => {
      if (res.data.success && res.data.data?.logo) {
        setLogo({ url: res.data.data.logo, width: res.data.data.logoWidth || 32 });
      }
    }).catch(() => {});
  }, []);

  const LogoContent = () => {
    if (logo?.url) {
      return (
        <Image 
          src={logo.url} 
          alt={SITE_NAME} 
          width={logo.width} 
          height={40} 
          className="object-contain" 
          unoptimized
          onError={() => setLogo(null)}
        />
      );
    }
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20">
        <span className="text-lg font-black text-white">A</span>
      </div>
    );
  };

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md shadow-gray-200/50'
            : 'bg-white/80 backdrop-blur-md'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <LogoContent />
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {SITE_NAME}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/new-arrivals"
                className="px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <span className="hidden lg:inline">New Arrivals</span>
                <span className="lg:hidden">New</span>
              </Link>
              <Link
                href="/deals"
                className="px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium text-orange-600 hover:bg-orange-50 transition-all"
              >
                🔥 <span className="hidden lg:inline">Deals</span>
              </Link>
              <Link
                href="/about"
                className="px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <span className="hidden lg:inline">About</span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="relative rounded-xl p-2.5 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                aria-label="Shopping Cart"
              >
                <FiShoppingCart size={22} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-[10px] font-bold text-white shadow-md shadow-emerald-500/30">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl p-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <div className="flex items-center gap-2">
                  {logo?.url ? (
                    <Image src={logo.url} alt={SITE_NAME} width={logo.width} height={32} className="object-contain" unoptimized />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700">
                      <span className="text-sm font-black text-white">A</span>
                    </div>
                  )}
                  <span className="text-lg font-black">{SITE_NAME}</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 hover:bg-gray-100"
                >
                  <FiX size={22} />
                </button>
              </div>
              <nav className="flex flex-col p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-xl px-4 py-3 text-base font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/new-arrivals" className="rounded-xl px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50">
                  New Arrivals
                </Link>
                <Link href="/deals" className="rounded-xl px-4 py-3 text-base font-medium text-orange-600 hover:bg-orange-50">
                  🔥 Flash Deals
                </Link>
                <Link href="/about" className="rounded-xl px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50">
                  About Us
                </Link>
                <Link href="/contact" className="rounded-xl px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50">
                  Contact Us
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
