# 2026-09-03 feat: PDF 매뉴얼 플립북 뷰어 구현

## 작업 개요
- 실제 책을 넘기는 듯한 인터랙티브 3D 플립북 형태로 PDF 매뉴얼을 열람할 수 있는 웹 뷰어 애플리케이션 개발

## 주요 변경 사항
1. **Next.js 16 + React 19 + Tailwind CSS 기반 프로젝트 구축**
2. **PDF 렌더링 엔진 (`src/lib/pdf-loader.ts`)**:
   - `pdfjs-dist`를 활용하여 브라우저에서 직접 PDF 페이지를 캔버스 고해상도 이미지로 변환
   - `public/pdfjs/pdf.worker.min.mjs` 워커 스크립트 번들링
3. **플립북 코어 (`src/components/FlipBook.tsx`)**:
   - `page-flip` 라이브러리를 연동하여 3D 종이 넘김 효과, 그림자, 하드커버/소프트페이지 물리 구현
   - 마우스 드래그, 모서리 넘김, 키보드 단축키 네비게이션 연동
4. **책장 넘김 사운드 (`src/lib/sound-effects.ts`)**:
   - Web Audio API 필터 및 화이트 노이즈 감쇠를 통한 사운드 효과음 합성
5. **툴바 및 컨트롤러 (`src/components/FlipBookToolbar.tsx`, `ThumbnailDrawer.tsx`, `UploadModal.tsx`)**:
   - 확대/축소 (Zoom), 단면/양면 보기 토글, 자동 재생(Auto-play), 전체화면, 페이지 직접 입력 점프
   - 사이드 썸네일 목차 서랍 및 로컬 PDF 파일 드래그앤드롭 업로드 모달 제공
6. **데모 매뉴얼 제공 (`scripts/generate-sample-pdf.mjs`, `public/sample-manual.pdf`)**:
   - 총 10페이지 분량의 스마트 디바이스 사용자 매뉴얼 PDF 기본 탑재
7. **Git 계정 설정**:
   - `kimseungmoo-weldbeing` 계정으로 로컬 git 작성자 설정 적용

