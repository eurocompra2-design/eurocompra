(function(){
  function aplicarVisual(){
    if(document.getElementById('eurocompra-beacons-style')) return;
    const style=document.createElement('style');
    style.id='eurocompra-beacons-style';
    style.textContent=`
      :root{--azul:#111;--escuro:#111;--claro:#f5eee7;--dourado:#e8dacb;--cinza:#f7f2ed;--texto:#111;--muted:#333;--borda:#111}
      html{background:#f7f2ed}
      body{background:#f7f2ed!important;color:#111!important;font-family:Georgia,'Times New Roman',serif!important;line-height:1.45!important}
      a{color:inherit}
      header{position:sticky;top:0;z-index:20;background:rgba(247,242,237,.97)!important;border-bottom:2px solid #111!important;box-shadow:none!important}
      .container{width:min(1120px,92%);margin:auto}
      .nav{min-height:78px!important;gap:10px!important}
      .logo{font-family:Arial,sans-serif!important;font-size:25px!important;font-weight:900!important;color:#111!important;letter-spacing:-.5px}
      .logo-icon{width:44px!important;height:44px!important;border-radius:50%!important;background:#111!important;color:#fff!important;margin-right:9px!important}
      .navlinks{gap:20px!important}
      .navlinks a{font-family:Arial,sans-serif!important;font-size:14px!important;font-weight:800!important;color:#111!important}
      .btn{font-family:Arial,sans-serif!important;border:2px solid #111!important;border-radius:14px!important;padding:12px 18px!important;box-shadow:none!important}
      .primary{background:#111!important;color:#fff!important}
      .gold{background:#e8dacb!important;color:#111!important}
      section{padding:58px 0!important}
      .hero{background:#f7f2ed!important}
      .hero-grid{grid-template-columns:1fr!important;max-width:900px}
      .badge{background:#e8dacb!important;color:#111!important;border:2px solid #111!important;border-radius:999px!important;font-family:Arial,sans-serif!important;font-weight:800!important}
      h1,.section-title h2,.form-header h2,.access-heading h2,.access-content h3{font-family:Georgia,'Times New Roman',serif!important;color:#111!important}
      h1{font-size:clamp(42px,8vw,68px)!important;line-height:1.02!important}
      .hero p,.section-title p,.card p,.loja-card p,.access-heading p,.access-content p,.form-header p,.help{color:#333!important}
      .hero-card,.form-box,.card,.loja-card,.access-card,.valores-panel{background:#eaded2!important;border:2px solid #111!important;border-radius:16px!important;box-shadow:none!important}
      .mini-icon,.access-icon{background:#f7f2ed!important;border:2px solid #111!important;border-radius:12px!important}
      .services,.form-section{background:#f7f2ed!important}
      .section-title{text-align:left;max-width:900px;margin:0 auto 28px!important}
      .section-title h2{font-size:36px!important}
      .cards{grid-template-columns:1fr!important;gap:16px!important}
      .card{padding:22px!important}
      .lojas-search{max-width:900px!important;margin:0 auto 22px!important}
      .lojas-search input{background:#fff!important;border:2px solid #111!important;border-radius:14px!important;color:#111!important;font-family:Georgia,'Times New Roman',serif!important;padding:15px 16px!important}
      .lojas-categorias{grid-template-columns:repeat(2,1fr)!important;gap:12px!important}
      .lojas-categorias .loja-card{min-height:125px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;background:#fff!important;border:3px solid #111!important;border-radius:16px!important;padding:22px!important;box-shadow:none!important}
      .lojas-categorias .loja-card h3{font-family:Georgia,'Times New Roman',serif!important;font-size:25px!important;margin:0 0 6px!important;color:#111!important}
      .lojas-categorias .loja-card p{font-family:Georgia,'Times New Roman',serif!important;font-size:16px!important;margin:0!important}
      .lojas-lista-aberta{background:#eaded2!important;border:2px solid #111!important;border-radius:16px!important;padding:12px!important;box-shadow:none!important}
      .lojas-lista-aberta a{font-family:Georgia,'Times New Roman',serif!important;color:#111!important;border-bottom:2px solid #111!important;padding:15px 12px!important;font-size:18px!important}
      .lojas-lista-aberta a:last-child{border-bottom:0!important}
      .number{background:#111!important;color:#fff!important;border-radius:50%!important}
      input,select,textarea{background:#fff!important;border:2px solid #111!important;border-radius:12px!important;color:#111!important}
      label{font-family:Arial,sans-serif!important;color:#111!important}
      .upload{background:#fff!important;border:2px dashed #111!important}
      .access-options{gap:16px!important}
      .access-card{box-shadow:none!important}
      .access-button{border:2px solid #111!important;border-radius:12px!important;font-family:Arial,sans-serif!important}
      .access-primary{background:#111!important;color:#fff!important}
      .access-gold{background:#e8dacb!important;color:#111!important}
      footer{background:#111!important;color:#fff!important;border-top:3px solid #111!important}
      .social-links a{background:#eaded2!important;color:#111!important;border:2px solid #111!important}
      @media(max-width:700px){
        .nav{min-height:68px!important}
        .logo{font-size:21px!important}
        .logo-icon{width:40px!important;height:40px!important}
        .nav>.gold,.nav>.primary{padding:9px 11px!important;font-size:12px!important}
        .lojas-categorias{grid-template-columns:1fr 1fr!important;gap:9px!important}
        .lojas-categorias .loja-card{min-height:115px!important;padding:15px!important}
        .lojas-categorias .loja-card h3{font-size:21px!important}
        .lojas-categorias .loja-card p{font-size:14px!important}
      }
      @media(max-width:420px){
        .lojas-categorias{grid-template-columns:1fr 1fr!important}
        .lojas-categorias .loja-card{min-height:105px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function iniciar(){
    aplicarVisual();
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
