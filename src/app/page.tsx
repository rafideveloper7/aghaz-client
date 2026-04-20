import { HeroSection } from '@/components/home/HeroSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { ProductScroll } from '@/components/home/ProductScroll';
import { CategorySection } from '@/components/home/CategorySection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      
      <ProductScroll
        title="🔥 Hot Products"
        subtitle="Trending right now"
        viewAllHref="/shop?category=trending-products"
        limit={10}
      />
      
      
      
      

      <ProductScroll
        title="Flash Deals"
        subtitle="Quick steals before they disappear"
        viewAllHref="/shop?category=flash-deals"
        limit={10}
      />

      <CategorySection />
      <ProductScroll
        title="Special Offers"
        subtitle="Deals you don't want to miss"
        viewAllHref="/shop?category=special-offers"
        limit={10}
      />

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] bg-[linear-gradient(135deg,rgba(17,24,39,0.98),rgba(6,95,70,0.95))] p-6 text-white shadow-[0_35px_90px_-55px_rgba(17,24,39,0.9)] md:p-10">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-100">
                Smart Living
              </span>
              <h2 className="mt-4 font-display text-3xl font-black md:text-4xl">Gear up your daily routine.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 md:text-base">
                Discover practical gadgets, household upgrades, and curated picks that feel premium without slowing down checkout.
              </p>
              <a
                href="/shop?category=smart-gadgets"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-gray-900 transition-transform hover:-translate-y-0.5"
              >
                Explore Smart Gadgets
              </a>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.35)] md:p-10">
              <h2 className="font-display text-3xl font-black text-primary-900 md:text-4xl">
                Checkout that feels trustworthy.
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary md:text-base">
                Free delivery above Rs. 2000, COD for confidence, and pay-now options when customers are ready.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="rounded-2xl bg-primary-50 px-3 py-4 text-primary-900">
                  <p className="text-lg font-black">2000+</p>
                  <p className="mt-1 text-primary-700">Free Delivery</p>
                </div>
                <div className="rounded-2xl bg-amber-50 px-3 py-4 text-amber-900">
                  <p className="text-lg font-black">COD</p>
                  <p className="mt-1 text-amber-700">Available</p>
                </div>
                <div className="rounded-2xl bg-slate-100 px-3 py-4 text-slate-900">
                  <p className="text-lg font-black">24h</p>
                  <p className="mt-1 text-slate-600">Confirmation</p>
                </div>
              </div>
              <a
                href="/checkout"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
              >
                Try New Checkout
              </a>
            </div>
          </div>
        </div>
      </section>

      <ProductScroll
        title="Smart Gadgets"
        subtitle="Innovation at your fingertips"
        viewAllHref="/shop?category=smart-gadgets"
        limit={10}
      />
      <section className="py-6 md:py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-white/60 bg-[linear-gradient(135deg,#fff8e6,#ffffff_40%,#ecfdf5)] p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] md:p-6">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-800">
              Hot Right Now
            </span>
            <h2 className="mt-3 font-display text-2xl font-black text-text-primary md:text-3xl">
              Trending picks that move fast.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-5 text-text-secondary md:text-base">
              Best sellers, impulse buys, and proven winners curated for quick decisions.
            </p>
            <a
              href="/shop?category=trending-products"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Shop Trending Now
            </a>
          </div>

          <div className="rounded-xl border border-rose-200/70 bg-[linear-gradient(160deg,#fff1f2,#ffffff_45%,#fff7ed)] p-4 shadow-[0_20px_60px_-45px_rgba(244,63,94,0.4)] md:p-6">
            <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-rose-700">
              Limited Window
            </span>
            <h2 className="mt-3 font-display text-2xl font-black text-text-primary">
              Flash Deals
            </h2>
            <p className="mt-2 text-sm leading-5 text-text-secondary">
              Urgent offers and short-run discounts designed to create momentum on the homepage.
            </p>
            <a
              href="/shop?category=flash-deals"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              See Flash Deals
            </a>
          </div>
        </div>
      </section>


      <TrustBadges />
    </div>
    
  );
}