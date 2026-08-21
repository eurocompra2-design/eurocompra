import originalWorker from "./worker.js";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/webhook") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders() });
      }

      // Meta verifica o webhook através de uma requisição GET.
      if (request.method === "GET") {
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");
        const expectedToken = String(env.META_WEBHOOK_VERIFY_TOKEN || "").trim();

        if (mode === "subscribe" && expectedToken && token === expectedToken && challenge) {
          return new Response(challenge, {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }

        return new Response("Forbidden", { status: 403 });
      }

      // Meta espera HTTP 200 ao entregar notificações.
      if (request.method === "POST") {
        try {
          const payload = await request.json();
          console.log("WhatsApp Webhook:", JSON.stringify(payload));
        } catch (error) {
          console.error("Webhook inválido:", error);
        }

        return new Response("EVENT_RECEIVED", {
          status: 200,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      return new Response("Method Not Allowed", { status: 405 });
    }

    // Mantém todos os endpoints atuais da EuroCompra funcionando.
    return originalWorker.fetch(request, env, ctx);
  },
};
