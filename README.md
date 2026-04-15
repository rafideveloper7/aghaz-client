# Aghaz Ecommerce - Client (Public Website)

Next.js frontend for the Aghaz dropshipping ecommerce platform.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (cart state management)
- **React Query** (data fetching & caching)
- **Framer Motion** (animations)
- **React Hot Toast** (notifications)
- **Zod** + **React Hook Form** (form validation)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (hero, trending, categories, offers) |
| `/shop` | Product listing with search, filters, sorting |
| `/product/[slug]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Checkout form (COD only) |
| `/order-success` | Order confirmation |

## Design Features

### Mobile-First
- **3 product cards per row** on mobile (Markaz-style)
- Sticky bottom navigation (Home, Categories, Cart, WhatsApp)
- Touch-optimized interactions
- Responsive images with Next.js Image component

### UX Highlights
- Smooth scroll animations (Framer Motion)
- Skeleton loading states
- Debounced search (500ms)
- Infinite scroll on shop page
- Sticky "Order Now" button on mobile PDP
- Toast notifications
- Lazy-loaded images

### Performance
- React Query caching (5-min stale time for products)
- Code splitting by route
- Font optimization with next/font
- Image optimization with next/image

## State Management

### Cart (Zustand)
```typescript
// Store: src/store/cartStore.ts
- addItem(product)
- removeItem(productId)
- updateQuantity(productId, quantity)
- clearCart()
- getTotal()
- getItemCount()
```

Cart persists across sessions using `persist` middleware (localStorage).

## API Integration

All API calls go through `src/lib/api.ts` (axios instance with interceptors).

React Query hooks:
- `useProducts()` - Paginated product list
- `useInfiniteProducts()` - Infinite scroll
- `useProductBySlug(slug)` - Single product
- `useFeaturedProducts()` - Featured products
- `useCategories()` - Category list
- `useCreateOrder()` - Submit order

## Categories

- Daily Use Gadgets
- Special Offers
- Trending Products
- Smart Gadgets
- Kitchen Tools
- Home Improvement
- Kids Products

## Project Structure

```
client/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── layout/       # Header, Footer, MobileBottomBar
│   │   ├── product/      # Product cards, slider, FAQ
│   │   ├── home/         # Homepage sections
│   │   ├── cart/         # Cart components
│   │   ├── checkout/     # Checkout form
│   │   ├── common/       # Search, filters, skeletons
│   │   └── ui/           # Button, Input, Badge
│   ├── store/            # Zustand stores
│   ├── hooks/            # React Query hooks
│   ├── lib/              # API client, utils, constants
│   └── types/            # TypeScript interfaces
├── public/
└── .env.local
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` (your production API URL)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy

## WhatsApp Integration

The WhatsApp button links to:
```
https://wa.me/{NUMBER}?text=Hi! I need help with an order from Aghaz.com
```

Update `NEXT_PUBLIC_WHATSAPP_NUMBER` with your business number (with country code, no + or spaces).
