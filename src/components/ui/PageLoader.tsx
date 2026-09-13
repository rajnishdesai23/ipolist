"use client";

import React from "react";
import { TrendingUp, Loader2, Sparkles } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  message = "Loading Live IPO Intelligence...",
  subMessage = "Fetching real-time Grey Market Premiums, allotment updates & market lot sizes",
  fullScreen = false,
}: PageLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-5 animate-in fade-in duration-300">
      {/* Animated Glowing Ring Spinner with Icon */}
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-spin blur-md opacity-70" />
        
        {/* Middle spinning border ring */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-500 animate-spin" />

        {/* Inner Glass Box with Pulsing Icon */}
        <div className="absolute w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
            <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Text Container */}
      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-heading tracking-tight flex items-center justify-center gap-1.5">
          <span>{message}</span>
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-bounce" />
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {subMessage}
        </p>
      </div>

      {/* Shimmer Bar Progress Indicator */}
      <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
        <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-pulse" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
