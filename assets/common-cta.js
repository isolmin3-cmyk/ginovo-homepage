(function () {
  function applyCommonCta() {
    var content = window.SMARTBALL_CONTENT || {};
    var media = window.SMARTBALL_MEDIA || {};
    document.querySelectorAll('.cta, .ginovo-common-cta').forEach(function (cta) {
      var eyebrow = cta.querySelector('.cta-copy p, .ginovo-common-cta-content p');
      var title = cta.querySelector('.cta-copy h2, .ginovo-common-cta-content h2');
      if (eyebrow && content.ctaEyebrow && eyebrow.textContent !== content.ctaEyebrow) {
        eyebrow.textContent = content.ctaEyebrow;
      }
      if (title && content.ctaTitle && title.textContent !== content.ctaTitle) {
        title.textContent = content.ctaTitle;
      }

      if (media['cta-background'] && cta.dataset.commonCtaBackground !== media['cta-background']) {
        cta.style.setProperty('background-image', 'url("' + media['cta-background'].replace(/"/g, '\\"') + '")', 'important');
        var backgroundImage = cta.querySelector('.ginovo-common-cta-image');
        if (backgroundImage) backgroundImage.src = media['cta-background'];
        cta.dataset.commonCtaBackground = media['cta-background'];
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCommonCta);
  } else {
    applyCommonCta();
  }
  window.addEventListener('load', applyCommonCta, { once: true });
}());
