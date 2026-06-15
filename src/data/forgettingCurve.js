/**
 * 에빙하우스 망각 곡선 기반 복습 스케줄
 * 점수에 따라 다음 복습 간격을 조정:
 *   90점 이상 → 21일 후
 *   70점 이상 → 7일 후
 *   50점 이상 → 3일 후
 *   50점 미만 → 1일 후 (거의 기억 못 함)
 */
const INTERVALS = [
  { minScore: 90, days: 21 },
  { minScore: 70, days: 7  },
  { minScore: 50, days: 3  },
  { minScore: 0,  days: 1  },
];

/**
 * 주제 ID별 "가장 최근 복습 이력"을 반환하는 맵을 만들어,
 * 각 주제의 다음 복습 예정일과 상태를 계산한다.
 *
 * @param {Array} history   - reviewHistory 배열
 * @param {Array} topics    - topic 배열
 * @param {Date}  now       - 현재 시각 (테스트 주입용, 기본값 new Date())
 * @returns {Map<topicId, ReviewStatus>}
 *
 * ReviewStatus = {
 *   dueDate: Date,       — 다음 복습 예정일
 *   daysLeft: number,    — 오늘 기준 남은 일수 (음수 = 지남)
 *   status: 'overdue' | 'due-today' | 'upcoming' | 'never',
 *   lastScore: number | null,
 *   lastReviewedAt: string | null,
 * }
 */
export function getReviewStatuses(history, topics, now = new Date()) {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const statusMap = new Map();

  for (const topic of topics) {
    const topicHistory = history
      .filter((h) => h.topicId === topic.id)
      .sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt));

    if (topicHistory.length === 0) {
      statusMap.set(topic.id, {
        dueDate: null,
        daysLeft: null,
        status: 'never',
        lastScore: null,
        lastReviewedAt: null,
      });
      continue;
    }

    const latest = topicHistory[0];
    const interval = INTERVALS.find((r) => latest.score >= r.minScore);
    const dueDate = new Date(latest.reviewedAt);
    dueDate.setDate(dueDate.getDate() + interval.days);
    dueDate.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.round((dueDate - todayStart) / msPerDay);

    let status;
    if (daysLeft < 0)       status = 'overdue';
    else if (daysLeft === 0) status = 'due-today';
    else                     status = 'upcoming';

    statusMap.set(topic.id, {
      dueDate,
      daysLeft,
      status,
      lastScore: latest.score,
      lastReviewedAt: latest.reviewedAt,
    });
  }

  return statusMap;
}

/**
 * 오늘 복습해야 할(overdue + due-today) 주제 개수
 */
export function getDueCount(statusMap) {
  let count = 0;
  for (const s of statusMap.values()) {
    if (s.status === 'overdue' || s.status === 'due-today') count++;
  }
  return count;
}

/**
 * daysLeft 기준 뱃지 텍스트 + 색상 반환
 */
export function getReviewBadge(status) {
  switch (status.status) {
    case 'never':
      return null; // 복습 이력 없으면 뱃지 없음
    case 'overdue':
      return {
        label: `${Math.abs(status.daysLeft)}일 지남`,
        textCls: 'text-[#ba1a1a]',
        borderCls: 'border-[#ba1a1a]/30',
        bgCls: 'bg-[#fff0f0]',
        dot: 'bg-[#ba1a1a]',
      };
    case 'due-today':
      return {
        label: '오늘 복습',
        textCls: 'text-[#944a00]',
        borderCls: 'border-[#fc8f34]/40',
        bgCls: 'bg-[#fff8f0]',
        dot: 'bg-[#fc8f34]',
      };
    case 'upcoming':
      return {
        label: `${status.daysLeft}일 후`,
        textCls: 'text-[#767683]',
        borderCls: 'border-[#e0ddd8]',
        bgCls: 'bg-[#f7f6f3]',
        dot: 'bg-[#c6c5d4]',
      };
    default:
      return null;
  }
}
