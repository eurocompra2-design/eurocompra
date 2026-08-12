const corsHeaders = {
  "Access-Control-Allow-Origin": "https://eurocompra2-design.github.io",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      ...extraHeaders,
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
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

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

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Status da API
    if (request.method === "GET" && url.pathname === "/") {
      return json({ ok: true, service: "EuroCompra API", status: "online" });
    }

    // Verificação do webhook do WhatsApp
    if (request.method === "GET" && url.pathname === "/webhook") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === env.WEBHOOK_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200, headers: corsHeaders });
      }

      return new Response("Token inválido", { status: 403, headers: corsHeaders });
    }

    // Cadastro do cliente
    if (request.method === "POST" && url.pathname === "/api/cadastro") {
      try {
        const data = await request.json();

        const nome = clean(data.nome);
        const email = clean(data.email).toLowerCase();
        const cpf = digits(data.cpf);
        const whatsapp = clean(data.whatsapp);
        const cep = digits(data.cep);
        const pais = clean(data.pais) || "Brasil";
        const endereco = clean(data.endereco);
        const numero = clean(data.numero);
        const complemento = clean(data.complemento);
        const bairro = clean(data.bairro);
        const cidade = clean(data.cidade);
        const estado = clean(data.estado);
        const servico = clean(data.servico);
        const produto = clean(data.produto);
        const observacoes = clean(data.observacoes);

        if (!nome || !email || !cpf || !whatsapp || !cep || !endereco || !numero || !bairro || !cidade || !estado || !servico) {
          return json({ ok: false, message: "Preencha todos os campos obrigatórios." }, 400);
        }

        if (!validarCPF(cpf)) {
          return json({ ok: false, message: "CPF inválido." }, 400);
        }

        if (cep.length !== 8) {
          return json({ ok: false, message: "CEP inválido." }, 400);
        }

        if (!env.DB) {
          return json({ ok: false, message: "Banco de dados não está conectado ao Worker." }, 500);
        }

        const codigo = gerarCodigo();

        await env.DB.prepare(`
          INSERT INTO clientes (
            codigo, nome, cpf, whatsapp, email, cep, pais, endereco,
            numero, complemento, bairro, cidade, estado, servico,
            produto, observacoes, status, criado_em, atualizado_em
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).bind(
          codigo,
          nome,
          cpf,
          whatsapp,
          email,
          cep,
          pais,
          endereco,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          servico,
          produto,
          observacoes,
          "Cadastro recebido"
        ).run();

        // WhatsApp é secundário: o cadastro já fica salvo no D1 mesmo que o envio falhe.
        let whatsappEnviado = false;

        if (env.META_ACCESS_TOKEN && env.META_PHONE_NUMBER_ID && env.META_ADMIN_PHONE) {
          try {
            const resposta = await fetch(
              `https://graph.facebook.com/v24.0/${env.META_PHONE_NUMBER_ID}/messages`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${env.META_ACCESS_TOKEN}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  recipient_type: "individual",
                  to: env.META_ADMIN_PHONE,
                  type: "text",
                  text: {
                    preview_url: false,
                    body: `🛒 NOVO CADASTRO - EUROCOMPRA\n\nCódigo: ${codigo}\nNome: ${nome}\nE-mail: ${email}\nWhatsApp: ${whatsapp}\nCPF: ***${cpf.slice(-4)}\nCidade/UF: ${cidade}/${estado}\nServiço: ${servico}\n\nCadastro salvo no sistema.`,
                  },
                }),
              }
            );
            whatsappEnviado = resposta.ok;
          } catch (erro) {
            console.error("Erro WhatsApp:", erro);
          }
        }

        return json({
          ok: true,
          codigo,
          whatsappEnviado,
          message: "Cadastro recebido com segurança.",
        });
      } catch (erro) {
        console.error("Erro no cadastro:", erro);
        return json({ ok: false, message: "Dados enviados em formato inválido." }, 400);
      }
    }

    // Consulta administrativa. Configure ADMIN_VIEW_TOKEN nos Secrets do Worker.
    if (request.method === "GET" && url.pathname === "/api/clientes") {
      const adminToken = request.headers.get("X-Admin-Token");

      if (!env.ADMIN_VIEW_TOKEN || adminToken !== env.ADMIN_VIEW_TOKEN) {
        return json({ ok: false, message: "Não autorizado." }, 401);
      }

      try {
        const limite = Math.min(Math.max(Number(url.searchParams.get("limit")) || 50, 1), 100);
        const result = await env.DB.prepare(`
          SELECT codigo, nome, email, whatsapp, cep, cidade, estado,
                 servico, produto, status, criado_em, atualizado_em
          FROM clientes
          ORDER BY id DESC
          LIMIT ?
        `).bind(limite).all();

        return json({ ok: true, clientes: result.results || [] });
      } catch (erro) {
        console.error("Erro ao consultar clientes:", erro);
        return json({ ok: false, message: "Não foi possível consultar os clientes." }, 500);
      }
    }

    return json({ ok: false, message: "Rota não encontrada." }, 404);
  },
};
