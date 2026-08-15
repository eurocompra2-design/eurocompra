(function(){
  const CSS = `
  .ec-cat-card{position:relative!important;display:flex!important;align-items:center!important;gap:18px!important;min-height:112px!important;padding:22px 24px!important;border:1px solid #e2e7f0!important;border-radius:20px!important;background:#fff!important;box-shadow:0 10px 30px rgba(6,59,158,.06)!important;cursor:pointer!important;transition:transform .18s,box-shadow .18s,border-color .18s!important}
  .ec-cat-card:hover{transform:translateY(-2px)!important;box-shadow:0 15px 34px rgba(6,59,158,.10)!important;border-color:#cbd9ef!important}
  .ec-cat-card:after{content:'›';margin-left:auto;font-size:38px;line-height:1;color:#06245c;font-weight:400}
  .ec-cat-card h3{margin:0 0 4px!important;font-size:22px!important;line-height:1.2!important;color:#172033!important}
  .ec-cat-card p{margin:0!important;font-size:15px!important;line-height:1.45!important;color:#667085!important}
  .ec-cat-icon{width:58px!important;height:58px!important;min-width:58px!important;border-radius:50%!important;background:#f7f9fc!important;border:1px solid #e2e7f0!important;display:grid!important;place-items:center!important;font-size:28px!important}
  .ec-store-list{display:grid!important;gap:12px!important;margin-top:12px!important}
  .ec-store-item{display:flex!important;align-items:center!important;min-height:72px!important;padding:14px 16px!important;border:1px solid #e2e7f0!important;border-radius:16px!important;background:#fff!important;box-shadow:0 7px 20px rgba(6,59,158,.045)!important}
  .ec-store-item a{display:flex!important;align-items:center!important;width:100%!important;padding:0!important;border:0!important;background:transparent!important;color:#172033!important;font-size:17px!important;font-weight:800!important;text-decoration:none!important}
  .ec-store-item a:after{content:'›';margin-left:auto;font-size:30px;font-weight:400;color:#06245c}
  .ec-store-item .ec-store-name{color:#172033!important;font-size:17px!important;font-weight:800!important}
  .ec-store-item .ec-store-desc{display:block!important;margin-top:3px!important;color:#667085!important;font-size:13px!important;font-weight:400!important}
  .ec-store-title{margin:4px 0 12px!important;color:#06245c!important;font-size:21px!important;font-weight:800!important}
  .ec-store-subtitle{display:none!important}
  @media(max-width:700px){.ec-cat-card{min-height:100px!important;padding:18px!important;gap:14px!important}.ec-cat-icon{width:52px!important;height:52px!important;min-width:52px!important}.ec-cat-card h3{font-size:20px!important}.ec-cat-card p{font-size:14px!important}.ec-store-item{min-height:66px;padding:13px 14px!important}.ec-store-item a{font-size:16px!important}}
  `;
  function injectStyle(){
    if(document.getElementById('eurocompra-categorias-profissionais')) return;
    const s=document.createElement('style'); s.id='eurocompra-categorias-profissionais'; s.textContent=CSS; document.head.appendChild(s);
  }
  function cleanText(t){return (t||'').replace(/🌐\s*/g,'').replace(/\s*Abrir site oficial\s*/gi,'').trim();}
  function normalizar(){
    const box=document.querySelector('.lojas-categorias');
    if(!box) return;
    box.querySelectorAll('.loja-card').forEach(function(card){
      card.classList.add('ec-cat-card');
      if(!card.querySelector('.ec-cat-icon')){
        const first=card.querySelector('div[style*="font-size:30px"]');
        const icon=document.createElement('div'); icon.className='ec-cat-icon'; icon.textContent=first?cleanText(first.textContent):'🛍️';
        if(first) first.remove();
        card.insertBefore(icon,card.firstChild);
      }
    });
    box.querySelectorAll('.lojas-lista-aberta').forEach(function(list){
      list.classList.add('ec-store-list');
      const oldTitle=list.querySelector('strong:first-child');
      if(oldTitle){
        const title=document.createElement('div'); title.className='ec-store-title'; title.textContent=cleanText(oldTitle.textContent); oldTitle.replaceWith(title);
      }
      list.querySelectorAll('a').forEach(function(a){
        const parent=a.parentElement;
        const name=parent && parent.querySelector('strong') ? cleanText(parent.querySelector('strong').textContent) : cleanText(a.textContent);
        if(!name) return;
        a.textContent=name;
        a.removeAttribute('style');
        a.classList.add('ec-store-link');
        if(parent && parent.tagName==='DIV'){
          parent.classList.add('ec-store-item');
          parent.removeAttribute('style');
          const strong=parent.querySelector('strong');
          if(strong && strong!==a) strong.remove();
        }
      });
      list.querySelectorAll('div').forEach(function(d){
        const txt=cleanText(d.textContent);
        if(/^Sites oficiais$/i.test(txt)) d.classList.add('ec-store-subtitle');
      });
    });
  }
  function start(){injectStyle();normalizar();new MutationObserver(normalizar).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
