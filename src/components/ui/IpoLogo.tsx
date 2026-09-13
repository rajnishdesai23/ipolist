"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";

interface IpoLogoProps {
  name: string;
  logoUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  alt?: string;
}

export function IpoLogo({ name, logoUrl, className = "", size = "md", alt }: IpoLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Size styling map
  const sizeMap = {
    sm: "w-8 h-8 text-xs font-bold rounded-lg",
    md: "w-10 h-10 sm:w-11 sm:h-11 text-sm font-bold rounded-xl",
    lg: "w-12 h-12 sm:w-14 sm:h-14 text-base font-extrabold rounded-2xl",
    xl: "w-16 h-16 sm:w-20 sm:h-20 text-xl font-black rounded-2xl",
  };

  const initial = (name || "I").trim().charAt(0).toUpperCase();

  // If valid logo URL exists and no loading error
  if (logoUrl && !imageError) {
    return (
      <div
        className={`relative bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0 shadow-sm transition-transform ${sizeMap[size]} ${className}`}
      >
        <img
          src={logoUrl}
          alt={alt || `${name} Logo`}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-1.5"
        />
      </div>
    );
  }

  // Default Fallback: Elegant Gradient Circular/Rounded Badge with Initial Letter
  return (
    <div
      className={`relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm border border-white/20 transition-transform ${sizeMap[size]} ${className}`}
      title={name}
    >
      <span className="drop-shadow-sm select-none font-heading">{initial}</span>
    </div>
  );
}
