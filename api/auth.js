/**
 * OAuth step 1 — Redirige vers GitHub pour l'autorisation
 * GET /api/auth
 */
module.exports = function (req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return res.status(500).send("Variable d'environnement GITHUB_CLIENT_ID manquante.");
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host  = req.headers["x-forwarded-host"] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/callback`;

  const params = new URLSearchParams({
    client_id:    clientId,
    redirect_uri: redirectUri,
    scope:        "repo,user",
  });

  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
};
