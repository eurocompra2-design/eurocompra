(function(){
  function iniciar(){
    const box=document.querySelector('.lojas-categorias');
    if(!box||box.querySelector('[data-categoria="doces"]')) return;
    const card=document.createElement('div');
    card.className='loja-card';
    card.dataset.categoria='doces';
    card.innerHTML='<h3>🍫 Doces</h3><p>Lojas de chocolate na Bélgica.</p>';
    box.appendChild(card);
    const lojas=[['Neuhaus','https://www.neuhauschocolates.com/be_en/'],['Leonidas','https://www.leonidas.com/be_en'],['Pierre Marcolini','https://eu.marcolini.com/'],['Galler','https://www.galler.com/'],['Chocolaterie Mary','https://www.mary.be/'],['Wittamer','https://wittamer.com/']];
    card.addEventListener('click',function(){
      const antigo=box.querySelector('[data-doces-lista="1"]');
      if(antigo){antigo.remove();return;}
      const lista=document.createElement('div');
      lista.className='lojas-lista-aberta ativa';
      lista.dataset.docesLista='1';
      lista.innerHTML='<strong>🍫 Lojas de chocolate</strong>'+lojas.map(function(item){return '<a href="'+item[1]+'" target="_blank" rel="noopener noreferrer">'+item[0]+' ↗</a>';}).join('');
      box.appendChild(lista);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',iniciar); else iniciar();
})();
