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

// deploy: admin can securely delete clients by codigo
