import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomBar } from '@/components/layout/MobileBottomBar';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { MarqueeBar } from '@/components/layout/MarqueeBar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Aghaz - Discover Smart Living',
    template: '%s | Aghaz',
  },
  description:
    'Discover smart living with curated products that make life easier and more enjoyable. Cash on Delivery available across Pakistan.',
  keywords: ['ecommerce', 'smart gadgets', 'Pakistan', 'cash on delivery', 'online shopping'],
  authors: [{ name: 'Aghaz' }],
  openGraph: {
    title: 'Aghaz - Discover Smart Living',
    description: 'Curated smart products that transform your everyday routine.',
    type: 'website',
    locale: 'en_PK',
    siteName: 'Aghaz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aghaz - Discover Smart Living',
    description: 'Curated smart products that transform your everyday routine.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <AnnouncementBar />
          <MarqueeBar />
          <Header />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomBar />
        </Providers>
      </body>
    </html>
  );
}
