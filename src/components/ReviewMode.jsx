import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, ChevronLeft, ChevronRight, CheckCircle, ImageOff } from 'lucide-react';

export default function ReviewMode({ topic, onBack, onComplete }) {
  const scenes = [...topic.scenes].sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [phase, setPhase] = useState('review');
  const [score, setScore] = useState(70);
  const [cardKey, setCardKey] = useState(0);

  const currentScene = scenes[currentIndex];
  const isLastScene = currentIndex === scenes.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / scenes.length) * 100);

  const handleNext = () => {
    if (isLastScene) {
      setPhase('score');
    } else {
      setCurrentIndex((p) => p + 1);
      setShowDescription(false);
      setCardKey((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
      setShowDescription(false);
      setCardKey((p) => p + 1);
    }
  };

  return (
    <div className="pt-1 min-h-screen bg-[#f7f6f3]">
      {/* 헤더 */}
      <header className="bg-[#f7f6f3] border-b border-[#e0ddd8] sticky top-1 z-40">
        <div className="max-w-container mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-[#767683] hover:text-[#1a237e] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            학습 노트로
          </button>
          <div className="text-center">
            <p className="font-serif text-base font-semibold text-[#1a1a1a] truncate max-w-xs">{topic.title}</p>
            <p className="text-[10px] text-[#767683] uppercase tracking-[0.1em] mt-0.5">기억 회상 복습</p>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-container mx-auto px-6 md:px-10 py-10">

        {/* ── 복습 슬라이드 ── */}
        {phase === 'review' && (
          <div className="max-w-xl mx-auto">
            {/* 진행 바 */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px bg-[#e0ddd8] relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-[#1a237e] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-[#767683] shrink-0 tabular-nums">
                {currentIndex + 1} / {scenes.length}
              </span>
            </div>

            {/* 플래시카드 */}
            <div key={cardKey} className="review-card-enter bg-white border border-[#e0ddd8] overflow-hidden">
              {/* 이미지 */}
              <div className="relative h-52 sm:h-64 bg-[#f0ede8] overflow-hidden">
                {currentScene.image ? (
                  <img
                    src={currentScene.image}
                    alt={currentScene.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 items-center justify-center bg-[#e8e5f0] ${currentScene.image ? 'hidden' : 'flex'}`}>
                  <ImageOff className="w-10 h-10 text-[#c6c5d4]" />
                </div>
                {/* 타이틀 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <span className="text-[10px] text-white/60 uppercase tracking-widest">장면 {currentScene.order}</span>
                  <h2 className="font-serif text-xl font-semibold text-white leading-snug mt-0.5">
                    {currentScene.title}
                  </h2>
                </div>
              </div>

              <div className="p-5">
                {/* 키워드 */}
                {currentScene.keywords.length > 0 && (
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-[#767683] mb-2">핵심 키워드</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentScene.keywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-0.5 border border-[#944a00] text-[#944a00] text-[11px] font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 설명 토글 */}
                <div className="border-t border-[#f0ede8] pt-4">
                  <button
                    onClick={() => setShowDescription((p) => !p)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#1a237e] hover:opacity-70 transition-opacity mb-3"
                  >
                    {showDescription ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showDescription ? '설명 숨기기' : '설명 보기'}
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${showDescription ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm text-[#454652] leading-relaxed bg-[#f7f6f3] p-3 border-l-2 border-[#1a237e]/20">
                      {currentScene.description || '설명이 없습니다.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex items-center justify-between gap-3 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 border border-[#e0ddd8] text-sm text-[#767683] hover:border-[#1a237e] hover:text-[#1a237e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2 bg-[#1a237e] text-white text-sm font-medium hover:bg-[#000666] transition-colors"
              >
                {isLastScene ? <>복습 완료 <CheckCircle className="w-4 h-4" /></> : <>다음 장면 <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>

            {/* 인디케이터 점 */}
            <div className="flex justify-center gap-1.5 mt-6">
              {scenes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i); setShowDescription(false); setCardKey((p) => p + 1); }}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    i === currentIndex ? 'w-5 bg-[#1a237e]' :
                    i < currentIndex  ? 'w-2 bg-[#767683]' : 'w-2 bg-[#e0ddd8]'
                  }`}
                  aria-label={`장면 ${i + 1}로 이동`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── 점수 입력 ── */}
        {phase === 'score' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-[#e0ddd8] p-8">
              <div className="text-center mb-8">
                <p className="font-serif text-4xl text-[#e0ddd8] mb-4">✓</p>
                <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] mb-1">복습 완료</h2>
                <p className="text-sm text-[#767683]">총 {scenes.length}개의 장면을 모두 확인했어요</p>
              </div>

              {/* 슬라이더 */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#767683]">자가 채점</p>
                  <p className="font-serif text-3xl font-semibold text-[#1a237e]">{score}점</p>
                </div>

                <input
                  type="range"
                  min={0} max={100} step={5}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full h-px cursor-pointer appearance-none bg-[#e0ddd8] accent-[#1a237e]"
                />

                <div className="flex justify-between mt-2 text-[10px] text-[#767683]">
                  <span>0</span>
                  <span className={`font-medium ${score >= 80 ? 'text-[#2d6a4f]' : score >= 50 ? 'text-[#944a00]' : 'text-[#ba1a1a]'}`}>
                    {score >= 80 ? '잘 기억했어요' : score >= 50 ? '조금 더 연습해요' : '다시 복습해요'}
                  </span>
                  <span>100</span>
                </div>
              </div>

              {/* 빠른 점수 */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[20, 50, 70, 90].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScore(s)}
                    className={`py-1.5 text-xs font-medium border transition-colors ${
                      score === s
                        ? 'border-[#1a237e] bg-[#1a237e] text-white'
                        : 'border-[#e0ddd8] text-[#767683] hover:border-[#1a237e] hover:text-[#1a237e]'
                    }`}
                  >
                    {s}점
                  </button>
                ))}
              </div>

              <button
                onClick={() => onComplete(score)}
                className="w-full py-3 bg-[#1a237e] text-white text-sm font-medium hover:bg-[#000666] transition-colors"
              >
                복습 기록 저장하기
              </button>
              <button
                onClick={onBack}
                className="w-full mt-3 py-2 text-xs text-[#767683] hover:text-[#1a1a1a] transition-colors"
              >
                저장하지 않고 돌아가기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
