'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUpload, FiCamera, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { reviewsApi, uploadReviewApi } from '@/lib/api';
import Image from 'next/image';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  image?: string;
  verified: boolean;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
  productTitle?: string;
}

function StarRating({ rating, size = 16, onClick, interactive = false }: { rating: number; size?: number; onClick?: (rating: number) => void; interactive?: boolean }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onClick?.(star)}
          className={cn(
            'transition-transform duration-150',
            interactive && 'cursor-pointer hover:scale-120 active:scale-95'
          )}
        >
          <FiStar
            size={size}
            className={cn(
              'transition-colors duration-150',
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200',
              interactive && star === rating && 'drop-shadow-sm'
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId, productTitle }: ProductReviewsProps) {
  const { data: settings } = useSiteSettings();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const data = await reviewsApi.getForProduct(productId);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (error: any) {
      console.warn('No reviews found or error fetching reviews:', error?.message || error);
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = '';
      if (formData.image) {
        const uploadResult = await uploadReviewApi.uploadImage(formData.image);
        imageUrl = uploadResult.url;
      }

      await reviewsApi.create({
        product: productId,
        name: formData.name,
        rating: formData.rating,
        comment: formData.comment,
        image: imageUrl || undefined,
      });

      toast.success('Review submitted!' + (settings?.reviewsRequireApproval ? ' It will be visible after approval.' : ''));
      setFormData({ name: '', rating: 5, comment: '', image: null });
      setImagePreview(null);
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image is larger than 10MB — upload may be slow', { id: 'size-warn' });
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  if (settings && settings.reviewsEnabled === false) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center">
        <FiStar className="mx-auto mb-3 h-12 w-12 text-gray-300" />
        <p className="text-gray-500">Reviews are currently disabled.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>
          {totalReviews > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-sm font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="
              btn-secondary 
              relative 
              z-10 
              w-full 
              sm:w-auto 
              border-4 
              border-orange-400 
              rounded-[8px] 
              p-2 
              font-semibold
              text-orange-500
              overflow-hidden 
              transition-colors 
              duration-500 
              hover:text-white

              after:absolute 
              after:left-[-50%] 
              after:top-[100%] 
              after:-z-10 
              after:h-[200px] 
              after:w-[200%] 
              after:aspect-square
              after:rounded-[40%] 
              after:bg-orange-400 
              after:transition-[top] 
              after:duration-700 
              after:ease-out
              
              hover:after:top-[-45px] 
              hover:after:animate-[spin_4s_linear_infinite]
            "
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Modern Redesigned Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mb-8 rounded-2xl border border-gray-200/80 bg-white shadow-sm shadow-gray-100/50 p-5 md:p-6"
        >
          {/* Form Header */}
          <div className="flex justify-between items-center pb-4 mb-5 border-b border-gray-100">
            <div>
              <h4 className="text-base font-bold text-gray-900">Write Your Review</h4>
              <p className="text-xs text-gray-500 mt-0.5">Fields marked with * are required</p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Star Selection Area */}
          <div className="mb-6 p-4 rounded-xl bg-orange-50/40 border border-orange-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800">Your Overall Rating *</label>
              <p className="text-xs text-gray-500 mt-0.5">Tap a star to set your review rating score</p>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-lg border border-orange-100 shadow-sm shadow-orange-100/20 w-fit">
              <StarRating rating={formData.rating} size={26} interactive onClick={(r) => setFormData(prev => ({ ...prev, rating: r }))} />
            </div>
          </div>

          {/* Name & Product Row */}
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Your Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Product</label>
              <input
                type="text"
                value={productTitle || 'Auto-detected Product'}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 font-medium cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          {/* Comment Area */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Your Review *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="Share your experience..."
              rows={5}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>


        </motion.form>
      )}
    </div>
  );
}
