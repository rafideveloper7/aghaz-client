"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSearch,
  FiChevronDown,
  FiGrid,
  FiPhone,
} from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useCategories } from "@/hooks/useCategories";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

interface SiteLogo {
  url: string;
  width: number;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const getItemCount = useCartStore((state) => state.getItemCount);
  const cartCount = getItemCount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();
  const { data: categories } = useCategories();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    },
    [router, searchQuery],
  );

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const logoUrl = settings?.logo?.trim();
  const hasValidLogo = logoUrl && !logoError;

  const LogoContent = () => {
    if (hasValidLogo) {
      return (
        <Image
          src={logoUrl!}
          alt="Aghaz Logo"
          width={settings?.logoWidth || 32}
          height={36}
          className="object-contain h-9 w-auto"
          unoptimized
          onError={() => {
            console.warn("Logo failed to load:", logoUrl);
            setLogoError(true);
          }}
        />
      );
    }
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20">
        <span className="text-lg font-black text-white">A</span>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    };
    if (categoriesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [categoriesOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300 border-b bg-white/95 backdrop-blur-md shadow-md shadow-gray-200/50",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-gray-200/50"
            : "bg-white/80 backdrop-blur-md",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 flex-shrink-0 mr-1"
            >
              <LogoContent />
              <h2 className="text-lg font-bold text-gray-900">Aghaz</h2>
            </Link>

            {/* Mobile Search - Visible on all screen sizes */}
            <form
              onSubmit={handleSearch}
              className="flex md:hidden flex-1 max-w-[180px] ml-2"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-8 pl-8 pr-2 rounded-lg border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <FiSearch
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />
              </div>
            </form>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
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
                🔥 <span className=" lg:inline">Deals</span>
              </Link>
              <Link
                href="/about"
                className="px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <span className="hidden lg:inline">About</span>
              </Link>

              {/* Contact Button - Always visible on all screens */}
              <Link
                href="/contact"
                className="hidden md:flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
              >
                <FiPhone size={14} />
                <span>Contact</span>
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1 px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <FiGrid size={14} />
                  <span className="hidden lg:inline">Categories</span>
                  <FiChevronDown
                    size={12}
                    className={cn(
                      "transition-transform",
                      categoriesOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {categoriesOpen && (categories?.length ?? 0) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {(categories || [])
                        .slice(0, 8)
                        .map(
                          (cat: {
                            _id: string;
                            name: string;
                            slug: string;
                          }) => (
                            <Link
                              key={cat._id}
                              href={`/shop?category=${cat.slug}`}
                              onClick={() => setCategoriesOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary border hover:border-primary transition-all"
                            >
                              {cat.name}
                            </Link>
                          ),
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Search Bar - Visible on all devices */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-[180px] mx-2 lg:mx-4"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-8 lg:h-9 pl-8 lg:pl-9 pr-3 lg:pr-4 rounded-lg lg:rounded-xl border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <FiSearch
                  className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={14}
                />
              </div>
            </form>

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
                    {cartCount > 9 ? "9+" : cartCount}
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <div className="flex items-center gap-2">
                  {hasValidLogo ? (
                    <Image
                      src={logoUrl!}
                      alt="Aghaz Logo"
                      width={settings?.logoWidth || 32}
                      height={32}
                      className="object-contain h-8 w-auto"
                      unoptimized
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700">
                      <span className="text-sm font-black text-white">A</span>
                    </div>
                  )}
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
                      "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                      pathname === link.href
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/new-arrivals"
                  className="rounded-xl px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  New Arrivals
                </Link>
                <Link
                  href="/deals"
                  className="rounded-xl px-4 py-3 text-base font-medium text-orange-600 hover:bg-orange-50"
                >
                  🔥 Flash Deals
                </Link>
                <Link
                  href="/about"
                  className="rounded-xl px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl px-4 py-3 text-base font-medium text-gray-600 hover:bg-gray-50"
                >
                  Contact Us
                </Link>
              </nav>
              {/* Categories Dropdown */}
              <div className="relative ml-4" ref={categoriesRef}>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <FiGrid size={14} />
                  <span className=" lg:inline ">Categories</span>
                  <FiChevronDown
                    size={12}
                    className={cn(
                      "transition-transform",
                      categoriesOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {categoriesOpen && (categories?.length ?? 0) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                    >
                      {(categories || [])
                        .slice(0, 8)
                        .map(
                          (cat: {
                            _id: string;
                            name: string;
                            slug: string;
                          }) => (
                            <Link
                              key={cat._id}
                              href={`/shop?category=${cat.slug}`}
                              onClick={() => setCategoriesOpen(false)}
                              className="block px-8 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary border "
                            >
                              {cat.name}
                            </Link>
                          ),
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
