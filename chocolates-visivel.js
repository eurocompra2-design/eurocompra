(function(){
  function iniciar(){
    const box=document.querySelector('.lojas-categorias');
    if(!box || box.querySelector('[data-chocolates-card="1"]')) return;

    const card=document.createElement('div');
    card.className='loja-card';
    card.dataset.chocolatesCard='1';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-expanded','false');
    card.innerHTML='<div style="font-size:30px;margin-bottom:8px">🍫</div><h3>Chocolates</h3><p>Somente lojas de chocolate na Bélgica.</p>';
    box.appendChild(card);

    const lojas=[
      ['Leonidas','https://www.leonidas.com/be_en'],
      ['Neuhaus','https://www.neuhauschocolates.com/be_en/'],
      ['Pierre Marcolini','https://eu.marcolini.com/'],
      ['Galler','https://www.galler.com/'],
      ['Chocolaterie Mary','https://www.mary.be/']
    ];

    function abrirLojas(){
      let lista=box.querySelector('[data-chocolates-lista="1"]');
      if(lista){
        lista.remove();
        card.setAttribute('aria-expanded','false');
        return;
      }

      lista=document.createElement('div');
      lista.className='lojas-lista-aberta ativa';
      lista.dataset.chocolatesLista='1';
      lista.innerHTML=lojas.map(function(item){
        return '<a href="'+item[1]+'" target="_blank" rel="noopener noreferrer">'+item[0]+'</a>';
      }).join('');

      box.appendChild(lista);
      card.setAttribute('aria-expanded','true');
    }

    card.addEventListener('click',abrirLojas);
    card.addEventListener('keydown',function(e){
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        abrirLojas();
      }
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',iniciar); else iniciar();
})();
