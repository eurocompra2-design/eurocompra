(function(){
  const lojas={
    'Moda e vestuário':{
      'Zara':'https://www.zara.com/be/','H&M':'https://www2.hm.com/en_be/index.html','C&A':'https://www.c-and-a.com/be/en/shop','Primark':'https://www.primark.com/en-be','Mango':'https://shop.mango.com/be/en','Uniqlo':'https://www.uniqlo.com/be/en/','Decathlon':'https://www.decathlon.be/','Carolina Herrera':'https://www.carolinaherrera.com/be/en/'
    },
    'Calçados e esportes':{
      'Decathlon':'https://www.decathlon.be/','Nike':'https://www.nike.com/be/','Adidas':'https://www.adidas.be/','Foot Locker':'https://www.footlocker.be/'
    },
    'Beleza e perfumes':{
      'Carolina Herrera':'https://www.carolinaherrera.com/be/en/','Douglas':'https://www.douglas.be/','ICI PARIS XL':'https://www.iciparisxl.be/'
    },
    'Eletrônicos e tecnologia':{
      'MediaMarkt':'https://www.mediamarkt.be/','Coolblue':'https://www.coolblue.be/','Apple':'https://www.apple.com/be/','Fnac':'https://www.nl.fnac.be/','Krëfel':'https://www.krefel.be/'
    },
    'Casa e decoração':{
      'IKEA':'https://www.ikea.com/be/en/','Action':'https://www.action.com/en-be/','JYSK':'https://jysk.be/','CASA':'https://www.casashops.com/en-be/','Maisons du Monde':'https://www.maisonsdumonde.com/BE/en/'
    },
    'Supermercados e alimentação':{
      'Carrefour':'https://www.carrefour.be/','Delhaize':'https://www.delhaize.be/','Colruyt':'https://www.colruyt.be/'
    },
    'Crianças e brinquedos':{
      'DreamLand':'https://www.dreamland.be/','LEGO':'https://www.lego.com/en-be/'
    },
    'Livros e papelaria':{
      'Standaard Boekhandel':'https://www.standaardboekhandel.be/','Fnac':'https://www.nl.fnac.be/'
    },
    'Animais':{
      'Tom&Co':'https://www.tomandco.com/','Maxi Zoo':'https://www.maxizoo.be/'
    }
  };

  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const esc=v=>String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  function init(){
    const input=document.getElementById('busca-lojas');
    const box=document.querySelector('.lojas-categorias');
    if(!input||!box)return;

    const searchWrap=input.parentElement;
    let button=document.getElementById('buscarLojasBtn');
    if(!button && searchWrap){
      searchWrap.style.display='flex';
      searchWrap.style.gap='10px';
      searchWrap.style.alignItems='stretch';
      input.style.flex='1';
      input.style.minWidth='0';
      button=document.createElement('button');
      button.id='buscarLojasBtn';
      button.type='button';
      button.className='btn primary';
      button.textContent='🔎 Buscar lojas';
      button.style.whiteSpace='nowrap';
      button.style.padding='13px 18px';
      searchWrap.appendChild(button);
    }

    let resultados=document.getElementById('lojasResultados');
    if(!resultados){
      resultados=document.createElement('div');
      resultados.id='lojasResultados';
      resultados.style.cssText='display:none;grid-column:1/-1;background:#fff;border:1px solid #e2e7f0;border-radius:15px;padding:18px;margin-top:0;box-shadow:0 8px 25px rgba(6,59,158,.07)';
      box.appendChild(resultados);
    }

    function buscar(){
      const q=norm(input.value);
      const cards=[...box.querySelectorAll('.loja-card')];
      if(!q){
        resultados.style.display='none';
        cards.forEach(c=>c.style.display='');
        return;
      }

      const found=[];
      Object.entries(lojas).forEach(([categoria,itens])=>{
        const categoriaMatch=norm(categoria).includes(q);
        Object.entries(itens).forEach(([nome,url])=>{
          if(categoriaMatch || norm(nome).includes(q)) found.push({categoria,nome,url});
        });
      });

      cards.forEach(card=>{
        const titulo=norm((card.querySelector('h3')||{}).textContent||'');
        const categoria=Object.keys(lojas).find(k=>titulo.includes(norm(k)));
        card.style.display=found.some(x=>x.categoria===categoria)?'':'none';
      });

      resultados.style.display='block';
      if(!found.length){
        resultados.innerHTML='<strong>❌ Nenhuma loja encontrada.</strong><p style="color:#667085;margin:6px 0 0">Tente o nome da loja ou categoria.</p>';
        return;
      }

      resultados.innerHTML='<strong>🔎 Lojas encontradas</strong>'+found.map(x=>
        '<a href="'+x.url+'" target="_blank" rel="noopener noreferrer" style="display:block;padding:11px 0;border-bottom:1px solid #e2e7f0;color:#063b9e;font-weight:700">'+esc(x.nome)+' <span style="font-weight:400;color:#667085">· '+esc(x.categoria)+'</span> ↗</a>'
      ).join('');
    }

    if(button && !button.dataset.buscaLojasAtiva){
      button.dataset.buscaLojasAtiva='1';
      button.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();buscar();});
    }

    if(!input.dataset.buscaLojasAtiva){
      input.dataset.buscaLojasAtiva='1';
      input.addEventListener('keydown',function(e){
        if(e.key==='Enter'){e.preventDefault();buscar();}
      });
      input.addEventListener('input',buscar);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
