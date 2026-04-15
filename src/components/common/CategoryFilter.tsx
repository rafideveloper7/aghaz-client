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
          <div key={i} className="shrink-0 rounded-full px-4 py-2 bg-gray-200 animate-pulse w-20 h-9" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-2 scrollbar-hide', className)}>
      <button
        onClick={() => handleCategoryClick('')}
        className={cn(
          'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
          !activeCategory
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
        )}
      >
        All
      </button>
      {categories?.map((category: { _id: string; name: string; slug: string }) => (
        <button
          key={category._id}
          onClick={() => handleCategoryClick(category.slug)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
            activeCategory === category.slug
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
