import * as pdfjsLib from 'pdfjs-dist';

// Use local worker script served from public/pdfjs
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
}

export interface RenderedPdfPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface PdfDocumentInfo {
  numPages: number;
  title?: string;
  pages: RenderedPdfPage[];
}

export async function loadAndRenderPdf(
  source: string | ArrayBuffer | Uint8Array,
  onProgress?: (loaded: number, total: number) => void,
  renderScale: number = 2.0
): Promise<PdfDocumentInfo> {
  const loadingTask = pdfjsLib.getDocument(
    typeof source === 'string' ? source : { data: source }
  );

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const pages: RenderedPdfPage[] = [];

  let metaTitle: string | undefined;
  try {
    const meta = await pdfDoc.getMetadata();
    if (meta?.info && typeof meta.info === 'object' && 'Title' in meta.info) {
      metaTitle = (meta.info as { Title?: string }).Title;
    }
  } catch (err) {
    console.warn('Could not extract PDF metadata:', err);
  }

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Fill white background before rendering
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
      intent: 'display',
    }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    pages.push({
      pageNumber: pageNum,
      dataUrl,
      width: viewport.width,
      height: viewport.height,
      aspectRatio: viewport.width / viewport.height,
    });

    if (onProgress) {
      onProgress(pageNum, numPages);
    }
  }

  return {
    numPages,
    title: metaTitle,
    pages,
  };
}
