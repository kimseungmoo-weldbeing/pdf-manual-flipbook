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

  const flipBookRef = useRef<FlipBookHandle>(null);

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
      size: 'stretch',
      minWidth: 320,
      maxWidth: 1000,
      minHeight: 450,
      maxHeight: 1400,
      maxShadowOpacity: 0.5,
      showCover: true,
      autoSize: true,
      mobileScrollSupport: false,
      usePortrait: singlePageMode,
      flippingTime: 700,
      drawShadow: true,
      useMouseEvents: true,
      showPageCorners: true,
      disableFlipByClick: false,
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
      console.log('[FlipBook] Loading pages into PageFlip, count:', pages.length);
      pageFlip.loadFromImages(pages);
      console.log('[FlipBook] loadFromImages complete');
      // Ensure canvas draws immediately
      requestAnimationFrame(() => {
        try {
          pageFlip.update();
        } catch {
          // ignore
        }
      });
      setTimeout(() => {
        try {
          pageFlip.update();
        } catch {
          // ignore
        }
      }, 50);
      setTimeout(() => {
        try {
          pageFlip.update();
        } catch {
          // ignore
        }
      }, 200);
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
      className="flipbook-container flex items-center justify-center w-full h-full p-2 select-none overflow-hidden relative"
      onClick={(e) => {
        // Fallback click on left/right half to turn pages if click wasn't consumed
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width / 2) {
          pageFlipInstanceRef.current?.flipPrev();
        } else {
          pageFlipInstanceRef.current?.flipNext();
        }
      }}
    >
      <div
        ref={bookElementRef}
        className="flip-book shadow-2xl rounded-sm mx-auto cursor-pointer"
      />
    </div>
  );
});
