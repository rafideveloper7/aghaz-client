'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCalendar, FiEye, FiHeart, FiTag, FiSearch } from 'react-icons/fi';
import { useBlogs } from '@/hooks/useBlogs';
import { useCategories } from '@/hooks/useCategories';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const limit = 6;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('newest');

  const { data: blogsData, isLoading } = useBlogs({
    page,
    limit,
    search,
    category,
    tag,
    sort,
    published: true,
  });
  const { data: categoriesData } = useCategories();

  const blogs = blogsData?.data || [];
  const pagination = blogsData?.pagination;
  const categories = categoriesData?.data || [];

  // Extract all unique tags from blogs
  const allTags = Array.from(
    new Set(blogs.flatMap(blog => blog.tags || []))
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-primary-100 max-w-2xl mx-auto">
              Stay updated with the latest news, tips, and insights
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search blogs..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => { setSort('newest'); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  sort === 'newest'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => { setSort('popular'); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  sort === 'popular'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Most Popular
              </button>
            </div>

            {/* Blog Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card p-0 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-300 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No blogs found</h3>
                <p className="text-gray-500">Check back later for new articles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog: Blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="card overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        {blog.featuredImage ? (
                          <Image
                            src={blog.featuredImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <FiTag className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {blog.isFeatured && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <FiCalendar className="h-4 w-4" />
                        <time dateTime={blog.publishedAt || blog.createdAt}>
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </time>
                        <span className="mx-1">•</span>
                        <FiEye className="h-4 w-4" />
                        <span>{blog.viewCount.toLocaleString()} views</span>
                      </div>

                      <Link href={`/blog/${blog.slug}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-primary-600 font-medium hover:text-primary-700 transition-colors inline-flex items-center gap-1"
                      >
                        Read More
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Categories */}
              {categories.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => { setCategory(''); setPage(1); }}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !category ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat._id}
                        onClick={() => { setCategory(cat._id); setPage(1); }}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          category === cat._id ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              {allTags.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag, i) => (
                      <button
                        key={i}
                        onClick={() => { setTag(tag); setPage(1); }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          tag === tag
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Blog */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured</h3>
                <FeaturedBlogWidget />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedBlogWidget() {
  const { data: featuredData } = useBlogs({ limit: 1, featured: true, sort: 'newest' });
  const featuredBlog = featuredData?.data?.[0];

  if (!featuredBlog) {
    return <p className="text-gray-500 text-sm">No featured blog yet</p>;
  }

  return (
    <Link href={`/blog/${featuredBlog.slug}`} className="group block">
      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
        {featuredBlog.featuredImage ? (
          <Image
            src={featuredBlog.featuredImage}
            alt={featuredBlog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <FiTag className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {featuredBlog.title}
      </h4>
      <p className="text-xs text-gray-500 mt-1">{formatDate(featuredBlog.publishedAt)}</p>
    </Link>
  );
}
