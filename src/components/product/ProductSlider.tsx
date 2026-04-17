'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMaximize } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductSliderProps {
  images: string[];
  title: string;
}

export function ProductSlider({ images, title }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-gray-100" />
    );
  }

  return (
    <>
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <SafeImage
                src={images[currentIndex]}
                alt={`${title} - Image ${currentIndex + 1}`}
                fill
                className="object-contain p-4"
                priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-white md:left-4"
                aria-label="Previous image"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-white md:right-4"
                aria-label="Next image"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute right-2 top-2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-white md:right-4 md:top-4"
            aria-label="View fullscreen"
          >
            <FiMaximize size={16} />
          </button>

          {/* Image Counter */}
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white md:bottom-4 md:right-4 md:text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

         {/* Thumbnails */}
         {images.length > 1 && (
           <div className="mt-2 flex gap-1.5 overflow-x-auto pb-2">
             {images.map((image, index) => (
               <button
                 key={index}
                 onClick={() => goToIndex(index)}
                 className={cn(
                   'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition-all md:h-16 md:w-16',
                   currentIndex === index
                     ? 'ring-2 ring-primary'
                     : 'ring-1 ring-gray-200 opacity-60 hover:opacity-100'
                 )}
               >
                 <SafeImage
                   src={image}
                   alt={`${title} - Thumbnail ${index + 1}`}
                   fill
                   className="object-cover"
                 />
               </button>
             ))}
           </div>
         )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen view"
          >
            <FiMaximize size={20} />
          </button>

          <div className="relative h-full w-full max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative h-full w-full"
              >
                <SafeImage
                  src={images[currentIndex]}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fullscreen Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(index);
                  }}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all',
                    currentIndex === index ? 'bg-white w-6' : 'bg-white/40'
                  )}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </>
  );
}
