(function(){
  const lojas={
    'Moda':{
      'Zara':'https://www.zara.com/be/','H&M':'https://www2.hm.com/en_be/index.html','C&A':'https://www.c-and-a.com/be/en/shop','Primark':'https://www.primark.com/en-be','Mango':'https://shop.mango.com/be/en','Uniqlo':'https://www.uniqlo.com/be/en/','Decathlon':'https://www.decathlon.be/'
    },
    'Eletrônicos':{
      'MediaMarkt':'https://www.mediamarkt.be/','Coolblue':'https://www.coolblue.be/','Apple':'https://www.apple.com/be/','Fnac':'https://www.nl.fnac.be/','Krëfel':'https://www.krefel.be/'
    },
    'Casa':{
      'IKEA':'https://www.ikea.com/be/en/','Action':'https://www.action.com/en-be/','JYSK':'https://jysk.be/','Casa':'https://www.casashops.com/en-be/','Maisons du Monde':'https://www.maisonsdumonde.com/BE/en/'
    }
  };
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  function init(){
    const input=document.getElementById('busca-lojas');
    const box=document.querySelector('.lojas-categorias');
    if(!input||!box)return;
    let resultados=document.getElementById('lojasResultados');
    if(!resultados){
      resultados=document.createElement('div');
      resultados.id='lojasResultados';
      resultados.style.cssText='display:none;grid-column:1/-1;background:#fff;border:1px solid #e2e7f0;border-radius:15px;padding:18px;margin-top:0';
      box.appendChild(resultados);
    }
    function buscar(){
      const q=norm(input.value);
      const cards=box.querySelectorAll('.loja-card');
      if(!q){resultados.style.display='none';cards.forEach(c=>c.style.display='');return;}
      const found=[];
      Object.entries(lojas).forEach(([cat,itens])=>Object.entries(itens).forEach(([nome,url])=>{
        if(norm(nome).includes(q)||norm(cat).includes(q))found.push({cat,nome,url});
      }));
      cards.forEach(c=>c.style.display='none');
      resultados.style.display='block';
      if(!found.length){resultados.innerHTML='<strong>Nenhuma loja encontrada.</strong><p style="color:#667085;margin:6px 0 0">Tente o nome da loja ou categoria.</p>';return;}
      resultados.innerHTML='<strong>🔎 Lojas encontradas</strong>'+found.map(x=>'<a href="'+x.url+'" target="_blank" rel="noopener noreferrer" style="display:block;padding:11px 0;border-bottom:1px solid #e2e7f0;color:#063b9e;font-weight:700">'+x.nome+' <span style="font-weight:400;color:#667085">· '+x.cat+'</span> ↗</a>').join('');
    }
    input.addEventListener('input',buscar);
    input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();buscar();}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
