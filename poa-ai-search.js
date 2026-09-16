(()=>{
  const path=location.pathname.replace(/\/$/,'')||'/';
  if(path!=='/articles'&&path!=='/articles.html') return;

  const input=document.getElementById('article-search');
  const grid=document.getElementById('article-cards');
  const note=document.getElementById('result-note');
  const empty=document.getElementById('empty-state');
  const sort=document.getElementById('article-sort');
  const sortLabel=document.getElementById('sort-label');
  if(!input||!grid||!note) return;

  document.querySelectorAll('.version,.workflow-version').forEach(el=>el.textContent='SITE V1.18');

  const cards=[...grid.querySelectorAll('.card')];
  const cardById=new Map(cards.map(card=>{
    const href=(card.getAttribute('href')||'').replace(/^\//,'').replace(/\.html$/,'')||'home';
    return [href,card];
  }));

  const style=document.createElement('style');
  style.textContent=`
    .poa-ai-status{margin:-8px 0 20px;padding:13px 15px;border-left:4px solid #d64b2a;background:#fffdf8;color:#393630;font-size:.9rem;line-height:1.5}
    .poa-ai-status strong{color:#0e0f11}.poa-ai-related{font-weight:800;color:#9f3118}
    .poa-ai-reason{display:block;margin:-6px 0 17px;padding:10px 12px;border-left:3px solid #d64b2a;background:#f4f0e7;color:#4f4a42;font-size:.79rem;line-height:1.45}
    .poa-ai-badge{display:inline-block;margin-right:7px;font:800 .66rem/1 system-ui;text-transform:uppercase;letter-spacing:.08em;color:#9f3118}
  `;
  document.head.appendChild(style);

  let statusBox=document.querySelector('.poa-ai-status');
  if(!statusBox){statusBox=document.createElement('div');statusBox.className='poa-ai-status';statusBox.hidden=true;note.insertAdjacentElement('afterend',statusBox);}

  const resetCards=()=>{
    cards.forEach(card=>{
      card.hidden=false;
      card.classList.remove('search-match');
      card.querySelectorAll('.poa-ai-reason').forEach(el=>el.remove());
    });
    statusBox.hidden=true;
    if(empty) empty.style.display='none';
    if(sort) sort.disabled=false;
  };

  const showResult=(result,q)=>{
    cards.forEach(card=>{card.hidden=true;card.querySelectorAll('.poa-ai-reason').forEach(el=>el.remove());});
    const matches=Array.isArray(result.matches)?result.matches:[];
    const displayed=[];
    matches.forEach(m=>{
      const card=cardById.get(m.id);
      if(!card) return;
      card.hidden=false;
      const reason=document.createElement('span');
      reason.className='poa-ai-reason';
      reason.innerHTML=`<span class="poa-ai-badge">${m.relation==='direct'?'Direct match':'Related reading'}</span>${String(m.reason||'')}`;
      const meta=card.querySelector('.meta');
      if(meta) meta.insertAdjacentElement('beforebegin',reason); else card.appendChild(reason);
      grid.appendChild(card);
      displayed.push(card);
    });

    statusBox.hidden=false;
    const msg=String(result.message||'').replace(/[<>]/g,'');
    if(result.status==='not_covered'){
      statusBox.innerHTML=`<strong>POA has not covered this subject directly yet.</strong>${msg?` ${msg}`:''}${displayed.length?' The articles below are only related reading.':''}`;
      note.textContent=displayed.length?`${displayed.length} related article${displayed.length===1?'':'s'} for “${q}”`:`No POA article directly covers “${q}” yet.`;
    } else if(result.status==='partly_covered'){
      statusBox.innerHTML=`<strong>POA touches this subject, but does not fully answer it.</strong>${msg?` ${msg}`:''}`;
      note.textContent=`${displayed.length} partial match${displayed.length===1?'':'es'} for “${q}”`;
    } else {
      statusBox.innerHTML=`<strong>POA has material that directly addresses this question.</strong>${msg?` ${msg}`:''}`;
      note.textContent=`${displayed.length} best match${displayed.length===1?'':'es'} for “${q}”`;
    }
    if(!displayed.length&&empty) empty.style.display='block';
    if(sort) sort.disabled=true;
    if(sortLabel) sortLabel.textContent='AI relevance';
  };

  let timer=null,controller=null,last='';
  async function run(){
    const q=input.value.trim();
    if(!q){last='';resetCards();note.textContent=cards.length+' articles';if(sortLabel&&sort)sortLabel.textContent=sort.options[sort.selectedIndex].text;return;}
    if(q.length<3) return;
    if(q===last) return;
    last=q;
    if(controller) controller.abort();
    controller=new AbortController();
    note.textContent='AI is interpreting your question…';
    statusBox.hidden=true;
    if(sort) sort.disabled=true;
    try{
      const res=await fetch('/.netlify/functions/poa-search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q}),signal:controller.signal});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||'Search failed');
      if(input.value.trim()!==q) return;
      showResult(data,q);
    }catch(err){
      if(err.name==='AbortError') return;
      resetCards();
      statusBox.hidden=false;
      statusBox.innerHTML='<strong>AI search is not available yet.</strong> The site is using the local article filter for now.';
      note.textContent='Local search results';
    }
  }

  input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(run,450);});
  document.querySelectorAll('.topic-row button').forEach(btn=>btn.addEventListener('click',()=>{if(input.value.trim()){last='';setTimeout(run,0);}}));
  input.placeholder='Ask POA a question in plain English…';
  const help=document.querySelector('.search-help');
  if(help) help.innerHTML='<strong>Ask POA naturally.</strong> AI checks whether the published library actually covers your question. If it does not, it will say so rather than stretching weak matches.';
})();