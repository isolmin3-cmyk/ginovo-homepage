/* Slope Putting Mat 제품 비교 카드의 기본 콘텐츠와 관리자 편집 연결 */
window.PUTTING_MAT_COMPARISON_DEFAULTS = [
  {
    image: './assets/putting-comparison-90-v4.png',
    title: '90cm',
    subtitle: 'Slope Putting Mat / Flagship / Dual-Side Slopes',
    items: ['Practice varied target lines', 'Uphill / Downhill / Hook / Slice', 'Closest to real-green conditions']
  },
  {
    image: './assets/putting-comparison-70-v4.png',
    title: '70cm',
    subtitle: 'Sloping Putting Mat / Game-Based Training / Slopes',
    items: ['Game-Based Putting', 'Slope-Zone Practice', 'Solo & Group Play']
  },
  {
    image: './assets/putting-comparison-60-v4.png',
    title: '60cm',
    subtitle: 'Slope Putting Mat / Compact / Single-Side Slope',
    items: ['Ideal for small spaces', 'Fundamental putting-routine training', 'For home, office and personal spaces']
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
      if (index === 1 && current.subtitle === 'Sloping Putting Mat / Game-Based Training / Slopes + Game Play') {
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
  title: '90 cm Wide Slope Putting Mat',
  subtitle: 'A Slope Putting Mat That Recreates On-Course Putting Conditions',
  description: 'The 90 cm mat uses internal slope plates to recreate real-green conditions indoors. Repeated practice across varied slopes and target lines improves distance control, direction and green reading.',
  item1Title: 'Dual-Side Slopes',
  item1Description: 'Practice uphill, downhill, slice and hook putts',
  item2Title: 'Recreates the feel of a real green',
  item2Description: 'Develop three-dimensional feel beyond flat-surface practice',
  item3Title: 'PATH31 Path Guide',
  item3Description: 'Practice varied target lines with 31 designed paths',
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
    if (saved.subtitle === 'A slope putting mat that recreates on-course conditions') {
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
