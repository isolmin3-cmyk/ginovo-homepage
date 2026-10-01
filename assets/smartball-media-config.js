/*
 * 관리자 페이지 연동 지점입니다.
 * 업로드된 이미지 URL을 각 슬롯 ID의 값으로 저장하면 공개 페이지에 반영됩니다.
 * 빈 값은 현재 합성 디자인 이미지를 그대로 보여줍니다.
 */
window.SMARTBALL_MEDIA_STORAGE_KEY = 'ginovo-smartball-media';
window.SMARTBALL_MEDIA_SCHEMA_KEY = 'ginovo-smartball-media-schema';
window.SMARTBALL_MEDIA_SCHEMA_VERSION = '20260902-wireless-v2';
window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-distance-media-schema';
window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_VERSION = '20260904-distance-v7';
window.SMARTBALL_SLOPE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-slope-media-schema';
window.SMARTBALL_SLOPE_MEDIA_SCHEMA_VERSION = '20260902-slope-v3';
window.SMARTBALL_FIELD_MEDIA_SCHEMA_KEY = 'ginovo-smartball-field-media-schema';
window.SMARTBALL_FIELD_MEDIA_SCHEMA_VERSION = '20260904-field-v6';
window.SMARTBALL_BATTLE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-battle-media-schema';
window.SMARTBALL_BATTLE_MEDIA_SCHEMA_VERSION = '20260903-battle-v5';
window.SMARTBALL_CTA_MEDIA_SCHEMA_KEY = 'ginovo-smartball-cta-media-schema';
window.SMARTBALL_CTA_MEDIA_SCHEMA_VERSION = '20260903-cta-v1';
window.SMARTBALL_MEDIA_DEFAULTS = {
  'anatomy-background': './assets/smartball-page-01-bg.png',
  'spec-weight': './assets/smartball-spec-1.png',
  'spec-size': './assets/smartball-spec-2.png',
  'spec-rebound': './assets/smartball-spec-3.png',
  'spec-eccentricity': './assets/smartball-spec-4.png',
  'putting-system-set': './assets/smartball-slot-putting-system.png',
  'wireless-charger': './assets/smartball-wireless-charger-final.png',
  'distance-practice-screen': './assets/smartball-slot-distance-practice.png',
  'distance-analysis-screen': './assets/smartball-distance-analysis-final-v4.png',
  'slope-practice-screen': './assets/smartball-slope-practice-1.png',
  'slope-selection-screen': './assets/smartball-slope-practice-2-v2.png',
  'field-background': './assets/smartball-field-green-final-v3.png',
  'field-panel': './assets/smartball-field-panel-v2.png',
  'battle-composite': './assets/smartball-battle-overlay-v2.webp',
  'battle-player-a': './assets/smartball-battle-player-a.jpg',
  'battle-player-b': './assets/smartball-battle-player-b.jpg',
  'cta-background': './assets/smartball-cta-bg-v2.jpg'
};
window.SMARTBALL_MEDIA = Object.assign({}, window.SMARTBALL_MEDIA_DEFAULTS);
