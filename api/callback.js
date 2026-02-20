/**
 * OAuth step 2 — Échange le code GitHub contre un token,
 * puis le renvoie à Decap CMS via postMessage.
 * GET /api/callback?code=...
 */
module.exports = async function (req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send(renderPage("error", "Code d'autorisation manquant."));
  }

  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res.status(500).send(renderPage("error", "Configuration OAuth incomplète côté serveur."));
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id:     GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      const msg = data.error_description || data.error || "Authentification refusée par GitHub.";
      return res.status(401).send(renderPage("error", msg));
    }

    return res.send(renderPage("success", data.access_token));
  } catch (err) {
    return res.status(500).send(renderPage("error", "Erreur serveur lors de l'échange du token."));
  }
};

/**
 * Génère la page HTML qui renvoie le résultat à Decap CMS via postMessage.
 * Le format attendu par Decap : "authorization:{provider}:{result}:{jsonData}"
 */
function renderPage(result, tokenOrError) {
  const payload =
    result === "success"
      ? { token: tokenOrError, provider: "github" }
      : { message: tokenOrError };

  const message = `authorization:github:${result}:${JSON.stringify(payload)}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Authentification — L'Atelier d'Antoine</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center;
           justify-content: center; min-height: 100vh; margin: 0;
           background: #FAF7F2; color: #2C2016; }
    p { font-size: 1rem; opacity: .7; }
  </style>
</head>
<body>
  <p>${result === "success" ? "Authentification réussie, fermeture…" : "Erreur : " + tokenOrError}</p>
  <script>
    (function () {
      var msg = ${JSON.stringify(message)};
      function receive(e) {
        window.opener.postMessage(msg, e.origin);
      }
      window.addEventListener("message", receive, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>`;
}
