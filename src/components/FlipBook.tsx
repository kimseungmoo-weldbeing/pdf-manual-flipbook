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
  const pageFlipInstanceRef = useRef<PageFlip | null>(null);
  const bookHostRef = useRef<HTMLDivElement | null>(null);

  const onPageChangeRef = useRef(onPageChange);
  const onInitRef = useRef(onInit);
  const currentPageRef = useRef(0);
  const prevPagesRef = useRef(pages);

  onPageChangeRef.current = onPageChange;
  onInitRef.current = onInit;

  if (prevPagesRef.current !== pages) {
    currentPageRef.current = 0;
    prevPagesRef.current = pages;
  }

  useImperativeHandle(ref, () => ({
    pageFlip: () => pageFlipInstanceRef.current,
    flipNext: () => {
      pageFlipInstanceRef.current?.flipNext();
    },
    flipPrev: () => {
      pageFlipInstanceRef.current?.flipPrev();
    },
    flipToPage: (pageIndex: number) => {
      pageFlipInstanceRef.current?.flip(pageIndex);
    },
    getCurrentPage: () => {
      return pageFlipInstanceRef.current ? pageFlipInstanceRef.current.getCurrentPageIndex() : 0;
    },
    getPageCount: () => {
      return pageFlipInstanceRef.current ? pageFlipInstanceRef.current.getPageCount() : 0;
    },
  }));

  useEffect(() => {
    if (!containerRef.current || pages.length === 0) return;

    if (pageFlipInstanceRef.current) {
      try {
        pageFlipInstanceRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying pageFlip instance:', e);
      }
      pageFlipInstanceRef.current = null;
    }

    bookHostRef.current = null;

    const bookElement = document.createElement('div');
    bookElement.className = 'flip-book shadow-2xl rounded-sm mx-auto cursor-pointer';
    containerRef.current.appendChild(bookElement);
    bookHostRef.current = bookElement;

    const pageFlip = new PageFlip(bookElement, {
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
      startPage: currentPageRef.current,
    });

    pageFlipInstanceRef.current = pageFlip;

    pageFlip.on('flip', (e: { data: number }) => {
      currentPageRef.current = e.data;
      soundEffects.playFlip();
      onPageChangeRef.current?.(e.data);
    });

    pageFlip.on('init', () => {
      onInitRef.current?.(pages.length);
    });

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
      if (isCancelled || !bookHostRef.current) return;
      console.log('[FlipBook] Loading pages into PageFlip, count:', pages.length);
      pageFlip.loadFromImages(pages);
      console.log('[FlipBook] loadFromImages complete');
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
      bookHostRef.current = null;
    };
  }, [pages, width, height, singlePageMode]);

  return (
    <div
      ref={containerRef}
      className="flipbook-container flex items-center justify-center w-full h-full p-2 select-none overflow-hidden relative"
      onClick={(e) => {
        if (e.target !== containerRef.current) return;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width / 2) {
          pageFlipInstanceRef.current?.flipPrev();
        } else {
          pageFlipInstanceRef.current?.flipNext();
        }
      }}
    />
  );
});
