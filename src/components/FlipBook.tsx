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

    const pageFlip = new PageFlip(bookElementRef.current, {
      width,
      height,
      size: 'fixed',
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

    // Preload all page images before loading into PageFlip
    let isCancelled = false;
    const preloadPromises = pages.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });
    });

    Promise.all(preloadPromises).then(() => {
      if (isCancelled || !bookElementRef.current) return;
      pageFlip.loadFromImages(pages);
    });

    return () => {
      isCancelled = true;
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
      className="flipbook-container flex items-center justify-center w-full h-full p-2 select-none overflow-hidden"
    >
      <div
        ref={bookElementRef}
        className="flip-book shadow-2xl rounded-sm mx-auto"
        style={{ width: `${width * 2}px`, maxWidth: '100%', height: `${height}px` }}
      />
    </div>
  );
});
