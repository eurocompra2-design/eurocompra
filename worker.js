const corsHeaders = {
  "Access-Control-Allow-Origin": "https://eurocompra2-design.github.io",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function clean(value) {
  return String(value ?? "").trim();
}

function digits(value) {
  return clean(value).replace(/\D/g, "");
}

function gerarCodigo() {
  const data = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const parte = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `EC-${data}-${parte}`;
}

function validarCPF(cpf) {
  cpf = digits(cpf);
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  return resto === Number(cpf[10]);
}

function validarCEP(cep) {
  return /^\d{8}$/.test(digits(cep));
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


async function criarTabelaAcesso(env) {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS cliente_acesso (codigo TEXT PRIMARY KEY, salt TEXT NOT NULL, senha_hash TEXT NOT NULL, criado_em TEXT NOT NULL DEFAULT (datetime('now')), atualizado_em TEXT NOT NULL DEFAULT (datetime('now')))`).run();
}
function b64(bytes) { let out=""; const a=new Uint8Array(bytes); for(let i=0;i<a.length;i+=0x8000) out+=String.fromCharCode(...a.subarray(i,i+0x8000)); return btoa(out); }
function unb64(text) { const bin=atob(text); const a=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) a[i]=bin.charCodeAt(i); return a; }
async function hashSenha(senha,salt) { const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(senha),'PBKDF2',false,['deriveBits']); const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:unb64(salt),iterations:120000,hash:'SHA-256'},material,256); return b64(bits); }
function senhaValida(senha) { return typeof senha==='string' && senha.length>=8 && /[A-Za-z]/.test(senha) && /\d/.test(senha); }
function codigoValido(codigo) { return /^EC-\d{8}-[A-Z0-9]{6}$/.test(clean(codigo)); }

function enderecoEuroCompra() {
  return {
    nome: "EUROCOMPRA",
    aosCuidados: "Rodrigo ou Viviane",
    endereco: "Ninoofsesteenweg 159",
    localidade: "1700 Dilbeek",
    pais: "Belgium",
    texto: "EUROCOMPRA\nA/C Rodrigo ou Viviane\nNinoofsesteenweg 159\n1700 Dilbeek\nBelgium",
  };
}

function mensagemAprovacao(codigo) {
  const a = enderecoEuroCompra();
  return `✅ CADASTRO APROVADO — EUROCOMPRA\n\nSeu código de cliente: ${codigo}\n\n📦 ENDEREÇO PARA RECEBIMENTO\n${a.texto}\n\n🔖 REFERÊNCIA OBRIGATÓRIA\n${codigo}\n\n⚠️ Sempre informe o código ${codigo} ao fazer uma compra para que possamos identificar sua encomenda quando ela chegar.\n\n🔐 Este endereço é privado e destinado exclusivamente ao seu cadastro EuroCompra.\n\n🕘 HORÁRIO DE FUNCIONAMENTO\n09:00 às 18:00 — horário da Bélgica 🇧🇪`;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return json({ ok: true, service: "EuroCompra API", status: "online" });
    }

    if (request.method === "POST" && url.pathname === "/api/cadastro") {
      try {
        const body = await request.json();
        const nome = clean(body.nome);
        const cpf = clean(body.cpf);
        const whatsapp = clean(body.whatsapp);
        const email = clean(body.email);
        const cep = clean(body.cep);
        const endereco = clean(body.endereco);
        const numero = clean(body.numero);
        const complemento = clean(body.complemento);
        const bairro = clean(body.bairro);
        const cidade = clean(body.cidade);
        const estado = clean(body.estado);
        const servico = clean(body.servico);
        const produto = clean(body.produto);
        const observacoes = clean(body.observacoes);

        if (!nome || !cpf || !whatsapp || !email || !cep || !endereco || !numero || !bairro || !cidade || !estado || !servico) {
          return json({ ok: false, message: "Preencha todos os campos obrigatórios." }, 400);
        }

        if (!validarCPF(cpf)) return json({ ok: false, message: "CPF inválido." }, 400);
        if (!validarCEP(cep)) return json({ ok: false, message: "CEP inválido." }, 400);

        const codigo = gerarCodigo();

        await env.DB.prepare(`
          INSERT INTO clientes (
            codigo, nome, cpf, email, whatsapp, cep, endereco, numero,
            complemento, bairro, cidade, estado, servico, produto,
            observacoes, status, criado_em, atualizado_em
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).bind(
          codigo, nome, digits(cpf), email, whatsapp, digits(cep), endereco,
          numero, complemento, bairro, cidade, estado, servico, produto,
          observacoes, "Cadastro recebido"
        ).run();

        let emailEnviado = false;
        let whatsappEnviado = false;

        if (env.RESEND_API_KEY && env.RESEND_FROM && env.ADMIN_EMAIL) {
          try {
            const respostaEmail = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: env.RESEND_FROM,
                to: [env.ADMIN_EMAIL],
                subject: `🛒 Novo cadastro EuroCompra - ${codigo}`,
                html: `
                  <h2>🛒 Novo cadastro - EuroCompra</h2>
                  <p><strong>Código:</strong> ${escapeHtml(codigo)}</p>
                  <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
                  <p><strong>CPF:</strong> ${escapeHtml(cpf)}</p>
                  <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
                  <p><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>
                  <p><strong>CEP:</strong> ${escapeHtml(cep)}</p>
                  <p><strong>Endereço:</strong> ${escapeHtml(endereco)}, ${escapeHtml(numero)}</p>
                  <p><strong>Bairro:</strong> ${escapeHtml(bairro)}</p>
                  <p><strong>Cidade/UF:</strong> ${escapeHtml(cidade)}/${escapeHtml(estado)}</p>
                  <p><strong>Serviço:</strong> ${escapeHtml(servico)}</p>
                  <p><strong>Produto:</strong> ${escapeHtml(produto)}</p>
                  <p><strong>Observações:</strong> ${escapeHtml(observacoes)}</p>
                `,
              }),
            });
            const resultadoEmail = await respostaEmail.json();
            console.log("Resend:", respostaEmail.status, resultadoEmail);
            emailEnviado = respostaEmail.ok;

            if (respostaEmail.ok && email && email !== env.ADMIN_EMAIL) {
              try {
                await fetch("https://api.resend.com/emails", { method:"POST", headers:{"Authorization":`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json"}, body:JSON.stringify({ from:env.RESEND_FROM,to:[email],subject:`🔐 Seu acesso EuroCompra - ${codigo}`,html:`<h2>Seu cadastro EuroCompra foi recebido</h2><p>Seu código de cadastro é:</p><p style="font-size:22px;font-weight:700">${escapeHtml(codigo)}</p><p>Guarde este código. Na próxima visita, use-o para criar sua senha e acessar seu cadastro.</p>` }) });
              } catch(erro) { console.error("Erro ao enviar código ao cliente:",erro); }
            }

          } catch (erro) {
            console.error("Erro no e-mail:", erro);
          }
        }

        if (env.META_ACCESS_TOKEN && env.META_PHONE_NUMBER_ID && env.META_ADMIN_PHONE) {
          try {
            const respostaWhatsApp = await fetch(
              `https://graph.facebook.com/v24.0/${env.META_PHONE_NUMBER_ID}/messages`,
              {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${env.META_ACCESS_TOKEN}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  recipient_type: "individual",
                  to: env.META_ADMIN_PHONE,
                  type: "text",
                  text: {
                    preview_url: false,
                    body: `🛒 NOVO CADASTRO - EUROCOMPRA\n\n🔖 Código: ${codigo}\n\n👤 Nome: ${nome}\n📧 E-mail: ${email}\n📱 WhatsApp: ${whatsapp}\n\n📍 Cidade/UF: ${cidade}/${estado}\n📦 Serviço: ${servico}\n\n📋 Status: Cadastro recebido\n\nO cadastro foi salvo no sistema EuroCompra.`,
                  },
                }),
              }
            );
            const resultadoWhatsApp = await respostaWhatsApp.json();
            console.log("WhatsApp Meta:", respostaWhatsApp.status, resultadoWhatsApp);
            whatsappEnviado = respostaWhatsApp.ok;
          } catch (erro) {
            console.error("Erro no WhatsApp:", erro);
          }
        }

        return json({
          ok: true,
          codigo,
          emailEnviado,
          whatsappEnviado,
          message: "Cadastro recebido com segurança.",
        });
      } catch (erro) {
        console.error("Erro no cadastro:", erro);
        return json({ ok: false, message: "Não foi possível processar o cadastro." }, 400);
      }
    }


    if (request.method === "POST" && url.pathname === "/api/acesso/criar-senha") {
      try {
        const body=await request.json(); const codigo=clean(body.codigo).toUpperCase(); const senha=String(body.senha||"");
        if(!codigoValido(codigo)) return json({ok:false,message:"Código de cadastro inválido."},400);
        if(!senhaValida(senha)) return json({ok:false,message:"A senha deve ter pelo menos 8 caracteres, uma letra e um número."},400);
        await criarTabelaAcesso(env);
        const cliente=await env.DB.prepare("SELECT codigo,nome FROM clientes WHERE codigo = ?").bind(codigo).first();
        if(!cliente) return json({ok:false,message:"Código de cadastro não encontrado."},404);
        const existente=await env.DB.prepare("SELECT codigo FROM cliente_acesso WHERE codigo = ?").bind(codigo).first();
        if(existente) return json({ok:false,message:"Este cadastro já possui uma senha. Use Entrar."},409);
        const salt=b64(crypto.getRandomValues(new Uint8Array(16))); const senha_hash=await hashSenha(senha,salt);
        await env.DB.prepare("INSERT INTO cliente_acesso (codigo,salt,senha_hash) VALUES (?,?,?)").bind(codigo,salt,senha_hash).run();
        return json({ok:true,codigo,nome:cliente.nome,message:"Senha criada com sucesso."});
      } catch(erro) { console.error("Erro ao criar senha:",erro); return json({ok:false,message:"Não foi possível criar a senha."},500); }
    }

    if (request.method === "POST" && url.pathname === "/api/acesso/login") {
      try {
        const body=await request.json(); const codigo=clean(body.codigo).toUpperCase(); const senha=String(body.senha||"");
        if(!codigoValido(codigo)||!senha) return json({ok:false,message:"Informe o código e a senha."},400);
        await criarTabelaAcesso(env);
        const acesso=await env.DB.prepare("SELECT codigo,salt,senha_hash FROM cliente_acesso WHERE codigo = ?").bind(codigo).first();
        if(!acesso) return json({ok:false,message:"Código ou senha incorretos."},401);
        if(await hashSenha(senha,acesso.salt)!==acesso.senha_hash) return json({ok:false,message:"Código ou senha incorretos."},401);
        const cliente=await env.DB.prepare("SELECT codigo,nome,email,whatsapp,servico,produto,status,criado_em,atualizado_em FROM clientes WHERE codigo = ?").bind(codigo).first();
        if(!cliente) return json({ok:false,message:"Cadastro não encontrado."},404);
        return json({ok:true,cliente,message:"Acesso autorizado."});
      } catch(erro) { console.error("Erro no acesso:",erro); return json({ok:false,message:"Não foi possível entrar."},500); }
    }

    if (request.method === "GET" && url.pathname === "/api/clientes") {
      const adminToken = request.headers.get("X-Admin-Token");
      if (!env.ADMIN_VIEW_TOKEN || adminToken !== env.ADMIN_VIEW_TOKEN) {
        return json({ ok: false, message: "Não autorizado." }, 401);
      }
      try {
        const limite = Math.min(Math.max(Number(url.searchParams.get("limit")) || 50, 1), 100);
        const resultado = await env.DB.prepare(`
          SELECT codigo, nome, cpf, email, whatsapp, cep, endereco, numero, complemento,
                 bairro, cidade, estado, servico, produto, observacoes, status,
                 criado_em, atualizado_em
          FROM clientes
          ORDER BY id DESC
          LIMIT ?
        `).bind(limite).all();
        return json({ ok: true, clientes: resultado.results || [] });
      } catch (erro) {
        console.error("Erro ao consultar clientes:", erro);
        return json({ ok: false, message: "Não foi possível consultar os clientes." }, 500);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/clientes/aprovar") {
      const adminToken = request.headers.get("X-Admin-Token");
      if (!env.ADMIN_VIEW_TOKEN || adminToken !== env.ADMIN_VIEW_TOKEN) {
        return json({ ok: false, message: "Não autorizado." }, 401);
      }

      const codigo = clean(url.searchParams.get("codigo"));
      if (!codigo) return json({ ok: false, message: "Código do cadastro não informado." }, 400);

      try {
        const cliente = await env.DB.prepare(
          "SELECT codigo, nome, email, whatsapp, status FROM clientes WHERE codigo = ?"
        ).bind(codigo).first();

        if (!cliente) return json({ ok: false, message: "Cadastro não encontrado." }, 404);

        await env.DB.prepare(
          "UPDATE clientes SET status = ?, atualizado_em = datetime('now') WHERE codigo = ?"
        ).bind("Aprovado", codigo).run();

        const mensagem = mensagemAprovacao(codigo);
        const whatsappNumeros = digits(cliente.whatsapp);
        const whatsappLink = whatsappNumeros ? `https://wa.me/${whatsappNumeros}?text=${encodeURIComponent(mensagem)}` : null;

        return json({
          ok: true,
          codigo,
          nome: cliente.nome,
          email: cliente.email,
          whatsapp: cliente.whatsapp,
          status: "Aprovado",
          endereco: enderecoEuroCompra(),
          mensagem,
          whatsappLink,
          message: "Cliente aprovado. O endereço privado está pronto para envio.",
        });
      } catch (erro) {
        console.error("Erro ao aprovar cliente:", erro);
        return json({ ok: false, message: "Não foi possível aprovar o cadastro." }, 500);
      }
    }

    if (request.method === "DELETE" && url.pathname === "/api/clientes") {
      const adminToken = request.headers.get("X-Admin-Token");
      if (!env.ADMIN_VIEW_TOKEN || adminToken !== env.ADMIN_VIEW_TOKEN) {
        return json({ ok: false, message: "Não autorizado." }, 401);
      }

      const codigo = clean(url.searchParams.get("codigo"));
      if (!codigo) {
        return json({ ok: false, message: "Código do cadastro não informado." }, 400);
      }

      try {
        const resultado = await env.DB.prepare(
          "DELETE FROM clientes WHERE codigo = ?"
        ).bind(codigo).run();

        if (!resultado.meta || resultado.meta.changes !== 1) {
          return json({ ok: false, message: "Cadastro não encontrado." }, 404);
        }

        return json({ ok: true, message: "Cadastro apagado com sucesso." });
      } catch (erro) {
        console.error("Erro ao apagar cliente:", erro);
        return json({ ok: false, message: "Não foi possível apagar o cadastro." }, 500);
      }
    }

    return json({ ok: false, message: "Rota não encontrada." }, 404);
  },
};

// deploy: approval flow with private receiving address and business hours