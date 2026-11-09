// Cloudflare Worker: guarda la clave en secreto y llama a la API de Anthropic
export default {
  async fetch(req, env) {
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = {"Access-Control-Allow-Origin": allowed, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"};
    const out = (o, s = 200) => new Response(JSON.stringify(o), {status: s, headers: {...cors, "Content-Type": "application/json"}});
    if (req.method === "OPTIONS") return new Response(null, {headers: cors});
    if (req.method !== "POST") return out({ok: true});
    if (allowed !== "*" && req.headers.get("Origin") !== allowed) return out({error: "origen no permitido"}, 403);
    try {
      const {tipo, data, mime, objetivo, contexto} = await req.json();
      if (!data || data.length > 7000000) return out({error: "archivo no válido o muy grande"}, 400);
      const bloque = mime === "application/pdf"
        ? {type: "document", source: {type: "base64", media_type: mime, data}}
        : {type: "image", source: {type: "base64", media_type: "image/jpeg", data}};
      const prompt = tipo === "comida"
        ? `Analiza la foto del plato. Objetivo del usuario: ${String(objetivo).slice(0, 20)}. Datos de analíticas: ${String(contexto || "ninguno").slice(0, 800)}. Responde SOLO JSON: {"plato":"nombre","kcal":número total estimado,"consejo":"consejo breve y motivador en español"}. Si no es comida, kcal 0.`
        : `Resume en español los valores de esta analítica relevantes para nutrición y composición corporal. No diagnostiques. Responde SOLO JSON: {"puntos":["máx 6 frases breves"]}.`;
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {"x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json"},
        body: JSON.stringify({model: env.MODEL || "claude-haiku-5-5", max_tokens: 600, messages: [{role: "user", content: [bloque, {type: "text", text: prompt}]}]})
      });
      const j = await r.json();
      if (!r.ok) return out({error: j.error?.message || "error de la API"}, 502);
      const txt = j.content.map(c => c.text || "").join("").replace(/```json|```/g, "").trim();
      return out(JSON.parse(txt));
    } catch (e) { return out({error: "no se pudo procesar"}, 500); }
  }
};
