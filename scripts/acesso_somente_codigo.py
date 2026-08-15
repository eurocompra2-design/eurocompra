from pathlib import Path

# Alteracao pequena e isolada: transforma o acesso do cliente em acesso somente por codigo.
# Nao reescreve o index inteiro; apenas adiciona um patch JS/CSS no final e uma rota nova no Worker.

index = Path('index.html')
s = index.read_text(encoding='utf-8')

marker = '<script id="eurocompra-acesso-codigo-only">'
if marker not in s:
    patch = r'''<style id="eurocompra-acesso-codigo-only-style">
#acessoCliente #accessSenha,#acessoCliente label[for="accessSenha"],#acessoCliente #accessEntrar,#acessoCliente #accessCriar,#acessoCliente #accessCreate{display:none!important}
#accessCodigoOnly{margin-top:18px;width:100%}
#accessClienteArea{margin-top:22px;padding:20px;border:1px solid #e2e7f0;border-radius:16px;background:#f7f9fc}
#accessClienteArea h3{margin-top:0;color:#06245c}
.access-pedido{padding:12px;margin-top:10px;border-radius:10px;background:#fff;border:1px solid #e2e7f0}
</style>
<script id="eurocompra-acesso-codigo-only">(()=>{
const API='https://eurocompra-api.eurocompra2.workers.dev';
function init(){
 const sec=document.getElementById('acessoCliente');
 const code=document.getElementById('accessCodigo');
 if(!sec||!code||document.getElementById('accessCodigoOnly')) return;
 const oldMsg=document.getElementById('accessMessage');
 const btn=document.createElement('button');
 btn.id='accessCodigoOnly'; btn.type='button'; btn.className='btn primary'; btn.textContent='🔐 Acessar meu cadastro';
 const area=document.createElement('div'); area.id='accessClienteArea'; area.style.display='none';
 const login=document.getElementById('accessLogin');
 if(login) login.appendChild(btn); else sec.appendChild(btn);
 sec.querySelector('.form-header p')?.replaceChildren(document.createTextNode('Digite somente o código do cliente para acessar seu cadastro e acompanhar seus pedidos.'));
 sec.appendChild(area);
 const msg=(t,ok=false)=>{if(oldMsg){oldMsg.textContent=t;oldMsg.style.display='block';oldMsg.style.background=ok?'#eaf8f0':'#fff4e5';oldMsg.style.color=ok?'#16804b':'#9a5b00'}};
 btn.onclick=async()=>{
   const codigo=code.value.trim().toUpperCase();
   if(!/^EC-\d{8}-[A-Z0-9]{6}$/.test(codigo)){msg('Informe um código de cliente válido.');return;}
   btn.disabled=true; btn.textContent='Consultando...';
   try{
     const r=await fetch(API+'/api/acesso/codigo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({codigo})});
     const d=await r.json();
     if(!r.ok||!d.ok) throw new Error(d.message||'Código não encontrado.');
     const c=d.cliente||{}; const pedidos=Array.isArray(d.pedidos)?d.pedidos:[];
     area.style.display='block';
     area.innerHTML='<h3>Olá, '+String(c.nome||'Cliente').replace(/[<>]/g,'')+' 👋</h3><p><strong>Código:</strong> '+String(c.codigo||codigo).replace(/[<>]/g,'')+'</p><p><strong>Status:</strong> '+String(c.status||'Cadastro ativo').replace(/[<>]/g,'')+'</p><h4>📦 Pedidos e compras</h4>'+ (pedidos.length?pedidos.map(p=>'<div class="access-pedido"><strong>'+String(p.numero||p.id||'Pedido').replace(/[<>]/g,'')+'</strong><br>'+String(p.status||'Em andamento').replace(/[<>]/g,'')+'</div>').join(''):'<p>Nenhum pedido registrado para este cliente.</p>');
     msg('Acesso autorizado com sucesso.',true);
   }catch(e){area.style.display='none';msg(e.message||'Não foi possível acessar o cadastro.');}
   finally{btn.disabled=false;btn.textContent='🔐 Acessar meu cadastro';}
 };
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();</script>
'''
    s = s.replace('</body>', patch + '</body>', 1)
    index.write_text(s, encoding='utf-8')

# Worker: add a new code-only endpoint without removing the existing password endpoints.
worker = Path('worker.js')
w = worker.read_text(encoding='utf-8')
route_marker = 'if (request.method === "POST" && url.pathname === "/api/acesso/codigo")'
if route_marker not in w:
    route = r'''
    if (request.method === "POST" && url.pathname === "/api/acesso/codigo") {
      try {
        const body = await request.json();
        const codigo = clean(body.codigo).toUpperCase();
        if (!codigoValido(codigo)) return json({ok:false,message:"Código de cliente inválido."},400);
        const cliente = await env.DB.prepare("SELECT codigo,nome,email,whatsapp,servico,produto,status,criado_em,atualizado_em FROM clientes WHERE codigo = ?").bind(codigo).first();
        if (!cliente) return json({ok:false,message:"Código de cliente não encontrado."},404);
        let pedidos = [];
        // A tabela de pedidos é opcional neste momento. Se existir, mostramos os registros vinculados ao código.
        try {
          const r = await env.DB.prepare("SELECT * FROM pedidos WHERE codigo_cliente = ? OR cliente_codigo = ? ORDER BY id DESC LIMIT 100").bind(codigo,codigo).all();
          pedidos = r.results || [];
        } catch (_) {}
        return json({ok:true,cliente,pedidos,message:"Acesso autorizado."});
      } catch (erro) {
        console.error("Erro no acesso por código:",erro);
        return json({ok:false,message:"Não foi possível acessar o cadastro."},500);
      }
    }

'''
    marker2 = 'if (request.method === "GET" && url.pathname === "/api/clientes")'
    if marker2 in w:
        w = w.replace(marker2, route + marker2, 1)
        worker.write_text(w, encoding='utf-8')
'''

print('Patch de acesso somente por codigo preparado.')
