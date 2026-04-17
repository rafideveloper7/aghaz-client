'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';

interface CategoryFilterProps {
  className?: string;
}

export function CategoryFilter({ className }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const { data: categories, isLoading } = useCategories();

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set('category', categorySlug);
      params.set('page', '1');
    } else {
      params.delete('category');
    }
    router.push(`/shop?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className={cn('flex gap-2 overflow-x-auto pb-2', className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-24 shrink-0 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mobile-category-scroll flex gap-2 overflow-x-auto pb-2 pr-1 scrollbar-hide snap-x snap-mandatory',
        className
      )}
    >
      <button
        onClick={() => handleCategoryClick('')}
        className={cn(
          'snap-start shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap shadow-sm',
          !activeCategory
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-white/70 bg-white text-text-secondary hover:border-primary/20 hover:bg-primary-50 hover:text-text-primary'
        )}
      >
        All
      </button>
      {categories?.map((category: { _id: string; name: string; slug: string }) => (
        <button
          key={category._id}
          onClick={() => handleCategoryClick(category.slug)}
          className={cn(
            'snap-start shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap shadow-sm',
            activeCategory === category.slug
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-white/70 bg-white text-text-secondary hover:border-primary/20 hover:bg-primary-50 hover:text-text-primary'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
