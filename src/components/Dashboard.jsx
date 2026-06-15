import { useState } from 'react';
import { Plus, BookOpen, Clock, Brain, Trash2, Bell, Pencil, X } from 'lucide-react';
import AddTopicModal from './AddTopicModal';
import { getReviewStatuses, getDueCount, getReviewBadge } from '../data/forgettingCurve';

export default function Dashboard({ topics, history, onSelectTopic, onAddTopic, onEditTopic, onDeleteTopic, onStartReview }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editTopicId, setEditTopicId] = useState(null);

  const reviewStatuses = getReviewStatuses(history, topics);
  const dueCount = getDueCount(reviewStatuses);

  const totalScenes = topics.reduce((s, t) => s + t.scenes.length, 0);
  const reviewedCount = new Set(history.map((h) => h.topicId)).size;
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
      : null;

  return (
    <div className="pt-1 min-h-screen bg-[#f7f6f3]">
      {/* ── 헤더 + 망각곡선 배너를 sticky 블록으로 묶음 ── */}
      <div className="sticky top-1 z-40 bg-[#f7f6f3]">
        <header className="border-b border-[#e0ddd8]">
          <div className="max-w-container mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
            <h1 className="vs-logo">VS</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#1a237e] text-[#1a237e] text-sm font-medium tracking-wide hover:bg-[#1a237e] hover:text-white transition-colors duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 주제</span>
              <span className="sm:hidden">추가</span>
            </button>
          </div>
        </header>

        {/* 망각곡선 알림 배너 — 항상 헤더 바로 아래에 고정 */}
        {dueCount > 0 && (
          <div className="border-b border-[#fc8f34]/30 bg-[#fff8f0]">
            <div className="max-w-container mx-auto px-6 md:px-10 py-2.5 flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fc8f34] animate-pulse" />
                <Bell className="w-3.5 h-3.5 text-[#fc8f34]" />
              </span>
              <p className="text-xs text-[#944a00]">
                <span className="font-semibold">오늘 복습할 주제 {dueCount}개</span>
                <span className="text-[#767683] ml-2 hidden sm:inline">— 에빙하우스 망각 곡선 기준 지금이 최적 타이밍입니다.</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <main className="max-w-container mx-auto px-6 md:px-10 py-10">
        {/* 통계 */}
        <div className="flex gap-8 mb-10 pb-8 border-b border-[#e0ddd8]">
          <Stat label="주제" value={topics.length} />
          <Stat label="장면" value={totalScenes} />
          <Stat label="평균 점수" value={avgScore !== null ? `${avgScore}점` : '—'} />
          {topics.length > 0 && (
            <Stat label="복습 완료" value={`${reviewedCount}/${topics.length}`} />
          )}
        </div>

        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-xl font-semibold text-[#1a1a1a] tracking-tight">나의 학습 주제</h2>
        </div>

        {topics.length === 0 ? (
          <EmptyState onAdd={() => setShowAddModal(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                reviewStatus={reviewStatuses.get(topic.id)}
                animationDelay={index * 50}
                onSelect={() => onSelectTopic(topic.id)}
                onReview={() => onStartReview(topic.id)}
                onEditRequest={() => setEditTopicId(topic.id)}
                onDeleteRequest={() => setDeleteConfirmId(topic.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddTopicModal onAdd={onAddTopic} onClose={() => setShowAddModal(false)} />
      )}

      {/* 주제 이름 편집 모달 */}
      {editTopicId !== null && (
        <EditTopicModal
          topic={topics.find((t) => t.id === editTopicId)}
          onSave={(newTitle) => { onEditTopic(editTopicId, newTitle); setEditTopicId(null); }}
          onClose={() => setEditTopicId(null)}
        />
      )}

      {deleteConfirmId !== null && (
        <DeleteConfirmModal
          topicTitle={topics.find((t) => t.id === deleteConfirmId)?.title ?? ''}
          onConfirm={() => { onDeleteTopic(deleteConfirmId); setDeleteConfirmId(null); }}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="font-serif text-2xl font-semibold text-[#1a237e] leading-none">{value}</p>
      <p className="text-xs text-[#767683] mt-1 tracking-widest uppercase">{label}</p>
    </div>
  );
}

function TopicCard({ topic, reviewStatus, animationDelay, onSelect, onReview, onEditRequest, onDeleteRequest }) {
  const badge = reviewStatus ? getReviewBadge(reviewStatus) : null;

  return (
    <div
      className="scene-card-enter bg-white border border-[#e0ddd8] hover:border-[#1a237e] hover:shadow-[0_2px_16px_rgba(26,35,126,0.07)] transition-all duration-200 cursor-pointer group flex flex-col"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={onSelect}
    >
      <div className="p-5 flex-1">
        {/* 제목 + 수정/삭제 아이콘 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] group-hover:text-[#1a237e] transition-colors leading-snug">
            {topic.title}
          </h3>
          {/* 아이콘 2개 나란히 */}
          <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
            <button
              onClick={(e) => { e.stopPropagation(); onEditRequest(); }}
              className="p-1 text-[#c6c5d4] hover:text-[#1a237e] transition-colors"
              aria-label="주제 이름 수정"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteRequest(); }}
              className="p-1 text-[#c6c5d4] hover:text-[#ba1a1a] transition-colors"
              aria-label="주제 삭제"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 메타 */}
        <div className="flex items-center gap-3 text-xs text-[#767683] mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {topic.scenes.length}장면
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {topic.createdAt}
          </span>
        </div>

        {/* 망각곡선 뱃지 */}
        {badge ? (
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 border text-[11px] font-medium ${badge.textCls} ${badge.borderCls} ${badge.bgCls}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dot}`} />
            {badge.label}
          </div>
        ) : (
          <p className="text-xs text-[#c6c5d4]">아직 복습하지 않음</p>
        )}
      </div>

      <div className="px-5 pb-4 flex gap-2 border-t border-[#f0ede8] pt-3">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="flex-1 py-1.5 text-xs font-medium text-[#1a237e] border border-[#1a237e] hover:bg-[#1a237e] hover:text-white transition-colors"
        >
          학습하기
        </button>
        {topic.scenes.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onReview(); }}
            className="flex-1 py-1.5 text-xs font-medium text-white bg-[#1a237e] hover:bg-[#000666] transition-colors flex items-center justify-center gap-1"
          >
            <Brain className="w-3 h-3" />
            복습하기
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="py-24 text-center">
      <p className="font-serif text-4xl text-[#e0ddd8] mb-6">∅</p>
      <h3 className="font-serif text-lg text-[#1a1a1a] mb-2">아직 학습 주제가 없어요</h3>
      <p className="text-sm text-[#767683] mb-8">첫 번째 주제를 추가하고 지식을 장면으로 기록해 보세요.</p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1a237e] text-[#1a237e] text-sm font-medium hover:bg-[#1a237e] hover:text-white transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        첫 번째 주제 추가하기
      </button>
    </div>
  );
}

/** 주제 이름 수정 모달 */
function EditTopicModal({ topic, onSave, onClose }) {
  const [title, setTitle] = useState(topic?.title ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim());
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content bg-white border border-[#e0ddd8] w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ede8]">
          <h2 className="font-serif text-lg font-semibold text-[#1a1a1a]">주제 이름 수정</h2>
          <button onClick={onClose} className="p-1 text-[#c6c5d4] hover:text-[#1a1a1a] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] text-[#767683] mb-2">주제 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#e0ddd8] bg-[#f7f6f3] text-[#1a1a1a] text-sm focus:outline-none focus:border-[#1a237e] transition-colors"
              autoFocus
              required
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-[#e0ddd8] text-sm text-[#767683] hover:bg-[#f7f6f3] transition-colors">
              취소
            </button>
            <button type="submit" disabled={!title.trim()}
              className="flex-1 py-2.5 bg-[#1a237e] text-white text-sm font-medium hover:bg-[#000666] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ topicTitle, onConfirm, onCancel }) {
  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="modal-content bg-white border border-[#e0ddd8] w-full max-w-sm p-7">
        <h2 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2">주제를 삭제할까요?</h2>
        <p className="text-sm text-[#767683] mb-6 leading-relaxed">
          <span className="font-medium text-[#1a1a1a]">"{topicTitle}"</span>의 모든 장면과 복습 이력이 함께 삭제됩니다.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 border border-[#e0ddd8] text-sm text-[#767683] hover:bg-[#f7f6f3] transition-colors">취소</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-[#ba1a1a] text-white text-sm hover:bg-[#93000a] transition-colors">삭제</button>
        </div>
      </div>
    </div>
  );
}
