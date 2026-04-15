'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/lib/constants';
import type { HeroSlide } from '@/types';

const fetchHeroSlides = async (): Promise<HeroSlide[]> => {
  const { data } = await axios.get(`${API_URL}/api/hero-slides`);
  return data.data || [];
};

export function HeroSection() {
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: fetchHeroSlides,
    staleTime: 5 * 60 * 1000,
  });

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
      <section className="relative h-[85vh] min-h-[500px] bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
        </div>
      </section>
    );
  }

  // Show nothing if no slides configured
  if (!slides.length) {
    return null;
  }

  const slide = slides[current];

  // Determine which image to use based on screen size
  const getImageSrc = () => {
    // Will be handled by CSS classes, but we need a fallback
    return slide.image;
  };

  return (
    <section
      className="relative h-[85vh] min-h-[500px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-gray-900 to-gray-950">
            {/* Mobile background - only shown on small screens */}
            {slide.mobileBg ? (
              <Image
                src={slide.mobileBg}
                alt={slide.title}
                fill
                priority
                className="object-cover md:hidden"
                sizes="100vw"
                unoptimized={slide.mobileBg.startsWith('data:')}
              />
            ) : (
              /* Fallback to main image on mobile if no mobileBg */
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover md:hidden"
                sizes="100vw"
                unoptimized={slide.image.startsWith('data:')}
              />
            )}

            {/* Desktop background - only shown on medium+ screens */}
            {slide.desktopBg ? (
              <Image
                src={slide.desktopBg}
                alt={slide.title}
                fill
                priority
                className="object-cover hidden md:block"
                sizes="100vw"
                unoptimized={slide.desktopBg.startsWith('data:')}
              />
            ) : (
              /* Fallback to main image on desktop if no desktopBg */
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover hidden md:block"
                sizes="100vw"
                unoptimized={slide.image.startsWith('data:')}
              />
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="mx-auto max-w-7xl px-4 w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="max-w-2xl"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 mb-6"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-white/90">New Arrivals Available</span>
                </motion.div>

                {/* Mobile Content - shown only on small screens */}
                <div className="md:hidden">
                  {/* Title */}
                  <h1 className="text-4xl font-black text-white leading-tight sm:text-5xl">
                    {slide.mobileTitle || slide.title}
                  </h1>

                  {/* Subtitle */}
                  {(slide.mobileSubtitle || slide.subtitle) && (
                    <p className="mt-4 text-lg text-white/80 sm:text-xl max-w-lg">
                      {slide.mobileSubtitle || slide.subtitle}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-8 flex flex-wrap gap-4"
                  >
                    <Link
                      href={slide.mobileCtaLink || slide.ctaLink || '/shop'}
                      className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                    >
                      {slide.mobileCtaText || slide.ctaText || 'Shop Now'}
                      <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/50"
                    >
                      Browse All
                    </Link>
                  </motion.div>
                </div>

                {/* Desktop Content - shown only on medium+ screens */}
                <div className="hidden md:block">
                  {/* Title */}
                  <h1 className="text-4xl font-black text-white leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
                    {slide.desktopTitle || slide.title}
                  </h1>

                  {/* Subtitle */}
                  {(slide.desktopSubtitle || slide.subtitle) && (
                    <p className="mt-4 text-lg text-white/80 sm:text-xl md:text-2xl max-w-lg">
                      {slide.desktopSubtitle || slide.subtitle}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-8 flex flex-wrap gap-4"
                  >
                    <Link
                      href={slide.desktopCtaLink || slide.ctaLink || '/shop'}
                      className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                    >
                      {slide.desktopCtaText || slide.ctaText || 'Shop Now'}
                      <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/50"
                    >
                      Browse All
                    </Link>
                  </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="mt-10 flex items-center gap-8"
                >
                  <div>
                    <p className="text-2xl font-bold text-white">500+</p>
                    <p className="text-sm text-white/60">Products</p>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div>
                    <p className="text-2xl font-bold text-white">10K+</p>
                    <p className="text-sm text-white/60">Happy Customers</p>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div>
                    <p className="text-2xl font-bold text-white">COD</p>
                    <p className="text-sm text-white/60">Cash on Delivery</p>
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
        className="absolute bottom-6 right-6 md:right-8"
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
