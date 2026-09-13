"use client";

import React, { useState } from "react";
import { X, ExternalLink, Search, CheckCircle2 } from "lucide-react";
import { IPO } from "@/types/ipo";

interface AllotmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipo: IPO;
}

export function AllotmentModal({ isOpen, onClose, ipo }: AllotmentModalProps) {
  const [panNumber, setPanNumber] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Registrar Allotment
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {ipo.name} Allotment Check
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs space-y-1">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">Official Registrar</span>
          <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
            {ipo.registrar?.name || "Official Registrar"}
          </span>
          {ipo.dates?.allotment && (
            <span className="text-[11px] text-slate-500 block">
              Tentative Allotment Date: <strong>{ipo.dates.allotment}</strong>
            </span>
          )}
        </div>

        {ipo.registrar?.website && (
          <a
            href={ipo.registrar.website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md"
          >
            <span>Open Registrar Allotment Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
