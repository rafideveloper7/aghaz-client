'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGrid, FiPackage, FiSmartphone, FiHome, FiHeart, FiSun, FiStar, FiBox } from 'react-icons/fi';
import { useCategories } from '@/hooks/useCategories';

const iconPool = [FiGrid, FiPackage, FiSmartphone, FiHome, FiHeart, FiSun, FiStar, FiBox];

export function CategorySection() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories?.length) {
    return (
      <section className="py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 mb-4">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex overflow-x-auto gap-4 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2">
              <div className="h-4 w-4 bg-gray-300 rounded-full" />
              <div className="h-4 w-16 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 md:py-6 text-center">
      <div className="mx-auto max-w-7xl px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.1 }}
        >
          <h2 className="text-2xl font-black text-text-primary md:text-3xl ">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Browse our curated collections
          </p>
        </motion.div>
      </div>

      {/* Marquee Categories - Scrolling from right to left */}
      <div className="relative overflow-hidden w-[95%] md:w-[70%] mx-auto">
        <div className="absolute left-0 top-0 bottom-0 w-10 md:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 md:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4 whitespace-nowrap py-2"
            animate={{
              x: [0, -50 * (categories?.length || 1)]
            }}
            transition={{
              duration: 5, // Fixed faster speed (lower = faster)
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {[...categories, ...categories, ...categories].map((category: { _id: string; name: string; slug: string }, index: number) => {
              const Icon = iconPool[index % iconPool.length];
              return (
                <Link
                  key={`${category._id}-${index}`}
                  href={`/shop?category=${category.slug}`}
                  className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-primary hover:text-primary hover:shadow-md"
                >
                  <Icon size={16} />
                  {category.name}
                </Link>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Static Grid for visual reference */}
      {/* <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {categories.slice(0, 7).map((category: { _id: string; name: string; slug: string }, index: number) => {
          const Icon = iconPool[index % iconPool.length];
          return (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-center transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-text-secondary transition-all duration-200 group-hover:bg-primary-50 group-hover:text-primary md:h-14 md:w-14">
                  <Icon size={22} />
                </div>
                <span className="text-xs font-semibold text-text-primary group-hover:text-primary md:text-sm">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div> */}
    </section>
  );
}