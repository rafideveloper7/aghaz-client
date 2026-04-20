'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';
import type { HeroSlide } from '@/types';

const fetchHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const res = await fetch(`${API_URL}/api/hero-slides`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
};

// Media renderer component that handles images, videos, gifs
const HeroMedia = ({ 
  src, 
  type, 
  alt, 
  fill = false,
  className = '' 
}: { 
  src: string; 
  type: 'image' | 'video' | 'gif'; 
  alt?: string;
  fill?: boolean;
  className?: string;
}) => {
  if (type === 'video') {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className={className}
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : {}}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt || ''}
      fill={fill}
      className={`${className} ${fill ? 'object-cover' : ''}`}
      sizes="100vw"
      unoptimized
      priority
    />
  );
};

export function HeroSection() {
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: fetchHeroSlides,
    staleTime: 60 * 1000,
  });

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mediaErrors, setMediaErrors] = useState<Record<string, boolean>>({});

  const handleMediaError = useCallback((mediaUrl: string) => {
    setMediaErrors(prev => ({ ...prev, [mediaUrl]: true }));
  }, []);

  const isValidMedia = useCallback((url: string) => {
    return url && url.trim() && !mediaErrors[url];
  }, [mediaErrors]);

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
      <section className="relative flex min-h-[300px] items-center justify-center bg-gray-100 md:min-h-[350px]">
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
      <section className="relative flex min-h-[300px] items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-black md:min-h-[350px]">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <h1 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            Discover Smart Living
          </h1>
          <p className="mt-3 max-w-xl text-base leading-6 text-white/78 mx-auto">
            Curated products that make your life easier, smarter, and more enjoyable.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-gray-950 shadow-lg transition-all hover:-translate-y-0.5"
            >
              Shop Now
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current];
  
  // Get media URL (fallback to legacy image field)
  const mediaUrl = slide.mediaUrl || slide.image;
  const mediaType = slide.mediaType || 'image';
  
  // Calculate heights with defaults
  const mobileHeight = slide.mobileHeroHeight || 400;
  const desktopHeight = slide.heroHeight || 450;

  return (
    <section
      className="relative overflow-hidden h-[90%]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide._id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Background Media */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-950 to-black"
            style={{ minHeight: `${mobileHeight}px` }}
          >
            {isValidMedia(mediaUrl) ? (
              <HeroMedia
                src={mediaUrl}
                type={mediaType}
                alt={slide.title}
                fill
                className="hidden md:block"
              />
            ) : null}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_18%),linear-gradient(90deg,rgba(2,6,23,0.85)_0%,rgba(2,6,23,0.55)_38%,rgba(2,6,23,0.1)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Content */}
          <div 
            className="relative flex items-center"
            style={{ minHeight: `${mobileHeight}px` }}
          >
            <div className="mx-auto w-full max-w-7xl px-4 py-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid items-center gap-6 lg:grid-cols-[1fr_350px]"
              >
                <div className="max-w-2xl">
                  <div className="md:hidden">
                    <h1 
                      className="font-display font-black leading-tight"
                      style={{ 
                        color: slide.titleColor || '#ffffff',
                        fontSize: `${Math.max(28, slide.titleFontSize * 0.7)}px`
                      }}
                    >
                      {slide.mobileTitle || slide.title}
                    </h1>
                    {(slide.mobileSubtitle || slide.subtitle) && (
                      <p 
                        className="mt-3 max-w-lg leading-6"
                        style={{ 
                          color: slide.subtitleColor || '#ffffffc4',
                          fontSize: `${Math.max(14, slide.subtitleFontSize * 0.8)}px`
                        }}
                      >
                        {slide.mobileSubtitle || slide.subtitle}
                      </p>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="mt-6 flex flex-wrap gap-3"
                    >
                      <Link
                        href={slide.mobileCtaLink || slide.ctaLink || '/shop'}
                        className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-gray-950 shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        {slide.mobileCtaText || slide.ctaText || 'Shop Now'}
                        <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  </div>

                  <div className="hidden md:block">
                    <h1 
                      className="font-display font-black leading-[0.95]"
                      style={{ 
                        color: slide.titleColor || '#ffffff',
                        fontSize: `${slide.titleFontSize || 52}px`
                      }}
                    >
                      {slide.desktopTitle || slide.title}
                    </h1>
                    {(slide.desktopSubtitle || slide.subtitle) && (
                      <p 
                        className="mt-4 max-w-2xl leading-7"
                        style={{ 
                          color: slide.subtitleColor || '#ffffffc4',
                          fontSize: `${slide.subtitleFontSize || 16}px`
                        }}
                      >
                        {slide.desktopSubtitle || slide.subtitle}
                      </p>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="mt-6 flex flex-wrap gap-3"
                    >
                      <Link
                        href={slide.desktopCtaLink || slide.ctaLink || '/shop'}
                        className="group inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 text-sm font-bold text-gray-950 shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        {slide.desktopCtaText || slide.ctaText || 'Shop Now'}
                        <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
               
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
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm p-2 text-white transition-all hover:bg-white/20 md:left-6"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm p-2 text-white transition-all hover:bg-white/20 md:right-6"
            aria-label="Next slide"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${index === current
                  ? 'w-6 h-2 bg-emerald-500 rounded-full'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
