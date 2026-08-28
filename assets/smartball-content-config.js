/*
 * 스마트 골프공 페이지 문구 관리 지점입니다.
 * 추후 관리자 페이지에서 아래 값을 저장하도록 연결하면 이미지 수정 없이 반영됩니다.
 */
window.SMARTBALL_CONTENT_STORAGE_KEY = 'ginovo-smartball-content';
window.SMARTBALL_CONTENT_DEFAULTS = {
  anatomyTitle: '일반 골프공의 타구감과 성능을 구현한 스마트 골프공',
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
  specEccentricity: '편심도 : 0.095%',
  systemTitle: 'GINOVO 퍼팅 시스템',
  systemSubtitle: '퍼팅 연습에 집중할 수 있는 스마트 골프의 완벽한 구성',
  systemDescription: '스마트 골프공, 무선 충전기, 퍼팅매트, 반사판, 모바일 거치대 set 구성',
  chargerTitle: '스마트 무선 충전 시스템',
  chargerSubtitle: '장소 제약 없는 휴대 가능한 무선 충전기',
  chargerNote1: 'On-chip thermal management를 통한 캡슐 내 발열 제어',
  chargerNote2: '상태 가시성을 확보하는 3색 LED 인디케이터',
  distanceTitle: '목표 거리 / 그린 스피드별 반복적이고 정량적인 퍼팅 연습',
  distancePoint1: '거리 제약 없는 완벽한 퍼팅 연습 지원',
  distancePoint2: '목표거리 달성을 위한 반복 연습을 통한 정량적 스트로크 지원'
};
try {
  window.SMARTBALL_CONTENT = Object.assign({}, window.SMARTBALL_CONTENT_DEFAULTS, JSON.parse(localStorage.getItem(window.SMARTBALL_CONTENT_STORAGE_KEY) || '{}'));
} catch (_) {
  window.SMARTBALL_CONTENT = Object.assign({}, window.SMARTBALL_CONTENT_DEFAULTS);
}
