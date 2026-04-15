import { HeroSection } from '@/components/home/HeroSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { ProductScroll } from '@/components/home/ProductScroll';
import { CategorySection } from '@/components/home/CategorySection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TrustBadges />
      <ProductScroll
        title="Trending Now"
        subtitle="Our most popular picks"
        viewAllHref="/shop?category=trending-products"
        limit={10}
      />
      <CategorySection />
      <ProductScroll
        title="Special Offers"
        subtitle="Deals you don't want to miss"
        viewAllHref="/shop?category=special-offers"
        limit={10}
      />

      {/* Smart Gadgets Section */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white md:p-10">
            <h2 className="text-2xl font-black md:text-3xl">Smart Gadgets</h2>
            <p className="mt-2 text-sm text-gray-400 md:text-base">
              Tech that simplifies your daily life
            </p>
            <a
              href="/shop?category=smart-gadgets"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              Explore Collection
            </a>
          </div>
        </div>
      </section>

      <ProductScroll
        title="Smart Gadgets"
        subtitle="Innovation at your fingertips"
        viewAllHref="/shop?category=smart-gadgets"
        limit={10}
      />

      {/* Bottom CTA Banner */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl bg-primary-50 p-6 text-center md:p-10">
            <h2 className="text-2xl font-black text-primary-800 md:text-3xl">
              Start Your Smart Journey
            </h2>
            <p className="mt-2 text-sm text-primary-600 md:text-base">
              Free delivery on orders above Rs. 2000. Cash on Delivery available nationwide.
            </p>
            <a
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
