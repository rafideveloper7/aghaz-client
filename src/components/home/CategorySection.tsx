'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGrid, FiPackage } from 'react-icons/fi';
import { useCategories } from '@/hooks/useCategories';

const iconPool = [FiGrid, FiPackage];

export function CategorySection() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories?.length) {
    return (
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 rounded-2xl border p-4 animate-pulse">
                <div className="h-12 w-12 rounded-xl bg-gray-200" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-black text-text-primary md:text-3xl">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Browse our curated collections
          </p>
        </motion.div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((category: { _id: string; name: string; slug: string }, index: number) => {
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
        </div>
      </div>
    </section>
  );
}
