(()=>{
  // When Google Translate is already proxying the site, use Google's own
  // language bar. Rendering our selector there would try to translate an
  // already-translated proxy URL and can produce a "Can't translate" error.
  const host=location.hostname.toLowerCase();
  const isGoogleTranslated=host.endsWith('.translate.goog')||host.includes('translate.googleusercontent.com')||location.search.includes('_x_tr_');
  if(isGoogleTranslated) return;

  const nav=document.querySelector('header nav');
  if(!nav||document.querySelector('.poa-translate')) return;

  const langs=[
    ['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],
    ['it','Italiano'],['zh-CN','中文'],['ja','日本語'],['ko','한국어'],
    ['ar','العربية'],['hi','हिन्दी'],['ru','Русский']
  ];

  const style=document.createElement('style');
  style.textContent=`
    .poa-translate{position:relative;display:inline-flex;align-items:center;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .poa-translate-trigger{display:inline-flex!important;align-items:center;gap:6px;width:auto!important;border:1px solid rgba(14,15,17,.45)!important;background:transparent!important;color:#282824!important;padding:7px 10px!important;font:800 .76rem/1 system-ui!important;cursor:pointer;border-radius:0!important;white-space:nowrap}
    .poa-translate-trigger:hover,.poa-translate-trigger[aria-expanded="true"]{background:#0e0f11!important;color:#f4f0e7!important}
    .poa-globe{font-size:1rem;line-height:1}.poa-translate-menu{position:absolute;right:0;top:calc(100% + 10px);z-index:99999;width:260px;background:#fffdf8;border:1px solid #0e0f11;box-shadow:0 14px 35px rgba(14,15,17,.18);padding:10px;display:none}
    .poa-translate.open .poa-translate-menu{display:block}.poa-translate-intro{font:700 .76rem/1.35 Georgia,serif;margin:2px 4px 9px;color:#34322e}.poa-translate-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
    .poa-language{display:block;width:100%!important;border:1px solid #c8c0b2!important;background:#f4f0e7!important;color:#0e0f11!important;padding:8px!important;text-align:left;font:700 .74rem/1.2 system-ui!important;cursor:pointer;border-radius:0!important}.poa-language:hover{border-color:#0e0f11!important;background:#ebe5d9!important}
    .poa-translate-more{display:block;margin-top:8px;padding-top:8px;border-top:1px solid #c8c0b2;font-size:.69rem;line-height:1.4;color:#666158}.poa-translate-more a{color:#9f3118!important;font-weight:800;text-decoration:none!important}
    @media(max-width:780px){.poa-translate-label{display:none}.poa-translate-trigger{padding:7px 8px!important}.poa-translate-menu{position:fixed;right:12px;left:12px;top:74px;width:auto}.poa-translate-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);

  const wrap=document.createElement('div');
  wrap.className='poa-translate';
  wrap.innerHTML=`<button class="poa-translate-trigger" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Translate this page"><span class="poa-globe" aria-hidden="true">🌐</span><span class="poa-translate-label">Translate</span></button><div class="poa-translate-menu" role="menu"><div class="poa-translate-intro">Read this page in another language</div><div class="poa-translate-grid"></div><div class="poa-translate-more">Machine translation by Google. <a href="https://translate.google.com/?op=websites" target="_blank" rel="noopener">More languages</a></div></div>`;

  const subscribe=nav.querySelector('.subscribe,.subscribe-link');
  if(subscribe) nav.insertBefore(wrap,subscribe); else nav.appendChild(wrap);

  const grid=wrap.querySelector('.poa-translate-grid');
  const translateTo=code=>{
    // Always translate the canonical POA URL, never a prior Google proxy URL.
    const source='https://paradoxofautomation.com'+location.pathname+location.search+location.hash;
    const url='https://translate.google.com/translate?sl=auto&tl='+encodeURIComponent(code)+'&u='+encodeURIComponent(source);
    location.href=url;
  };
  langs.forEach(([code,label])=>{
    const b=document.createElement('button');
    b.type='button'; b.className='poa-language'; b.textContent=label; b.setAttribute('role','menuitem');
    b.addEventListener('click',()=>translateTo(code)); grid.appendChild(b);
  });

  const trigger=wrap.querySelector('.poa-translate-trigger');
  const close=()=>{wrap.classList.remove('open');trigger.setAttribute('aria-expanded','false')};
  trigger.addEventListener('click',e=>{e.stopPropagation();const open=!wrap.classList.contains('open');close();if(open){wrap.classList.add('open');trigger.setAttribute('aria-expanded','true')}});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target)) close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') close()});
})();