// Cloudflare Worker (plan gratuito): guarda la clave en secreto y llama a la API gratuita de Google Gemini
export default {
  async fetch(req, env) {
    const allowed = env.ALLOWED_ORIGIN || "https://luiisso.github.io";
    const cors = {"Access-Control-Allow-Origin": allowed, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"};
    const out = (o, s = 200) => new Response(JSON.stringify(o), {status: s, headers: {...cors, "Content-Type": "application/json"}});
    if (req.method === "OPTIONS") return new Response(null, {headers: cors});
    if (req.method !== "POST") return out({ok: true});
    if (allowed !== "*" && req.headers.get("Origin") !== allowed) return out({error: "origen no permitido"}, 403);
    try {
      const {tipo, data, mime, objetivo, contexto} = await req.json();
      if (!data || data.length > 7000000) return out({error: "archivo no válido o muy grande"}, 400);
      const prompt = tipo === "comida"
        ? `Analiza la foto del plato. Objetivo del usuario: ${String(objetivo).slice(0, 20)}. Datos de analíticas: ${String(contexto || "ninguno").slice(0, 800)}. Responde SOLO JSON: {"plato":"nombre","kcal":número total estimado,"consejo":"consejo breve y motivador en español"}. Si no es comida, kcal 0.`
        : `Resume en español los valores de esta analítica relevantes para nutrición y composición corporal. No diagnostiques. Responde SOLO JSON: {"puntos":["máx 6 frases breves"]}.`;
      const model = env.MODEL || "gemini-3.1-flash-lite";
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: {"x-goog-api-key": env.GEMINI_API_KEY, "content-type": "application/json"},
        body: JSON.stringify({
          contents: [{parts: [{inline_data: {mime_type: mime === "application/pdf" ? mime : "image/jpeg", data}}, {text: prompt}]}],
          generationConfig: {responseMimeType: "application/json", maxOutputTokens: 600}
        })
      });
      if (r.status === 429) return out({error: "límite gratuito alcanzado, prueba en un minuto"}, 429);
      const j = await r.json();
      if (!r.ok) return out({error: j.error?.message || "error de la API"}, 502);
      const txt = j.candidates[0].content.parts.map(p => p.text || "").join("").replace(/```json|```/g, "").trim();
      return out(JSON.parse(txt));
    } catch (e) { return out({error: "no se pudo procesar"}, 500); }
  }
};
