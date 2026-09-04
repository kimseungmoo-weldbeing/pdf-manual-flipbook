# 2026-09-04 fix: 페이지 넘김 시 플립북 사라짐 버그 수정

## 문제
페이지를 넘길 때마다 3D 플립북이 UI에서 사라지는 현상이 발생했다.

## 원인
1. `page.tsx`의 `onPageChange` 인라인 콜백이 `currentPage` state를 갱신하면서 부모가 리렌더되고, 콜백 참조가 매번 바뀜.
2. `FlipBook.tsx`의 `useEffect` 의존성 배열에 `onPageChange`, `onInit`이 포함되어 페이지 넘김마다 effect cleanup(`destroy()`)이 실행됨.
3. `page-flip`의 `destroy()`가 `this.block.remove()`를 호출해 React가 관리하던 DOM 노드(`bookElementRef`)가 트리에서 분리됨. 재실행된 effect는 고아 노드에 canvas를 그려 화면에 책이 보이지 않음.
4. `containerRef`의 `onClick`이 버블링을 막지 않아 책 내부 클릭과 배경 클릭 넘김이 겹침.

## 수정 내용
### `src/components/FlipBook.tsx`
- `onPageChangeRef`, `onInitRef`로 콜백을 ref에 보관하고 effect 의존성에서 제외.
- `currentPageRef`로 현재 페이지를 추적하고, `PageFlip` 생성 시 `startPage` 옵션으로 모드 전환 시 페이지 위치 유지.
- `document.createElement('div')`로 PageFlip 전용 DOM 노드를 동적 생성해 `containerRef`에 append. `destroy()`로 해당 노드만 제거되도록 React 컨테이너와 격리.
- React JSX의 `bookElementRef` div 제거.
- `containerRef` `onClick`에 `e.target !== containerRef.current` 가드를 추가해 배경 클릭 시에만 좌/우 넘김 동작.

### `src/types/page-flip.d.ts`
- 라이브러리 실제 옵션과 맞추기 위해 `PageFlipOptions`에 `startPage?: number` 추가.

## 검증
- `npx tsc --noEmit` 통과
- 개발 서버 `http://localhost:3847` HTTP 200 응답 확인
