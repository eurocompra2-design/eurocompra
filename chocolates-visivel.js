(function(){
  function iniciar(){
    const box=document.querySelector('.lojas-categorias');
    if(!box || box.querySelector('[data-chocolates-card="1"]')) return;
    const card=document.createElement('div');
    card.className='loja-card';
    card.dataset.chocolatesCard='1';
    card.innerHTML='<div style="font-size:30px;margin-bottom:8px">🍫</div><h3>Chocolates</h3><p>Somente lojas de chocolate na Bélgica.</p>';
    box.appendChild(card);
    const lojas=[['Neuhaus','https://www.neuhauschocolates.com/be_en/'],['Leonidas','https://www.leonidas.com/be_en'],['Pierre Marcolini','https://eu.marcolini.com/'],['Galler','https://www.galler.com/'],['Chocolaterie Mary','https://www.mary.be/'],['Wittamer','https://wittamer.com/']];
    card.addEventListener('click',function(){
      let lista=box.querySelector('[data-chocolates-lista="1"]');
      if(lista){lista.remove();return;}
      lista=document.createElement('div');
      lista.className='lojas-lista-aberta ativa';
      lista.dataset.chocolatesLista='1';
      lista.style.cssText='grid-column:1/-1;background:#fff;border:1px solid #e2e7f0;border-radius:18px;padding:20px;box-shadow:0 10px 30px rgba(6,59,158,.06)';
      lista.innerHTML='<div style="font-size:18px;font-weight:800;color:#06245c;margin-bottom:8px">🍫 Lojas de chocolate</div><div style="font-size:13px;color:#667085;margin-bottom:6px">Sites oficiais</div>'+lojas.map(function(item){return '<div style="padding:12px 0;border-bottom:1px solid #e7ebf2"><strong style="display:block;color:#06245c;margin-bottom:7px">'+item[0]+'</strong><a href="'+item[1]+'" target="_blank" rel="noopener noreferrer" style="display:inline-flex;background:#063b9e;color:#fff;border-radius:10px;padding:9px 13px;font-weight:800">🌐 Abrir site oficial</a></div>';}).join('');
      box.appendChild(lista);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',iniciar); else iniciar();
})();
