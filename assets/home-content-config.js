window.HOME_CONTENT = {
  section1Eyebrow: '지노버 스마트 골프공',
  section1Title: '골프공의 한계를 넘어,\n골프 분석의 새로운 표준이 되다.',
  section1Body: '독창성, 우수성, 신뢰성, 파급효과 새로운 골프 분석의 기준을 제시하는 혁신적인 스마트 골프 솔루션',
  section2Title: 'Unity 기반의 물리엔진을 통한 골프혁신',
  section2Body: '퍼팅 샷에 대한 7대 구질 정보 가시화\n블루투스 통신을 통한 샷 정보 실시간 전송',
  section3Title: '감에 의존하는 지루한 연습에서 데이터를 기반으로 한 체계적 연습',
  section3Body: '목표 거리 설정 - 통계분석 - 반복 연습 - 퍼팅 대결 실전 연습',
  section4Title: '지노버 경사 퍼팅매트'
};

window.HOME_MEDIA = {
  section1Background: './assets/home/section-1-background.jpg',
  section2Background: './assets/home/section-2-background.jpg',
  section2Visual: './assets/home/section-2-visual.png',
  section3Background: './assets/home/section-3-background.jpg',
  section3Visual: './assets/home/section-3-visual.png',
  section4Background: './assets/home/section-4-background.jpg',
  section4Image1: './assets/putting-slope.png',
  section4Image2: './assets/home/putting-course.jpg.png',
  section4Image3: './assets/home/putting-kit.jpg.png?v=20260828-2',
  esgImage: './assets/home/esg-visual.png',
  newsImage3: './assets/home/news-exhibition.png'
};

window.HOME_UNITY_STORAGE_KEY = 'ginovo-home-unity-section-v1';
window.HOME_UNITY_DEFAULTS = {
  background: './assets/home/unity-section-background.jpg',
  visual: './assets/home/unity-section-phone.png',
  title: 'Unity 기반의 물리엔진을 통한 골프혁신',
  subtitle1: '퍼팅 샷에 대한 7대 구질 정보 가시화',
  subtitle2: '블루투스 통신을 통한 샷 정보 실시간 전송',
  metrics: [
    { label: '3D 볼 궤적', english: '3D Trajectory', value: '' },
    { label: '이동 거리', english: 'Total Distance', value: '5.1 m' },
    { label: '발사각', english: 'Launch Angle', value: '3.5°' },
    { label: '타점 위치', english: 'Impact Point', value: '' },
    { label: '볼 속도', english: 'Ball Speed', value: '1.2 m/s' },
    { label: '스키드', english: 'Skid', value: '2.1 cm' },
    { label: '회전량', english: 'Spin Rate', value: '120 rpm' }
  ]
};

window.getHomeUnityContent = function () {
  try {
    var saved = JSON.parse(localStorage.getItem(window.HOME_UNITY_STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return JSON.parse(JSON.stringify(window.HOME_UNITY_DEFAULTS));
    return Object.assign({}, window.HOME_UNITY_DEFAULTS, saved, {
      metrics: window.HOME_UNITY_DEFAULTS.metrics.map(function (metric, index) {
        return Object.assign({}, metric, Array.isArray(saved.metrics) ? saved.metrics[index] : null);
      })
    });
  } catch (_) {
    return JSON.parse(JSON.stringify(window.HOME_UNITY_DEFAULTS));
  }
};

window.HOME_UNITY_IMAGE_DB = 'ginovo-home-unity-images-v1';
window.openHomeUnityImageDB = function () {
  return new Promise(function (resolve, reject) {
    var request = indexedDB.open(window.HOME_UNITY_IMAGE_DB, 1);
    request.onupgradeneeded = function () { request.result.createObjectStore('images'); };
    request.onsuccess = function () { resolve(request.result); };
    request.onerror = function () { reject(request.error); };
  });
};
window.getHomeUnityImage = async function (key) {
  var db = await window.openHomeUnityImageDB();
  return new Promise(function (resolve, reject) {
    var request = db.transaction('images').objectStore('images').get(key);
    request.onsuccess = function () { resolve(request.result || null); };
    request.onerror = function () { reject(request.error); };
  });
};
window.setHomeUnityImage = async function (key, file) {
  var db = await window.openHomeUnityImageDB();
  return new Promise(function (resolve, reject) {
    var transaction = db.transaction('images', 'readwrite');
    transaction.objectStore('images').put(file, key);
    transaction.oncomplete = function () { resolve(); };
    transaction.onerror = function () { reject(transaction.error); };
  });
};
window.clearHomeUnityImages = async function () {
  var db = await window.openHomeUnityImageDB();
  return new Promise(function (resolve, reject) {
    var transaction = db.transaction('images', 'readwrite');
    transaction.objectStore('images').clear();
    transaction.oncomplete = function () { resolve(); };
    transaction.onerror = function () { reject(transaction.error); };
  });
};
