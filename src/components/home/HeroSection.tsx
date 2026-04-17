'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';
import type { HeroSlide } from '@/types';

const fetchHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const response = await fetch(`${API_URL}/api/hero-slides`);
    if (!response.ok) {
      return [];
    }
    const json = await response.json();
    const slides = json.data;
    return Array.isArray(slides) ? slides : [];
  } catch (error) {
    return [];
  }
};

export function HeroSection() {
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: fetchHeroSlides,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = useCallback((imageUrl: string) => {
    setImageErrors(prev => ({ ...prev, [imageUrl]: true }));
  }, []);

  const isValidImage = useCallback((url: string) => {
    return url && url.trim() && !imageErrors[url];
  }, [imageErrors]);

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % (slides.length || 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isHovered, slides.length, nextSlide]);

  const goToSlide = (index: number) => setCurrent(index);

  // Show loading skeleton
  if (isLoading) {
    return (
      <section className="relative flex min-h-[400px] items-center justify-center bg-gray-100 md:min-h-[500px]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
        </div>
      </section>
    );
  }

  // Always show fallback banner (hero not configured or API failed)
  if (!slides.length) {
    return (
      <section className="relative flex min-h-[400px] items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-black md:min-h-[500px]">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="font-display text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Smart Living
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-7 text-white/78 mx-auto">
            Curated products that make your life easier, smarter, and more enjoyable.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-gray-950 shadow-lg transition-all hover:-translate-y-0.5"
            >
              Shop Now
              <FiArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur transition-all hover:bg-white/15"
            >
              Try Faster Checkout
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  // Determine which image to use based on screen size
  const getImageSrc = () => {
    // Will be handled by CSS classes, but we need a fallback
    return slide.image;
  };

  return (
    <section
      className="relative overflow-hidden pb-8 md:pb-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-x-4 top-6 z-10 hidden h-px bg-white/20 md:block" />

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide._id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* Background Images */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-black">
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
                unoptimized
              />
            ) : null}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.25),transparent_18%),linear-gradient(90deg,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.68)_38%,rgba(2,6,23,0.18)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute left-[-8%] top-[14%] h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl md:h-72 md:w-72" />
          <div className="absolute right-[8%] top-[18%] h-28 w-28 rounded-full bg-amber-300/20 blur-3xl md:h-44 md:w-44" />

          {/* Content */}
          <div className="relative flex min-h-[560px] items-center md:min-h-[720px]">
            <div className="mx-auto w-full max-w-7xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"
              >
                <div className="max-w-3xl">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/85">Fresh Drops • Fast Delivery</span>
                  </motion.div>

                  <div className="md:hidden">
                    <h1 className="font-display text-4xl font-black leading-tight text-white sm:text-5xl">
                      {slide.mobileTitle || slide.title}
                    </h1>
                    {(slide.mobileSubtitle || slide.subtitle) && (
                      <p className="mt-4 max-w-lg text-base leading-7 text-white/78 sm:text-lg">
                        {slide.mobileSubtitle || slide.subtitle}
                      </p>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="mt-8 flex flex-wrap gap-3"
                    >
                      <Link
                        href={slide.mobileCtaLink || slide.ctaLink || '/shop'}
                        className="group inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-bold text-gray-950 shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        {slide.mobileCtaText || slide.ctaText || 'Shop Now'}
                        <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/checkout"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition-all hover:bg-white/15"
                      >
                        Try Faster Checkout
                      </Link>
                    </motion.div>
                  </div>

                  <div className="hidden md:block">
                    <h1 className="font-display text-5xl font-black leading-[0.95] text-white lg:text-7xl">
                      {slide.desktopTitle || slide.title}
                    </h1>
                    {(slide.desktopSubtitle || slide.subtitle) && (
                      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78 lg:text-2xl">
                        {slide.desktopSubtitle || slide.subtitle}
                      </p>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="mt-9 flex flex-wrap gap-4"
                    >
                      <Link
                        href={slide.desktopCtaLink || slide.ctaLink || '/shop'}
                        className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-gray-950 shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        {slide.desktopCtaText || slide.ctaText || 'Shop Now'}
                        <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/checkout"
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur transition-all hover:bg-white/15"
                      >
                        Explore Checkout
                      </Link>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mt-10 grid max-w-2xl grid-cols-3 gap-3"
                  >
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                      <p className="text-2xl font-black text-white">500+</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/55">Curated Products</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                      <p className="text-2xl font-black text-white">10K+</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/55">Happy Customers</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                      <p className="text-2xl font-black text-white">COD</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/55">Plus Pay Now</p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                  className="hidden rounded-[2rem] border border-white/10 bg-white/10 p-5 text-white shadow-2xl backdrop-blur lg:block"
                >
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/85">Why Customers Convert</p>
                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-sm font-semibold">Cleaner value hierarchy</p>
                        <p className="mt-1 text-sm text-white/65">Headline, CTA, and offer stay readable even over rich imagery.</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-sm font-semibold">Confidence-led checkout</p>
                        <p className="mt-1 text-sm text-white/65">COD plus admin-managed payment accounts reduce hesitation.</p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4">
                        <p className="text-sm font-semibold">Mobile-first flow</p>
                        <p className="mt-1 text-sm text-white/65">Faster browsing, clearer categories, and stronger touch targets.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition-all hover:bg-white/20 md:left-8"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition-all hover:bg-white/20 md:right-8"
            aria-label="Next slide"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === current
                  ? 'w-8 h-2 bg-emerald-500 rounded-full'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 right-6 hidden md:block md:right-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <div className="h-8 w-5 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
