/**
 * 상단 고정 진행 바 컴포넌트
 * DESIGN.md - Secondary Ochre (#fc8f34), 4px 높이, 뷰포트 최상단 고정
 * @param {number} progress - 0~100 사이의 진행률
 */
export default function ProgressBar({ progress }) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-surface-container-high">
      <div
        className="h-full bg-secondary-container transition-all duration-700 ease-out"
        style={{ width: `${clampedProgress}%` }}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`학습 진행률 ${clampedProgress}%`}
      />
    </div>
  );
}
