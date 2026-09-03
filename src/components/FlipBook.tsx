'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { PageFlip } from 'page-flip';
import { soundEffects } from '@/lib/sound-effects';

export interface FlipBookProps {
  pages: string[]; // Page images (data URLs or URLs)
  width?: number;
  height?: number;
  onPageChange?: (pageIndex: number) => void;
  onInit?: (pageCount: number) => void;
  singlePageMode?: boolean;
}

export interface FlipBookHandle {
  pageFlip: () => PageFlip | null;
  flipNext: () => void;
  flipPrev: () => void;
  flipToPage: (pageIndex: number) => void;
  getCurrentPage: () => number;
  getPageCount: () => number;
}

export const FlipBook = forwardRef<FlipBookHandle, FlipBookProps>(function FlipBook(
  { pages, width = 500, height = 700, onPageChange, onInit, singlePageMode = false },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookElementRef = useRef<HTMLDivElement>(null);
  const pageFlipInstanceRef = useRef<PageFlip | null>(null);

  useImperativeHandle(ref, () => ({
    pageFlip: () => pageFlipInstanceRef.current,
    flipNext: () => {
      if (pageFlipInstanceRef.current) {
        pageFlipInstanceRef.current.flipNext();
      }
    },
    flipPrev: () => {
      if (pageFlipInstanceRef.current) {
        pageFlipInstanceRef.current.flipPrev();
      }
    },
    flipToPage: (pageIndex: number) => {
      if (pageFlipInstanceRef.current) {
        pageFlipInstanceRef.current.flip(pageIndex);
      }
    },
    getCurrentPage: () => {
      return pageFlipInstanceRef.current ? pageFlipInstanceRef.current.getCurrentPageIndex() : 0;
    },
    getPageCount: () => {
      return pageFlipInstanceRef.current ? pageFlipInstanceRef.current.getPageCount() : 0;
    },
  }));

  useEffect(() => {
    if (!bookElementRef.current || pages.length === 0) return;

    // Clean up previous instance
    if (pageFlipInstanceRef.current) {
      try {
        pageFlipInstanceRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying pageFlip instance:', e);
      }
      pageFlipInstanceRef.current = null;
    }

    // Reset container HTML
    bookElementRef.current.innerHTML = '';

    // Create page elements
    pages.forEach((src, idx) => {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'flipbook-page bg-white shadow-md overflow-hidden relative select-none';
      pageDiv.dataset.density = (idx === 0 || idx === pages.length - 1) ? 'hard' : 'soft';

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Page ${idx + 1}`;
      img.className = 'w-full h-full object-contain pointer-events-none';
      img.loading = 'eager';

      // Page number badge on bottom corner
      const badge = document.createElement('div');
      badge.className = `absolute bottom-2 ${idx % 2 === 0 ? 'left-3' : 'right-3'} text-[11px] font-mono text-zinc-500 bg-white/80 px-2 py-0.5 rounded shadow-xs backdrop-blur-xs select-none pointer-events-none`;
      badge.textContent = `${idx + 1}`;

      pageDiv.appendChild(img);
      pageDiv.appendChild(badge);
      bookElementRef.current?.appendChild(pageDiv);
    });

    const pageFlip = new PageFlip(bookElementRef.current, {
      width,
      height,
      size: 'stretch',
      minWidth: 320,
      maxWidth: 1000,
      minHeight: 450,
      maxHeight: 1400,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: singlePageMode,
      flippingTime: 700,
      drawShadow: true,
      useMouseEvents: true,
    });

    pageFlipInstanceRef.current = pageFlip;

    const pageElements = bookElementRef.current.querySelectorAll<HTMLElement>('.flipbook-page');
    pageFlip.loadFromHTML(Array.from(pageElements));

    pageFlip.on('flip', (e: { data: number }) => {
      soundEffects.playFlip();
      if (onPageChange) {
        onPageChange(e.data);
      }
    });

    pageFlip.on('init', () => {
      if (onInit) {
        onInit(pages.length);
      }
    });

    return () => {
      if (pageFlipInstanceRef.current) {
        try {
          pageFlipInstanceRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        pageFlipInstanceRef.current = null;
      }
    };
  }, [pages, width, height, singlePageMode, onPageChange, onInit]);

  return (
    <div
      ref={containerRef}
      className="flipbook-container flex items-center justify-center w-full h-full p-2 select-none"
    >
      <div ref={bookElementRef} className="flip-book shadow-2xl rounded-sm overflow-hidden" />
    </div>
  );
});
