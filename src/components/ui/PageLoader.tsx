"use client";

import React from "react";
import { Sparkles, Activity } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  message = "Loading Live IPO Data...",
  subMessage = "Fetching real-time Grey Market Premiums, allotment updates & lot sizes",
  fullScreen = false,
}: PageLoaderProps) {
  const content = (
    <div className="relative flex flex-col items-center justify-center p-8 sm:p-10 text-center space-y-6 max-w-md mx-auto rounded-3xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-blue-500/5 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Glow Aura behind logo */}
      <div className="absolute top-10 w-32 h-32 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

      {/* Brand Logo Container with Glowing Spinner Ring */}
      <div className="relative flex items-center justify-center p-3">
        {/* Animated Gradient Ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 p-[2.5px] animate-spin opacity-80 blur-[1px]" />
        
        {/* Inner Glass Badge for Logo */}
        <div className="relative z-10 px-6 py-3.5 bg-white dark:bg-slate-950 rounded-[14px] border border-slate-100 dark:border-slate-800/90 shadow-xl flex items-center justify-center">
          <img
            src="/ipolistlogo.png"
            alt="IPO List Logo"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm animate-pulse"
          />
        </div>
      </div>

      {/* Message and Sub-message */}
      <div className="space-y-2 relative z-10">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-heading tracking-tight flex items-center justify-center gap-2">
          <span>{message}</span>
          <Sparkles className="w-4 h-4 text-blue-500 animate-bounce" />
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xs mx-auto">
          {subMessage}
        </p>
      </div>

      {/* Sleek Indeterminate Progress Shimmer */}
      <div className="w-56 h-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden relative">
        <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full animate-shimmer" 
             style={{
               animation: 'shimmerSlide 1.5s infinite ease-in-out'
             }} 
        />
      </div>

      <style jsx>{`
        @keyframes shimmerSlide {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}

