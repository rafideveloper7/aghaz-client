export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string | { _id: string; name: string; slug: string };
  tags?: string[];
  isFeatured?: boolean;
  isHot?: boolean;
  isDeal?: boolean;
  isOffer?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
  inStock: boolean;
  stock?: number;
  videoUrl?: string;
  benefits?: string[];
  faqs?: { question: string; answer: string }[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: string | Product['_id'];
  name: string;
  rating: number;
  comment: string;
  image?: string;
  verified: boolean;
  approved: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

export interface CartItem {
  product: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export type PaymentMethodType = 'cod' | 'wallet' | 'bank' | 'other';

export interface PaymentMethod {
  code: string;
  label: string;
  type: PaymentMethodType;
  accountTitle?: string;
  accountNumber?: string;
  iban?: string;
  instructions?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderPayload {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  products: CartItem[];
  totalAmount: number;
  paymentMethodCode: string;
  paymentReference?: string;
  paymentProofUrl?: string;
}

export interface OrderResponse {
  _id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  products: CartItem[];
  totalAmount: number;
  paymentMethod: {
    code: string;
    label: string;
    type: PaymentMethodType;
  };
  paymentDetails?: {
    accountTitle?: string;
    accountNumber?: string;
    iban?: string;
    paymentReference?: string;
  };
  paymentStatus: 'unpaid' | 'awaiting_verification' | 'paid';
  status: string;
  createdAt: string;
}

export interface PageHero {
  bgColor?: string;
  bgGradient?: string;
  bgImage?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
  timerEndTime?: string;
  titleColor?: string;
  subtitleColor?: string;
  titleFontSize?: number;
  subtitleFontSize?: number;
  rightSideImage?: string;
}

export interface TopBanner {
  enabled?: boolean;
  text?: string;
  bgColor?: string;
  textColor?: string;
  link?: string;
}

export interface HomeHero {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  bgColor?: string;
  bgGradientStart?: string;
  bgGradientMid?: string;
  bgGradientEnd?: string;
  bgImage?: string;
  titleColor?: string;
  subtitleColor?: string;
  titleFontSize?: number;
  subtitleFontSize?: number;
  ctaLink?: string;
  ctaBgColor?: string;
  ctaTextColor?: string;
}

export interface SiteSettings {
  _id: string;
  logo: string;
  logoWidth: number;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string;
  workingHours: string;
  formSubmitEmail: string;
  orderSuccessMessage: string;
  paymentMethods: PaymentMethod[];
  reviewsEnabled: boolean;
  reviewsRequireApproval: boolean;
  newArrivalsHero?: PageHero;
  aboutHero?: PageHero;
  dealsHero?: PageHero;
  shopHero?: PageHero;
  topBanner?: TopBanner;
  homeHero?: HomeHero;
  dealsEndTime?: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'latest' | 'price-asc' | 'price-desc';
  isFeatured?: boolean;
  isHot?: boolean;
  isDeal?: boolean;
  isOffer?: boolean;
  isNewArrival?: boolean;
}

export type SortOption = 'latest' | 'price-asc' | 'price-desc';

export interface HeroSlide {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileBg?: string;
  desktopBg?: string;
  ctaText: string;
  ctaLink: string;
  mediaType: 'image' | 'video' | 'gif';
  mediaUrl: string;
  rightSideMediaType: 'image' | 'video' | 'gif' | 'card' | 'none';
  rightSideMediaUrl: string;
  rightSideCardTitle: string;
  rightSideCardSubtitle: string;
  titleColor?: string;
  subtitleColor?: string;
  titleFontSize?: number;
  subtitleFontSize?: number;
  heroHeight?: number;
  mobileHeroHeight?: number;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileCtaText?: string;
  mobileCtaLink?: string;
  desktopTitle?: string;
  desktopSubtitle?: string;
  desktopCtaText?: string;
  desktopCtaLink?: string;
  isActive: boolean;
  sortOrder: number;
}

export const CATEGORIES = [
  'Daily Use Gadgets',
  'Special Offers',
  'Trending Products',
  'Smart Gadgets',
  'Kitchen Tools',
  'Home Improvement',
  'Kids Products',
] as const;

export type CategoryName = (typeof CATEGORIES)[number];
