window.HOME_CONTENT = {
  section1Eyebrow: 'GINOVO Smart Golf Ball',
  section1Title: 'Beyond the Limits of Golf Balls,\nA New Standard in Golf Analysis.',
  section1Body: 'Original. Advanced. Reliable. Impactful.\nA smart golf solution that sets a new standard\nfor golf analysis.',
  section2Title: 'Golf Innovation Powered by a Unity-Based Physics Engine',
  section2Body: 'Visualize Seven Essential Putting-Shot Metrics\nTransmit Shot Data in Real Time via Bluetooth',
  section3Title: 'Move Beyond Feel-Based Repetition to Systematic, Data-Driven Practice',
  section3Body: 'Set Target Distance – Analyze Statistics – Repeat Practice – Compete in Putting Matches',
  section4Title: 'GINOVO \nSlope Putting Mat'
};

window.HOME_MEDIA = {
  section1Background: './assets/home/section-1-background.jpg',
  section2Background: './assets/home/section-2-background.jpg',
  section2Visual: './assets/home/section-2-visual.png',
  section3Background: './assets/home/section-3-background.jpg',
  section3Visual: './assets/home/section-3-visual.png',
  section4Background: './assets/home/section-4-background.jpg',
  section4Image1: './assets/putting-slope-en.png',
  section4Image2: './assets/home/putting-course.jpg.png',
  section4Image3: './assets/home/putting-kit.jpg.png?v=20260828-2',
  esgImage: './assets/home/esg-visual.png',
  newsImage3: './assets/home/news-exhibition.png'
};

window.HOME_UNITY_STORAGE_KEY = 'ginovo-home-unity-section-v3';
window.HOME_UNITY_DEFAULTS = {
  background: './assets/home/unity-section-background.jpg?v=20260901-4',
  visual: './assets/home/unity-section-phone.png',
  title: 'Golf Innovation Powered by a Unity-Based Physics Engine',
  subtitle1: 'Visualize Seven Essential Putting-Shot Metrics',
  subtitle2: 'Transmit Shot Data in Real Time via Bluetooth',
  metrics: [
    { label: '3D Ball Trajectory', english: '3D Trajectory', value: '' },
    { label: 'Total Distance', english: 'Total Distance', value: '5.1 m' },
    { label: 'Launch Angle', english: 'Launch Angle', value: '3.5°' },
    { label: 'Impact Point', english: 'Impact Point', value: '' },
    { label: 'Ball Speed', english: 'Ball Speed', value: '1.2 m/s' },
    { label: 'Skid', english: 'Skid', value: '2.1 cm' },
    { label: 'Spin Rate', english: 'Spin Rate', value: '120 rpm' }
  ]
};

window.HOME_PRACTICE_STORAGE_KEY = 'ginovo-home-practice-four-points-v1';
window.HOME_PRACTICE_DEFAULTS = {
  heading: 'Move Beyond Feel-Based Repetition to Systematic, Data-Driven Practice',
  subtitle: 'Set Target Distance – Analyze Statistics – Repeat Practice – Compete in Putting Matches',
  title: 'A Complete Smart-Golf System Built for Focused Putting Practice',
  points: [
    { label: 'Point 1', body: 'Real-Time Data Storage (Analysis)' },
    { label: 'Point 2', body: 'Fine Target Distance / Green-Speed Settings (Diagnosis)' },
    { label: 'Point 3', body: 'Repeat Practice at Weak Distances (Correction)' },
    { label: 'Point 4', body: 'Match-Based Putting Practice (Competition)' }
  ]
};

window.getHomePracticeContent = function () {
  try {
    var saved = JSON.parse(localStorage.getItem(window.HOME_PRACTICE_STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return JSON.parse(JSON.stringify(window.HOME_PRACTICE_DEFAULTS));
    return {
      heading: saved.heading || window.HOME_PRACTICE_DEFAULTS.heading,
      subtitle: saved.subtitle || window.HOME_PRACTICE_DEFAULTS.subtitle,
      title: saved.title || window.HOME_PRACTICE_DEFAULTS.title,
      points: window.HOME_PRACTICE_DEFAULTS.points.map(function (point, index) {
        return Object.assign({}, point, saved.points && saved.points[index]);
      })
    };
  } catch (_) {
    return JSON.parse(JSON.stringify(window.HOME_PRACTICE_DEFAULTS));
  }
};

window.HOME_PRACTICE_IMAGE_DB = 'ginovo-home-practice-images-v1';
window.openHomePracticeImageDB = function () {
  return new Promise(function (resolve, reject) {
    var request = indexedDB.open(window.HOME_PRACTICE_IMAGE_DB, 1);
    request.onupgradeneeded = function () { request.result.createObjectStore('images'); };
    request.onsuccess = function () { resolve(request.result); };
    request.onerror = function () { reject(request.error); };
  });
};
window.getHomePracticeImage = async function (key) {
  var db = await window.openHomePracticeImageDB();
  return new Promise(function (resolve, reject) {
    var request = db.transaction('images').objectStore('images').get(key);
    request.onsuccess = function () { resolve(request.result || null); };
    request.onerror = function () { reject(request.error); };
  });
};
window.setHomePracticeImage = async function (key, file) {
  var db = await window.openHomePracticeImageDB();
  return new Promise(function (resolve, reject) {
    var transaction = db.transaction('images', 'readwrite');
    transaction.objectStore('images').put(file, key);
    transaction.oncomplete = function () { resolve(); };
    transaction.onerror = function () { reject(transaction.error); };
  });
};
window.clearHomePracticeImages = async function () {
  var db = await window.openHomePracticeImageDB();
  return new Promise(function (resolve, reject) {
    var transaction = db.transaction('images', 'readwrite');
    transaction.objectStore('images').clear();
    transaction.oncomplete = function () { resolve(); };
    transaction.onerror = function () { reject(transaction.error); };
  });
};

window.getHomeUnityContent = function () {
  try {
    var saved = JSON.parse(localStorage.getItem(window.HOME_UNITY_STORAGE_KEY) || 'null');
    if (!saved || typeof saved !== 'object') return JSON.parse(JSON.stringify(window.HOME_UNITY_DEFAULTS));
    return Object.assign({}, window.HOME_UNITY_DEFAULTS, saved, {
      background: window.HOME_UNITY_DEFAULTS.background,
      metrics: window.HOME_UNITY_DEFAULTS.metrics.map(function (metric, index) {
        return Object.assign({}, metric, Array.isArray(saved.metrics) ? saved.metrics[index] : null);
      })
    });
  } catch (_) {
    return JSON.parse(JSON.stringify(window.HOME_UNITY_DEFAULTS));
  }
};

window.HOME_UNITY_IMAGE_DB = 'ginovo-home-unity-images-v3';
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
