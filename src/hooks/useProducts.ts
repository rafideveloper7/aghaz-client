import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import type { ProductsQueryParams } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

export function useProducts(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll({
      page: params.page || 1,
      limit: params.limit || DEFAULT_PAGE_SIZE,
      category: params.category,
      search: params.search,
      sort: params.sort,
      isFeatured: params.isFeatured,
      isHot: params.isHot,
      isDeal: params.isDeal,
      isOffer: params.isOffer,
      isNewArrival: params.isNewArrival,
    }),
    select: (data) => ({
      products: data.data,
      pagination: data.pagination,
    }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInfiniteProducts(params: Omit<ProductsQueryParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['infinite-products', params],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getAll({
        page: pageParam as number,
        limit: params.limit || DEFAULT_PAGE_SIZE,
        category: params.category,
        search: params.search,
        sort: params.sort,
        isFeatured: params.isFeatured,
        isHot: params.isHot,
        isDeal: params.isDeal,
        isOffer: params.isOffer,
        isNewArrival: params.isNewArrival,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.page + 1;
      return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
    },
    select: (data) => ({
      pages: data.pages.map(p => p.data),
      pageParams: data.pageParams,
      pagination: data.pages[data.pages.length - 1]?.pagination,
    }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useFeaturedProducts(limit = 10) {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: () => productsApi.getFeatured(limit),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useHotProducts(limit = 10) {
  return useQuery({
    queryKey: ['hot-products', limit],
    queryFn: () => productsApi.getHot(limit),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useDealProducts(limit = 10) {
  return useQuery({
    queryKey: ['deal-products', limit],
    queryFn: () => productsApi.getDeals(limit),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useOfferProducts(limit = 10) {
  return useQuery({
    queryKey: ['offer-products', limit],
    queryFn: () => productsApi.getOffers(limit),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useNewArrivalProducts(limit = 10) {
  return useQuery({
    queryKey: ['new-arrival-products', limit],
    queryFn: () => productsApi.getNewArrivals(limit),
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
