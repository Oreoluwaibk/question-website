"use client";

import Image from "next/image";
import { useState } from "react";

type AppLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function AppLogo({
  size = 36,
  className = "",
  priority = false,
}: AppLogoProps) {
  const [loaded, setLoaded] = useState(false);
  const hasSizeClass = /\bh-|\bw-/.test(className);

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-xl bg-mint-soft ${className}`}
      style={hasSizeClass ? undefined : { width: size, height: size }}
    >
      {loaded ? null : (
        <span
          className="absolute inset-0 z-10 flex items-center justify-center"
          role="status"
          aria-label="Loading picture"
        >
          <span className="h-1/2 w-1/2 max-h-4 max-w-4 animate-spin rounded-full border-2 border-mint border-t-transparent" />
        </span>
      )}
      <Image
        src="/icon.png"
        alt="Question Bank"
        width={size}
        height={size}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-contain ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}
