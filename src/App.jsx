import { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { INITIAL_TOPICS, INITIAL_HISTORY } from './data/initialData';
import ProgressBar from './components/ProgressBar';
import Dashboard from './components/Dashboard';
import TopicDetail from './components/TopicDetail';
import ReviewMode from './components/ReviewMode';

// LocalStorage 키 상수
const TOPICS_KEY = 'tasty_knowledge_topics';
const HISTORY_KEY = 'tasty_knowledge_history';

export default function App() {
  // 뷰 상태: 'dashboard' | 'topic-detail' | 'review'
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  // LocalStorage 연동 상태
  const [topics, setTopics] = useLocalStorage(TOPICS_KEY, null);
  const [history, setHistory] = useLocalStorage(HISTORY_KEY, INITIAL_HISTORY);

  // 최초 진입 시 LocalStorage가 비어있으면 DNS 더미 데이터 주입
  useEffect(() => {
    if (topics === null || topics === undefined) {
      setTopics(INITIAL_TOPICS);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 현재 선택된 주제 객체
  const selectedTopic = topics?.find((t) => t.id === selectedTopicId) ?? null;

  // 복습 진행률 계산 (전체 장면 수 대비 복습한 주제 비율)
  const totalScenes = topics?.reduce((sum, t) => sum + t.scenes.length, 0) ?? 0;
  const reviewedTopicIds = new Set(history.map((h) => h.topicId));
  const progressPercent =
    topics?.length > 0
      ? Math.round((reviewedTopicIds.size / topics.length) * 100)
      : 0;

  // --- 주제(Topic) CRUD ---

  /** 새 주제 추가 */
  const handleAddTopic = (title) => {
    const newTopic = {
      id: Date.now(),
      title: title.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      scenes: [],
    };
    setTopics((prev) => [...(prev ?? []), newTopic]);
  };

  /** 주제 이름 수정 */
  const handleEditTopic = (topicId, newTitle) => {
    setTopics((prev) =>
      prev.map((t) => t.id !== topicId ? t : { ...t, title: newTitle.trim() })
    );
  };

  /** 주제 삭제 */
  const handleDeleteTopic = (topicId) => {
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
    setHistory((prev) => prev.filter((h) => h.topicId !== topicId));
  };

  // --- 장면(Scene) CRUD ---

  /** 특정 주제에 새 장면 추가 */
  const handleAddScene = (topicId, sceneData) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) return topic;
        const newScene = {
          id: Date.now(),
          order: topic.scenes.length + 1,
          title: sceneData.title.trim(),
          description: sceneData.description.trim(),
          image: sceneData.image.trim(),
          keywords: sceneData.keywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean),
        };
        return { ...topic, scenes: [...topic.scenes, newScene] };
      })
    );
  };

  /** 특정 장면 편집 */
  const handleEditScene = (topicId, sceneId, sceneData) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) return topic;
        return {
          ...topic,
          scenes: topic.scenes.map((s) =>
            s.id !== sceneId ? s : {
              ...s,
              title: sceneData.title.trim(),
              description: sceneData.description.trim(),
              image: sceneData.image.trim(),
              keywords: sceneData.keywords
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean),
            }
          ),
        };
      })
    );
  };

  /** 장면 순서 변경 — newScenes는 새 order가 반영된 배열 */
  const handleReorderScenes = (topicId, newScenes) => {
    setTopics((prev) =>
      prev.map((t) => t.id !== topicId ? t : { ...t, scenes: newScenes })
    );
  };

  /** 특정 장면 삭제 (order 재정렬) */
  const handleDeleteScene = (topicId, sceneId) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) return topic;
        const filtered = topic.scenes
          .filter((s) => s.id !== sceneId)
          .map((s, i) => ({ ...s, order: i + 1 }));
        return { ...topic, scenes: filtered };
      })
    );
  };

  // --- 복습 이력(ReviewHistory) ---

  /** 복습 점수 저장 */
  const handleSaveReview = (topicId, score) => {
    const entry = {
      topicId,
      reviewedAt: new Date().toISOString(),
      score,
    };
    setHistory((prev) => [...prev, entry]);
    // 대시보드로 복귀
    setCurrentView('dashboard');
    setSelectedTopicId(null);
  };

  // --- 뷰 네비게이션 ---

  const handleSelectTopic = (topicId) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic-detail');
  };

  const handleStartReview = (topicId) => {
    setSelectedTopicId(topicId);
    setCurrentView('review');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTopicId(null);
  };

  const handleBackToDetail = () => {
    setCurrentView('topic-detail');
  };

  // topics가 아직 null인 초기화 전 상태에는 빈 화면
  if (topics === null) return null;

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      {/* 상단 지식 소비량 진행 바 (항상 노출) */}
      <ProgressBar progress={progressPercent} />

      {/* 뷰 렌더링 */}
      {currentView === 'dashboard' && (
        <Dashboard
          topics={topics}
          history={history}
          onSelectTopic={handleSelectTopic}
          onAddTopic={handleAddTopic}
          onEditTopic={handleEditTopic}
          onDeleteTopic={handleDeleteTopic}
          onStartReview={handleStartReview}
        />
      )}

      {currentView === 'topic-detail' && selectedTopic && (
        <TopicDetail
          topic={selectedTopic}
          history={history}
          onBack={handleBackToDashboard}
          onStartReview={() => handleStartReview(selectedTopic.id)}
          onAddScene={(sceneData) => handleAddScene(selectedTopic.id, sceneData)}
          onEditScene={(sceneId, sceneData) => handleEditScene(selectedTopic.id, sceneId, sceneData)}
          onDeleteScene={(sceneId) => handleDeleteScene(selectedTopic.id, sceneId)}
          onReorderScenes={(newScenes) => handleReorderScenes(selectedTopic.id, newScenes)}
        />
      )}

      {currentView === 'review' && selectedTopic && (
        <ReviewMode
          topic={selectedTopic}
          onBack={handleBackToDetail}
          onComplete={(score) => handleSaveReview(selectedTopic.id, score)}
        />
      )}
    </div>
  );
}
