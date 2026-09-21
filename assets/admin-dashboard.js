(function () {
  'use strict';

  var SESSION_KEY = 'ginovo-admin-authenticated-session';
  var isEnglish = document.documentElement.lang === 'en';
  var visualEditorUrl = './index.html?edit=1';
  var requestedEditorUrl = sessionStorage.getItem('ginovo-admin-return');
  var auth = window.GINOVO_ADMIN_AUTH;

  if (requestedEditorUrl) {
    try {
      var requestedUrl = new URL(requestedEditorUrl, location.href);
      if (requestedUrl.origin === location.origin && requestedUrl.pathname.indexOf('/admin') < 0) {
        visualEditorUrl = requestedUrl.pathname + requestedUrl.search + requestedUrl.hash;
      }
    } catch (_) {}
  }

  var t = isEnglish ? {
    title: 'Content Manager', intro: 'Edit website text and images without changing the layout.', preview: 'Live editing', site: 'Open website', logout: 'Log out', login: 'Administrator login', loginHelp: 'Use the invited company email account. Access is limited to active publishers.', email: 'Email', pw: 'Password', enter: 'Log in', forgot: 'Reset password', error: 'Check your email and password, then try again.', denied: 'This account does not have publisher access.', setup: 'Supabase is not connected yet. Add the Project URL and publishable key.', unavailable: 'The login service could not be reached. Check your network and try again.', sending: 'Signing in…', resetSent: 'A password reset link was sent if the account is registered.', resetPrompt: 'Enter your email first.', newPassword: 'New password', updatePassword: 'Update password', passwordUpdated: 'Your password was updated. Sign in again.', passwordShort: 'Use at least 10 characters.', menu: 'Menu', mat: 'Putting Mat', ball: 'Smart Golf Ball', home: 'Home', sections: 'EDIT SECTIONS'
  } : {
    title: '콘텐츠 관리자', intro: '홈페이지 구조를 유지하면서 문구와 이미지를 편집합니다.', preview: '실시간 편집', site: '홈페이지 열기', logout: '로그아웃', login: '관리자 로그인', loginHelp: '초대받은 회사 이메일 계정으로 로그인하세요. 활성화된 게시 담당자만 접근할 수 있습니다.', email: '이메일', pw: '비밀번호', enter: '로그인', forgot: '비밀번호 재설정', error: '이메일과 비밀번호를 확인한 뒤 다시 시도하세요.', denied: '이 계정에는 게시 담당자 권한이 없습니다.', setup: '아직 Supabase 연결값이 설정되지 않았습니다. Project URL과 publishable key를 연결해야 합니다.', unavailable: '로그인 서비스에 연결할 수 없습니다. 네트워크를 확인한 뒤 다시 시도하세요.', sending: '로그인 중…', resetSent: '등록된 계정이면 비밀번호 재설정 링크를 이메일로 보냈습니다.', resetPrompt: '먼저 이메일을 입력해 주세요.', newPassword: '새 비밀번호', updatePassword: '비밀번호 변경', passwordUpdated: '비밀번호를 변경했습니다. 다시 로그인해 주세요.', passwordShort: '비밀번호는 10자 이상 입력해 주세요.', menu: '메뉴', mat: '경사 퍼팅매트', ball: '스마트 골프공', home: '메인 홈', sections: '편집 섹션'
  };

  function messageFor(error) {
    if (!error) return t.error;
    if (error.message === 'SUPABASE_NOT_CONFIGURED') return t.setup;
    if (error.message === 'PUBLISHER_ACCESS_REQUIRED') return t.denied;
    if (/fetch|network|unavailable/i.test(error.message || '')) return t.unavailable;
    return t.error;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
    });
  }

  function setSession(publisher) {
    if (publisher) sessionStorage.setItem(SESSION_KEY, '1');
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function makeLogin() {
    var gate = document.createElement('div');
    gate.className = 'admin-login';
    gate.innerHTML = '<form class="admin-login-card" novalidate>' +
      '<div class="admin-login-logo"><img src="./assets/logo.png" alt="GREEN TALK"></div>' +
      '<h1>' + t.login + '</h1><p>' + t.loginHelp + '</p>' +
      '<div class="admin-setup-note" data-setup-note hidden></div>' +
      '<label for="admin-email">' + t.email + '</label>' +
      '<input id="admin-email" type="email" name="email" autocomplete="username" inputmode="email" required>' +
      '<label for="admin-password">' + t.pw + '</label>' +
      '<div class="admin-password-row"><input id="admin-password" type="password" name="password" autocomplete="current-password" minlength="10" required><button class="admin-password-toggle" type="button" aria-label="' + (isEnglish ? 'Show password' : '비밀번호 표시') + '"><span aria-hidden="true">' + (isEnglish ? 'Show' : '보기') + '</span></button></div>' +
      '<p class="admin-login-error" role="alert" aria-live="assertive"></p>' +
      '<button class="admin-login-submit" type="submit">' + t.enter + '</button>' +
      '<button class="admin-forgot" type="button">' + t.forgot + '</button>' +
      '</form>';
    document.body.appendChild(gate);
    document.body.classList.add('admin-locked');

    var form = gate.querySelector('form');
    var email = gate.querySelector('#admin-email');
    var password = gate.querySelector('#admin-password');
    var submit = gate.querySelector('.admin-login-submit');
    var errorBox = gate.querySelector('[role=alert]');
    var setupNote = gate.querySelector('[data-setup-note]');

    if (!auth || !auth.isConfigured()) {
      setupNote.hidden = false;
      setupNote.textContent = t.setup;
      email.disabled = true;
      password.disabled = true;
      submit.disabled = true;
    }

    gate.querySelector('.admin-password-toggle').addEventListener('click', function () {
      var visible = password.type === 'text';
      password.type = visible ? 'password' : 'text';
      this.setAttribute('aria-label', isEnglish ? (visible ? 'Show password' : 'Hide password') : (visible ? '비밀번호 표시' : '비밀번호 숨기기'));
      this.querySelector('span').textContent = isEnglish ? (visible ? 'Show' : 'Hide') : (visible ? '보기' : '숨기기');
    });

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      errorBox.textContent = '';
      errorBox.classList.remove('is-success');
      if (!form.reportValidity()) return;
      submit.disabled = true;
      submit.textContent = t.sending;
      try {
        var publisher = await auth.signIn(email.value.trim(), password.value);
        setSession(publisher);
        sessionStorage.removeItem('ginovo-admin-return');
        location.replace(visualEditorUrl);
      } catch (error) {
        errorBox.textContent = messageFor(error);
        password.focus();
      } finally {
        submit.disabled = false;
        submit.textContent = t.enter;
      }
    });

    gate.querySelector('.admin-forgot').addEventListener('click', async function () {
      errorBox.textContent = '';
      errorBox.classList.remove('is-success');
      if (!email.value.trim()) {
        errorBox.textContent = t.resetPrompt;
        email.focus();
        return;
      }
      this.disabled = true;
      try {
        await auth.sendPasswordReset(email.value.trim());
        errorBox.classList.add('is-success');
        errorBox.textContent = t.resetSent;
      } catch (error) {
        errorBox.textContent = messageFor(error);
      } finally {
        this.disabled = false;
      }
    });
  }

  function makeRecovery() {
    var gate = document.createElement('div');
    gate.className = 'admin-login';
    gate.innerHTML = '<form class="admin-login-card" novalidate>' +
      '<div class="admin-login-logo"><img src="./assets/logo.png" alt="GREEN TALK"></div>' +
      '<h1>' + t.updatePassword + '</h1>' +
      '<p>' + (isEnglish ? 'Choose a new password for your administrator account.' : '관리자 계정에서 사용할 새 비밀번호를 입력하세요.') + '</p>' +
      '<label for="admin-new-password">' + t.newPassword + '</label>' +
      '<input id="admin-new-password" type="password" autocomplete="new-password" minlength="10" required>' +
      '<p class="admin-login-error" role="alert" aria-live="assertive"></p>' +
      '<button class="admin-login-submit" type="submit">' + t.updatePassword + '</button>' +
      '</form>';
    document.body.appendChild(gate);
    document.body.classList.add('admin-locked');
    gate.querySelector('form').addEventListener('submit', async function (event) {
      event.preventDefault();
      var password = gate.querySelector('#admin-new-password');
      var errorBox = gate.querySelector('[role=alert]');
      var button = gate.querySelector('button[type=submit]');
      if (password.value.length < 10) {
        errorBox.textContent = t.passwordShort;
        password.focus();
        return;
      }
      button.disabled = true;
      try {
        await auth.updatePassword(password.value);
        await auth.signOut();
        setSession(null);
        errorBox.classList.add('is-success');
        errorBox.textContent = t.passwordUpdated;
        setTimeout(function () { location.replace('./admin.html'); }, 1000);
      } catch (error) {
        errorBox.textContent = messageFor(error);
        button.disabled = false;
      }
    });
  }

  function classify(title) {
    if (/퍼팅매트|Putting Mat|90cm/.test(title)) return t.mat;
    if (/골프공|Golf Ball|스펙|거리|경사 연습|필드|대결|CTA/.test(title)) return t.ball;
    return t.home;
  }

  function buildShell(publisher) {
    var main = document.querySelector('main');
    if (!main) return;
    document.body.classList.add('admin-ready');
    document.body.classList.remove('admin-locked');
    var candidates = Array.from(main.querySelectorAll(':scope > h1, :scope > .admin-section')).map(function (element, index) {
      var heading = element.matches('h1') ? element : element.querySelector('h1');
      if (!heading) return null;
      var target = element.matches('h1') && element.nextElementSibling && element.nextElementSibling.tagName === 'FORM' ? element.nextElementSibling : element;
      if (!target.id) target.id = 'admin-section-' + index;
      return { id: target.id, title: heading.textContent.trim(), group: classify(heading.textContent) };
    }).filter(Boolean);
    var groups = {};
    candidates.forEach(function (item) { (groups[item.group] || (groups[item.group] = [])).push(item); });
    var nav = Object.keys(groups).map(function (group) {
      return '<div class="admin-nav-group">' + group + '</div>' + groups[group].map(function (item) {
        return '<a href="#' + item.id + '">' + item.title.replace(/ 관리$/, '') + '</a>';
      }).join('');
    }).join('');
    var shell = document.createElement('div');
    shell.className = 'admin-shell';
    shell.innerHTML = '<aside class="admin-sidebar"><div class="admin-brand"><span class="admin-brand-badge">G</span> GINOVO ADMIN</div><nav class="admin-nav" aria-label="' + t.sections + '">' + nav + '</nav><div class="admin-sidebar-footer"><div class="admin-user"><strong>' + escapeHtml(publisher.displayName || publisher.email) + '</strong><span>' + escapeHtml(publisher.email) + '</span></div><button type="button" data-admin-logout>' + t.logout + '</button></div></aside><div class="admin-workspace"><header class="admin-topbar"><div class="admin-topbar-title"><button class="admin-mobile-menu" type="button" aria-label="' + t.menu + '" aria-expanded="false"><span aria-hidden="true">☰</span></button><h2>' + t.title + '</h2></div><div class="admin-topbar-actions"><span class="admin-mode">' + t.preview + '</span><a href="./index.html?edit=1">' + t.site + '</a></div></header><div class="admin-content"><section class="admin-hero"><h1>' + t.title + '</h1><p>' + t.intro + '</p></section></div></div>';
    var content = shell.querySelector('.admin-content');
    main.parentNode.insertBefore(shell, main);
    content.appendChild(main);
    var sidebar = shell.querySelector('.admin-sidebar');
    var menu = shell.querySelector('.admin-mobile-menu');
    menu.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      menu.setAttribute('aria-expanded', String(open));
      var overlay = document.querySelector('.admin-overlay');
      if (open && !overlay) {
        overlay = document.createElement('div');
        overlay.className = 'admin-overlay';
        document.body.appendChild(overlay);
        overlay.onclick = function () { sidebar.classList.remove('is-open'); overlay.remove(); };
      }
    });
    shell.querySelectorAll('.admin-nav a').forEach(function (link) {
      link.onclick = function () {
        sidebar.classList.remove('is-open');
        var overlay = document.querySelector('.admin-overlay');
        if (overlay) overlay.remove();
      };
    });
    shell.querySelector('[data-admin-logout]').onclick = async function () {
      this.disabled = true;
      await auth.signOut();
      setSession(null);
      location.replace('./admin.html');
    };
  }

  document.addEventListener('DOMContentLoaded', async function () {
    if (new URLSearchParams(location.search).get('recovery') === '1') {
      makeRecovery();
      return;
    }
    if (!auth || !auth.isConfigured()) {
      makeLogin();
      return;
    }
    try {
      var publisher = await auth.getPublisher(true);
      if (publisher) {
        setSession(publisher);
        var legacy = new URLSearchParams(location.search).get('legacy') === '1';
        if (!legacy) {
          location.replace(visualEditorUrl);
          return;
        }
        buildShell(publisher);
        return;
      }
    } catch (_) {}
    setSession(null);
    makeLogin();
  });
})();
