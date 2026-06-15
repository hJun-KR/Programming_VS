/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // DESIGN.md - Deep Indigo (Primary)
        primary: {
          DEFAULT: '#000666',
          container: '#1a237e',
          light: '#bdc2ff',
          fixed: '#e0e0ff',
          'fixed-dim': '#bdc2ff',
        },
        // DESIGN.md - Warm Ochre (Secondary)
        secondary: {
          DEFAULT: '#944a00',
          container: '#fc8f34',
          fixed: '#ffdcc5',
          'fixed-dim': '#ffb783',
        },
        // DESIGN.md - Surface 계열
        surface: {
          DEFAULT: '#f8f9fa',
          card: '#ffffff',
          dim: '#d9dadb',
          bright: '#f8f9fa',
          'container-lowest': '#ffffff',
          'container-low': '#f3f4f5',
          container: '#edeeef',
          'container-high': '#e7e8e9',
          'container-highest': '#e1e3e4',
        },
        // DESIGN.md - 텍스트 색상
        'on-surface': '#191c1d',
        'on-surface-variant': '#454652',
        outline: '#767683',
        'outline-variant': '#c6c5d4',
        // 에러
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
      },
      fontFamily: {
        // DESIGN.md - 헤드라인용 세리프 폰트
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        // DESIGN.md - UI/바디용 산세리프 폰트
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // DESIGN.md - typography 스펙
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.05em' }],
      },
      boxShadow: {
        // DESIGN.md - Level 2 Elevation
        scene: '0px 4px 20px rgba(26, 35, 126, 0.05)',
        'scene-hover': '0px 8px 32px rgba(26, 35, 126, 0.12)',
      },
      maxWidth: {
        // DESIGN.md - container-max
        container: '1200px',
      },
      spacing: {
        // DESIGN.md - scene-gap
        'scene-gap': '48px',
      },
    },
  },
  plugins: [],
};
