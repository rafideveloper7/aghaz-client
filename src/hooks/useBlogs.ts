import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogsApi } from '@/lib/api';
import type { Blog } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

export function useBlogs(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  sort?: string;
  featured?: boolean;
  status?: string;
} = {}) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => blogsApi.getAll({
      page: params.page || 1,
      limit: params.limit || DEFAULT_PAGE_SIZE,
      search: params.search,
      category: params.category,
      tag: params.tag,
      sort: params.sort,
      featured: params.featured,
      status: params.status,
      published: true, // Always get published blogs on client
    }),
    select: (data) => ({
      blogs: data.data,
      pagination: data.pagination,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogsApi.getBySlug(slug),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useFeaturedBlogs(limit = 5) {
  return useQuery({
    queryKey: ['featuredBlogs', limit],
    queryFn: () => blogsApi.getFeatured(limit),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useRecentBlogs(limit = 5) {
  return useQuery({
    queryKey: ['recentBlogs', limit],
    queryFn: () => blogsApi.getRecent(limit),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useIncrementLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogsApi.incrementLike(id),
    onSuccess: () => {
      // Invalidate current blog query to update like count
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
}
