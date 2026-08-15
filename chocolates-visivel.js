(function(){
  function aplicarVisual(){
    if(document.getElementById('eurocompra-beacons-style')) return;
    const style=document.createElement('style');
    style.id='eurocompra-beacons-style';
    style.textContent=`
:root{--ec-bg:#f7f0ea;--ec-card:#eadccf;--ec-white:#fffdf9;--ec-black:#080808}
html,body{background:var(--ec-bg)!important;color:var(--ec-black)!important;font-family:Georgia,'Times New Roman',serif!important}
body{line-height:1.45!important;overflow-x:hidden!important}
header{position:relative!important;top:auto!important;background:transparent!important;border:0!important;box-shadow:none!important;padding:20px 0 5px!important}
.container{width:min(760px,92%)!important;margin:auto!important}
.nav{min-height:48px!important;justify-content:center!important;gap:0!important}
.logo{font-family:Arial,sans-serif!important;font-size:28px!important;font-weight:900!important;color:#000!important;letter-spacing:-1px!important}
.logo-icon{width:43px!important;height:43px!important;border-radius:50%!important;background:#000!important;color:#fff!important;margin-right:8px!important}
.navlinks,.header-precos,.nav>.primary{display:none!important}
section{padding:26px 0!important;background:transparent!important}
.hero{padding:25px 0 12px!important;background:transparent!important}
.hero-grid{display:block!important;max-width:760px!important}
.hero-grid>div:first-child{text-align:center!important}
.hero-card{display:none!important}
.badge{background:transparent!important;color:#000!important;border:0!important;border-radius:0!important;font-size:17px!important;font-weight:400!important;padding:0!important;margin:0 0 8px!important}
h1{font-family:Georgia,'Times New Roman',serif!important;color:#000!important;font-size:clamp(36px,8vw,54px)!important;line-height:1.03!important;margin:0 0 12px!important}
.hero p{color:#000!important;font-size:17px!important;max-width:650px!important;margin:0 auto 18px!important}
.hero-buttons{display:grid!important;grid-template-columns:1fr!important;gap:12px!important;max-width:680px!important;margin:auto!important}
.btn{font-family:Georgia,serif!important;background:var(--ec-card)!important;color:#000!important;border:2.5px solid #000!important;border-radius:17px!important;padding:15px 18px!important;box-shadow:none!important;font-size:17px!important}
.primary,.gold{background:var(--ec-card)!important;color:#000!important}
.section-title{text-align:center!important;max-width:700px!important;margin:0 auto 20px!important}
.section-title h2{font-family:Georgia,serif!important;color:#000!important;font-size:31px!important;margin:0 0 5px!important}
.section-title p{color:#000!important;font-size:16px!important;margin:0!important}
.cards,.steps{display:grid!important;grid-template-columns:1fr!important;gap:13px!important}
.card,.step{background:var(--ec-card)!important;border:2.5px solid #000!important;border-radius:17px!important;box-shadow:none!important;padding:20px!important;text-align:left!important}
.card h3,.step h3{font-family:Georgia,serif!important;color:#000!important;font-size:23px!important;margin:0 0 4px!important}
.card p,.step p{color:#000!important;font-size:16px!important;margin:0!important}
.number{background:#000!important;color:#fff!important;width:48px!important;height:48px!important;margin:0 0 11px!important}
.lojas-search{max-width:100%!important;margin:0 auto 14px!important}
.lojas-search input{background:var(--ec-white)!important;color:#000!important;border:2.5px solid #000!important;border-radius:17px!important;padding:14px!important;font-family:Georgia,serif!important}
.lojas-categorias{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:9px!important}
.lojas-categorias .loja-card{background:var(--ec-white)!important;color:#000!important;border:2.5px solid #000!important;border-radius:17px!important;box-shadow:none!important;min-height:125px!important;padding:9px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important}
.lojas-categorias .loja-card h3{font-family:Arial,sans-serif!important;color:#000!important;font-size:16px!important;font-weight:800!important;line-height:1.05!important;margin:0!important}
.lojas-categorias .loja-card p{display:none!important}
.lojas-categorias .loja-card>div:first-child{font-size:28px!important;margin:0 0 7px!important}
.lojas-lista-aberta{background:var(--ec-card)!important;border:2.5px solid #000!important;border-radius:17px!important;box-shadow:none!important;padding:13px!important;color:#000!important}
.lojas-lista-aberta a{display:block!important;color:#000!important;font-family:Georgia,serif!important;font-size:17px!important;border-bottom:1.5px solid #000!important;padding:11px 4px!important}
.form-section{background:transparent!important}
.form-box,.access-card,.valores-panel{background:var(--ec-card)!important;border:2.5px solid #000!important;border-radius:17px!important;box-shadow:none!important}
.form-box{padding:21px!important}
.form-header h2,.access-heading h2,.access-content h3{font-family:Georgia,serif!important;color:#000!important}
.form-header p,.access-heading p,.access-content p,.help{font-family:Georgia,serif!important;color:#000!important}
.access-options{grid-template-columns:1fr!important;gap:13px!important}
.access-card{padding:19px!important}
.access-icon{background:#000!important;color:#fff!important;border-radius:14px!important}
.access-label{color:#000!important;font-family:Arial,sans-serif!important}
.access-button{border:2px solid #000!important;border-radius:14px!important;background:var(--ec-white)!important;color:#000!important;font-family:Georgia,serif!important}
.access-primary,.access-gold{background:var(--ec-white)!important;color:#000!important}
.access-security{color:#000!important}
input,select,textarea{background:var(--ec-white)!important;color:#000!important;border:2px solid #000!important;border-radius:13px!important;font-family:Georgia,serif!important}
label{font-family:Georgia,serif!important;color:#000!important}
.upload{background:var(--ec-white)!important;border:2px dashed #000!important;border-radius:14px!important}
footer{background:transparent!important;color:#000!important;border:0!important;padding:30px 0 60px!important}
.footer-grid{grid-template-columns:1fr!important;text-align:center!important}
.social-links{justify-content:center!important}
.social-links a{background:var(--ec-card)!important;color:#000!important;border:2px solid #000!important;border-radius:14px!important;font-family:Georgia,serif!important}
@media(max-width:520px){.container{width:calc(100% - 30px)!important}.lojas-categorias{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important}.lojas-categorias .loja-card{min-height:92px!important;padding:6px!important;border-width:2.3px!important}.lojas-categorias .loja-card h3{font-size:11px!important}.lojas-categorias .loja-card>div:first-child{font-size:21px!important;margin-bottom:4px!important}.hero{padding-top:15px!important}section{padding:22px 0!important}}
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
      if(lista){lista.remove();card.setAttribute('aria-expanded','false');return;}
      lista=document.createElement('div');
      lista.className='lojas-lista-aberta ativa';
      lista.dataset.chocolatesLista='1';
      lista.innerHTML=lojas.map(function(item){return '<a href="'+item[1]+'" target="_blank" rel="noopener noreferrer">'+item[0]+'</a>';}).join('');
      box.appendChild(lista);card.setAttribute('aria-expanded','true');
    }
    card.addEventListener('click',abrirLojas);
    card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();abrirLojas();}});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',iniciar); else iniciar();
})();
