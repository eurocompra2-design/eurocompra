// EuroCompra — pasta Chocolates: uma única lista, sem nomes repetidos e identidade visual azul.
(function(){
  const azul='#063b9e', escuro='#06245c', claro='#eaf1ff', borda='#d8e5ff';
  const lojas=[
    ['Milka','https://www.milka.com/be/'],['Lindt','https://www.lindt.be/'],['Ferrero Rocher','https://www.ferrerorocher.com/be/en/'],['Côte d’Or','https://www.cotedor.com/'],['Neuhaus','https://www.neuhauschocolates.com/be_en/'],['Godiva','https://www.godiva.com/'],['Leonidas','https://www.leonidas.com/be_en'],['Guylian','https://www.guylian.com/'],['Mary','https://www.mary.be/'],['Galler','https://www.galler.com/'],['Jacques','https://www.jacques.be/']
  ];
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  function dedupe(){const seen=new Set();return lojas.filter(x=>{const k=norm(x[0]);if(seen.has(k))return false;seen.add(k);return true;});}
  function aplicarVisual(){if(document.getElementById('eurocompra-blue-style'))return;const s=document.createElement('style');s.id='eurocompra-blue-style';s.textContent=`
    :root{--azul:${azul};--escuro:${escuro};--claro:${claro};--borda:${borda}}
    body{background:#fff!important;color:#172033!important;font-family:Arial,sans-serif!important}
    header{background:#fff!important;border-bottom:1px solid #e2e7f0!important}
    .logo{color:${azul}!important}.logo-icon{background:${azul}!important;color:#fff!important}
    h1,h2,h3,.section-title h2,.form-header h2,.access-content h3{color:${escuro}!important}
    .badge{background:${claro}!important;color:${azul}!important}
    .btn.primary,.primary,.access-primary,.valores-btn{background:${azul}!important;color:#fff!important}
    .btn.gold,.gold{background:${claro}!important;color:${azul}!important;border:1px solid ${borda}!important}
    .hero{background:linear-gradient(135deg,#f7faff,#fff)!important}
    .card,.step,.hero-card,.form-box,.access-card,.valores-panel{border-color:${borda}!important;box-shadow:0 12px 35px rgba(6,59,158,.07)!important;background:#fff!important}
    .mini-icon,.access-icon{background:${claro}!important;color:${azul}!important}
    .number{background:${azul}!important;color:#fff!important}
    input,select,textarea,.lojas-search input{border-color:${borda}!important;background:#fff!important}
    .phone-prefix,.phone-area{background:${claro}!important;color:${azul}!important}
    .lojas-lista-aberta{background:#fff!important;border-color:${borda}!important}
    .lojas-lista-aberta a{color:${azul}!important;border-color:${borda}!important}
    footer{background:${escuro}!important;color:#fff!important}
    .social-links a{color:${escuro}!important}
  `;document.head.appendChild(s);}
  function iniciar(){
    aplicarVisual();
    const box=document.querySelector('.lojas-categorias');if(!box)return;
    box.querySelectorAll('.ec-chocolates-card').forEach(x=>x.remove());
    const card=document.createElement('div');card.className='loja-card ec-chocolates-card';card.dataset.chocolatesCard='1';card.setAttribute('role','button');card.setAttribute('tabindex','0');card.setAttribute('aria-expanded','false');card.style.cssText='cursor:pointer!important;background:#fff!important;border:2px solid #063b9e!important;border-radius:17px!important;box-shadow:0 8px 24px rgba(6,59,158,.07)!important;min-height:125px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:12px!important;';card.innerHTML='<div style="font-size:30px;margin-bottom:7px">🍫</div><h3 style="margin:0;color:'+azul+'!important;font-family:Arial,sans-serif!important;font-size:18px!important;font-weight:900!important">Chocolates</h3>';
    box.appendChild(card);
    const lista=dedupe();
    function abrir(){let old=box.querySelector('.ec-chocolates-lista');if(old){old.remove();card.setAttribute('aria-expanded','false');return;}const div=document.createElement('div');div.className='lojas-lista-aberta ec-chocolates-lista';div.style.cssText='grid-column:1/-1!important;background:#fff!important;border:1px solid '+borda+'!important;border-radius:17px!important;padding:12px!important;box-shadow:0 10px 30px rgba(6,59,158,.07)!important';div.innerHTML=lista.map(x=>'<a href="'+x[1]+'" target="_blank" rel="noopener noreferrer" style="display:block!important;color:'+azul+'!important;font-weight:800!important;padding:11px 8px!important;border-bottom:1px solid '+borda+'!important;text-decoration:none!important">'+x[0]+'</a>').join('');box.appendChild(div);card.setAttribute('aria-expanded','true');}
    card.addEventListener('click',abrir);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();abrir();}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
