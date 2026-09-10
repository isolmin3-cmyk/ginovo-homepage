(function () {
  'use strict';

  function initialize(language, index, puttingHeader) {
    if (language.dataset.languageMenuReady === 'true') return;
    var button = puttingHeader ? language.querySelector(':scope > a') : language.querySelector('.language-button');
    var menu = puttingHeader ? language.querySelector(':scope > .ginovo-dropdown-wrap') : language.querySelector('.language-menu');
    if (!button || !menu) return;

    language.dataset.languageMenuReady = 'true';
    var menuId = menu.id || (puttingHeader ? 'putting-language-menu-' : 'language-menu-') + (index + 1);
    menu.id = menuId;
    if (puttingHeader) {
      button.setAttribute('role', 'button');
      button.setAttribute('aria-label', '언어 선택');
    }
    button.setAttribute('aria-controls', menuId);
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');

    function setOpen(open) {
      language.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    button.addEventListener('click', function (event) {
      if (puttingHeader) event.preventDefault();
      event.stopPropagation();
      setOpen(!language.classList.contains('is-open'));
    });
    menu.addEventListener('pointerdown', function (event) {
      event.stopPropagation();
    });
    document.addEventListener('click', function (event) {
      if (!language.contains(event.target)) setOpen(false);
    });
    language.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false);
        button.focus();
      }
    });
  }

  function initializeAll() {
    document.querySelectorAll('.language').forEach(function (language, index) {
      initialize(language, index, false);
    });
    document.querySelectorAll('.ginovo-lang').forEach(function (language, index) {
      initialize(language, index, true);
    });
  }

  initializeAll();
  document.addEventListener('DOMContentLoaded', initializeAll, { once: true });
  new MutationObserver(initializeAll).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}());
