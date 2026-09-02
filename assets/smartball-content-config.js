/*
 * 스마트 골프공 페이지 문구 관리 지점입니다.
 * 추후 관리자 페이지에서 아래 값을 저장하도록 연결하면 이미지 수정 없이 반영됩니다.
 */
window.SMARTBALL_CONTENT_STORAGE_KEY = 'ginovo-smartball-content';
window.SMARTBALL_CONTENT_DEFAULTS = {
  anatomyTitle: '스마트 골프공 안에 시뮬레이터 구현',
  anatomySubtitle: '일반 골프공의 타구감과 성능을 구현한 스마트 골프공',
  anatomyLayerTitle: '레이어 (Layer)',
  anatomyLayerDescription: '아이오노머 충격 흡수 구조 내구성 확보',
  anatomyElastomerTitle: '탄성체 (Elastomer)',
  anatomyElastomerDescription: '반발력 확보 및 코어 편심량.\n완벽 제어 기술 적용.',
  anatomyShellTitle: '보호구 (Protective Shell)',
  anatomyShellDescription: '',
  anatomyCoverTitle: '외피 (Outer Cover)',
  anatomyCoverDescription: '공기 저항을 최소화하는 딤플.\n공인구 직경 42.67mm 유지.',
  specTitle: '물리적 스펙 목표 100% 달성 현황',
  specWeight: '무게 : 45.93g',
  specSize: '외경 사이즈 : 42.67mm',
  specRebound: '반발력 : 72.1',
  specEccentricity: '편심도 : 0.1%',
  systemTitle: 'GINOVO 퍼팅 시스템',
  systemSubtitle: '퍼팅 연습에 집중할 수 있는 스마트 골프의 완벽한 구성',
  systemDescription: '스마트 골프공, 무선 충전기, 퍼팅매트, 반사판, 모바일 거치대 set 구성',
  chargerTitle: '스마트 무선 충전 시스템',
  chargerSubtitle: '장소 제약 없는 휴대 가능한 무선 충전기',
  chargerDeviceLabel: '무선 충전기',
  chargerBallLabel: '스마트 골프공(1구)',
  chargerNote1: 'On-chip thermal management를 통한 캡슐 내 발열 제어',
  chargerNote2: '상태 가시성을 확보하는 3색 LED 인디케이터',
  distanceTitle: '목표 거리 / 그린 스피드별 반복적이고 정량적인 퍼팅 연습',
  distancePoint1: '거리 제약 없는 완벽한 퍼팅 연습 지원',
  distancePoint2: '목표거리 달성을 위한 반복 연습을 통한 정량적 스트로크 지원',
  slopeTitle: '그린 분석을 통한 경사별 유연한 퍼팅 연습 지원',
  slopePoint1: '나만의 경사 설계로 반복 연습을 통한 정량적 스트로크 지원',
  fieldTitle: '필드 그린에서 거리 & 경사 영향 퍼팅 연습을 자유롭게',
  fieldSubtitle: '실제 그린 환경에서 퍼팅의 경사 영향 분석 및 그린 스피드 피드백',
  fieldKickerLine1: '자유로운 연습부터',
  fieldKickerAccent: '실전 그린 정밀 분석',
  fieldSummary: '언제 어디서나 실제 필드의 그린 감각을 완벽하게 재현합니다.',
  fieldFeature1Title: '장소 제한 없는 자유로운 퍼팅 연습',
  fieldFeature1Description: '실제 필드 그린은 물론 연습장, 가정용 연습 매트까지 어떤 공간에서든 제약 없이 자유롭게 연습할 수 있습니다.',
  fieldFeature2Title: '경사 영향 분석 & 그린 스피드 피드백',
  fieldFeature2Description: '실제 그린 환경에서의 경사도에 따른 공의 궤적 영향을 정밀 분석하고, 그린 스피드에 맞춘 최적의 거리감 피드백을 제공합니다.',
  fieldBadge1Title: 'ANYWHERE',
  fieldBadge1Description: '필드 & 다양한 매트 지원',
  fieldBadge2Title: 'REAL - TIME',
  fieldBadge2Description: '경사도 및 스피드 실시간 데이터'
};
try {
  var savedSmartballContent = JSON.parse(localStorage.getItem(window.SMARTBALL_CONTENT_STORAGE_KEY) || '{}');
  var smartballContentMigrated = false;
  if (savedSmartballContent.anatomyTitle === '일반 골프공의 타구감과 성능을 구현한 스마트 골프공') {
    savedSmartballContent.anatomyTitle = window.SMARTBALL_CONTENT_DEFAULTS.anatomyTitle;
    savedSmartballContent.anatomySubtitle = window.SMARTBALL_CONTENT_DEFAULTS.anatomySubtitle;
    smartballContentMigrated = true;
  }
  if (savedSmartballContent.specEccentricity === '편심도 : 0.095%') {
    savedSmartballContent.specEccentricity = window.SMARTBALL_CONTENT_DEFAULTS.specEccentricity;
    smartballContentMigrated = true;
  }
  if (smartballContentMigrated) localStorage.setItem(window.SMARTBALL_CONTENT_STORAGE_KEY, JSON.stringify(savedSmartballContent));
  window.SMARTBALL_CONTENT = Object.assign({}, window.SMARTBALL_CONTENT_DEFAULTS, savedSmartballContent);
} catch (_) {
  window.SMARTBALL_CONTENT = Object.assign({}, window.SMARTBALL_CONTENT_DEFAULTS);
}
