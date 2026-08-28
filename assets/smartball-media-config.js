/*
 * 관리자 페이지 연동 지점입니다.
 * 업로드된 이미지 URL을 각 슬롯 ID의 값으로 저장하면 공개 페이지에 반영됩니다.
 * 빈 값은 현재 합성 디자인 이미지를 그대로 보여줍니다.
 */
window.SMARTBALL_MEDIA_STORAGE_KEY = 'ginovo-smartball-media';
window.SMARTBALL_MEDIA_DEFAULTS = {
  'spec-weight': './assets/smartball-spec-1.png',
  'spec-size': './assets/smartball-spec-2.png',
  'spec-rebound': './assets/smartball-spec-3.png',
  'spec-eccentricity': './assets/smartball-spec-4.png',
  'putting-system-set': './assets/smartball-slot-putting-system.png',
    'wireless-charger': './assets/smartball-slot-wireless-charger-labeled.png',
  'distance-practice-screen': './assets/smartball-slot-distance-practice.png',
  'distance-analysis-screen': './assets/smartball-slot-distance-analysis-v2.png',
  'slope-practice-screen': './assets/smartball-slot-slope-practice.png',
  'slope-selection-screen': './assets/smartball-slot-slope-selection.png',
  'battle-panel': './assets/smartball-slot-battle-panel.png',
  'battle-player-a': './assets/smartball-battle-player-a.jpg',
  'battle-player-b': './assets/smartball-battle-player-b.jpg'
};
try {
  var savedSmartballMedia = JSON.parse(localStorage.getItem(window.SMARTBALL_MEDIA_STORAGE_KEY) || '{}');
  if (savedSmartballMedia['distance-analysis-screen'] === './assets/smartball-slot-distance-analysis.png') {
    savedSmartballMedia['distance-analysis-screen'] = window.SMARTBALL_MEDIA_DEFAULTS['distance-analysis-screen'];
    localStorage.setItem(window.SMARTBALL_MEDIA_STORAGE_KEY, JSON.stringify(savedSmartballMedia));
  }
  window.SMARTBALL_MEDIA = Object.assign({}, window.SMARTBALL_MEDIA_DEFAULTS, savedSmartballMedia);
} catch (_) {
  window.SMARTBALL_MEDIA = Object.assign({}, window.SMARTBALL_MEDIA_DEFAULTS);
}
