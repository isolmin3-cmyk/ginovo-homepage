(function(){
  'use strict';
  var SESSION_KEY='ginovo-admin-preview-session';
  var PASS_KEY='ginovo-admin-preview-password';
  var isEnglish=document.documentElement.lang==='en';
  var visualEditorUrl='./index.html?edit=1';
  var requestedEditorUrl=sessionStorage.getItem('ginovo-admin-return');
  if(requestedEditorUrl){try{var requestedUrl=new URL(requestedEditorUrl,location.href);if(requestedUrl.origin===location.origin&&requestedUrl.pathname.indexOf('/admin')<0)visualEditorUrl=requestedUrl.pathname+requestedUrl.search+requestedUrl.hash}catch(_){}}
  var t=isEnglish?{
    title:'Content Manager',intro:'Edit website text and images without changing the layout.',preview:'Preview mode',site:'Open website',logout:'Log out',login:'Administrator login',loginHelp:'This local login is for UI testing. Supabase authentication will replace it before launch.',id:'Admin ID',pw:'Password',enter:'Log in',setup:'Set the preview password on first use (8+ characters).',error:'Check your ID and password.',short:'Use at least 8 characters.',menu:'Menu',overview:'Dashboard',mat:'Putting Mat',ball:'Smart Golf Ball',home:'Home',sections:'EDIT SECTIONS'
  }:{
    title:'콘텐츠 관리자',intro:'홈페이지 구조를 유지하면서 문구와 이미지를 편집합니다.',preview:'미리보기 모드',site:'홈페이지 열기',logout:'로그아웃',login:'관리자 로그인',loginHelp:'현재 로그인은 화면 검수용 로컬 방식입니다. 실제 운영 전 Supabase 인증으로 교체됩니다.',id:'관리자 아이디',pw:'비밀번호',enter:'로그인',setup:'최초 접속 시 사용할 비밀번호를 설정하세요. (8자 이상)',error:'아이디 또는 비밀번호를 확인해 주세요.',short:'비밀번호는 8자 이상 입력해 주세요.',menu:'메뉴',overview:'대시보드',mat:'경사 퍼팅매트',ball:'스마트 골프공',home:'메인 홈',sections:'편집 섹션'
  };
  function hash(value){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)).then(function(buf){return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0')}).join('')})}
  function makeLogin(){
    var gate=document.createElement('div');gate.className='admin-login';gate.innerHTML='<form class="admin-login-card"><div class="admin-login-logo"><span class="admin-login-mark">G</span> GINOVO ADMIN</div><h1>'+t.login+'</h1><p>'+t.loginHelp+'</p><label for="admin-id">'+t.id+'</label><input id="admin-id" name="username" autocomplete="username" value="admin"><label for="admin-password">'+t.pw+'</label><input id="admin-password" type="password" name="password" autocomplete="current-password" minlength="8" required><p class="admin-login-error" role="alert">'+(!localStorage.getItem(PASS_KEY)?t.setup:'')+'</p><button type="submit">'+t.enter+'</button></form>';
    document.body.appendChild(gate);document.body.classList.add('admin-locked');
    gate.querySelector('form').addEventListener('submit',async function(e){e.preventDefault();var id=gate.querySelector('#admin-id').value.trim(),pw=gate.querySelector('#admin-password').value,stored=localStorage.getItem(PASS_KEY);if(id!=='admin'||pw.length<8){gate.querySelector('[role=alert]').textContent=pw.length<8?t.short:t.error;return}var digest=await hash(pw);if(!stored){localStorage.setItem(PASS_KEY,digest);stored=digest}if(digest!==stored){gate.querySelector('[role=alert]').textContent=t.error;return}sessionStorage.setItem(SESSION_KEY,'1');sessionStorage.removeItem('ginovo-admin-return');location.replace(visualEditorUrl)});
  }
  function classify(title){if(/퍼팅매트|Putting Mat|90cm/.test(title))return t.mat;if(/골프공|Golf Ball|스펙|거리|경사 연습|필드|대결|CTA/.test(title))return t.ball;return t.home}
  function buildShell(){
    var main=document.querySelector('main');if(!main)return;document.body.classList.add('admin-ready');
    var candidates=Array.from(main.querySelectorAll(':scope > h1, :scope > .admin-section')).map(function(el,i){var h=el.matches('h1')?el:el.querySelector('h1');if(!h)return null;var target=el.matches('h1')?(el.nextElementSibling&&el.nextElementSibling.tagName==='FORM'?el.nextElementSibling:el):el;if(!target.id)target.id='admin-section-'+i;return{id:target.id,title:h.textContent.trim(),group:classify(h.textContent)}}).filter(Boolean);
    var groups={};candidates.forEach(function(x){(groups[x.group]||(groups[x.group]=[])).push(x)});
    var nav=Object.keys(groups).map(function(group){return '<div class="admin-nav-group">'+group+'</div>'+groups[group].map(function(x){return '<a href="#'+x.id+'">'+x.title.replace(/ 관리$/,'')+'</a>'}).join('')}).join('');
    var shell=document.createElement('div');shell.className='admin-shell';shell.innerHTML='<aside class="admin-sidebar"><div class="admin-brand"><span class="admin-brand-badge">G</span> GINOVO ADMIN</div><nav class="admin-nav" aria-label="'+t.sections+'">'+nav+'</nav><div class="admin-sidebar-footer"><button type="button" data-admin-logout>'+t.logout+'</button></div></aside><div class="admin-workspace"><header class="admin-topbar"><div style="display:flex;align-items:center;gap:10px"><button class="admin-mobile-menu" type="button" aria-label="'+t.menu+'" aria-expanded="false">☰</button><h2>'+t.title+'</h2></div><div class="admin-topbar-actions"><span class="admin-mode">'+t.preview+'</span><a href="./index.html?edit=1">'+t.site+'</a></div></header><div class="admin-content"><section class="admin-hero"><h1>'+t.title+'</h1><p>'+t.intro+'</p></section></div></div>';
    var content=shell.querySelector('.admin-content');main.parentNode.insertBefore(shell,main);content.appendChild(main);
    var sidebar=shell.querySelector('.admin-sidebar'),menu=shell.querySelector('.admin-mobile-menu');menu.addEventListener('click',function(){var open=sidebar.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));var old=document.querySelector('.admin-overlay');if(open&&!old){old=document.createElement('div');old.className='admin-overlay';document.body.appendChild(old);old.onclick=function(){sidebar.classList.remove('is-open');old.remove()}}});
    shell.querySelectorAll('.admin-nav a').forEach(function(a){a.onclick=function(){sidebar.classList.remove('is-open');var o=document.querySelector('.admin-overlay');if(o)o.remove()}});
    shell.querySelector('[data-admin-logout]').onclick=function(){sessionStorage.removeItem(SESSION_KEY);location.reload()};
  }
  document.addEventListener('DOMContentLoaded',function(){var legacy=new URLSearchParams(location.search).get('legacy')==='1';if(sessionStorage.getItem(SESSION_KEY)==='1'&&!legacy){location.replace(visualEditorUrl);return}buildShell();makeLogin()});
})();
