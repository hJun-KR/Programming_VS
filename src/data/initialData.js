// VS 앱 최초 실행 시 주입되는 DNS 동작 원리 더미 데이터
export const INITIAL_TOPICS = [
  {
    id: 1,
    title: 'DNS 동작 원리',
    createdAt: '2026-06-15',
    scenes: [
      {
        id: 1,
        order: 1,
        title: '브라우저 주소 입력',
        description:
          '사용자가 브라우저 주소창에 "google.com"을 입력하면, 브라우저는 이 도메인 이름에 해당하는 IP 주소를 알아내야 합니다. 먼저 브라우저 자체 캐시와 운영체제의 hosts 파일을 확인하고, 없으면 DNS 조회 과정이 시작됩니다.',
        image:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        keywords: ['DNS', '브라우저', 'URL', '도메인', '캐시'],
      },
      {
        id: 2,
        order: 2,
        title: 'DNS 서버 요청',
        description:
          '브라우저는 운영체제를 통해 로컬 DNS 서버(리졸버)에 "google.com의 IP 주소가 무엇인가요?"라고 질의합니다. 로컬 DNS 서버는 캐시를 먼저 확인하고, 없으면 루트 DNS → TLD DNS(Top-Level Domain) → 권한 DNS 서버 순으로 반복적으로 조회(재귀 쿼리)합니다.',
        image:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        keywords: ['DNS 서버', 'IP 주소', '재귀 쿼리', '루트 DNS', 'TLD'],
      },
      {
        id: 3,
        order: 3,
        title: 'IP 반환 및 서버 연결',
        description:
          '권한 DNS 서버로부터 "google.com = 142.250.196.110"과 같은 IP 주소를 응답받습니다. 이 IP를 브라우저에 전달하면, 브라우저는 해당 IP의 웹 서버에 TCP 연결(3-way handshake)을 수립하고 HTTP(S) 요청을 보내 웹 페이지를 불러옵니다.',
        image:
          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
        keywords: ['IP 주소', 'TCP', '3-way handshake', '웹 서버', 'HTTPS'],
      },
    ],
  },
];

export const INITIAL_HISTORY = [];
