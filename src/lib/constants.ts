export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const SITE_NAME = 'Aghaz';
export const SITE_TAGLINE = 'Discover Smart Living';

export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400/e2e8f0/64748b?text=No+Image';

export const DEFAULT_PAGE_SIZE = 20;

// Default product benefits (used as fallback when product has no benefits)
export const PRODUCT_BENEFITS = [
  'Premium quality materials built to last',
  'Free shipping on orders over Rs. 2000',
  '7-day hassle-free return policy',
  '24/7 customer support via WhatsApp',
  'Secure cash on delivery available',
  '1-year warranty on all products',
];

// Default product FAQs (used as fallback when product has no FAQs)
export const PRODUCT_FAQS = [
  {
    question: 'How long does delivery take?',
    answer: 'We typically deliver within 2-5 business days depending on your location. Major cities usually receive orders within 2-3 days, while remote areas may take up to 5 days.',
  },
  {
    question: 'Can I return or exchange the product?',
    answer: 'Yes! We offer a 7-day return policy. If you\'re not satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange.',
  },
  {
    question: 'Is Cash on Delivery available?',
    answer: 'Yes, we offer Cash on Delivery (COD) across Pakistan. You can pay when you receive your order. No advance payment required!',
  },
  {
    question: 'Do you offer a warranty?',
    answer: 'All our products come with a 1-year manufacturer warranty covering defects in materials and workmanship. Contact us for warranty claims.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you\'ll receive a tracking number via SMS and email. You can also contact our WhatsApp support for order updates.',
  },
];
