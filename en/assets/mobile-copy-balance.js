(function () {
  'use strict';

  var mobileQuery = window.matchMedia('(max-width: 700px)');
  var timer;

  function balanceMobileCopy() {
    var selector = 'main h1, main h2, main h3, main h4, main p, main li';

    document.querySelectorAll(selector).forEach(function (element) {
      var hasStructuredContent = Array.prototype.some.call(element.children, function (child) {
        return child.tagName !== 'BR';
      });
      if (hasStructuredContent) return;

      if (element._mobileBalanceOriginalHtml === undefined) {
        element._mobileBalanceOriginalHtml = element.innerHTML;
      }
      element.innerHTML = element._mobileBalanceOriginalHtml;

      if (!mobileQuery.matches || getComputedStyle(element).display === 'none') return;

      var source = document.createElement('div');
      source.innerHTML = element._mobileBalanceOriginalHtml.replace(/<br\b[^>]*>/gi, ' ');
      var text = source.textContent.replace(/\s+/g, ' ').trim();
      var words = text.split(' ');
      if (words.length < 4 || element.clientWidth < 1) return;

      var style = getComputedStyle(element);
      var lineHeight = parseFloat(style.lineHeight);
      var naturalLines = lineHeight > 0
        ? Math.round(element.getBoundingClientRect().height / lineHeight)
        : 1;
      if (naturalLines < 2) return;

      var canvas = balanceMobileCopy.canvas || (balanceMobileCopy.canvas = document.createElement('canvas'));
      var context = canvas.getContext('2d');
      context.font = style.font;
      var space = context.measureText(' ').width;
      var widths = words.map(function (word) { return context.measureText(word).width; });
      var maxWidth = element.clientWidth * 1.01;
      var lineCount = Math.min(naturalLines, words.length);
      var prefix = [0];

      widths.forEach(function (width, index) { prefix.push(prefix[index] + width); });
      function segmentWidth(start, end) {
        return prefix[end] - prefix[start] + space * Math.max(0, end - start - 1);
      }

      var target = segmentWidth(0, words.length) / lineCount;
      var dp = Array.from({ length: lineCount + 1 }, function () {
        return Array(words.length + 1).fill(Infinity);
      });
      var cut = Array.from({ length: lineCount + 1 }, function () {
        return Array(words.length + 1).fill(-1);
      });
      dp[0][0] = 0;

      for (var line = 1; line <= lineCount; line += 1) {
        for (var end = line; end <= words.length; end += 1) {
          for (var start = line - 1; start < end; start += 1) {
            var width = segmentWidth(start, end);
            if (width > maxWidth || !isFinite(dp[line - 1][start])) continue;
            var cost = dp[line - 1][start] + Math.pow(width - target, 2);
            if (cost < dp[line][end]) {
              dp[line][end] = cost;
              cut[line][end] = start;
            }
          }
        }
      }

      if (cut[lineCount][words.length] < 0) return;
      var lines = [];
      var cursor = words.length;
      for (var current = lineCount; current > 0; current -= 1) {
        var previous = cut[current][cursor];
        lines.unshift(words.slice(previous, cursor).join(' '));
        cursor = previous;
      }

      element.replaceChildren();
      lines.forEach(function (value, index) {
        if (index) element.appendChild(document.createElement('br'));
        element.appendChild(document.createTextNode(value));
      });
    });
  }

  function scheduleBalance() {
    window.clearTimeout(timer);
    timer = window.setTimeout(balanceMobileCopy, 120);
  }

  scheduleBalance();
  window.addEventListener('load', function () {
    scheduleBalance();
    window.setTimeout(balanceMobileCopy, 700);
    window.setTimeout(balanceMobileCopy, 1400);
  }, { once: true });
  window.addEventListener('resize', scheduleBalance, { passive: true });
}());
