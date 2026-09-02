(function () {
  function applyCommonCta() {
    var content = window.SMARTBALL_CONTENT || {};
    var media = window.SMARTBALL_MEDIA || {};
    var cta = document.querySelector('.cta, .ginovo-common-cta');
    if (!cta) return;

    var eyebrow = cta.querySelector('.cta-copy p, .ginovo-common-cta-content p');
    var title = cta.querySelector('.cta-copy h2, .ginovo-common-cta-content h2');
    if (eyebrow && content.ctaEyebrow) eyebrow.textContent = content.ctaEyebrow;
    if (title && content.ctaTitle) title.textContent = content.ctaTitle;

    if (media['cta-background']) {
      cta.style.setProperty('background-image', 'url("' + media['cta-background'].replace(/"/g, '\\"') + '")', 'important');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCommonCta);
  } else {
    applyCommonCta();
  }
}());
