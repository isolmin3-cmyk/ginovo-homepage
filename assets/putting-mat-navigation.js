(function () {
  function initPuttingMatNavigation() {
    var header = document.querySelector('.ginovo-header');
    var menuToggle = document.querySelector('[data-putting-menu-toggle]');
    var navigation = document.getElementById('putting-main-navigation');
    var aboutToggle = document.querySelector('[data-putting-about-toggle]');
    if (!header || !menuToggle || !navigation || menuToggle.dataset.puttingNavigationReady === 'true') return;

    var replacementMenuToggle = menuToggle.cloneNode(true);
    menuToggle.replaceWith(replacementMenuToggle);
    menuToggle = replacementMenuToggle;
    if (aboutToggle) {
      var replacementAboutToggle = aboutToggle.cloneNode(true);
      aboutToggle.replaceWith(replacementAboutToggle);
      aboutToggle = replacementAboutToggle;
    }

    var aboutItem = aboutToggle && aboutToggle.closest('.ginovo-nav-item');
    var mobileQuery = window.matchMedia('(max-width: 700px)');
    menuToggle.dataset.puttingNavigationReady = 'true';

    function setAbout(open) {
      if (!aboutItem || !aboutToggle) return;
      aboutItem.classList.toggle('is-about-open', open);
      aboutToggle.setAttribute('aria-expanded', String(open));
    }

    function setMenu(open) {
      header.classList.toggle('is-menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', document.documentElement.lang === 'en'
        ? (open ? 'Close menu' : 'Open menu')
        : (open ? '메뉴 닫기' : '메뉴 열기'));
      if (!open) setAbout(false);
    }

    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    if (aboutToggle) {
      aboutToggle.addEventListener('click', function () {
        setAbout(aboutToggle.getAttribute('aria-expanded') !== 'true');
      });
    }
    document.addEventListener('click', function (event) {
      if (aboutItem && !aboutItem.contains(event.target)) setAbout(false);
      if (mobileQuery.matches && !header.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });
    var closeOnBreakpointChange = function () { setMenu(false); };
    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', closeOnBreakpointChange);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(closeOnBreakpointChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPuttingMatNavigation, { once: true });
  } else {
    initPuttingMatNavigation();
  }
  window.addEventListener('load', initPuttingMatNavigation, { once: true });
}());
