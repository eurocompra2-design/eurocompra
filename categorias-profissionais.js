(function(){
  const STORES=[
    ['JBC','https://www.jbc.be/'],
    ['ZEB','https://www.zeb.be/'],
    ['Torfs','https://www.torfs.be/'],
    ['e5 mode','https://www.e5.be/'],
    ['C&A','https://www.c-and-a.com/be/en/shop'],
    ['H&M','https://www2.hm.com/en_be/index.html'],
    ['Zara','https://www.zara.com/be/'],
    ['Mango','https://shop.mango.com/be/en'],
    ['Kiabi','https://www.kiabi.be/'],
    ['Primark','https://www.primark.com/en-be'],
    ['Kruidvat','https://www.kruidvat.be/'],
    ['Action','https://www.action.com/nl-be/'],
    ['MediaMarkt','https://www.mediamarkt.be/'],
    ['Vanden Borre','https://www.vandenborre.be/'],
    ['Krëfel','https://www.krefel.be/'],
    ['Coolblue','https://www.coolblue.be/'],
    ['Fnac','https://www.nl.fnac.be/'],
    ['Decathlon','https://www.decathlon.be/'],
    ['JYSK','https://jysk.be/'],
    ['IKEA','https://www.ikea.com/be/en/'],
    ['Brico','https://www.brico.be/'],
    ['Hubo','https://www.hubo.be/'],
    ['DreamLand','https://www.dreamland.be/'],
    ['Delhaize','https://www.delhaize.be/'],
    ['Colruyt','https://www.colruyt.be/'],
    ['Carrefour','https://www.carrefour.be/'],
    ['Lidl','https://www.lidl.be/'],
    ['ALDI','https://www.aldi.be/'],
    ['Leonidas','https://www.leonidas.com/be_en'],
    ['Neuhaus','https://www.neuhauschocolates.com/be_en/'],
    ['Galler','https://www.galler.com/'],
    ['Côte d’Or','https://www.cotedor.be/']
  ];

  const CSS=`
    .ec-belgium-grid{
      display:grid!important;
      grid-template-columns:repeat(4,minmax(0,1fr))!important;
      gap:10px!important;
      margin-top:8px!important;
    }
    .ec-belgium-store{
      position:relative!important;
      min-height:150px!important;
      aspect-ratio:1/1!important;
      padding:12px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      text-align:center!important;
      background:#fff!important;
      border:3px solid #111!important;
      border-radius:17px!important;
      box-shadow:none!important;
      cursor:pointer!important;
      overflow:hidden!important;
      transition:transform .16s ease,box-shadow .16s ease!important;
    }
    .ec-belgium-store:hover{
      transform:translateY(-2px)!important;
      box-shadow:0 8px 18px rgba(0,0,0,.10)!important;
    }
    .ec-belgium-store a{
      width:100%!important;
      height:100%!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      color:#111!important;
      text-decoration:none!important;
      font-family:Arial,Helvetica,sans-serif!important;
      font-size:clamp(17px,2.1vw,27px)!important;
      font-weight:900!important;
      letter-spacing:-.7px!important;
      line-height:1.05!important;
      text-transform:none!important;
    }
    .ec-belgium-store:nth-child(4n+1) a{font-weight:900!important}
    .ec-belgium-store[data-store="ZEB"] a{letter-spacing:3px!important}
    .ec-belgium-store[data-store="JBC"] a{letter-spacing:1px!important}
    .ec-belgium-store[data-store="e5 mode"] a{font-weight:800!important;letter-spacing:1px!important}
    .ec-belgium-store[data-store="C&A"] a{font-size:31px!important}
    .ec-belgium-store[data-store="H&M"] a{font-size:31px!important;font-style:italic!important}
    .ec-belgium-store[data-store="Zara"] a{font-family:Georgia,serif!important;font-size:31px!important;font-weight:700!important}
    .ec-belgium-store[data-store="Mango"] a{font-weight:500!important;letter-spacing:1px!important}
    .ec-belgium-store[data-store="Kruidvat"] a{font-size:24px!important}
    .ec-belgium-store[data-store="MediaMarkt"] a{font-size:23px!important}
    .ec-belgium-store[data-store="Vanden Borre"] a{font-size:22px!important}
    .ec-belgium-store[data-store="Krëfel"] a{font-size:27px!important}
    .ec-belgium-store[data-store="Coolblue"] a{font-size:26px!important}
    .ec-belgium-store[data-store="Decathlon"] a{font-size:23px!important}
    .ec-belgium-store[data-store="Delhaize"] a{font-size:27px!important}
    .ec-belgium-store[data-store="Colruyt"] a{font-size:27px!important}
    .ec-belgium-store[data-store="Carrefour"] a{font-size:24px!important}
    .ec-belgium-store[data-store="Leonidas"] a{font-family:Georgia,serif!important;font-size:25px!important}
    .ec-belgium-store[data-store="Neuhaus"] a{font-family:Georgia,serif!important;font-size:24px!important}
    .ec-belgium-store[data-store="Galler"] a{font-size:27px!important}
    .ec-belgium-store[data-store="Côte d’Or"] a{font-size:24px!important}
    @media(max-width:850px){
      .ec-belgium-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
      .ec-belgium-store{min-height:105px!important;border-width:2.5px!important;border-radius:15px!important;padding:7px!important}
      .ec-belgium-store a{font-size:15px!important;letter-spacing:-.4px!important}
      .ec-belgium-store[data-store="ZEB"] a{font-size:15px!important;letter-spacing:2px!important}
      .ec-belgium-store[data-store="C&A"] a,.ec-belgium-store[data-store="H&M"] a,.ec-belgium-store[data-store="Zara"] a{font-size:20px!important}
      .ec-belgium-store[data-store="Leonidas"] a,.ec-belgium-store[data-store="Neuhaus"] a,.ec-belgium-store[data-store="Côte d’Or"] a{font-size:17px!important}
    }
  `;

  function style(){
    if(document.getElementById('ec-belgium-stores-style')) return;
    const s=document.createElement('style');
    s.id='ec-belgium-stores-style';
    s.textContent=CSS;
    document.head.appendChild(s);
  }

  function build(){
    const box=document.querySelector('.lojas-categorias');
    if(!box) return;
    if(box.dataset.belgiumStoresBuilt==='1') return;

    box.innerHTML='';
    box.className='lojas-categorias ec-belgium-grid';
    box.dataset.belgiumStoresBuilt='1';

    STORES.forEach(function(item){
      const card=document.createElement('div');
      card.className='loja-card ec-belgium-store';
      card.dataset.store=item[0];
      card.setAttribute('role','link');
      card.setAttribute('tabindex','0');
      const a=document.createElement('a');
      a.href=item[1];
      a.target='_blank';
      a.rel='noopener noreferrer';
      a.textContent=item[0];
      card.appendChild(a);
      box.appendChild(card);
    });

    box.addEventListener('click',function(e){
      const card=e.target.closest('.ec-belgium-store');
      if(!card) return;
      if(e.target.tagName==='A') return;
      const a=card.querySelector('a');
      if(a) window.open(a.href,'_blank','noopener,noreferrer');
    });
    box.addEventListener('keydown',function(e){
      if(e.key!=='Enter' && e.key!==' ') return;
      const card=e.target.closest('.ec-belgium-store');
      if(!card) return;
      e.preventDefault();
      const a=card.querySelector('a');
      if(a) window.open(a.href,'_blank','noopener,noreferrer');
    });
  }

  function start(){
    style();
    build();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);
  else start();
})();
