import { useState } from 'react';
import { X, ImageIcon } from 'lucide-react';

/**
 * 장면 편집 모달 — AddSceneModal과 동일한 폼 구조,
 * scene 초기값을 받아 채워놓는 것이 차이점
 */
export default function EditSceneModal({ scene, onSave, onClose }) {
  const [form, setForm] = useState({
    title: scene.title,
    description: scene.description,
    image: scene.image,
    keywords: scene.keywords.join(', '),
  });
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name === 'image') setImagePreviewError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
    onClose();
  };

  const isValidImage = form.image.trim().startsWith('http') && !imagePreviewError;

  const inputCls =
    'w-full px-3 py-2.5 border border-[#e0ddd8] bg-[#f7f6f3] text-[#1a1a1a] text-sm placeholder-[#c6c5d4] focus:outline-none focus:border-[#1a237e] transition-colors';
  const labelCls =
    'block text-[10px] uppercase tracking-[0.12em] text-[#767683] mb-2';

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-content bg-white border border-[#e0ddd8] w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ede8] shrink-0">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[#1a1a1a]">장면 편집</h2>
            <p className="text-[10px] text-[#767683] mt-0.5">장면 {scene.order}</p>
          </div>
          <button onClick={onClose} className="p-1 text-[#c6c5d4] hover:text-[#1a1a1a] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* 제목 */}
            <div>
              <label className={labelCls}>장면 제목 <span className="text-[#ba1a1a]">*</span></label>
              <input
                type="text" name="title" value={form.title} onChange={handleChange}
                className={inputCls} autoFocus required
              />
            </div>

            {/* 설명 */}
            <div>
              <label className={labelCls}>장면 설명</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                rows={4} className={`${inputCls} resize-none`}
              />
            </div>

            {/* 이미지 URL */}
            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" />이미지 URL</span>
              </label>
              <input
                type="url" name="image" value={form.image} onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className={inputCls}
              />
              {form.image.trim() && (
                <div className="mt-2 h-24 bg-[#f0ede8] border border-[#e0ddd8] overflow-hidden">
                  {isValidImage ? (
                    <img
                      src={form.image.trim()} alt="미리보기"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreviewError(true)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-[#767683] gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />불러올 수 없습니다
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 키워드 */}
            <div>
              <label className={labelCls}>키워드 (쉼표로 구분)</label>
              <input
                type="text" name="keywords" value={form.keywords} onChange={handleChange}
                placeholder="예: DNS, IP 주소, 브라우저"
                className={inputCls}
              />
              {form.keywords.trim() && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.keywords.split(',').map((k) => k.trim()).filter(Boolean).map((kw, i) => (
                    <span key={i} className="px-2.5 py-0.5 border border-[#c6c5d4] text-[#454652] text-[11px] font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-[#e0ddd8] text-sm text-[#767683] hover:bg-[#f7f6f3] transition-colors"
            >
              취소
            </button>
            <button
              type="submit" disabled={!form.title.trim()}
              className="flex-1 py-2.5 bg-[#1a237e] text-white text-sm font-medium hover:bg-[#000666] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
