# FitVerde (todo gratis, hecho para el móvil)
Archivos: index.html, estilos.css, app.js, manifest.json (web) · worker.js (va a Cloudflare, no a Pages).
Sin configurar nada, la web funciona en MODO DEMO (la cámara y las analíticas dan resultados de ejemplo).

## Publicar
1. GitHub (navegador): crea un repositorio público → Add file → Upload files → sube index.html, estilos.css, app.js, manifest.json.
2. Settings → Pages → Deploy from a branch → main → / (root). Tu web: https://TUUSUARIO.github.io/REPO

## Activar la IA (gratis)
3. Clave: aistudio.google.com → Get API key (plan gratuito, sin tarjeta).
4. Cloudflare: dash.cloudflare.com → Workers & Pages → Create → Hello World → Deploy → Edit code → pega worker.js → Deploy.
5. Worker → Settings → Variables and Secrets: GEMINI_API_KEY (Secret) y ALLOWED_ORIGIN = https://TUUSUARIO.github.io (sin barra final). Opcional: MODEL.
6. En GitHub edita app.js (lápiz) y cambia API_URL por la URL del Worker (.workers.dev). Commit.

## Fotos de recetas
Sube el .jpg al repositorio y pon su nombre en el campo f de la receta en app.js (f:"tortilla.jpg").
Sin foto, se muestra un emoji. Usa fotos tuyas o libres (Unsplash, Pexels).

## Notas
En el plan gratuito Google puede usar los datos enviados para mejorar sus productos; no subas nombre ni DNI.
Web orientativa: no sustituye a un médico o dietista.
