"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface VendorImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function VendorImage({ src, alt, className }: VendorImageProps) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  const imageSrc =
    failed || !src || src === "/placeholder.svg" ? "/placeholder.svg" : src;

  return (
    <>
      {loading && <div className="absolute inset-0 animate-pulse bg-muted" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
        onLoad={() => setLoading(false)}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
      />
    </>
  );
}
