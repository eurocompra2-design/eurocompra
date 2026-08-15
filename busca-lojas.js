(function(){
  const lojas={
    'Moda e vestuário':{'Zara':'https://www.zara.com/be/','H&M':'https://www2.hm.com/en_be/index.html','C&A':'https://www.c-and-a.com/be/en/shop','Primark':'https://www.primark.com/en-be','Mango':'https://shop.mango.com/be/en','Uniqlo':'https://www.uniqlo.com/be/en/','Decathlon':'https://www.decathlon.be/','Carolina Herrera':'https://www.carolinaherrera.com/be/en/'},
    'Calçados e esportes':{'Decathlon':'https://www.decathlon.be/','Nike':'https://www.nike.com/be/','Adidas':'https://www.adidas.be/','Foot Locker':'https://www.footlocker.be/'},
    'Beleza e perfumes':{'Carolina Herrera':'https://www.carolinaherrera.com/be/en/','Douglas':'https://www.douglas.be/','ICI PARIS XL':'https://www.iciparisxl.be/'},
    'Eletrônicos e tecnologia':{'MediaMarkt':'https://www.mediamarkt.be/','Coolblue':'https://www.coolblue.be/','Apple':'https://www.apple.com/be/','Fnac':'https://www.nl.fnac.be/','Krëfel':'https://www.krefel.be/'},
    'Casa e decoração':{'IKEA':'https://www.ikea.com/be/en/','Action':'https://www.action.com/en-be/','JYSK':'https://jysk.be/','CASA':'https://www.casashops.com/en-be/','Maisons du Monde':'https://www.maisonsdumonde.com/BE/en/'},
    'Supermercados e alimentação':{'Carrefour':'https://www.carrefour.be/','Delhaize':'https://www.delhaize.be/','Colruyt':'https://www.colruyt.be/'},
    'Crianças e brinquedos':{'DreamLand':'https://www.dreamland.be/','LEGO':'https://www.lego.com/en-be/'},
    'Livros e papelaria':{'Standaard Boekhandel':'https://www.standaardboekhandel.be/','Fnac':'https://www.nl.fnac.be/'},
    'Animais':{'Tom&Co':'https://www.tomandco.com/','Maxi Zoo':'https://www.maxizoo.be/'}
  };
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const esc=v=>String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  function init(){
    const input=document.getElementById('busca-lojas'),box=document.querySelector('.lojas-categorias');
    if(!input||!box)return;
    const wrap=input.parentElement;let button=document.getElementById('buscarLojasBtn');
    if(!button){wrap.style.display='flex';wrap.style.gap='6px';wrap.style.alignItems='stretch';input.style.flex='1';input.style.minWidth='0';button=document.createElement('button');button.id='buscarLojasBtn';button.type='button';button.className='btn primary';button.textContent='🔎 Buscar';button.style.whiteSpace='nowrap';button.style.padding='13px 14px';wrap.appendChild(button)}
    let resultados=document.getElementById('lojasResultados');
    if(!resultados){resultados=document.createElement('div');resultados.id='lojasResultados';resultados.style.cssText='display:none;grid-column:1/-1;background:#fff;border:1px solid #e2e7f0;border-radius:15px;padding:18px;margin-top:0;box-shadow:0 8px 25px rgba(6,59,158,.07)';box.appendChild(resultados)}
    function buscar(){
      const q=input.value.trim();
      if(!q){input.focus();return}
      const cadastradas=[];
      Object.entries(lojas).forEach(([categoria,itens])=>Object.entries(itens).forEach(([nome,url])=>{if(norm(nome).includes(norm(q)))cadastradas.push({categoria,nome,url})}));
      const online='https://www.google.com/search?q='+encodeURIComponent(q+' site oficial Bélgica');
      resultados.style.display='block';
      resultados.innerHTML='<div style="font-size:12px;font-weight:800;letter-spacing:.5px;color:#667085;margin-bottom:10px">RESULTADO DA BUSCA</div>'+(cadastradas.length?cadastradas.map(x=>'<div style="padding:14px 0;border-bottom:1px solid #e2e7f0"><strong style="display:block;font-size:17px;color:#06245c">'+esc(x.nome)+'</strong><span style="display:block;color:#667085;font-size:13px;margin:3px 0 10px">🇧🇪 Site da loja</span><a href="'+x.url+'" target="_blank" rel="noopener noreferrer" style="color:#063b9e;font-weight:800;text-decoration:none">🔗 Visitar site oficial →</a></div>').join(''):'<div style="padding:8px 0 12px"><strong style="display:block;font-size:17px;color:#06245c">'+esc(q)+'</strong><span style="display:block;color:#667085;font-size:13px;margin-top:3px">Loja não cadastrada na lista EuroCompra.</span></div>')+'<div style="margin-top:14px"><a href="'+online+'" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;background:#063b9e;color:#fff;border-radius:11px;padding:11px 15px;font-weight:800;text-decoration:none">🌐 Procurar site oficial na Bélgica →</a></div>';
    }
    if(!button.dataset.buscaLojasAtiva){button.dataset.buscaLojasAtiva='1';button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();buscar()})}
    if(!input.dataset.buscaLojasAtiva){input.dataset.buscaLojasAtiva='1';input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();buscar()}})}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
