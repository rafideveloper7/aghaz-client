'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src?: string | null;
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  alt,
  fallbackSrc = PLACEHOLDER_IMAGE,
  unoptimized = true,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <Image
      {...props}
      src={currentSrc || fallbackSrc}
      alt={alt}
      unoptimized={unoptimized}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
