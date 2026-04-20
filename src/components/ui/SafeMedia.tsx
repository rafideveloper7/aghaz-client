'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

type SafeMediaProps = Omit<ImageProps, 'src'> & {
  src?: string | null;
  fallbackSrc?: string;
  videoControls?: boolean;
};

export function SafeMedia({
  src,
  alt,
  fallbackSrc = PLACEHOLDER_IMAGE,
  unoptimized = true,
  videoControls = true,
  ...props
}: SafeMediaProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  
  const isVideo = currentSrc?.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) || currentSrc?.includes('video');

  if (isVideo) {
    return (
      <video
        src={currentSrc}
        className={props.className as string}
        style={props.style}
        controls={videoControls}
        muted
        preload="metadata"
        playsInline
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          }
        }}
      />
    );
  }

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
