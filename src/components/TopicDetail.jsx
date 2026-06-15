import { useState } from 'react';
import { ArrowLeft, Plus, Brain, Clock, BookOpen, ArrowUpDown, ChevronUp, ChevronDown, Check } from 'lucide-react';
import SceneCard from './SceneCard';
import AddSceneModal from './AddSceneModal';

export default function TopicDetail({
  topic, history, onBack, onStartReview,
  onAddScene, onEditScene, onDeleteScene, onReorderScenes,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  // 순서 편집 모드 여부
  const [reorderMode, setReorderMode] = useState(false);
  // 순서 편집 중 로컬 배열 (저장 전 임시)
  const [draftScenes, setDraftScenes] = useState([]);

  const topicHistory = history
    .filter((h) => h.topicId === topic.id)
    .sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));
  const latestReview = topicHistory[0] ?? null;
  const sortedScenes = [...topic.scenes].sort((a, b) => a.order - b.order);

  const getNodeStatus = (index, total) => {
    if (total === 1) return 'current';
    if (index === total - 1) return 'current';
    return 'completed';
  };

  /* ── 순서 편집 진입 ── */
  const handleEnterReorder = () => {
    setDraftScenes([...sortedScenes]);
    setReorderMode(true);
  };

  /* ── 위/아래 이동 ── */
  const move = (index, dir) => {
    const next = [...draftScenes];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    // order 값 갱신
    setDraftScenes(next.map((s, i) => ({ ...s, order: i + 1 })));
  };

  /* ── 저장 ── */
  const handleSaveReorder = () => {
    onReorderScenes(draftScenes);
    setReorderMode(false);
  };

  /* ── 취소 ── */
  const handleCancelReorder = () => {
    setReorderMode(false);
    setDraftScenes([]);
  };

  const displayScenes = reorderMode ? draftScenes : sortedScenes;

  return (
    <div className="pt-1 min-h-screen bg-[#f7f6f3]">
      {/* 헤더 */}
      <header className="bg-[#f7f6f3] border-b border-[#e0ddd8] sticky top-1 z-40">
        <div className="max-w-container mx-auto px-6 md:px-10 py-5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-[#767683] hover:text-[#1a237e] transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            전체 주제
          </button>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#1a1a1a] leading-tight">
                {topic.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#767683]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {topic.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {topic.scenes.length}개 장면
                </span>
                {latestReview && (
                  <span className="font-medium text-[#944a00]">
                    최근 복습 {latestReview.score}점
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {/* 순서 편집 모드가 아닐 때 */}
              {!reorderMode ? (
                <>
                  {sortedScenes.length > 1 && (
                    <button
                      onClick={handleEnterReorder}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e0ddd8] text-[#767683] text-xs font-medium hover:border-[#1a237e] hover:text-[#1a237e] transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      <span className="hidden sm:inline">순서 편집</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1a237e] text-[#1a237e] text-xs font-medium hover:bg-[#1a237e] hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="hidden sm:inline">장면 추가</span>
                  </button>
                  {sortedScenes.length > 0 && (
                    <button
                      onClick={onStartReview}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a237e] text-white text-xs font-medium hover:bg-[#000666] transition-colors"
                    >
                      <Brain className="w-3 h-3" />
                      복습 시작
                    </button>
                  )}
                </>
              ) : (
                /* 순서 편집 모드일 때 — 취소 / 저장 */
                <>
                  <button
                    onClick={handleCancelReorder}
                    className="px-3 py-1.5 border border-[#e0ddd8] text-[#767683] text-xs font-medium hover:bg-[#f7f6f3] transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveReorder}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a237e] text-white text-xs font-medium hover:bg-[#000666] transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    순서 저장
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 순서 편집 모드 안내 바 */}
        {reorderMode && (
          <div className="border-t border-[#e0ddd8] bg-[#f0ede8]">
            <div className="max-w-container mx-auto px-6 md:px-10 py-2 text-xs text-[#767683]">
              ↕ 각 장면의 위·아래 버튼을 눌러 순서를 조정하세요. 완료 후 <span className="font-medium text-[#1a237e]">순서 저장</span>을 누르세요.
            </div>
          </div>
        )}
      </header>

      {/* 타임라인 본문 */}
      <main className="max-w-container mx-auto px-6 md:px-10 py-10">
        {displayScenes.length === 0 ? (
          <EmptyScenes onAdd={() => setShowAddModal(true)} />
        ) : (
          <div className="relative">
            {/* 타임라인 수직선 — 순서 편집 모드에서는 숨김 */}
            {!reorderMode && (
              <div className="absolute left-3 top-5 bottom-5 w-px bg-[#e0ddd8]" aria-hidden="true" />
            )}

            <div className="space-y-0">
              {displayScenes.map((scene, index) =>
                reorderMode ? (
                  /* ── 순서 편집 행 ── */
                  <ReorderRow
                    key={scene.id}
                    scene={scene}
                    index={index}
                    total={displayScenes.length}
                    onMoveUp={() => move(index, -1)}
                    onMoveDown={() => move(index, 1)}
                  />
                ) : (
                  /* ── 일반 SceneCard ── */
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    nodeStatus={getNodeStatus(index, displayScenes.length)}
                    animationDelay={index * 70}
                    onEdit={(sceneData) => onEditScene(scene.id, sceneData)}
                    onDelete={() => onDeleteScene(scene.id)}
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* 복습 이력 */}
        {!reorderMode && topicHistory.length > 0 && (
          <div className="mt-14 pt-8 border-t border-[#e0ddd8]">
            <h2 className="font-serif text-base font-semibold text-[#1a1a1a] mb-4">복습 이력</h2>
            <div className="space-y-1.5">
              {topicHistory.slice(0, 5).map((h, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-white border border-[#e0ddd8]">
                  <span className="text-xs text-[#767683]">
                    {new Date(h.reviewedAt).toLocaleString('ko-KR', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  <span className={`text-xs font-semibold ${
                    h.score >= 80 ? 'text-[#2d6a4f]' :
                    h.score >= 50 ? 'text-[#944a00]' : 'text-[#ba1a1a]'
                  }`}>
                    {h.score}점
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showAddModal && (
        <AddSceneModal onAdd={onAddScene} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

/* ── 순서 편집 모드용 행 컴포넌트 ── */
function ReorderRow({ scene, index, total, onMoveUp, onMoveDown }) {
  return (
    <div className="flex items-center gap-3 py-2 scene-card-enter">
      {/* 순서 번호 */}
      <div className="w-7 h-7 flex items-center justify-center shrink-0 border border-[#e0ddd8] bg-white text-[11px] font-semibold text-[#1a237e]">
        {scene.order}
      </div>

      {/* 장면 요약 */}
      <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white border border-[#e0ddd8] min-w-0">
        {/* 썸네일 */}
        {scene.image ? (
          <img
            src={scene.image}
            alt=""
            className="w-10 h-10 object-cover shrink-0 border border-[#e0ddd8]"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="w-10 h-10 shrink-0 bg-[#e8e5f0] border border-[#e0ddd8]" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1a1a1a] truncate">{scene.title}</p>
          {scene.keywords.length > 0 && (
            <p className="text-[11px] text-[#767683] truncate mt-0.5">
              {scene.keywords.slice(0, 3).join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* 위/아래 버튼 */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="w-7 h-7 flex items-center justify-center border border-[#e0ddd8] bg-white text-[#767683] hover:border-[#1a237e] hover:text-[#1a237e] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="위로 이동"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="w-7 h-7 flex items-center justify-center border border-[#e0ddd8] bg-white text-[#767683] hover:border-[#1a237e] hover:text-[#1a237e] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="아래로 이동"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function EmptyScenes({ onAdd }) {
  return (
    <div className="py-24 text-center">
      <p className="font-serif text-4xl text-[#e0ddd8] mb-6">◦</p>
      <h3 className="font-serif text-lg text-[#1a1a1a] mb-2">아직 장면이 없어요</h3>
      <p className="text-sm text-[#767683] mb-8">학습 내용을 장면으로 기록하면 한눈에 흐름을 볼 수 있어요.</p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1a237e] text-[#1a237e] text-sm font-medium hover:bg-[#1a237e] hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        첫 번째 장면 추가하기
      </button>
    </div>
  );
}
