// EuroCompra — horário profissional de atendimento WhatsApp
(function(){
  function aplicar(){
    const footer=document.querySelector('footer');
    if(!footer || document.getElementById('ec-horario-whatsapp')) return;
    const box=document.createElement('div');
    box.id='ec-horario-whatsapp';
    box.innerHTML=`
      <div class="ec-horario-card" aria-label="Horário de atendimento WhatsApp">
        <div class="ec-horario-icon">💬</div>
        <div class="ec-horario-info">
          <div class="ec-horario-title">Atendimento via WhatsApp</div>
          <div class="ec-horario-time"><span class="ec-ponto"></span> Segunda a sábado · 09:00 às 18:00</div>
          <div class="ec-horario-note">Horário da Bélgica (CET/CEST)</div>
        </div>
      </div>`;
    footer.prepend(box);
    const style=document.createElement('style');
    style.id='ec-horario-style';
    style.textContent=`
      #ec-horario-whatsapp{max-width:1120px;width:92%;margin:0 auto 28px}
      .ec-horario-card{display:flex;align-items:center;gap:14px;padding:16px 20px;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(255,255,255,.07);box-shadow:0 8px 24px rgba(0,0,0,.08)}
      .ec-horario-icon{width:44px;height:44px;min-width:44px;border-radius:12px;display:grid;place-items:center;background:#eaf1ff;color:#063b9e;font-size:22px}
      .ec-horario-title{font-weight:800;font-size:15px;color:#fff;margin-bottom:2px}
      .ec-horario-time{font-weight:700;font-size:14px;color:#fff}
      .ec-horario-note{font-size:11px;color:rgba(255,255,255,.68);margin-top:2px}
      .ec-ponto{display:inline-block;width:7px;height:7px;border-radius:50%;background:#35c759;margin-right:6px;vertical-align:1px}
      @media(max-width:600px){#ec-horario-whatsapp{width:92%;margin-bottom:22px}.ec-horario-card{padding:14px 15px}.ec-horario-time{font-size:13px}.ec-horario-note{font-size:10px}}
    `;
    document.head.appendChild(style);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',aplicar); else aplicar();
})();
