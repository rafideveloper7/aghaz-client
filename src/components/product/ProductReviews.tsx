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
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onClick?.(star)}
          className={cn(
            'transition-transform',
            interactive && 'cursor-pointer hover:scale-110'
          )}
        >
          <FiStar
            size={size}
            className={cn(
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  // Show message if reviews are disabled (after settings loaded)
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
          <h3 className="text-lg font-bold text-text-primary">Customer Reviews</h3>
          {totalReviews > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-sm font-semibold text-text-primary">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-text-secondary">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-secondary w-full sm:w-auto">
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4"
        >
          <h4 className="font-semibold text-gray-900 mb-4">Write Your Review</h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
            <StarRating rating={formData.rating} size={24} interactive onClick={(r) => setFormData(prev => ({ ...prev, rating: r }))} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
                <span className="text-gray-400 text-xs ml-1">({productTitle || 'Auto-detected'})</span>
              </label>
              <input type="text" value={productTitle || ''} className="input-field bg-gray-100" disabled />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className="input-field min-h-24"
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCamera className="inline mr-1" />
              Add Photo (optional)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-primary-400 transition-colors">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" width={80} height={80} className="object-cover" />
                  ) : (
                    <FiUpload className="text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-xs text-gray-500">Click to upload</span>
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, image: null }));
                  }}
                  className="text-red-500 text-sm hover:underline flex items-center gap-1"
                >
                  <FiX size={14} /> Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Max 5MB. JPG, PNG, WebP supported.</p>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? 'Submitting...' : <><FiCheck size={16} /> Submit Review</>}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ name: '', rating: 5, comment: '', image: null });
                setImagePreview(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Rating breakdown */}
      {totalReviews > 0 && (
        <div className="mb-6 flex gap-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const percentage = reviews.filter(r => r.rating === star).length / totalReviews * 100;
            return (
              <div key={star} className="flex-1">
                <div className="mb-1 flex items-center gap-1">
                  <span className="text-xs text-text-secondary">{star}</span>
                  <FiStar size={10} className="fill-yellow-400 text-yellow-400" />
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {visibleReviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-b border-gray-50 pb-4 last:border-0 last:pb-0"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-text-secondary">
                  {review.name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-text-primary">{review.name}</span>
                    {review.verified && (
                      <span className="rounded-full bg-primary-50 px-1.5 py-0.5 text-[10px] font-medium text-primary">Verified</span>
                    )}
                  </div>
                  <StarRating rating={review.rating} size={12} />
                </div>
              </div>
              <span className="text-xs text-text-secondary">
                {new Date(review.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            {review.image && (
              <button
                type="button"
                onClick={() => setPreviewImage(review.image || null)}
                className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
              >
                <Image src={review.image} alt="Review" width={64} height={64} className="object-cover" />
              </button>
            )}
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{review.comment}</p>
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

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <FiX size={24} />
            </button>
            <Image src={previewImage} alt="Preview" width={800} height={800} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
