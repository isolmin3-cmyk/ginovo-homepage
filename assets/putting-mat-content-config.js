/* 경사 퍼팅매트 제품 비교 카드의 기본 콘텐츠와 관리자 편집 연결 */
window.PUTTING_MAT_COMPARISON_DEFAULTS = [
  {
    image: './assets/putting-comparison-90-v4.png',
    title: '90cm',
    subtitle: '경사 퍼팅매트 / 대표 제품 / 양쪽 경사',
    items: ['다양한 공략 라인 훈련', '오르막/내리막/훅/슬라이스', '필드와 가장 유사한 환경']
  },
  {
    image: './assets/putting-comparison-70-v4.png',
    title: '70cm',
    subtitle: '슬로핑 퍼팅매트 / 게임형 훈련 / 경사',
    items: ['퍼팅 게임 방식 적용', '경사 구간 활용 연습', '솔로 & 그룹 플레이']
  },
  {
    image: './assets/putting-comparison-60-v4.png',
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
    let migrated = false;
    const legacyImages = [
      ['./assets/img-016.png', './assets/putting-comparison-90-v2.png', './assets/putting-comparison-90-v3.png'],
      ['./assets/img-014.png', './assets/putting-comparison-70-v2.png', './assets/putting-comparison-70-v3.png'],
      ['./assets/img-015.png', './assets/putting-comparison-60-v2.png', './assets/putting-comparison-60-v3.png']
    ];
    const result = defaults.map((fallback, index) => {
      const current = { ...fallback, ...(saved[index] || {}) };
      if (legacyImages[index].includes(current.image)) {
        current.image = fallback.image;
        migrated = true;
      }
      if (index === 1 && current.subtitle === '슬로핑 퍼팅매트 / 게임형 훈련 / 경사+게임 결합') {
        current.subtitle = fallback.subtitle;
        migrated = true;
      }
      return current;
    });
    if (migrated) localStorage.setItem(window.PUTTING_MAT_COMPARISON_STORAGE_KEY, JSON.stringify(result));
    return result;
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

/* 폭 90cm 대표 모델의 문구와 이미지 관리자 편집 연결 */
window.PUTTING_MAT_FEATURE90_DEFAULTS = {
  badge: 'Flagship Model',
  title: '폭 90cm 경사 퍼팅매트',
  subtitle: '필드 퍼팅 환경을 구현한 경사 퍼팅매트',
  description: '폭 90cm 경사 퍼팅매트는 퍼팅 매트 내부에 경사판을 삽입하여 실제 필드 그린과 유사한 퍼팅 환경을 실내에 구현합니다. 다양한 경사 구간과 공략 라인을 통해 반복 연습만으로도 거리감, 방향성, 라인 읽기 감각을 향상할 수 있습니다.',
  item1Title: '양쪽 경사 적용',
  item1Description: '오르막, 내리막, 슬라이스, 훅 연습 가능',
  item2Title: '실제 필드 그린과 유사한 퍼팅 감각 구현',
  item2Description: '단순한 평면이 아닌 입체적 감각 훈련',
  item3Title: 'PATH31 경로 가이드 적용',
  item3Description: '31개 경로 설계로 다양한 공략 라인 연습',
  images: {
    main: './assets/06-mrhrqr9k.jpg',
    angle: './assets/107389421193421728_1893345465-mrhu6uuy.jpg',
    detail: './assets/img-029.jpg'
  }
};

window.PUTTING_MAT_FEATURE90_STORAGE_KEY = 'ginovo-putting-mat-feature90-v1';

window.getPuttingMatFeature90Content = function () {
  const defaults = window.PUTTING_MAT_FEATURE90_DEFAULTS;
  try {
    const saved = JSON.parse(localStorage.getItem(window.PUTTING_MAT_FEATURE90_STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return defaults;
    if (saved.subtitle === '필드 퍼팅 환경을 구현한 경사퍼팅매트') {
      saved.subtitle = defaults.subtitle;
      localStorage.setItem(window.PUTTING_MAT_FEATURE90_STORAGE_KEY, JSON.stringify(saved));
    }
    return { ...defaults, ...saved, images: { ...defaults.images, ...(saved.images || {}) } };
  } catch (_) {
    return defaults;
  }
};

window.applyPuttingMatFeature90Content = function () {
  const section = document.getElementById('features');
  if (!section) return;
  const content = window.getPuttingMatFeature90Content();
  section.querySelectorAll('[data-feature90-field]').forEach(element => {
    element.textContent = content[element.dataset.feature90Field] || '';
  });
  section.querySelectorAll('[data-feature90-image]').forEach(image => {
    const source = content.images[image.dataset.feature90Image];
    if (source) image.src = source;
  });
  const descriptions = section.querySelectorAll('ul li > div > span:last-child');
  ['item1Description', 'item2Description', 'item3Description'].forEach((key, index) => {
    if (descriptions[index]) descriptions[index].textContent = content[key] || '';
  });
};

document.addEventListener('DOMContentLoaded', window.applyPuttingMatFeature90Content);
