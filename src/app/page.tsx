'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlipBook, FlipBookHandle } from '@/components/FlipBook';
import { FlipBookToolbar } from '@/components/FlipBookToolbar';
import { ThumbnailDrawer } from '@/components/ThumbnailDrawer';
import { UploadModal } from '@/components/UploadModal';
import { loadAndRenderPdf } from '@/lib/pdf-loader';
import { soundEffects } from '@/lib/sound-effects';
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react';

export default function FlipBookViewerPage() {
  const flipBookRef = useRef<FlipBookHandle>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const [pages, setPages] = useState<string[]>([]);
  const [documentTitle, setDocumentTitle] = useState<string>('스마트 디바이스 사용자 매뉴얼');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [singlePageMode, setSinglePageMode] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  // Modals & Panels
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<{ loaded: number; total: number }>({ loaded: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load PDF helper
  const loadPdfSource = useCallback(async (source: string | ArrayBuffer, title: string = '사용자 매뉴얼') => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingProgress({ loaded: 0, total: 0 });

    try {
      const result = await loadAndRenderPdf(source, (loaded, total) => {
        setLoadingProgress({ loaded, total });
      });

      const pageUrls = result.pages.map((p) => p.dataUrl);
      setPages(pageUrls);
      setDocumentTitle(result.title || title);
      setCurrentPage(0);
    } catch (err) {
      console.error('Failed to load PDF:', err);
      setErrorMessage('PDF 파일을 읽어 렌더링하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load with default sample manual
  useEffect(() => {
    loadPdfSource('/sample-manual.pdf', 'PRO-FLIP-2026 사용자 매뉴얼');
  }, [loadPdfSource]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        flipBookRef.current?.flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        flipBookRef.current?.flipPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        flipBookRef.current?.flipToPage(0);
      } else if (e.key === 'End' && pages.length > 0) {
        e.preventDefault();
        flipBookRef.current?.flipToPage(pages.length - 1);
      } else if (e.key.toLowerCase() === 't') {
        setIsThumbnailsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pages.length]);

  // AutoPlay timer
  useEffect(() => {
    if (!autoPlay || pages.length === 0) return;

    const interval = setInterval(() => {
      const current = flipBookRef.current?.getCurrentPage() ?? 0;
      if (current >= pages.length - 1) {
        setAutoPlay(false);
      } else {
        flipBookRef.current?.flipNext();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay, pages.length]);

  // Fullscreen change handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(2.0, Number((z + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))));
  const handleResetZoom = () => setZoom(1.0);

  // Sound toggle
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundEffects.setEnabled(nextVal);
  };

  return (
    <div
      ref={mainContainerRef}
      className="relative w-screen h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 flex flex-col overflow-hidden select-none"
    >
      {/* Top Brand Bar */}
      <header className="h-12 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-5 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              PDF 매뉴얼 플립북
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-normal hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> 3D Page Flip
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="truncate max-w-[240px] sm:max-w-md font-medium text-zinc-300">
            {documentTitle}
          </span>
        </div>
      </header>

      {/* Main Flipbook Canvas Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-2 sm:p-6 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-2xl max-w-sm">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <h3 className="text-sm font-semibold text-zinc-200">PDF 매뉴얼을 로딩하는 중입니다</h3>
            <p className="text-xs text-zinc-400 mt-1">
              페이지를 고해상도 3D 플립북으로 변환하고 있습니다.
            </p>
            {loadingProgress.total > 0 && (
              <div className="w-full mt-4 bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-2 transition-all duration-200 rounded-full"
                  style={{ width: `${(loadingProgress.loaded / loadingProgress.total) * 100}%` }}
                />
              </div>
            )}
            <span className="text-[11px] font-mono text-indigo-400 mt-2">
              {loadingProgress.loaded} / {loadingProgress.total} 페이지
            </span>
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900/80 rounded-2xl border border-red-900/40 max-w-md">
            <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-200">불러오기 실패</h3>
            <p className="text-xs text-red-300 mt-1 mb-4">{errorMessage}</p>
            <button
              onClick={() => loadPdfSource('/sample-manual.pdf', 'PRO-FLIP-2026 사용자 매뉴얼')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition cursor-pointer"
            >
              기본 데모 매뉴얼 다시 열기
            </button>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <FlipBook
              ref={flipBookRef}
              pages={pages}
              width={480}
              height={680}
              singlePageMode={singlePageMode}
              onPageChange={(newPageIndex) => {
                setCurrentPage(newPageIndex);
              }}
            />
          </div>
        )}

        {/* Ambient Left/Right quick nav buttons for click/tap */}
        {!isLoading && pages.length > 0 && (
          <>
            <button
              onClick={() => flipBookRef.current?.flipPrev()}
              disabled={currentPage <= 0}
              title="이전 페이지 (클릭/드래그)"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/70 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-750 backdrop-blur-md shadow-xl transition disabled:opacity-0 disabled:pointer-events-none cursor-pointer hidden md:flex items-center justify-center group"
            >
              <span className="text-lg font-bold group-hover:-translate-x-0.5 transition-transform">‹</span>
            </button>
            <button
              onClick={() => flipBookRef.current?.flipNext()}
              disabled={currentPage >= pages.length - 1}
              title="다음 페이지 (클릭/드래그)"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/70 hover:bg-zinc-800/90 text-zinc-300 hover:text-white border border-zinc-750 backdrop-blur-md shadow-xl transition disabled:opacity-0 disabled:pointer-events-none cursor-pointer hidden md:flex items-center justify-center group"
            >
              <span className="text-lg font-bold group-hover:translate-x-0.5 transition-transform">›</span>
            </button>
          </>
        )}
      </main>

      {/* Bottom Viewer Toolbar */}
      {!isLoading && pages.length > 0 && (
        <FlipBookToolbar
          currentPage={currentPage}
          totalPages={pages.length}
          onPrevPage={() => flipBookRef.current?.flipPrev()}
          onNextPage={() => flipBookRef.current?.flipNext()}
          onFirstPage={() => flipBookRef.current?.flipToPage(0)}
          onLastPage={() => flipBookRef.current?.flipToPage(pages.length - 1)}
          onJumpToPage={(p) => flipBookRef.current?.flipToPage(p)}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          singlePageMode={singlePageMode}
          onToggleSinglePage={() => setSinglePageMode((prev) => !prev)}
          autoPlay={autoPlay}
          onToggleAutoPlay={() => setAutoPlay((prev) => !prev)}
          onOpenThumbnails={() => setIsThumbnailsOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          title={documentTitle}
        />
      )}

      {/* Thumbnail Drawer Sidebar */}
      <ThumbnailDrawer
        isOpen={isThumbnailsOpen}
        onClose={() => setIsThumbnailsOpen(false)}
        pages={pages}
        currentPage={currentPage}
        onSelectPage={(pageIdx) => flipBookRef.current?.flipToPage(pageIdx)}
        documentTitle={documentTitle}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        isLoading={isLoading}
        loadingProgress={loadingProgress}
        onFileLoaded={(buffer, fileName) => {
          setIsUploadOpen(false);
          loadPdfSource(buffer, fileName.replace(/\.pdf$/i, ''));
        }}
        onLoadSample={() => {
          loadPdfSource('/sample-manual.pdf', 'PRO-FLIP-2026 사용자 매뉴얼');
        }}
      />
    </div>
  );
}
