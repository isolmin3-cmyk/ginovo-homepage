(function () {
  var mobileQuery = window.matchMedia('(max-width: 700px)');
  function applyMobileEyebrowBreak(eyebrow) {
    if (!eyebrow) return;
    var copy = eyebrow.textContent.trim();
    var marker = ' The ';
    var markerIndex = copy.indexOf(marker);
    if (markerIndex === -1) return;
    var lineBreak = eyebrow.querySelector('.mobile-cta-break');
    if (!lineBreak) {
      eyebrow.textContent = '';
      eyebrow.appendChild(document.createTextNode(copy.slice(0, markerIndex) + ' '));
      lineBreak = document.createElement('br');
      lineBreak.className = 'mobile-cta-break';
      lineBreak.setAttribute('aria-hidden', 'true');
      eyebrow.appendChild(lineBreak);
      eyebrow.appendChild(document.createTextNode(copy.slice(markerIndex + 1)));
    }
    lineBreak.style.display = mobileQuery.matches ? 'block' : 'none';
  }
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
      applyMobileEyebrowBreak(eyebrow);

      if (media['cta-background'] && cta.dataset.commonCtaBackground !== media['cta-background']) {
        cta.style.setProperty('background-image', 'url("' + media['cta-background'].replace(/"/g, '\\"') + '")', 'important');
        var backgroundImage = cta.querySelector('.ginovo-common-cta-image');
        if (backgroundImage) backgroundImage.src = media['cta-background'];
        cta.dataset.commonCtaBackground = media['cta-background'];
      }
    });
  }

  mobileQuery.addEventListener('change', applyCommonCta);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCommonCta);
  } else {
    applyCommonCta();
  }
  window.addEventListener('load', applyCommonCta, { once: true });
}());
