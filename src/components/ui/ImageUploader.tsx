"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Link as LinkIcon, Loader2, RefreshCw, Check } from "lucide-react";
import { uploadImageToStorage } from "@/lib/firebase/storage";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
  defaultFallback?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "ipos",
  label = "Image Upload / Direct URL",
  placeholder = "PNG, JPG, WEBP or SVG (Max 5MB)",
}: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const url = await uploadImageToStorage(file, folder);
      onChange(url);
    } catch (err: any) {
      setError(err?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setError(null);
    onChange(urlInput.trim());
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    setError(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">{label}</label>}

        {/* Tab Switcher */}
        {!value && (
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                activeTab === "upload"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                activeTab === "url"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              <span>Direct URL</span>
            </button>
          </div>
        )}
      </div>

      {value ? (
        <div className="relative group bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={value}
                alt="Preview"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">
                {value.startsWith("data:") ? "Uploaded Base64 Image" : value.startsWith("http") ? "Image URL Set" : "Image Set"}
              </span>
              <span className="text-[11px] text-slate-400 block truncate max-w-xs">{value}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
              title="Change Image File"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Change</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
              title="Remove Image (Use Default)"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      ) : activeTab === "upload" ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-950/60 hover:bg-slate-900/60 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-blue-400 py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs font-bold">Uploading to Firebase Storage...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 py-1">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">Click to Select or Drag Image</span>
              <span className="text-[11px] text-slate-500">{placeholder}</span>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleApplyUrl} className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste direct image URL (https://...)"
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply URL</span>
          </button>
        </form>
      )}

      {error && <p className="text-[11px] text-red-400 font-medium mt-1">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
