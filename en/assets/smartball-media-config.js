/*
 * Admin-page integration point.
 * Save uploaded image URLs by slot ID to publish them on the public page.
 * Empty values retain the current composed design assets.
 */
window.SMARTBALL_MEDIA_STORAGE_KEY = 'ginovo-smartball-media-en';
window.SMARTBALL_MEDIA_SCHEMA_KEY = 'ginovo-smartball-media-schema-en';
window.SMARTBALL_MEDIA_SCHEMA_VERSION = '20260910-system-localized-v6';
window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-distance-media-schema';
window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_VERSION = '20260910-distance-en-v1';
window.SMARTBALL_SLOPE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-slope-media-schema';
window.SMARTBALL_SLOPE_MEDIA_SCHEMA_VERSION = '20260910-slope-en-v1';
window.SMARTBALL_FIELD_MEDIA_SCHEMA_KEY = 'ginovo-smartball-field-media-schema';
window.SMARTBALL_FIELD_MEDIA_SCHEMA_VERSION = '20260904-field-v6';
window.SMARTBALL_BATTLE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-battle-media-schema-en';
window.SMARTBALL_BATTLE_MEDIA_SCHEMA_VERSION = '20260912-battle-en-v3';
window.SMARTBALL_CTA_MEDIA_SCHEMA_KEY = 'ginovo-smartball-cta-media-schema';
window.SMARTBALL_CTA_MEDIA_SCHEMA_VERSION = '20260903-cta-v1';
window.SMARTBALL_MEDIA_DEFAULTS = {
  'anatomy-background': './assets/smartball-page-01-bg.png',
  'spec-weight': './assets/smartball-spec-1.png',
  'spec-size': './assets/smartball-spec-2.png',
  'spec-rebound': './assets/smartball-spec-3.png',
  'spec-eccentricity': './assets/smartball-spec-4.png',
  'putting-system-set': './assets/smartball-slot-putting-system-en-v3.png',
  'wireless-charger': './assets/smartball-wireless-charger-final.png',
  'distance-practice-screen': './assets/smartball-distance-practice-en-v2.png',
  'distance-analysis-screen': './assets/smartball-distance-analysis-en-v2.png',
  'slope-practice-screen': './assets/smartball-slope-options-en-v2.png',
  'slope-selection-screen': './assets/smartball-slope-practice-en-v2.png',
  'field-background': './assets/smartball-field-green-final-v3.png',
  'field-panel': './assets/smartball-field-panel-v2.png',
  'battle-composite': './assets/smartball-battle-overlay-v2.webp',
  'battle-player-a': './assets/smartball-battle-player-a.jpg',
  'battle-player-b': './assets/smartball-battle-player-b.jpg',
  'cta-background': './assets/smartball-cta-bg-v2.jpg'
};
window.SMARTBALL_MEDIA = Object.assign({}, window.SMARTBALL_MEDIA_DEFAULTS);
