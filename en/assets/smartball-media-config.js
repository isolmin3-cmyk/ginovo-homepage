/*
 * Admin-page integration point.
 * Save uploaded image URLs by slot ID to publish them on the public page.
 * Empty values retain the current composed design assets.
 */
window.SMARTBALL_MEDIA_STORAGE_KEY = 'ginovo-smartball-media';
window.SMARTBALL_MEDIA_SCHEMA_KEY = 'ginovo-smartball-media-schema';
window.SMARTBALL_MEDIA_SCHEMA_VERSION = '20260910-system-localized-v6';
window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-distance-media-schema';
window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_VERSION = '20260910-distance-en-v1';
window.SMARTBALL_SLOPE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-slope-media-schema';
window.SMARTBALL_SLOPE_MEDIA_SCHEMA_VERSION = '20260910-slope-en-v1';
window.SMARTBALL_FIELD_MEDIA_SCHEMA_KEY = 'ginovo-smartball-field-media-schema';
window.SMARTBALL_FIELD_MEDIA_SCHEMA_VERSION = '20260904-field-v6';
window.SMARTBALL_BATTLE_MEDIA_SCHEMA_KEY = 'ginovo-smartball-battle-media-schema';
window.SMARTBALL_BATTLE_MEDIA_SCHEMA_VERSION = '20260911-battle-en-v2';
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
try {
  var savedSmartballMedia = JSON.parse(localStorage.getItem(window.SMARTBALL_MEDIA_STORAGE_KEY) || '{}');
  if (localStorage.getItem(window.SMARTBALL_MEDIA_SCHEMA_KEY) !== window.SMARTBALL_MEDIA_SCHEMA_VERSION) {
    delete savedSmartballMedia['wireless-charger'];
    delete savedSmartballMedia['putting-system-set'];
    localStorage.setItem(window.SMARTBALL_MEDIA_STORAGE_KEY, JSON.stringify(savedSmartballMedia));
    localStorage.setItem(window.SMARTBALL_MEDIA_SCHEMA_KEY, window.SMARTBALL_MEDIA_SCHEMA_VERSION);
  }
  if (localStorage.getItem(window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_KEY) !== window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_VERSION) {
    delete savedSmartballMedia['distance-practice-screen'];
    delete savedSmartballMedia['distance-analysis-screen'];
    localStorage.setItem(window.SMARTBALL_MEDIA_STORAGE_KEY, JSON.stringify(savedSmartballMedia));
    localStorage.setItem(window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_KEY, window.SMARTBALL_DISTANCE_MEDIA_SCHEMA_VERSION);
  }
  if (localStorage.getItem(window.SMARTBALL_SLOPE_MEDIA_SCHEMA_KEY) !== window.SMARTBALL_SLOPE_MEDIA_SCHEMA_VERSION) {
    delete savedSmartballMedia['slope-practice-screen'];
    delete savedSmartballMedia['slope-selection-screen'];
    localStorage.setItem(window.SMARTBALL_MEDIA_STORAGE_KEY, JSON.stringify(savedSmartballMedia));
    localStorage.setItem(window.SMARTBALL_SLOPE_MEDIA_SCHEMA_KEY, window.SMARTBALL_SLOPE_MEDIA_SCHEMA_VERSION);
  }
  if (localStorage.getItem(window.SMARTBALL_FIELD_MEDIA_SCHEMA_KEY) !== window.SMARTBALL_FIELD_MEDIA_SCHEMA_VERSION) {
    delete savedSmartballMedia['field-background'];
    delete savedSmartballMedia['field-panel'];
    localStorage.setItem(window.SMARTBALL_MEDIA_STORAGE_KEY, JSON.stringify(savedSmartballMedia));
    localStorage.setItem(window.SMARTBALL_FIELD_MEDIA_SCHEMA_KEY, window.SMARTBALL_FIELD_MEDIA_SCHEMA_VERSION);
  }
  if (localStorage.getItem(window.SMARTBALL_BATTLE_MEDIA_SCHEMA_KEY) !== window.SMARTBALL_BATTLE_MEDIA_SCHEMA_VERSION) {
    delete savedSmartballMedia['battle-background'];
    delete savedSmartballMedia['battle-panel'];
    delete savedSmartballMedia['battle-composite'];
    delete savedSmartballMedia['battle-player-a'];
    delete savedSmartballMedia['battle-player-b'];
    localStorage.setItem(window.SMARTBALL_MEDIA_STORAGE_KEY, JSON.stringify(savedSmartballMedia));
    localStorage.setItem(window.SMARTBALL_BATTLE_MEDIA_SCHEMA_KEY, window.SMARTBALL_BATTLE_MEDIA_SCHEMA_VERSION);
  }
  if (localStorage.getItem(window.SMARTBALL_CTA_MEDIA_SCHEMA_KEY) !== window.SMARTBALL_CTA_MEDIA_SCHEMA_VERSION) {
    delete savedSmartballMedia['cta-background'];
    localStorage.setItem(window.SMARTBALL_MEDIA_STORAGE_KEY, JSON.stringify(savedSmartballMedia));
    localStorage.setItem(window.SMARTBALL_CTA_MEDIA_SCHEMA_KEY, window.SMARTBALL_CTA_MEDIA_SCHEMA_VERSION);
  }
  if (savedSmartballMedia['distance-analysis-screen'] === './assets/smartball-slot-distance-analysis.png') {
    savedSmartballMedia['distance-analysis-screen'] = window.SMARTBALL_MEDIA_DEFAULTS['distance-analysis-screen'];
    localStorage.setItem(window.SMARTBALL_MEDIA_STORAGE_KEY, JSON.stringify(savedSmartballMedia));
  }
  window.SMARTBALL_MEDIA = Object.assign({}, window.SMARTBALL_MEDIA_DEFAULTS, savedSmartballMedia);
} catch (_) {
  window.SMARTBALL_MEDIA = Object.assign({}, window.SMARTBALL_MEDIA_DEFAULTS);
}
