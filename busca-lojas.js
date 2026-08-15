// EuroCompra — Lojas da Bélgica: grade profissional 4 colunas + busca por campo.
(function(){
  const lojas=[
    ['Zara','Moda','https://www.zara.com/be/'],['H&M','Moda','https://www2.hm.com/en_be/index.html'],['C&A','Moda','https://www.c-and-a.com/be/en/shop'],['Primark','Moda','https://www.primark.com/en-be'],['Mango','Moda','https://shop.mango.com/be/en'],['Uniqlo','Moda','https://www.uniqlo.com/be/en/'],['JBC','Moda','https://www.jbc.be/'],['ZEB','Moda','https://www.zeb.be/'],['Torfs','Calçados','https://www.torfs.be/'],['e5','Moda','https://www.e5.be/'],['Bershka','Moda','https://www.bershka.com/be/'],['Stradivarius','Moda','https://www.stradivarius.com/be/'],['Zalando','Moda','https://www.zalando.be/'],['Foot Locker','Esportes','https://www.footlocker.be/'],
    ['Louis Vuitton','Luxo','https://be.louisvuitton.com/'],['Guess','Moda','https://www.guess.eu/en-be/'],['Calzedonia','Moda','https://www.calzedonia.com/be/'],['Intimissimi','Moda','https://www.intimissimi.com/be/'],
    ['Sephora','Perfumes e Beleza','https://www.sephora.be/'],['Douglas','Perfumes e Beleza','https://www.douglas.be/'],['KIKO Milano','Perfumes e Beleza','https://www.kikocosmetics.com/'],['ICI PARIS XL','Perfumes e Beleza','https://www.iciparisxl.be/'],['Rituals','Perfumes e Beleza','https://www.rituals.com/'],['Yves Rocher','Perfumes e Beleza','https://www.yves-rocher.be/'],['DI','Perfumes e Beleza','https://www.di.be/'],['April','Perfumes e Beleza','https://www.april-beauty.be/'],['Planet Parfum','Perfumes e Beleza','https://www.planetparfum.com/'],['INNO','Perfumes e Beleza','https://www.inno.be/'],['Parfuma','Perfumes e Beleza','https://www.parfuma.com/'],
    ['MediaMarkt','Eletrônicos','https://www.mediamarkt.be/'],['Coolblue','Eletrônicos','https://www.coolblue.be/'],['Apple','Eletrônicos','https://www.apple.com/be/'],['Fnac','Eletrônicos','https://www.nl.fnac.be/'],['Krëfel','Eletrônicos','https://www.krefel.be/'],['Vanden Borre','Eletrônicos','https://www.vandenborre.be/'],
    ['LEGO','Brinquedos','https://www.lego.com/en-be/'],['DreamLand','Brinquedos','https://www.dreamland.be/'],
    ['Decathlon','Esportes','https://www.decathlon.be/'],['Nike','Esportes','https://www.nike.com/be/'],['Adidas','Esportes','https://www.adidas.be/'],['JD Sports','Esportes','https://www.jdsports.be/'],['INTERSPORT','Esportes','https://www.intersport.be/'],['Sports Direct','Esportes','https://be.sportsdirect.com/'],['A.S.Adventure','Esportes','https://www.asadventure.com/'],['Courir','Esportes','https://www.courir.com/be/'],['Puma','Esportes','https://eu.puma.com/be/en/'],['Under Armour','Esportes','https://www.underarmour.be/'],['New Balance','Esportes','https://www.newbalance.be/'],['Asics','Esportes','https://www.asics.com/be/en-be/'],
    ['IKEA','Casa','https://www.ikea.com/be/en/'],['Action','Casa','https://www.action.com/en-be/'],['JYSK','Casa','https://jysk.be/'],['CASA','Casa','https://www.casashops.com/en-be/'],['Maisons du Monde','Casa','https://www.maisonsdumonde.com/BE/en/'],
    ['Standaard Boekhandel','Livros','https://www.standaardboekhandel.be/'],['Tom&Co','Animais','https://www.tomandco.com/'],['Maxi Zoo','Animais','https://www.maxizoo.be/']
  ];
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  const esc=v=>String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const css=`
    .ec-store-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}
    .ec-store-card{min-height:125px!important;background:#fff!important;border:2px solid #063b9e!important;border-radius:17px!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:12px!important;text-decoration:none!important;color:#06245c!important;box-shadow:0 8px 24px rgba(6,59,158,.07)!important;transition:transform .15s,box-shadow .15s,background .15s!important}
    .ec-store-card:hover{transform:translateY(-2px)!important;box-shadow:0 10px 25px rgba(6,59,158,.14)!important;background:#f7faff!important}
    .ec-store-name{font-family:Arial,sans-serif!important;font-size:18px!important;font-weight:900!important;line-height:1.05!important;letter-spacing:-.4px!important;color:#063b9e!important}
    .ec-store-cat{display:block!important;font-family:Arial,sans-serif!important;font-size:9px!important;font-weight:700!important;letter-spacing:.8px!important;text-transform:uppercase!important;margin-top:7px!important;color:#667085!important}
    .ec-store-search{display:flex!important;gap:8px!important;margin:0 auto 15px!important}
    .ec-store-search input{flex:1!important;min-width:0!important;width:100%!important;background:#fff!important;color:#172033!important;border:2px solid #063b9e!important;border-radius:13px!important;padding:14px!important;font-family:Arial,sans-serif!important}
    .ec-store-search button{display:none!important}
    @media(max-width:700px){.ec-store-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important}.ec-store-card{min-height:92px!important;padding:6px!important}.ec-store-name{font-size:11px!important}.ec-store-cat{font-size:6px!important;margin-top:4px!important}}
  `;
  function style(){if(document.getElementById('ec-store-grid-style'))return;const s=document.createElement('style');s.id='ec-store-grid-style';s.textContent=css;document.head.appendChild(s)}
  function build(){
    const box=document.querySelector('.lojas-categorias'),input=document.getElementById('busca-lojas');
    if(!box||!input)return;
    style();
    if(box.dataset.ecGrid==='1')return;
    box.dataset.ecGrid='1';box.innerHTML='';box.classList.add('ec-store-grid');
    lojas.forEach(function(item){const a=document.createElement('a');a.className='ec-store-card';a.href=item[2];a.target='_blank';a.rel='noopener noreferrer';a.dataset.nome=norm(item[0]);a.dataset.cat=norm(item[1]);a.innerHTML='<div><div class="ec-store-name">'+esc(item[0])+'</div><span class="ec-store-cat">'+esc(item[1])+'</span></div>';box.appendChild(a);});
    const wrap=input.parentElement;wrap.className='ec-store-search';
    function filtrar(){const q=norm(input.value);box.querySelectorAll('.ec-store-card').forEach(c=>c.style.display=!q||c.dataset.nome.includes(q)||c.dataset.cat.includes(q)?'flex':'none');}
    input.addEventListener('input',filtrar);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();filtrar()}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
