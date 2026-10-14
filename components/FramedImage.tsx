"use client";

import { useState } from "react";

type FramedImageProps = {
  src: string;
  alt: string;
  className: string;
  loading?: boolean;
};

export function FramedImage({ src, alt, className, loading = false }: FramedImageProps) {
  const [loadedSrc, setLoadedSrc] = useState("");
  const ready = loadedSrc === src && !loading;

  return (
    <span className={`relative inline-flex shrink-0 overflow-hidden bg-mint-soft ${className}`}>
      {ready ? null : (
        <span
          className="absolute inset-0 z-10 flex items-center justify-center"
          role="status"
          aria-label="Loading picture"
        >
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-mint border-t-transparent" />
        </span>
      )}
      {/* Profile photos are remote Supabase files with sizes chosen by the frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        ref={(node) => {
          if (node?.complete && node.naturalWidth > 0) setLoadedSrc(src);
        }}
        onLoad={() => setLoadedSrc(src)}
        className={`h-full w-full object-cover ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}
