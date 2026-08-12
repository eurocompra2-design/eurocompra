const corsHeaders = {
  "Access-Control-Allow-Origin": "https://eurocompra2-design.github.io",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function validarCPF(cpf) {
  cpf = String(cpf || "").replace(/\D/g, "");
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

function adminAuthorized(request, env) {
  const expected = env.ADMIN_KEY;
  const received = request.headers.get("Authorization") || "";
  return Boolean(expected) && received === `Bearer ${expected}`;
}

async function sendWhatsApp(data, env) {
  const { META_ACCESS_TOKEN, META_PHONE_NUMBER_ID, META_ADMIN_PHONE } = env;
  if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID || !META_ADMIN_PHONE) {
    return { configured: false, ok: false };
  }

  const mensagem = `🛒 NOVO CADASTRO - EUROCOMPRA\n\n` +
    `🔢 Código: ${data.codigo}\n` +
    `👤 Nome: ${data.nome}\n` +
    `📧 E-mail: ${data.email}\n` +
    `📱 WhatsApp: ${data.whatsapp}\n` +
    `🪪 CPF: ${data.cpf}\n` +
    `📍 Endereço: ${data.endereco}, ${data.numero}${data.complemento ? `, ${data.complemento}` : ""}\n` +
    `${data.bairro} - ${data.cidade}/${data.estado}\n` +
    `📮 CEP: ${data.cep}\n` +
    `🛍️ Serviço: ${data.servico}\n` +
    `📦 Produto: ${data.produto || "Não informado"}`;

  const resposta = await fetch(
    `https://graph.facebook.com/v24.0/${META_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${META_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: META_ADMIN_PHONE,
        type: "text",
        text: { preview_url: false, body: mensagem },
      }),
    }
  );

  return { configured: true, ok: resposta.ok };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);

    // WhatsApp webhook verification
    if (request.method === "GET" && url.pathname === "/webhook") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      if (mode === "subscribe" && token === env.WEBHOOK_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200, headers: corsHeaders });
      }
      return new Response("Token inválido", { status: 403, headers: corsHeaders });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return json({ ok: true, service: "EuroCompra API", status: "online" });
    }

    // Customer registration: stores the record first, then optionally sends WhatsApp.
    if (request.method === "POST" && url.pathname === "/api/cadastro") {
      try {
        const data = await request.json();
        const nome = String(data.nome || "").trim();
        const email = String(data.email || "").trim().toLowerCase();
        const cpf = String(data.cpf || "").replace(/\D/g, "");
        const whatsapp = String(data.whatsapp || "").trim();
        const cep = String(data.cep || "").trim();
        const endereco = String(data.endereco || "").trim();
        const numero = String(data.numero || "").trim();
        const complemento = String(data.complemento || "").trim();
        const bairro = String(data.bairro || "").trim();
        const cidade = String(data.cidade || "").trim();
        const estado = String(data.estado || "").trim();
        const pais = String(data.pais || "Brasil").trim();
        const servico = String(data.servico || "").trim();
        const produto = String(data.produto || "").trim();
        const observacoes = String(data.observacoes || "").trim();

        if (!nome || !email || !cpf || !whatsapp || !cep || !endereco || !numero || !bairro || !cidade || !estado || !servico) {
          return json({ ok: false, message: "Preencha todos os campos obrigatórios." }, 400);
        }
        if (!validarCPF(cpf)) {
          return json({ ok: false, message: "CPF inválido." }, 400);
        }
        if (!env.DB) {
          return json({ ok: false, message: "Banco de dados ainda não está configurado." }, 500);
        }

        const codigo = `EC-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const agora = new Date().toISOString();

        await env.DB.prepare(`
          INSERT INTO clientes (
            codigo, criado_em, nome, email, cpf, whatsapp, pais, cep, endereco,
            numero, complemento, bairro, cidade, estado, servico, produto,
            observacoes, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          codigo, agora, nome, email, cpf, whatsapp, pais, cep, endereco,
          numero, complemento, bairro, cidade, estado, servico, produto,
          observacoes, "Cadastro recebido"
        ).run();

        const whatsappResult = await sendWhatsApp({
          codigo, nome, email, whatsapp, cpf, cep, endereco, numero,
          complemento, bairro, cidade, estado, servico, produto,
        }, env);

        return json({
          ok: true,
          codigo,
          message: "Cadastro recebido com segurança.",
          whatsapp: whatsappResult.ok,
        });
      } catch (error) {
        console.error("Erro cadastro:", error);
        return json({ ok: false, message: "Não foi possível registrar o cadastro." }, 500);
      }
    }

    // Private admin list.
    if (request.method === "GET" && url.pathname === "/api/admin/cadastros") {
      if (!adminAuthorized(request, env)) return json({ ok: false, message: "Não autorizado." }, 401);
      if (!env.DB) return json({ ok: false, message: "Banco de dados não configurado." }, 500);
      const { results } = await env.DB.prepare(
        `SELECT codigo, criado_em, nome, email, whatsapp, pais, cep, endereco, numero, complemento, bairro, cidade, estado, servico, produto, observacoes, status, atualizado_em FROM clientes ORDER BY criado_em DESC`
      ).all();
      return json({ ok: true, clientes: results });
    }

    // Private admin status update.
    if (request.method === "POST" && url.pathname === "/api/admin/status") {
      if (!adminAuthorized(request, env)) return json({ ok: false, message: "Não autorizado." }, 401);
      if (!env.DB) return json({ ok: false, message: "Banco de dados não configurado." }, 500);
      const data = await request.json();
      const codigo = String(data.codigo || "").trim();
      const status = String(data.status || "").trim();
      const permitidos = [
        "Cadastro recebido", "Pagamento", "Compra realizada",
        "Recebido na Bélgica", "Preparando", "Enviado", "Entregue"
      ];
      if (!codigo || !permitidos.includes(status)) {
        return json({ ok: false, message: "Código ou status inválido." }, 400);
      }
      await env.DB.prepare(
        `UPDATE clientes SET status = ?, atualizado_em = ? WHERE codigo = ?`
      ).bind(status, new Date().toISOString(), codigo).run();
      return json({ ok: true, message: "Status atualizado." });
    }

    return json({ ok: false, message: "Rota não encontrada." }, 404);
  },
};
