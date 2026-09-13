"use client";

import React, { useState, useEffect, useRef } from "react";

interface IpoLogoProps {
  name: string;
  logoUrl?: string;
  slug?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  alt?: string;
}

export function IpoLogo({ name, logoUrl, slug, className = "", size = "md", alt }: IpoLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  // Size styling map
  const sizeMap = {
    sm: "w-8 h-8 text-xs font-bold rounded-lg",
    md: "w-10 h-10 sm:w-11 sm:h-11 text-sm font-bold rounded-xl",
    lg: "w-12 h-12 sm:w-14 sm:h-14 text-base font-extrabold rounded-2xl",
    xl: "w-16 h-16 sm:w-20 sm:h-20 text-xl font-black rounded-2xl",
  };

  const initial = (name || "I").trim().charAt(0).toUpperCase();

  // Determine base image URL:
  // 1. If slug is present and logoUrl is data: URI, route through lazy cached API endpoint
  // 2. If logoUrl is already an external or local URL, use it directly
  // 3. If logoUrl is empty but slug is present, try the API endpoint
  let baseSrc: string | undefined;
  if (logoUrl) {
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://") || (logoUrl.startsWith("/") && !logoUrl.startsWith("/api/ipo-logo/"))) {
      baseSrc = logoUrl;
    } else if (slug) {
      baseSrc = `/api/ipo-logo/${slug}`;
    } else {
      baseSrc = logoUrl;
    }
  } else if (slug) {
    baseSrc = `/api/ipo-logo/${slug}`;
  }

  const currentSrc = baseSrc
    ? retryCount > 0
      ? `${baseSrc}${baseSrc.includes("?") ? "&" : "?"}r=${retryCount}`
      : baseSrc
    : undefined;

  const handleImageError = () => {
    if (retryCount < 2 && baseSrc) {
      // Retry after a short backoff (600ms, 1200ms)
      const nextRetry = retryCount + 1;
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(nextRetry);
      }, nextRetry * 600);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setImageError(false);
  };

  // If a valid image source exists and no permanent error
  if (currentSrc && !imageError) {
    return (
      <div
        className={`relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0 shadow-sm transition-transform ${sizeMap[size]} ${className}`}
      >
        <img
          src={currentSrc}
          alt={alt || `${name} Logo`}
          loading="lazy"
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-contain p-1.5 transition-opacity duration-200 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Skeleton placeholder while lazily loading */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-850 animate-pulse">
            <span className="text-slate-400 font-semibold text-xs select-none">{initial}</span>
          </div>
        )}
      </div>
    );
  }

  // Default Fallback: Gradient Circular/Rounded Badge with Initial Letter
  return (
    <div
      className={`relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm border border-white/20 transition-transform ${sizeMap[size]} ${className}`}
      title={name}
    >
      <span className="drop-shadow-sm select-none font-heading">{initial}</span>
    </div>
  );
}
