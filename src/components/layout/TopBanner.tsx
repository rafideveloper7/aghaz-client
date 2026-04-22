'use client';

import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Link from 'next/link';

export function TopBanner() {
  const [mounted, setMounted] = useState(false);
  const { data: settings } = useSiteSettings();
  const topBanner = settings?.topBanner;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !topBanner?.enabled || !topBanner?.text) {
    return null;
  }

  const content = (
    <div
      className="py-2 text-center text-sm font-medium"
      style={{ backgroundColor: topBanner.bgColor, color: topBanner.textColor }}
    >
      {topBanner.text}
    </div>
  );

  if (topBanner.link) {
    return (
      <Link href={topBanner.link} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}