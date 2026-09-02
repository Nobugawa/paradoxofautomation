(()=>{
  const host=location.hostname.toLowerCase();
  const isGoogleTranslated=host.endsWith('.translate.goog')||host.includes('translate.googleusercontent.com')||location.search.includes('_x_tr_');
  if(isGoogleTranslated) return;

  // Article-specific presentation updates.
  if(location.pathname==='/the-paradox-of-automation.html'||location.pathname==='/the-paradox-of-automation'){
    const oldA='For one firm, removing labor cost can be rational. For every firm simultaneously, removing labor income can become dangerous.';
    const oldB='For one firm, removing labor cost can be rational. For every firm simultaneously, removing labor income can become dangerous';
    const replacement='For one firm, removing labor cost can be rational. For every firm simultaneously, removing labor income can be detrimental to society.';

    document.querySelectorAll('.thesis blockquote,.pulse').forEach(el=>{
      const normalized=el.textContent.replace(/\s+/g,' ').trim();
      if(normalized===oldA||normalized===oldB) el.textContent=replacement;
    });

    const problemParagraph=[...document.querySelectorAll('article p')].find(p=>p.textContent.trim()==='And now the island has a problem.');
    if(problemParagraph&&!document.querySelector('.feedback-visual')){
      const style=document.createElement('style');
      style.textContent='.feedback-visual{width:min(calc(100vw - 40px),1000px);margin:56px 0 64px 50%;transform:translateX(-50%)}.feedback-visual img{display:block;width:100%;height:auto;border:1px solid var(--line)}.feedback-visual figcaption{margin-top:10px;font:.78rem/1.5 system-ui;color:var(--muted)}';
      document.head.appendChild(style);
      const figure=document.createElement('figure');
      figure.className='feedback-visual';
      figure.innerHTML='<img src="/media/paradox-feedback-loop.webp" width="600" height="450" loading="lazy" alt="The Paradox of Automation feedback loop: firms automate to cut costs, fewer workers are needed, labor income and purchasing power fall, consumers buy less, and demand weakens for the whole economy."><figcaption>A simplified feedback loop. The outcome depends on scale, prices, new jobs, ownership and policy.</figcaption>';
      problemParagraph.insertAdjacentElement('afterend',figure);
    }

    const version=document.querySelector('.version');
    if(version&&version.textContent.trim()==='SITE V1.8') version.textContent='SITE V1.9';
  }

  const nav=document.querySelector('header nav');
  if(!nav||document.querySelector('.poa-translate')) return;

  const langs=[['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['it','Italiano'],['zh-CN','中文'],['ja','日本語'],['ko','한국어'],['ar','العربية'],['hi','हिन्दी'],['ru','Русский']];

  const style=document.createElement('style');
  style.textContent=`
    .poa-translate{position:relative;display:inline-flex;align-items:center;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .poa-translate-trigger{display:inline-flex!important;align-items:center;gap:6px;width:auto!important;border:1px solid rgba(14,15,17,.45)!important;background:transparent!important;color:#282824!important;padding:7px 10px!important;font:800 .76rem/1 system-ui!important;cursor:pointer;border-radius:0!important;white-space:nowrap}
    .poa-translate-trigger:hover,.poa-translate-trigger[aria-expanded="true"]{background:#0e0f11!important;color:#f4f0e7!important}
    .poa-globe{font-size:1rem;line-height:1}.poa-translate-menu{position:absolute;right:0;top:calc(100% + 10px);z-index:99999;width:260px;background:#fffdf8;border:1px solid #0e0f11;box-shadow:0 14px 35px rgba(14,15,17,.18);padding:10px;display:none}
    .poa-translate.open .poa-translate-menu{display:block}.poa-translate-intro{font:700 .76rem/1.35 Georgia,serif;margin:2px 4px 9px;color:#34322e}.poa-translate-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
    .poa-language{display:block;width:100%!important;border:1px solid #c8c0b2!important;background:#f4f0e7!important;color:#0e0f11!important;padding:8px!important;text-align:left;font:700 .74rem/1.2 system-ui!important;cursor:pointer;border-radius:0!important}.poa-language:hover{border-color:#0e0f11!important;background:#ebe5d9!important}
    .poa-translate-more{display:block;margin-top:8px;padding-top:8px;border-top:1px solid #c8c0b2;font-size:.69rem;line-height:1.4;color:#666158}.poa-translate-more a{color:#9f3118!important;font-weight:800;text-decoration:none!important}
    .poa-mobile-menu{display:none;position:relative}.poa-menu-trigger{display:inline-flex;align-items:center;justify-content:center;width:42px!important;height:38px!important;padding:0!important;border:1px solid #0e0f11!important;background:transparent!important;color:#0e0f11!important;font:800 1.35rem/1 system-ui!important;cursor:pointer}
    .poa-menu-panel{display:none;position:absolute;right:0;top:calc(100% + 9px);z-index:99998;min-width:170px;background:#fffdf8;border:1px solid #0e0f11;box-shadow:0 14px 35px rgba(14,15,17,.18);padding:7px}.poa-mobile-menu.open .poa-menu-panel{display:block}.poa-menu-panel a{display:block!important;padding:10px 11px!important;text-decoration:none!important;color:#0e0f11!important;font:800 .82rem/1.2 system-ui!important;background:transparent!important;border:0!important}.poa-menu-panel a:hover{background:#ebe5d9!important}
    @media(max-width:780px){header .nav{flex-wrap:nowrap!important;padding:6px 0!important;gap:8px!important;min-height:68px!important}header .brand{flex:1 1 auto!important;max-width:220px!important;min-width:0!important}header .brand img{max-height:50px!important}header nav{display:flex!important;flex:0 0 auto!important;width:auto!important;justify-content:flex-end!important;align-items:center!important;gap:8px!important;font-size:.74rem!important;white-space:nowrap!important}header nav>a{display:inline-block!important;white-space:nowrap!important}header nav .subscribe,header nav .subscribe-link{padding:7px 8px!important;font-size:.72rem!important}.poa-translate-label{display:none}.poa-translate-trigger{padding:7px 8px!important}.poa-translate-menu{position:fixed;right:12px;left:12px;top:78px;width:auto}.poa-translate-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:389px){header .brand{max-width:205px!important}header nav>a{display:none!important}header nav .subscribe,header nav .subscribe-link{display:none!important}header nav{gap:7px!important}.poa-mobile-menu{display:inline-flex}.poa-translate-trigger{width:40px!important;height:38px!important;padding:0!important;justify-content:center!important}}
  `;
  document.head.appendChild(style);

  const wrap=document.createElement('div');
  wrap.className='poa-translate';
  wrap.innerHTML='<button class="poa-translate-trigger" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Translate this page"><span class="poa-globe" aria-hidden="true">🌐</span><span class="poa-translate-label">Translate</span></button><div class="poa-translate-menu" role="menu"><div class="poa-translate-intro">Read this page in another language</div><div class="poa-translate-grid"></div><div class="poa-translate-more">Machine translation by Google. <a href="https://translate.google.com/?op=websites" target="_blank" rel="noopener">More languages</a></div></div>';
  const subscribe=nav.querySelector('.subscribe,.subscribe-link');
  if(subscribe) nav.insertBefore(wrap,subscribe); else nav.appendChild(wrap);

  const mobileMenu=document.createElement('div');
  mobileMenu.className='poa-mobile-menu';
  mobileMenu.innerHTML='<button class="poa-menu-trigger" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Open site menu">☰</button><div class="poa-menu-panel"><a href="/articles.html">Articles</a><a href="/#about">About</a><a href="/#subscribe">Subscribe</a></div>';
  nav.appendChild(mobileMenu);

  const grid=wrap.querySelector('.poa-translate-grid');
  const translateTo=code=>{const source='https://paradoxofautomation.com'+location.pathname+location.search+location.hash;location.href='https://translate.google.com/translate?sl=auto&tl='+encodeURIComponent(code)+'&u='+encodeURIComponent(source)};
  langs.forEach(([code,label])=>{const b=document.createElement('button');b.type='button';b.className='poa-language';b.textContent=label;b.setAttribute('role','menuitem');b.addEventListener('click',()=>translateTo(code));grid.appendChild(b)});

  const trigger=wrap.querySelector('.poa-translate-trigger');
  const menuTrigger=mobileMenu.querySelector('.poa-menu-trigger');
  const closeTranslate=()=>{wrap.classList.remove('open');trigger.setAttribute('aria-expanded','false')};
  const closeMenu=()=>{mobileMenu.classList.remove('open');menuTrigger.setAttribute('aria-expanded','false')};
  trigger.addEventListener('click',e=>{e.stopPropagation();const open=!wrap.classList.contains('open');closeTranslate();closeMenu();if(open){wrap.classList.add('open');trigger.setAttribute('aria-expanded','true')}});
  menuTrigger.addEventListener('click',e=>{e.stopPropagation();const open=!mobileMenu.classList.contains('open');closeMenu();closeTranslate();if(open){mobileMenu.classList.add('open');menuTrigger.setAttribute('aria-expanded','true')}});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))closeTranslate();if(!mobileMenu.contains(e.target))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeTranslate();closeMenu()}});
})();