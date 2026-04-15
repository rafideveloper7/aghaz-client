'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Ahmed K.',
    rating: 5,
    comment: 'Excellent product quality! Exactly as described. Fast delivery too.',
    date: '2 days ago',
    verified: true,
  },
  {
    id: '2',
    name: 'Sara M.',
    rating: 4,
    comment: 'Good value for money. Works as expected. Would recommend.',
    date: '1 week ago',
    verified: true,
  },
  {
    id: '3',
    name: 'Ali R.',
    rating: 5,
    comment: 'Amazing quality and fast shipping. Very happy with my purchase!',
    date: '2 weeks ago',
    verified: true,
  },
];

interface ProductReviewsProps {
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={cn(
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );
}

export function ProductReviews({
  reviews = MOCK_REVIEWS,
  averageRating = 4.7,
  totalReviews = 128,
}: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-text-primary">Customer Reviews</h3>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(averageRating)} />
          <span className="text-sm font-semibold text-text-primary">{averageRating}</span>
          <span className="text-xs text-text-secondary">({totalReviews})</span>
        </div>
      </div>

      {/* Rating breakdown */}
      <div className="mb-6 flex gap-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const percentages: Record<number, number> = { 5: 72, 4: 18, 3: 6, 2: 2, 1: 2 };
          return (
            <div key={star} className="flex-1">
              <div className="mb-1 flex items-center gap-1">
                <span className="text-xs text-text-secondary">{star}</span>
                <FiStar size={10} className="fill-yellow-400 text-yellow-400" />
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${percentages[star]}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {visibleReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-b border-gray-50 pb-4 last:border-0 last:pb-0"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-text-secondary">
                  {review.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-text-primary">{review.name}</span>
                    {review.verified && (
                      <span className="rounded-full bg-primary-50 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        Verified
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} size={12} />
                </div>
              </div>
              <span className="text-xs text-text-secondary">{review.date}</span>
            </div>
            <p className="text-sm text-text-secondary">{review.comment}</p>
          </motion.div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-gray-50"
        >
          {showAll ? 'Show Less' : `View All ${totalReviews} Reviews`}
        </button>
      )}
    </div>
  );
}
