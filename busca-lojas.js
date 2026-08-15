(function(){
  function init(){
    const input=document.getElementById('busca-lojas');
    if(!input)return;
    const wrap=input.parentElement;
    let button=document.getElementById('buscarLojasBtn');
    if(!button){
      wrap.style.display='flex';
      wrap.style.gap='6px';
      wrap.style.alignItems='stretch';
      input.style.flex='1';
      input.style.minWidth='0';
      button=document.createElement('button');
      button.id='buscarLojasBtn';
      button.type='button';
      button.className='btn primary';
      button.textContent='🔎 Buscar';
      button.style.whiteSpace='nowrap';
      button.style.padding='13px 16px';
      wrap.appendChild(button);
    }

    // Remove resultados antigos criados pelas versões anteriores da busca.
    document.getElementById('lojasResultados')?.remove();

    function buscar(){
      const q=input.value.trim();
      if(!q){input.focus();return;}
      // Pesquisa online diretamente, sem depender da lista de lojas do EuroCompra.
      window.location.href='https://www.google.com/search?q='+encodeURIComponent(q+' lojas Bélgica');
    }

    if(!button.dataset.buscaDireta){
      button.dataset.buscaDireta='1';
      button.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        buscar();
      });
    }
    if(!input.dataset.buscaDireta){
      input.dataset.buscaDireta='1';
      input.addEventListener('keydown',function(e){
        if(e.key==='Enter'){
          e.preventDefault();
          buscar();
        }
      });
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
