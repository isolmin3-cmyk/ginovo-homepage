(function(){
  'use strict';
  var PARAM='edit',SESSION='ginovo-admin-authenticated-session';
  var scriptBase=(function(){var current=document.currentScript;return current&&current.src?new URL('.',current.src).href:new URL('./assets/',location.href).href})();
  var editing=null,originalText=new Map(),pendingMedia=new Map(),originalMedia=new Map(),pendingBackgrounds=new Map(),originalBackgrounds=new Map(),stableTextKeys=new WeakMap();
  var pencil='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  var mediaIcon='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3Z"/><circle cx="12" cy="13" r="3"/></svg>';
  var landscape='<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 4"/></svg>';
  function locale(ko,en){return document.documentElement.lang==='en'?en:ko}
  var publishedContent={};
  function store(){return publishedContent}
  function pageKey(){var pathname=location.pathname;return pathname.endsWith('/')?pathname+'index.html':pathname}
  function isKoreanPage(){return document.documentElement.lang!=='en'&&pageKey().indexOf('/en/')<0}
  function englishPageKey(){var current=pageKey(),slash=current.lastIndexOf('/');return current.slice(0,slash+1)+'en/'+current.slice(slash+1)}
  function mirroredKey(key){var current=pageKey();return englishPageKey()+key.slice(current.length)}
  function mirroredStorageKey(key){return key.indexOf('shared|ko|')===0?key.replace('shared|ko|','shared|en|'):mirroredKey(key)}
  function sections(){return Array.from(document.querySelectorAll('body > header,.ginovo-header,main section,body > section,body > footer,.ginovo-footer')).filter(function(s){return !s.closest('header')||s.matches('body > header,.ginovo-header')})}
  function legacySections(){return Array.from(document.querySelectorAll('main section, body > section, body > footer')).filter(function(s){return !s.closest('header')})}
  function sectionId(section){return section.id||section.dataset.editableSection||section.dataset.screenLabel||('section-'+sections().indexOf(section))}
  function legacySectionId(section){return section.id||section.dataset.editableSection||section.dataset.screenLabel||('section-'+legacySections().indexOf(section))}
  function sharedLocale(){return isKoreanPage()?'ko':'en'}
  function isSharedCta(section){return section.matches('.cta,.ginovo-common-cta')}
  function globalTextToken(section,element){
    if(section.matches('body > header,.ginovo-header')){
      if(element.matches('.about-trigger,.ginovo-about-trigger'))return 'header.nav.about';
      var href=element.matches('a[href]')?element.getAttribute('href')||'':'';
      if(/smart-golf-ball\.html/.test(href))return 'header.nav.smartball';
      if(/putting-mat\.html/.test(href))return 'header.nav.putting';
      if(/smartstore\.naver\.com/.test(href))return 'header.nav.shop';
      if(/#products$/.test(href))return 'header.subnav.products';
      if(/#history$/.test(href))return 'header.subnav.history';
      if(/#about$/.test(href))return 'header.subnav.esg';
      if(/#exhibition$/.test(href))return 'header.subnav.exhibition';
      if(/#news$/.test(href))return 'header.subnav.news';
      return '';
    }
    if(isSharedCta(section)){
      if(element.matches('.cta-copy p,.ginovo-common-cta-content p'))return 'cta.eyebrow';
      if(element.matches('.cta-copy h2,.ginovo-common-cta-content h2'))return 'cta.title';
    }
    if(section.matches('footer,.site-footer,.ginovo-footer')){
      if(element.matches('.footer-phone,.ginovo-footer-phone'))return 'footer.phone';
      if(element.matches('.footer-email,.ginovo-footer-email'))return 'footer.email';
      if(element.matches('.footer-muted,.ginovo-footer-muted'))return 'footer.note.'+Array.from(section.querySelectorAll('.footer-muted,.ginovo-footer-muted')).indexOf(element);
      if(element.matches('h4'))return 'footer.heading.'+Array.from(section.querySelectorAll('h4')).indexOf(element);
      if(element.matches('.business p,.ginovo-footer-info')){
        var copy=element.textContent.trim();
        if(/^(본사|Head Office)/.test(copy))return 'footer.office';
        if(/^(공장|Factory)/.test(copy))return 'footer.factory';
      }
    }
    return '';
  }
  function canonicalLegacyTextValue(data,token){
    var indexes={
      'cta.eyebrow':['section-13',0],
      'cta.title':['section-13',1],
      'footer.heading.0':['section-14',0],
      'footer.phone':['section-14',1],
      'footer.note.0':['section-14',2],
      'footer.note.1':['section-14',3],
      'footer.note.2':['section-14',4],
      'footer.heading.1':['section-14',5],
      'footer.email':['section-14',6],
      'footer.heading.2':['section-14',7],
      'footer.office':['section-14',8],
      'footer.factory':['section-14',9]
    },mapping=indexes[token];
    if(!mapping)return undefined;
    var prefix=sharedLocale()==='en'?'/en/index.html':'/index.html';
    return data[prefix+'|'+mapping[0]+'|text:'+mapping[1]];
  }
  function textTargets(section){return Array.from(section.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,span,strong,small,b,em,label,a,button,div,.year')).filter(function(el){var structural=Array.from(el.children).some(function(child){return child.tagName!=='BR'}),shared=globalTextToken(section,el);return !structural&&el.textContent.trim()&&(shared||!el.closest('button,a[data-no-edit]'))&&!el.closest('.gt-edit-toolbar,.gt-link-panel,[data-inline-media-group]')&&!el.matches('[aria-hidden=true]')})}
  function legacyTextTargets(section){return Array.from(section.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,span,strong,small,b,em,label,a,div,.year')).filter(function(el){var structural=Array.from(el.children).some(function(child){return child.tagName!=='BR'});return !structural&&el.textContent.trim()&&!el.closest('button,a[data-no-edit],.gt-edit-toolbar,.gt-link-panel,[data-inline-media-group]')&&!el.matches('[aria-hidden=true]')})}
  function legacyElementKey(section,element){var attr=['data-smartball-content','data-content-key','data-feature90-field','data-card-title','data-card-subtitle','data-card-item','data-unity-field','data-practice-heading','data-practice-subtitle','data-practice-title'].find(function(a){return element.hasAttribute(a)});var token=attr?attr+':'+(element.getAttribute(attr)||Array.from(section.querySelectorAll('['+attr+']')).indexOf(element)):(element.classList.contains('year')?'year:':'text:')+legacyTextTargets(section).indexOf(element);return pageKey()+'|'+legacySectionId(section)+'|'+token}
  var semanticTextAttributes=['data-smartball-content','data-content-key','data-feature90-field','data-card-title','data-card-subtitle','data-card-item','data-unity-field','data-practice-heading','data-practice-subtitle','data-practice-title'];
  function semanticTextCarrier(section,element){var attr=semanticTextAttributes.find(function(name){return element.hasAttribute(name)}),carrier=element;if(!attr){attr=semanticTextAttributes.find(function(name){var candidate=element.closest('['+name+']');if(candidate&&section.contains(candidate)){carrier=candidate;return true}return false})}return attr?{attr:attr,carrier:carrier}:null}
  function structuralTextToken(section,element){var parts=[],node=element;while(node&&node!==section){var tag=node.tagName.toLowerCase(),siblings=Array.from(node.parentElement.children).filter(function(candidate){return candidate.tagName===node.tagName&&!candidate.matches('.gt-edit-section-button,.gt-media-button,.gt-background-button,.gt-link-panel')});parts.unshift(tag+':'+siblings.indexOf(node));node=node.parentElement}return 'dom:'+parts.join('/')}
  function elementKey(section,element){if(stableTextKeys.has(element))return stableTextKeys.get(element);var shared=globalTextToken(section,element);if(shared)return 'shared|'+sharedLocale()+'|text|'+shared;var semantic=semanticTextCarrier(section,element),token=semantic?semantic.attr+':'+(semantic.carrier.getAttribute(semantic.attr)||Array.from(section.querySelectorAll('['+semantic.attr+']')).indexOf(semantic.carrier)):structuralTextToken(section,element);return pageKey()+'|'+sectionId(section)+'|'+token}
  function lockTextKeys(section){textTargets(section).forEach(function(element){stableTextKeys.set(element,elementKey(section,element))})}
  function linkTargets(section){return Array.from(section.querySelectorAll('a[data-editable-link]'))}
  function linkKey(section,link){return pageKey()+'|'+sectionId(section)+'|link:'+(link.dataset.editableLink||linkTargets(section).indexOf(link))}
  function validLink(value){value=String(value).trim();if(!/^https?:\/\//i.test(value))return false;try{var url=new URL(value);return url.protocol==='http:'||url.protocol==='https:'}catch(_){return false}}
  function mediaTargets(section){return Array.from(section.querySelectorAll('img,video')).filter(function(el){return !el.closest('.gt-edit-toolbar,.gt-edit-section-button,.gt-media-button,.unity-original-content')&&!el.matches('[aria-hidden="true"]')})}
  function mediaKey(section,el){if(el.dataset.gtMediaKey)return el.dataset.gtMediaKey;if(section.matches('body > header,.ginovo-header')&&el.closest('.logo,.ginovo-logo'))return 'shared|'+sharedLocale()+'|media|header.logo';if(section.matches('body > header,.ginovo-header')&&el.closest('.language,.ginovo-lang'))return 'shared|'+sharedLocale()+'|media|header.language-icon';if(isSharedCta(section)&&el.matches('.cta-background,.ginovo-common-cta-image'))return 'shared|'+sharedLocale()+'|media|cta.background';var attr=el.getAttribute('data-media-slot')||el.getAttribute('data-media-image')||el.getAttribute('data-feature90-image')||el.getAttribute('data-card-image')||el.getAttribute('data-practice-image')||el.getAttribute('data-unity-media')||el.id||Array.from(el.classList).filter(function(c){return c!=='gt-edit-media'})[0];return pageKey()+'|'+sectionId(section)+'|'+(el.tagName==='IMG'?'image:':'video:')+(attr||mediaTargets(section).indexOf(el))}
  function legacyMediaKey(section,el){var attr=el.getAttribute('data-media-slot')||el.getAttribute('data-media-image')||el.getAttribute('data-feature90-image')||el.getAttribute('data-card-image')||el.getAttribute('data-practice-image')||el.getAttribute('data-unity-media')||el.id||Array.from(el.classList).filter(function(c){return c!=='gt-edit-media'})[0];return pageKey()+'|'+legacySectionId(section)+'|'+(el.tagName==='IMG'?'image:':'video:')+(attr||mediaTargets(section).indexOf(el))}
  function backgroundKey(section){return isSharedCta(section)?'shared|'+sharedLocale()+'|media|cta.background':pageKey()+'|'+sectionId(section)+'|background'}
  function hasEditableBackground(section){return section.hasAttribute('data-background-slot')||section.id==='unity-feature'||section.id==='practice-four-points'}
  function setTextLines(el,value){el.textContent='';String(value).split('\n').forEach(function(line,index){if(index)el.appendChild(document.createElement('br'));el.appendChild(document.createTextNode(line))});if(el.matches('a[href^="mailto:"]'))el.href='mailto:'+String(value).trim();if(el.matches('a[href^="tel:"]'))el.href='tel:'+String(value).replace(/[^+\d]/g,'')}
  function toast(message){var n=document.createElement('div');n.className='gt-edit-toast';n.setAttribute('role','status');n.textContent=message;document.body.appendChild(n);setTimeout(function(){n.remove()},2200)}
  function recordBlob(record){return record instanceof Blob?record:record&&(record.url||record.blob)}
  function recordKind(record,blob){return record&&record.kind||(blob&&blob.type.indexOf('video/')===0?'video':'image')}
  function copyMediaAttributes(from,to){Array.from(from.attributes).forEach(function(attr){if(!['src','poster','controls','autoplay','loop','muted','playsinline','preload'].includes(attr.name))to.setAttribute(attr.name,attr.value)});to.className=from.className;to.dataset.gtMediaKey=from.dataset.gtMediaKey||''}
  function replaceMediaElement(el,blob,kind,key){var url=typeof blob==='string'?blob:URL.createObjectURL(blob),next=el;if(kind==='video'&&el.tagName!=='VIDEO'){next=document.createElement('video');copyMediaAttributes(el,next);next.controls=true;next.muted=true;next.loop=true;next.autoplay=true;next.playsInline=true;next.preload='metadata';el.replaceWith(next)}else if(kind==='image'&&el.tagName!=='IMG'){next=document.createElement('img');copyMediaAttributes(el,next);next.alt=el.getAttribute('aria-label')||locale('교체 이미지','Replacement image');el.replaceWith(next)}next.dataset.gtMediaKey=key;next.classList.add('gt-edit-media-fill');next.src=url;if(next.tagName==='VIDEO'){next.load();next.play().catch(function(){})}return next}
  function compatibleLegacyValue(data,section,element,targets){var stableKey=elementKey(section,element);for(var candidate of targets){if(elementKey(section,candidate)!==stableKey)continue;var value=data[legacyElementKey(section,candidate)];if(typeof value==='string')return value}return undefined}
  function canonicalPageLegacyTextValue(data,section,element){if(section.id!=='hero')return undefined;var key=element.getAttribute('data-content-key'),indexes={heroBadge:0,heroTitleLine1:1,heroTitleLine2:2,heroSubtitle:7};return Object.prototype.hasOwnProperty.call(indexes,key)?data[pageKey()+'|hero|text:'+indexes[key]]:undefined}
  async function applySaved(){var data=store();for(var section of sections()){var targets=textTargets(section),legacyValue=data[pageKey()+'|'+legacySectionId(section)+'|text:-1'],legacyCandidates=targets.filter(function(el){return el.querySelector('br')}),legacyTarget=section.querySelector('.footer-phone')||(legacyCandidates.length===1?legacyCandidates[0]:null);for(var el of targets){var sharedToken=globalTextToken(section,el),semantic=semanticTextCarrier(section,el),value=data[elementKey(section,el)];if(typeof value!=='string'&&sharedToken)value=canonicalLegacyTextValue(data,sharedToken);if(typeof value!=='string')value=canonicalPageLegacyTextValue(data,section,el);if(typeof value!=='string'&&semantic)value=compatibleLegacyValue(data,section,el,targets);if(typeof value!=='string'&&typeof legacyValue==='string'&&legacyTarget===el)value=legacyValue;if(typeof value==='string'&&el.innerText!==value)setTextLines(el,value)}for(var link of linkTargets(section)){var href=data[linkKey(section,link)];if(typeof href==='string'&&validLink(href))link.href=href}for(var media of mediaTargets(section)){var group=media.closest('[data-inline-media-group]');var key=group?pageKey()+'|'+sectionId(section)+'|group:'+group.dataset.inlineMediaGroup:mediaKey(section,media);media.dataset.gtMediaKey=key;var record=data[key];if(!record&&key.indexOf('shared|')===0&&isSharedCta(section)){var canonicalPrefix=sharedLocale()==='en'?'/en/index.html':'/index.html';record=data[canonicalPrefix+'|section-13|background']}if(!record&&key.indexOf('shared|')===0)record=data[legacyMediaKey(section,media)];var blob=recordBlob(record);if(blob&&media.dataset.gtAppliedSource!==String(blob)){var applied=replaceMediaElement(media,blob,recordKind(record,blob),key);applied.dataset.gtAppliedSource=String(blob);if(group&&record.composite)group.classList.add('gt-composite-replaced')}}if(hasEditableBackground(section)){var backgroundRecord=data[backgroundKey(section)];if(!backgroundRecord&&isSharedCta(section)){var canonicalBackgroundPrefix=sharedLocale()==='en'?'/en/index.html':'/index.html';backgroundRecord=data[canonicalBackgroundPrefix+'|section-13|background']||data[pageKey()+'|'+legacySectionId(section)+'|background']}var background=recordBlob(backgroundRecord);if(background) section.style.backgroundImage='url("'+(typeof background==='string'?background:URL.createObjectURL(background))+'")'}}}
  function clearEditChrome(){if(!editing)return;editing.querySelectorAll('[contenteditable=true]').forEach(function(el){el.removeAttribute('contenteditable');el.classList.remove('gt-editable-text')});editing.querySelectorAll('.gt-media-button,.gt-background-button,.gt-link-panel').forEach(function(b){b.remove()});editing.querySelectorAll('.gt-media-host,.gt-media-host-needs-position').forEach(function(host){host.classList.remove('gt-media-host','gt-media-host-needs-position')});editing.classList.remove('gt-edit-active');editing=null;originalText.clear();originalMedia.clear();pendingMedia.clear();pendingBackgrounds.clear();originalBackgrounds.clear();var toolbar=document.querySelector('.gt-edit-toolbar');if(toolbar)toolbar.classList.remove('is-editing')}
  var saving=false;
  async function endEdit(save){
    if(saving)return;
    if(!editing){if(save)toast(locale('수정할 섹션의 연필 아이콘을 먼저 눌러주세요.','Choose a section with its pencil icon first.'));return}
    if(save){
      var changes={},inputs=Array.from(editing.querySelectorAll('.gt-link-input')),invalid=false,mirror=isKoreanPage();
      editing.querySelectorAll('.gt-editable-text').forEach(function(el){var key=elementKey(editing,el),value=el.innerText.trim();changes[key]=value});
      inputs.forEach(function(input){input.removeAttribute('aria-invalid');if(!validLink(input.value)){input.setAttribute('aria-invalid','true');invalid=true}});
      if(invalid){toast(locale('http:// 또는 https://로 시작하는 올바른 링크를 입력해 주세요.','Enter a valid link beginning with http:// or https://.'));return}
      inputs.forEach(function(input){var value=input.value.trim(),key=input.dataset.linkKey;changes[key]=value;if(mirror)changes[mirroredStorageKey(key)]=value});
      saving=true;
      var saveButton=document.querySelector('.gt-edit-toolbar .gt-save');if(saveButton){saveButton.disabled=true;saveButton.textContent=locale('게시 중…','Publishing…')}
      try{
        for(var [mediaKeyValue,mediaRecord] of pendingMedia){var mediaUrl=await uploadMedia(mediaRecord.blob);changes[mediaKeyValue]={url:mediaUrl,kind:mediaRecord.kind,composite:!!mediaRecord.composite};if(mirror)changes[mirroredStorageKey(mediaKeyValue)]=changes[mediaKeyValue]}
        for(var [backgroundKeyValue,backgroundRecord] of pendingBackgrounds){var backgroundUrl=await uploadMedia(backgroundRecord.blob);changes[backgroundKeyValue]={url:backgroundUrl,kind:'background'};if(mirror)changes[mirroredStorageKey(backgroundKeyValue)]=changes[backgroundKeyValue]}
        await publishChanges(changes);
        inputs.forEach(function(input){var link=linkTargets(editing).find(function(candidate){return linkKey(editing,candidate)===input.dataset.linkKey});if(link)link.href=input.value.trim()});
        toast(locale('사이트에 게시했습니다.','Published to the site.'));
      }catch(error){console.error('GINOVO publish failed',error);toast(locale('게시 실패: 저장되지 않았습니다. 다시 시도해 주세요.','Publish failed. Changes were not saved; please try again.'));saving=false;if(saveButton){saveButton.disabled=false;saveButton.textContent=locale('게시','Publish')}return}
      saving=false;if(saveButton){saveButton.disabled=false;saveButton.textContent=locale('게시','Publish')}
    }else{originalText.forEach(function(value,el){setTextLines(el,value)});originalMedia.forEach(function(state){if(state.current&&state.current.isConnected)state.current.replaceWith(state.clone)});originalBackgrounds.forEach(function(value,section){section.style.backgroundImage=value})}
    clearEditChrome();
  }
  function addMediaEditor(section,media){var group=media.closest('[data-inline-media-group]');var box=media.closest('[data-inline-image-box]');var key=group?pageKey()+'|'+sectionId(section)+'|group:'+group.dataset.inlineMediaGroup:mediaKey(section,media);media.dataset.gtMediaKey=key;var host=group||box||media.parentElement;if(!host||host.querySelector(':scope > .gt-media-button'))return;host.classList.add('gt-media-host');if(getComputedStyle(host).position==='static')host.classList.add('gt-media-host-needs-position');var button=document.createElement('button');button.type='button';button.className='gt-media-button';button.title=locale('사진 또는 동영상 교체','Replace image or video');button.setAttribute('aria-label',button.title);button.innerHTML=mediaIcon;var input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp,video/mp4,video/webm';input.hidden=true;button.appendChild(input);button.onclick=function(e){if(e.target!==input)input.click()};input.onchange=function(){var file=input.files&&input.files[0];if(!file)return;var kind=file.type.indexOf('video/')===0?'video':'image';if(!originalMedia.has(key))originalMedia.set(key,{clone:media.cloneNode(true),current:media});var state=originalMedia.get(key),current=state.current&&state.current.isConnected?state.current:media;state.current=replaceMediaElement(current,file,kind,key);if(group)group.classList.add('gt-composite-replaced');pendingMedia.set(key,{blob:file,kind:kind,type:file.type,composite:!!group})};host.appendChild(button)}
  function addBackgroundEditor(section){if(!hasEditableBackground(section))return;var button=document.createElement('button');button.type='button';button.className='gt-background-button';button.title=locale('배경 이미지 교체','Replace background image');button.setAttribute('aria-label',button.title);button.innerHTML=landscape+'<span>'+locale('배경','Background')+'</span>';var input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp';input.hidden=true;button.appendChild(input);button.onclick=function(e){if(e.target!==input)input.click()};input.onchange=function(){var file=input.files&&input.files[0];if(!file)return;if(!originalBackgrounds.has(section))originalBackgrounds.set(section,section.style.backgroundImage);section.style.backgroundImage='url("'+URL.createObjectURL(file)+'")';pendingBackgrounds.set(backgroundKey(section),{blob:file,kind:'background',type:file.type})};section.appendChild(button)}
  function addLinkEditor(section){var links=linkTargets(section);if(!links.length||section.querySelector(':scope > .gt-link-panel'))return;var panel=document.createElement('div');panel.className='gt-link-panel';var title=document.createElement('strong');title.textContent=locale('뉴스 기사 링크','News article links');panel.appendChild(title);links.forEach(function(link,index){var row=document.createElement('label');row.className='gt-link-row';var caption=document.createElement('span');caption.textContent=locale('뉴스 '+(index+1)+' 링크','Article '+(index+1)+' link');var input=document.createElement('input');input.className='gt-link-input';input.type='url';input.inputMode='url';input.value=link.getAttribute('href')||'';input.dataset.linkKey=linkKey(section,link);input.setAttribute('aria-label',caption.textContent);row.appendChild(caption);row.appendChild(input);panel.appendChild(row)});section.insertBefore(panel,section.firstChild)}
  function startEdit(section){if(editing===section)return;if(editing)endEdit(false);editing=section;section.classList.add('gt-edit-active');lockTextKeys(section);textTargets(section).forEach(function(el){originalText.set(el,el.innerText);el.classList.add('gt-editable-text');el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','true')});mediaTargets(section).forEach(function(media){addMediaEditor(section,media)});addBackgroundEditor(section);addLinkEditor(section);document.querySelector('.gt-edit-toolbar').classList.add('is-editing');section.scrollIntoView({behavior:'smooth',block:'start'})}
  function decorateSections(){sections().forEach(function(section){if(section.querySelector(':scope > .gt-edit-section-button'))return;section.classList.add('gt-edit-section');var b=document.createElement('button');b.type='button';b.className='gt-edit-section-button';b.innerHTML=pencil;b.title=locale('이 섹션 편집','Edit this section');b.setAttribute('aria-label',b.title);b.onclick=function(){startEdit(section)};section.appendChild(b)})}
  function keepEditModeOnNavigation(){document.querySelectorAll('a[href]').forEach(function(link){try{var url=new URL(link.getAttribute('href'),location.href);if(url.origin===location.origin&&/\.html$/.test(url.pathname)&&url.pathname.indexOf('/admin')<0){url.searchParams.set(PARAM,'1');link.href=url.pathname+url.search+url.hash}}catch(_){}})}
  function refreshEditingSection(){if(!editing||!editing.isConnected)return;mediaTargets(editing).forEach(function(media){addMediaEditor(editing,media)});textTargets(editing).forEach(function(el){if(el.hasAttribute('contenteditable'))return;originalText.set(el,el.innerText);el.classList.add('gt-editable-text');el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','true')})}
  function build(){var toolbar=document.createElement('div');toolbar.className='gt-edit-toolbar';toolbar.innerHTML='<span>'+locale('관리자 편집 모드','Admin edit mode')+'</span><button class="gt-save" type="button">'+locale('게시','Publish')+'</button><button class="gt-cancel" type="button">'+locale('취소','Cancel')+'</button>';document.body.appendChild(toolbar);toolbar.querySelector('.gt-save').onclick=function(){endEdit(true)};toolbar.querySelector('.gt-cancel').onclick=function(){endEdit(false)};decorateSections();keepEditModeOnNavigation();setTimeout(function(){decorateSections();keepEditModeOnNavigation();refreshEditingSection()},600);var root=document.getElementById('dc-root');if(root){var timer;new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(function(){decorateSections();keepEditModeOnNavigation();refreshEditingSection()},60)}).observe(root,{childList:true,subtree:true})}}
  var guardedMediaEditor=addMediaEditor;addMediaEditor=function(section,media){var group=media.closest('[data-inline-media-group]'),box=media.closest('[data-inline-image-box]'),host=group||box||media.parentElement,position=host?getComputedStyle(host).position:'static';if(host&&!host.hasAttribute('data-gt-original-inline-position')){host.dataset.gtOriginalInlinePosition=host.style.getPropertyValue('position');host.dataset.gtOriginalInlinePriority=host.style.getPropertyPriority('position')}guardedMediaEditor(section,media);if(host&&position!=='static')host.style.setProperty('position',position,'important')};
  var guardedClearEditChrome=clearEditChrome;clearEditChrome=function(){var guarded=document.querySelectorAll('[data-gt-original-inline-position]');guardedClearEditChrome();guarded.forEach(function(host){var value=host.dataset.gtOriginalInlinePosition,priority=host.dataset.gtOriginalInlinePriority;if(value)host.style.setProperty('position',value,priority);else host.style.removeProperty('position');delete host.dataset.gtOriginalInlinePosition;delete host.dataset.gtOriginalInlinePriority})};
  var synchronizedStartEdit=startEdit;startEdit=function(section){synchronizedStartEdit(section);textTargets(section).forEach(function(el){el.addEventListener('input',function(){var key=elementKey(section,el),value=el.innerText;textTargets(section).forEach(function(peer){if(peer!==el&&elementKey(section,peer)===key)setTextLines(peer,value)})},{once:false})})};
  function loadScript(src){return new Promise(function(resolve,reject){if(Array.from(document.scripts).some(function(s){return s.src===src})){resolve();return}var s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  async function contentClient(){
    if(!window.supabase)await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
    if(!window.GINOVO_SUPABASE)await loadScript(scriptBase+'supabase-config.js?v=20260921-1');
    if(!window.GINOVO_ADMIN_AUTH)await loadScript(scriptBase+'admin-auth.js?v=20260921-1');
    return window.GINOVO_ADMIN_AUTH.getClient();
  }
  async function loadPublishedContent(){
    if(!window.GINOVO_SUPABASE)await loadScript(scriptBase+'supabase-config.js?v=20260921-1');
    var config=window.GINOVO_SUPABASE,offset=0,rows;
    if(!config||!config.url||!config.publishableKey)throw new Error('SUPABASE_NOT_CONFIGURED');
    publishedContent={};
    do{
      var endpoint=config.url.replace(/\/$/,'')+'/rest/v1/site_content?select=content_key,content_value&limit=1000&offset='+offset;
      var response;
      for(var attempt=0;attempt<2;attempt++){
        try{
          response=await fetch(endpoint,{headers:{apikey:config.publishableKey,Authorization:'Bearer '+config.publishableKey,Accept:'application/json'},cache:'no-store'});
          if(response.ok)break;
          throw new Error('CONTENT_HTTP_'+response.status);
        }catch(error){if(attempt===1)throw error}
      }
      rows=await response.json();
      if(!Array.isArray(rows))throw new Error('INVALID_CONTENT_RESPONSE');
      rows.forEach(function(row){publishedContent[row.content_key]=row.content_value});
      offset+=rows.length;
    }while(rows.length===1000);
    Object.keys(publishedContent).forEach(function(key){
      if(!key.startsWith('/en/'))return;
      var value=publishedContent[key];
      if(typeof value==='string'&&/[가-힣]/.test(value))delete publishedContent[key];
    });
  }
  async function publishChanges(changes){
    var rows=Object.keys(changes).map(function(key){return{content_key:key,content_value:changes[key],updated_at:new Date().toISOString()}});
    if(!rows.length)return;
    var client=await contentClient();
    for(var offset=0;offset<rows.length;offset+=100){
      var batch=rows.slice(offset,offset+100),result=await client.from('site_content').upsert(batch,{onConflict:'content_key'}).select('content_key');
      if(result.error)throw result.error;
      if(!result.data||result.data.length!==batch.length)throw new Error('PUBLISH_VERIFICATION_FAILED');
    }
    Object.assign(publishedContent,changes);
  }
  async function uploadMedia(file){
    if(file.size>50*1024*1024)throw new Error('MEDIA_TOO_LARGE');
    var extensions={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'},extension=extensions[file.type];
    if(!extension)throw new Error('UNSUPPORTED_MEDIA_TYPE');
    var client=await contentClient(),path='site/'+crypto.randomUUID()+'.'+extension;
    var result=await client.storage.from('site-media').upload(path,file,{contentType:file.type,cacheControl:'3600',upsert:false});
    if(result.error)throw result.error;
    return client.storage.from('site-media').getPublicUrl(path).data.publicUrl;
  }
  async function verifyPublisher(){try{if(!window.supabase)await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');if(!window.GINOVO_SUPABASE)await loadScript(scriptBase+'supabase-config.js?v=20260921-1');if(!window.GINOVO_ADMIN_AUTH)await loadScript(scriptBase+'admin-auth.js?v=20260921-1');if(!window.GINOVO_ADMIN_AUTH.isConfigured())return false;var publisher=await window.GINOVO_ADMIN_AUTH.getPublisher(true);if(!publisher)return false;sessionStorage.setItem(SESSION,'1');return true}catch(_){return false}}
  var publishedContentPromise=loadPublishedContent();
  var publishedContentRefreshPromise=null;
  async function refreshPublishedContent(){
    if(publishedContentRefreshPromise)return publishedContentRefreshPromise;
    publishedContentRefreshPromise=(async function(){try{await loadPublishedContent();if(!editing)await applySaved()}finally{publishedContentRefreshPromise=null}})();
    return publishedContentRefreshPromise;
  }
  function keepPublishedContentSynchronized(){
    var root=document.getElementById('dc-root')||document.body,timer;
    function scheduleApply(){
      if(editing)return;
      clearTimeout(timer);
      timer=setTimeout(function(){applySaved().catch(function(error){console.error('GINOVO content synchronization failed',error)})},80);
    }
    new MutationObserver(function(){
      scheduleApply();
    }).observe(root,{childList:true,subtree:true});
    window.addEventListener('resize',scheduleApply,{passive:true});
    window.addEventListener('orientationchange',scheduleApply,{passive:true});
    window.addEventListener('pageshow',function(){refreshPublishedContent().catch(function(error){console.error('GINOVO content refresh failed',error)})});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')refreshPublishedContent().catch(function(error){console.error('GINOVO content refresh failed',error)})});
  }
  document.addEventListener('DOMContentLoaded',async function(){
    var loaded=false;
    try{await publishedContentPromise;loaded=true;await applySaved();keepPublishedContentSynchronized();window.addEventListener('load',function(){if(!editing)applySaved().catch(function(error){console.error('GINOVO content reapply failed',error)})},{once:true})}catch(error){console.error('GINOVO content load failed',error)}
    if(new URLSearchParams(location.search).get(PARAM)!=='1')return;
    if(!(await verifyPublisher())){sessionStorage.removeItem(SESSION);sessionStorage.setItem('ginovo-admin-return',location.href);location.href='./admin.html';return}
    if(!loaded){toast(locale('게시된 내용을 불러오지 못했습니다. 새로고침해 주세요.','Could not load published content. Please refresh.'));return}
    build();
  });
})();
