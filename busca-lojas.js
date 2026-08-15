(function(){
  const lojas={'Zara':'https://www.zara.com/be/','H&M':'https://www2.hm.com/en_be/index.html','C&A':'https://www.c-and-a.com/be/en/shop','Primark':'https://www.primark.com/en-be','Mango':'https://shop.mango.com/be/en','Uniqlo':'https://www.uniqlo.com/be/en/','Decathlon':'https://www.decathlon.be/','Carolina Herrera':'https://www.carolinaherrera.com/be/en/','Nike':'https://www.nike.com/be/','Adidas':'https://www.adidas.be/','Foot Locker':'https://www.footlocker.be/','Sephora':'https://www.sephora.be/','Douglas':'https://www.douglas.be/','ICI PARIS XL':'https://www.iciparisxl.be/','MediaMarkt':'https://www.mediamarkt.be/','Coolblue':'https://www.coolblue.be/','Apple':'https://www.apple.com/be/','Fnac':'https://www.nl.fnac.be/','Krëfel':'https://www.krefel.be/','IKEA':'https://www.ikea.com/be/en/','Action':'https://www.action.com/en-be/','JYSK':'https://jysk.be/','CASA':'https://www.casashops.com/en-be/','Maisons du Monde':'https://www.maisonsdumonde.com/BE/en/','Carrefour':'https://www.carrefour.be/','Delhaize':'https://www.delhaize.be/','Colruyt':'https://www.colruyt.be/','DreamLand':'https://www.dreamland.be/','LEGO':'https://www.lego.com/en-be/','Standaard Boekhandel':'https://www.standaardboekhandel.be/','Tom&Co':'https://www.tomandco.com/','Maxi Zoo':'https://www.maxizoo.be/','Louis Vuitton':'https://be.louisvuitton.com/'};
  const chocolates={'Neuhaus':'https://www.neuhauschocolates.com/be_en/','Leonidas':'https://www.leonidas.com/be_en','Pierre Marcolini':'https://eu.marcolini.com/','Galler':'https://www.galler.com/','Chocolaterie Mary':'https://www.mary.be/','Wittamer':'https://wittamer.com/'};
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const esc=v=>String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  function init(){
    const input=document.getElementById('busca-lojas'),box=document.querySelector('.lojas-categorias');if(!input||!box)return;
    if(!box.querySelector('[data-categoria="doces"]')){
      const card=document.createElement('div');card.className='loja-card';card.dataset.categoria='doces';card.innerHTML='<h3>🍫 Doces</h3><p>Chocolaterias e lojas de chocolate na Bélgica.</p>';
      box.appendChild(card);
      card.addEventListener('click',function(){
        const old=box.querySelector('.lojas-lista-aberta[data-doces="1"]');if(old)old.remove();
        const lista=document.createElement('div');lista.className='lojas-lista-aberta ativa';lista.dataset.doces='1';
        lista.innerHTML='<strong>🍫 Doces — lojas de chocolate na Bélgica</strong>'+Object.entries(chocolates).map(([nome,url])=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+esc(nome)+' ↗</a>').join('');
        box.appendChild(lista);
      });
    }
    const wrap=input.parentElement;let button=document.getElementById('buscarLojasBtn');
    if(!button){wrap.style.display='flex';wrap.style.gap='6px';input.style.flex='1';button=document.createElement('button');button.id='buscarLojasBtn';button.type='button';button.className='btn primary';button.textContent='🔎 Buscar';button.style.whiteSpace='nowrap';button.style.padding='13px 14px';wrap.appendChild(button)}
    let resultados=document.getElementById('lojasResultados');
    if(!resultados){resultados=document.createElement('div');resultados.id='lojasResultados';resultados.style.cssText='display:none;grid-column:1/-1;background:#fff;border:1px solid #e2e7f0;border-radius:15px;padding:18px;margin-top:0;box-shadow:0 8px 25px rgba(6,59,158,.07)';box.appendChild(resultados)}
    function buscar(){const q=input.value.trim();if(!q){input.focus();return}const chave=norm(q);const base=Object.entries(lojas).concat(Object.entries(chocolates));const encontrados=base.filter(([nome])=>norm(nome).includes(chave)||chave.includes(norm(nome)));resultados.style.display='block';if(!encontrados.length){resultados.innerHTML='<strong>Loja não encontrada</strong><p style="color:#667085;margin:6px 0 0">Digite o nome de uma loja ou marca.</p>';return}resultados.innerHTML='<div style="font-weight:800;color:#06245c;margin-bottom:10px">🔎 Resultado da busca</div>'+encontrados.map(([nome,url])=>'<div style="padding:14px 0;border-bottom:1px solid #e2e7f0"><div style="font-size:17px;font-weight:800;color:#06245c">'+esc(nome)+'</div><div style="font-size:13px;color:#667085;margin:3px 0 10px">Site oficial</div><a href="'+url+'" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;background:#063b9e;color:#fff;border-radius:10px;padding:10px 14px;font-weight:800;text-decoration:none">🌐 Abrir site oficial</a></div>').join('')}
    if(!button.dataset.buscaLojasAtiva){button.dataset.buscaLojasAtiva='1';button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();buscar()})}
    if(!input.dataset.buscaLojasAtiva){input.dataset.buscaLojasAtiva='1';input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();buscar()}})}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
