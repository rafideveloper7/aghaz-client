'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProductBySlug } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { ProductSlider } from '@/components/product/ProductSlider';
import { ProductBenefits } from '@/components/product/ProductBenefits';
import { ProductFAQ } from '@/components/product/ProductFAQ';
import { ProductReviews } from '@/components/product/ProductReviews';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import { FiChevronLeft, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-text-secondary">Product not found</p>
          <Link href="/shop" className="mt-4 text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.comparePrice);

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        product: product._id,
        title: product.title,
        price: product.price,
        image: product.images[0] || '',
      });
    }
  };

  return (
    <div className="pb-8 md:pb-12">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-20 md:pt-24">
        <nav className="flex items-center gap-1 text-sm text-text-secondary">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="truncate text-text-primary">{product.title}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <ProductSlider images={product.images || []} title={product.title} />
          </div>

          {/* Product Info */}
          <div>
            {/* Category Badge */}
            <Badge variant="info" size="sm" className="mb-3">
              {typeof product.category === 'object' ? product.category.name : product.category}
            </Badge>

            {/* Title */}
            <h1 className="text-2xl font-black text-text-primary md:text-3xl">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        'text-sm',
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      )}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <span className="text-sm text-text-secondary">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-text-primary md:text-4xl">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-lg text-text-secondary line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  {discount && (
                    <Badge variant="danger" size="sm">
                      -{discount}% OFF
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-3">
              {product.inStock ? (
                <Badge variant="success" size="sm">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="danger" size="sm">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {product.description}
              </p>
            )}

            {/* Video Embed */}
            {product.videoUrl && (
              <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-gray-100">
                <iframe
                  src={product.videoUrl}
                  title={`${product.title} video`}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium text-text-primary">Quantity:</span>
              <div className="flex items-center rounded-xl border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center text-text-secondary transition-colors hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={16} />
                </button>
                <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-text-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center text-text-secondary transition-colors hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                asMotion
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <FiShoppingCart size={18} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            {/* Order Now - Direct */}
            <Link href="/cart" className="mt-3 block">
              <Button variant="secondary" size="lg" fullWidth asMotion>
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits, FAQ, Reviews */}
      <div className="mx-auto max-w-7xl px-4 space-y-6">
        <ProductBenefits benefits={product.benefits} />
        <ProductFAQ faqs={product.faqs} />
        <ProductReviews productId={product._id} productTitle={product.title} />
      </div>

      {/* Related Products */}
      <RelatedProducts 
        currentSlug={slug} 
        category={typeof product.category === 'string' ? product.category : product.category?._id} 
      />

      {/* Sticky Mobile Order Button */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 p-2 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-black text-text-primary">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="ml-1 text-xs text-text-secondary line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="min-w-[120px] text-sm py-2"
            asMotion
          >
            <FiShoppingCart size={14} />
            <span className="sm:hidden">Order</span>
            <span className="hidden sm:inline">Order Now</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
