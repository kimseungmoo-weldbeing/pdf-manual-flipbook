'use client';

import React from 'react';
import { X, BookCheck, Layers } from 'lucide-react';

export interface ThumbnailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pages: string[];
  currentPage: number;
  onSelectPage: (pageIndex: number) => void;
  documentTitle?: string;
}

export function ThumbnailDrawer({
  isOpen,
  onClose,
  pages,
  currentPage,
  onSelectPage,
  documentTitle = 'PDF 매뉴얼',
}: ThumbnailDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 sm:w-96 bg-zinc-950/95 text-zinc-100 border-r border-zinc-800 shadow-2xl backdrop-blur-lg flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-sm truncate max-w-[200px]" title={documentTitle}>
            페이지 목차 ({pages.length}p)
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail List / Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <div className="grid grid-cols-2 gap-3">
          {pages.map((imgSrc, idx) => {
            const isCurrent = currentPage === idx || (currentPage % 2 === 0 && currentPage + 1 === idx);
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectPage(idx);
                  onClose();
                }}
                className={`group relative flex flex-col items-center rounded-lg border p-1.5 transition-all text-left cursor-pointer ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/50'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-800/80'
                }`}
              >
                <div className="w-full aspect-[1/1.414] bg-zinc-950 rounded overflow-hidden flex items-center justify-center relative shadow-sm">
                  <img
                    src={imgSrc}
                    alt={`Page ${idx + 1}`}
                    className="w-full h-full object-contain pointer-events-none group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  {isCurrent && (
                    <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow">
                      <BookCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="w-full mt-1.5 flex items-center justify-between text-[11px] px-1 font-mono text-zinc-400">
                  <span>P. {idx + 1}</span>
                  {idx === 0 && <span className="text-[9px] bg-zinc-800 px-1 py-0.2 rounded text-zinc-300">표지</span>}
                  {idx === pages.length - 1 && <span className="text-[9px] bg-zinc-800 px-1 py-0.2 rounded text-zinc-300">뒤표지</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
