(function () {
  var targetIds = ['products', 'history', 'about', 'exhibition', 'news', 'contact'];
  var legacyIds = {
    'gt-sec-esg': 'about',
    'gt-sec-history': 'history',
    'gt-sec-location': 'contact'
  };

  function targetId() {
    var id = window.location.hash.slice(1);
    return legacyIds[id] || id;
  }

  function alignSection() {
    var id = targetId();
    if (targetIds.indexOf(id) === -1) return;
    var target = document.getElementById(id);
    if (!target) return;
    if (window.location.hash.slice(1) !== id) window.history.replaceState(null, '', '#' + id);
    window.scrollTo(0, Math.round(target.getBoundingClientRect().top + window.scrollY));
  }

  function alignAfterLayout() {
    window.requestAnimationFrame(function () { window.requestAnimationFrame(alignSection); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', alignAfterLayout, { once: true });
  } else {
    alignAfterLayout();
  }
  window.addEventListener('load', alignAfterLayout);
  window.addEventListener('pageshow', alignAfterLayout);
  window.addEventListener('hashchange', alignAfterLayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignAfterLayout);
}());
