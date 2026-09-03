'use client';

import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileLoaded: (fileData: ArrayBuffer, fileName: string) => void;
  onLoadSample: () => void;
  isLoading: boolean;
  loadingProgress?: { loaded: number; total: number };
}

export function UploadModal({
  isOpen,
  onClose,
  onFileLoaded,
  onLoadSample,
  isLoading,
  loadingProgress,
}: UploadModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setError(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('PDF 파일(.pdf)만 업로드할 수 있습니다.');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      onFileLoaded(buffer, file.name);
    } catch {
      setError('파일을 읽는 도중 오류가 발생했습니다.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-zinc-50 flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-400" />
          PDF 매뉴얼 열기
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          컴퓨터에 보관된 PDF 매뉴얼을 불러와 3D 플립북으로 감상하세요.
        </p>

        {isLoading ? (
          <div className="my-8 flex flex-col items-center justify-center py-6">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-zinc-200">PDF 페이지를 렌더링하고 있습니다...</p>
            {loadingProgress && loadingProgress.total > 0 && (
              <p className="text-xs text-indigo-400 mt-2 font-mono">
                {loadingProgress.loaded} / {loadingProgress.total} 페이지 완료
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-5 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-950/20 scale-[0.99]'
                  : 'border-zinc-700 bg-zinc-950/40 hover:border-zinc-500 hover:bg-zinc-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <FileText className="w-10 h-10 text-indigo-400 mb-3" />
              <p className="text-sm font-medium text-zinc-200 text-center">
                PDF 파일을 이 곳으로 드래그하거나 클릭하여 선택
              </p>
              <p className="text-xs text-zinc-500 mt-1">최대 권장 크기 50MB</p>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-red-950/50 border border-red-800/50 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">PDF 파일이 없으신가요?</span>
              <button
                type="button"
                onClick={() => {
                  onLoadSample();
                  onClose();
                }}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                기본 데모 매뉴얼 불러오기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
