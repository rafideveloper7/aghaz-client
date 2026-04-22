import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './constants';
import toast from 'react-hot-toast';
import type { Product, Category, ProductsResponse, ProductsQueryParams, OrderPayload, OrderResponse, ApiResponse, SiteSettings, ContactMessagePayload, Review } from '@/types';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please check your connection and try again.');
    } else if (!error.response) {
      toast.error('Unable to connect to server. Please try again later.');
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productsApi = {
  getAll: async (params: ProductsQueryParams = {}): Promise<PaginatedResponse<Product>> => {
    const apiParams = {
      ...params,
      sort:
        params.sort === 'price-asc'
          ? 'price_asc'
          : params.sort === 'price-desc'
            ? 'price_desc'
            : params.sort,
    };

    const { data } = await api.get<ApiResponse>('/api/products', { params: apiParams });
    return data as PaginatedResponse<Product>;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get<ApiResponse>(`/api/products/${slug}`);
    return data as { success: boolean; message: string; data: Product };
  },

  getFeatured: async (limit = 10): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<ApiResponse>('/api/products', {
      params: { isFeatured: true, limit },
    });
    return data as PaginatedResponse<Product>;
  },

  getOnSale: async (limit = 10): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get<ApiResponse>('/api/products', {
      params: { onSale: true, limit },
    });
    return data as PaginatedResponse<Product>;
  },
};

export const categoriesApi = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse>('/api/categories');
    return data as { success: boolean; message: string; data: Category[] };
  },
};

export const ordersApi = {
  create: async (payload: OrderPayload): Promise<OrderResponse> => {
    const { data } = await api.post<ApiResponse>('/api/orders', payload);
    return data.data as OrderResponse;
  },
};

export const settingsApi = {
  get: async (): Promise<SiteSettings> => {
    const response = await fetch(`${API_URL}/api/settings`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch settings');
    }
    return data.data as SiteSettings;
  },
};

export const reviewsApi = {
  getForProduct: async (productId: string) => {
    const { data } = await api.get<ApiResponse>(`/api/reviews/product/${productId}`);
    return data.data as { reviews: Review[]; averageRating: number; totalReviews: number; pagination: any };
  },
  create: async (payload: { product: string; name: string; rating: number; comment: string; image?: string }) => {
    const { data } = await api.post<ApiResponse>('/api/reviews', payload);
    return data.data as Review;
  },
};

export const contactMessagesApi = {
  create: async (payload: ContactMessagePayload) => {
    const { data } = await api.post<ApiResponse>('/api/contact-messages', payload);
    return data.data;
  },
};

export const uploadReviewApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post<ApiResponse>('/api/upload/review-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data as { url: string; fileId: string };
  },
};

export const uploadApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post<ApiResponse>('/api/upload/payment-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data as { url: string };
  },
};

export default api;
