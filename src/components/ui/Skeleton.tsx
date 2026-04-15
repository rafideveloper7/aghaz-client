import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text';
}

function Skeleton({ variant = 'rect', className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'circle' && 'rounded-full',
        variant === 'rect' && 'rounded-xl',
        variant === 'text' && 'rounded h-4',
        className
      )}
      {...props}
    />
  );
}

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-2 md:p-3">
        <Skeleton variant="text" className="mb-1 h-3 w-full" />
        <Skeleton variant="text" className="mb-2 h-3 w-2/3" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton variant="text" className="h-6 w-3/4" />
          <Skeleton variant="text" className="h-8 w-1/3" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-5/6" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-3/4" />
            <Skeleton variant="text" className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { Skeleton, ProductCardSkeleton, ProductDetailSkeleton, ListSkeleton };
