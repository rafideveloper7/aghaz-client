'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiCalendar,
  FiEye,
  FiHeart,
  FiTag,
  FiUser,
  FiArrowLeft,
  FiShare2,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiLink as FiLinkIcon,
} from 'react-icons/fi';
import { useBlog, useIncrementLike } from '@/hooks/useBlogs';
import { useCategories } from '@/hooks/useCategories';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';
import { useParams } from 'next/navigation';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [liked, setLiked] = useState(false);
  // Fixed: Using useParams instead of useState on params

    const { data: blogData, isLoading, error } = useBlog(slug);
    const { data: categoriesData } = useCategories();
    const incrementLikeMutation = useIncrementLike();

    const blog = blogData as Blog | undefined;
    const categories = categoriesData || [];

   useEffect(() => {
     if (!blog && !isLoading && error) {
       // Blog not found - will show not found UI below
     }
   }, [blog, isLoading, error]);

  const handleLike = async () => {
    if (!blog || liked) return;
    try {
      await incrementLikeMutation.mutateAsync(blog._id);
      setLiked(true);
    } catch {
      // error handled by mutation
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = blog?.title || 'Check out this blog post';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Blog post not found</p>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryName = (category: any) => {
    if (!category) return null;
    if (typeof category === 'string') return category;
    return category.name;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      {blog.featuredImage && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            <p className="text-white/90 text-lg max-w-3xl line-clamp-2">
              {blog.excerpt}
            </p>
          </div>
        </div>
      )}
      

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FiCalendar className="h-4 w-4" />
              <time dateTime={blog.publishedAt || blog.createdAt}>
                {formatDate(blog.publishedAt || blog.createdAt)}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <FiEye className="h-4 w-4" />
              <span>{blog.viewCount.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                disabled={liked || incrementLikeMutation.isPending}
                className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'hover:text-red-500'} transition-colors`}
              >
                <FiHeart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                <span>{blog.likeCount + (liked ? 1 : 0)}</span>
              </button>
            </div>
            {blog.author?.name && (
              <div className="flex items-center gap-2">
                <FiUser className="h-4 w-4" />
                <span>{blog.author.name}</span>
              </div>
            )}
            {blog.category && getCategoryName(blog.category) && (
               <Link
                 href={`/blog?category=${typeof blog.category === 'string' ? blog.category : blog.category._id}`}
                 className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
               >
                 {getCategoryName(blog.category)}
               </Link>
             )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, i) => (
                <Link
                  key={i}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                >
                  <FiTag className="h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Blog Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg max-w-none mb-12 bg-white rounded-2xl shadow-sm p-8 md:p-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Action Links (Custom CTAs) */}
          {blog.customLinks && blog.customLinks.length > 0 && (
            <div className="mt-12 mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Actions</h3>
              <div className="flex flex-wrap gap-3">
                {blog.customLinks.map((link, idx) => (
                  link.isButton ? (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        link.style === 'primary'
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : link.style === 'secondary'
                          ? 'bg-gray-800 text-white hover:bg-gray-900'
                          : link.style === 'outline'
                          ? 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                          : 'text-primary-600 hover:underline'
                      }`}
                    >
                      {link.text}
                    </a>
                  ) : (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {link.text} →
                    </a>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Gallery Images */}
          {blog.gallery && blog.gallery.length > 0 && (
            <div className="mt-12 mb-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {blog.gallery.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`${blog.title} gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a91da] transition-colors"
              >
                <FiTwitter className="h-4 w-4" />
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#4267B2] text-white rounded-lg hover:bg-[#365899] transition-colors"
              >
                <FiFacebook className="h-4 w-4" />
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
              >
                <FiLinkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('Link copied to clipboard!');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <FiLinkIcon className="h-4 w-4" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
