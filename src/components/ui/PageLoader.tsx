"use client";

import React from "react";

interface PageLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  message = "Loading...",
  subMessage,
  fullScreen = false,
}: PageLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in fade-in duration-200">
      {/* Simple, sleek circular spinner ring — NO logo */}
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-500 animate-spin" />
      
      {message && (
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {message}
        </p>
      )}
      {subMessage && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs">
          {subMessage}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
}


