import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddTopicModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim());
    onClose();
  };

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content bg-white border border-[#e0ddd8] w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ede8]">
          <h2 className="font-serif text-lg font-semibold text-[#1a1a1a]">새 학습 주제</h2>
          <button onClick={onClose} className="p-1 text-[#c6c5d4] hover:text-[#1a1a1a] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.12em] text-[#767683] mb-2">
              주제 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 운영체제 메모리 관리, 리액트 렌더링 원리..."
              className="w-full px-3 py-2.5 border border-[#e0ddd8] bg-[#f7f6f3] text-[#1a1a1a] text-sm placeholder-[#c6c5d4] focus:outline-none focus:border-[#1a237e] transition-colors"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#e0ddd8] text-sm text-[#767683] hover:bg-[#f7f6f3] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-2.5 bg-[#1a237e] text-white text-sm font-medium hover:bg-[#000666] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
