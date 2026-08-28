/* 경사 퍼팅매트 제품 비교 카드의 기본 콘텐츠와 관리자 편집 연결 */
window.PUTTING_MAT_COMPARISON_DEFAULTS = [
  {
    image: './assets/img-016.png',
    title: '90cm',
    subtitle: '경사 퍼팅매트 / 대표 제품 / 양쪽 경사',
    items: ['다양한 공략 라인 훈련', '오르막/내리막/훅/슬라이스', '필드와 가장 유사한 환경']
  },
  {
    image: './assets/img-014.png',
    title: '70cm',
    subtitle: '슬로핑 퍼팅매트 / 게임형 훈련 / 경사+게임 결합',
    items: ['퍼팅 게임 방식 적용', '경사 구간 활용 연습', '솔로 & 그룹 플레이']
  },
  {
    image: './assets/img-015.png',
    title: '60cm',
    subtitle: '경사 퍼팅매트 / 컴팩트형 / 한쪽 경사',
    items: ['좁은 공간에 적합', '기본 퍼팅 루틴 훈련', '개인 공간, 사무실 등 활용']
  }
];

window.PUTTING_MAT_COMPARISON_STORAGE_KEY = 'ginovo-putting-mat-comparison-v1';

window.getPuttingMatComparisonContent = function () {
  const defaults = window.PUTTING_MAT_COMPARISON_DEFAULTS;
  try {
    const saved = JSON.parse(localStorage.getItem(window.PUTTING_MAT_COMPARISON_STORAGE_KEY) || 'null');
    if (!Array.isArray(saved)) return defaults;
    return defaults.map((fallback, index) => ({ ...fallback, ...(saved[index] || {}) }));
  } catch (_) {
    return defaults;
  }
};

window.applyPuttingMatComparisonContent = function () {
  const cards = document.querySelectorAll('[data-comparison-card]');
  const content = window.getPuttingMatComparisonContent();
  cards.forEach((card, index) => {
    const data = content[index];
    if (!data) return;
    const image = card.querySelector('[data-card-image]');
    const title = card.querySelector('[data-card-title]');
    const subtitle = card.querySelector('[data-card-subtitle]');
    const items = card.querySelectorAll('[data-card-item]');
    if (image && data.image) image.src = data.image;
    if (title) title.textContent = data.title || '';
    if (subtitle) subtitle.textContent = data.subtitle || '';
    items.forEach((item, itemIndex) => { item.textContent = data.items?.[itemIndex] || ''; });
  });
};

document.addEventListener('DOMContentLoaded', window.applyPuttingMatComparisonContent);
