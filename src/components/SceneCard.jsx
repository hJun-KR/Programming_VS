import { useState } from 'react';
import { ImageOff, Pencil, Trash2 } from 'lucide-react';
import EditSceneModal from './EditSceneModal';

/**
 * @param {Object}   scene
 * @param {'completed'|'current'|'future'} nodeStatus
 * @param {number}   animationDelay
 * @param {Function} onEdit   - (sceneData) => void
 * @param {Function} onDelete - () => void
 */
export default function SceneCard({ scene, nodeStatus, animationDelay = 0, onEdit, onDelete }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const nodeRing = {
    completed: 'bg-[#1a237e] border-[#1a237e]',
    current:   'bg-white border-[#fc8f34] ring-2 ring-[#fc8f34]/30 ring-offset-1',
    future:    'bg-white border-[#d9dadb]',
  };
  const nodeDot = {
    completed: 'bg-white',
    current:   'bg-[#fc8f34]',
    future:    'bg-[#d9dadb]',
  };

  return (
    <>
      <div
        className="scene-card-enter relative flex gap-6 md:gap-8"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* 타임라인 노드 */}
        <div className="relative flex flex-col items-center shrink-0 w-6 mt-1">
          <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${nodeRing[nodeStatus]}`}>
            <div className={`w-2 h-2 rounded-full ${nodeDot[nodeStatus]}`} />
          </div>
        </div>

        {/* 카드 */}
        <div className="flex-1 pb-12">
          <span className="block text-[10px] uppercase tracking-[0.12em] text-[#767683] mb-2">
            장면 {scene.order}
          </span>

          <div className="bg-white border border-[#e0ddd8] hover:border-[#1a237e] hover:shadow-[0_2px_16px_rgba(26,35,126,0.06)] transition-all duration-200 overflow-hidden group">
            {/* 이미지 */}
            <div className="relative h-44 sm:h-52 bg-[#f0ede8] overflow-hidden">
              {scene.image ? (
                <img
                  src={scene.image}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 items-center justify-center bg-[#e8e5f0] ${scene.image ? 'hidden' : 'flex'}`}>
                <ImageOff className="w-8 h-8 text-[#c6c5d4]" />
              </div>

              {/* 호버 시 나타나는 액션 버튼 */}
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-1.5 bg-white/90 border border-[#e0ddd8] text-[#454652] hover:text-[#1a237e] hover:border-[#1a237e] transition-colors"
                  aria-label="장면 편집"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 bg-white/90 border border-[#e0ddd8] text-[#454652] hover:text-[#ba1a1a] hover:border-[#ba1a1a] transition-colors"
                  aria-label="장면 삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 텍스트 */}
            <div className="p-5">
              <h3 className="font-serif text-lg font-semibold text-[#1a1a1a] mb-2 leading-snug">
                {scene.title}
              </h3>
              <p className="text-sm text-[#454652] leading-relaxed mb-4">
                {scene.description}
              </p>

              {scene.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {scene.keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-0.5 border border-[#c6c5d4] text-[#454652] text-[11px] font-medium tracking-wide">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 편집 모달 */}
      {showEditModal && (
        <EditSceneModal
          scene={scene}
          onSave={onEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* 삭제 확인 인라인 토스트 스타일 */}
      {showDeleteConfirm && (
        <div
          className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteConfirm(false); }}
        >
          <div className="modal-content bg-white border border-[#e0ddd8] w-full max-w-sm p-6">
            <h3 className="font-serif text-base font-semibold text-[#1a1a1a] mb-1">장면을 삭제할까요?</h3>
            <p className="text-sm text-[#767683] mb-5">
              <span className="font-medium text-[#1a1a1a]">"{scene.title}"</span> 장면이 삭제됩니다. 이후 장면의 순서가 자동으로 조정됩니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 border border-[#e0ddd8] text-sm text-[#767683] hover:bg-[#f7f6f3] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { onDelete(); setShowDeleteConfirm(false); }}
                className="flex-1 py-2 bg-[#ba1a1a] text-white text-sm hover:bg-[#93000a] transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
