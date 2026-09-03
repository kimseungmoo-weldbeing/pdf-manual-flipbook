'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  FileText,
  Play,
  Pause,
  UploadCloud,
  Grid
} from 'lucide-react';

export interface FlipBookToolbarProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onJumpToPage: (page: number) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  singlePageMode: boolean;
  onToggleSinglePage: () => void;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
  onOpenThumbnails: () => void;
  onOpenUpload: () => void;
  title?: string;
}

export function FlipBookToolbar({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onFirstPage,
  onLastPage,
  onJumpToPage,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullscreen,
  onToggleFullscreen,
  soundEnabled,
  onToggleSound,
  singlePageMode,
  onToggleSinglePage,
  autoPlay,
  onToggleAutoPlay,
  onOpenThumbnails,
  onOpenUpload,
  title,
}: FlipBookToolbarProps) {
  const [pageInput, setPageInput] = useState<string>('');

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onJumpToPage(pageNum - 1);
      setPageInput('');
    }
  };

  return (
    <div className="w-full bg-zinc-900/90 text-zinc-100 backdrop-blur-md border-t border-zinc-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xl select-none z-30">
      {/* Left section: Document Title & Thumbnail Drawer Button */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onOpenThumbnails}
          title="페이지 썸네일 목차 (T)"
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
        >
          <Grid className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">목차 / 썸네일</span>
        </button>

        <button
          onClick={onOpenUpload}
          title="새 PDF 업로드"
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer text-indigo-300"
        >
          <UploadCloud className="w-4 h-4" />
          <span className="hidden sm:inline">PDF 열기</span>
        </button>

        {title && (
          <div className="hidden lg:flex items-center gap-1.5 ml-2 text-xs text-zinc-400 truncate max-w-[200px]">
            <FileText className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
            <span className="truncate">{title}</span>
          </div>
        )}
      </div>

      {/* Middle section: Navigation Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onFirstPage}
          disabled={currentPage <= 0}
          title="처음으로"
          className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onPrevPage}
          disabled={currentPage <= 0}
          title="이전 페이지 (←)"
          className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-indigo-400" />
        </button>

        {/* Page status & Jump Form */}
        <form onSubmit={handlePageSubmit} className="flex items-center gap-1.5 text-xs">
          <input
            type="number"
            min={1}
            max={totalPages}
            placeholder={String(currentPage + 1)}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="w-12 text-center bg-zinc-800 border border-zinc-700 rounded px-1 py-1 text-zinc-200 focus:outline-none focus:border-indigo-500 text-xs font-mono"
          />
          <span className="text-zinc-500">/</span>
          <span className="text-zinc-400 font-mono text-xs">{totalPages}</span>
        </form>

        <button
          onClick={onNextPage}
          disabled={currentPage >= totalPages - 1}
          title="다음 페이지 (→)"
          className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-indigo-400" />
        </button>

        <button
          onClick={onLastPage}
          disabled={currentPage >= totalPages - 1}
          title="끝으로"
          className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right section: Zoom, View Mode, Sound, Autoplay, Fullscreen */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Zoom Controls */}
        <div className="flex items-center bg-zinc-800/80 rounded-lg p-0.5 border border-zinc-750">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 0.6}
            title="축소"
            className="p-1.5 hover:bg-zinc-700 rounded disabled:opacity-30 transition cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onResetZoom}
            title="배율 초기화 (100%)"
            className="px-2 text-[11px] font-mono text-zinc-300 hover:text-white transition cursor-pointer"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 2.0}
            title="확대"
            className="p-1.5 hover:bg-zinc-700 rounded disabled:opacity-30 transition cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Toggle (Single vs Double Page) */}
        <button
          onClick={onToggleSinglePage}
          title={singlePageMode ? '양면 보기로 전환' : '단면 보기로 전환'}
          className={`p-2 rounded-lg transition cursor-pointer ${
            singlePageMode ? 'bg-indigo-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* AutoPlay Toggle */}
        <button
          onClick={onToggleAutoPlay}
          title={autoPlay ? '자동 넘김 중지' : '자동 넘김 시작'}
          className={`p-2 rounded-lg transition cursor-pointer ${
            autoPlay ? 'bg-amber-600 text-white animate-pulse' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
          }`}
        >
          {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer text-zinc-300"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? '전체화면 종료 (Esc)' : '전체화면 (F)'}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer text-zinc-300"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
