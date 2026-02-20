# L'Atelier d'Antoine — Site vitrine

Site vitrine professionnel pour un atelier de menuiserie sur-mesure.
Stack : **Eleventy 3 · Nunjucks · CSS vanilla · Decap CMS · Vercel · eleventy-img**

---

## Structure du projet

```
atelier-antoine/
├── .eleventy.js            # Config Eleventy (shortcodes, filtres, collections)
├── package.json
├── vercel.json             # Config déploiement Vercel
├── src/
│   ├── _data/
│   │   ├── site.json       # Coordonnées, email, Instagram, Formspree ID
│   │   ├── atelier.json    # Contenu éditable (hero, présentation) — géré par CMS
│   │   └── build.js        # Année de build dynamique
│   ├── _includes/
│   │   ├── layouts/
│   │   │   └── base.njk    # Layout HTML complet (meta, OG, Schema.org)
│   │   └── partials/
│   │       ├── header.njk
│   │       ├── footer.njk
│   │       └── gallery-section.njk  # Macro galerie filtrée
│   ├── admin/
│   │   ├── index.html      # Interface Decap CMS
│   │   └── config.yml      # Configuration CMS (collections, champs)
│   ├── assets/
│   │   ├── css/main.css
│   │   ├── js/main.js      # Nav, filtres galerie, lightbox, swipe tactile
│   │   └── images/
│   ├── realisations/       # Fichiers Markdown gérés par le CMS
│   │   └── realisations.json  # Empêche la génération de pages individuelles
│   ├── uploads/            # Images uploadées via CMS (ignorées par git)
│   ├── index.njk           # Accueil
│   ├── menuiserie-exterieure.njk
│   ├── menuiserie-interieure.njk
│   ├── agencement.njk
│   ├── contact.njk         # Formulaire Formspree
│   ├── confirmation.njk
│   ├── sitemap.njk         # → /sitemap.xml
│   └── robots.njk          # → /robots.txt
```

---

## Démarrage rapide

```bash
npm install
npm start          # Serveur dev sur http://localhost:8080
```

Pour utiliser l'admin CMS en local :
```bash
# Terminal 1
npx decap-server

# Terminal 2
npm start
# Ouvrir http://localhost:8080/admin/
```

---

## Déploiement sur Vercel

1. Pushez le dépôt sur GitHub
2. Importez le projet sur [vercel.com](https://vercel.com)
   — Vercel détecte automatiquement `vercel.json`
3. Variables d'environnement : aucune requise

---

## Configuration du CMS (Decap CMS)

### Étapes d'activation

1. **Créez un OAuth App GitHub** :
   `https://github.com/settings/developers`
   - Authorization callback URL : `https://api.netlify.com/auth/done`

2. **Enregistrez le site sur Netlify** (gratuit, même si hébergé sur Vercel) :
   - Activez GitHub dans *Identity > External providers*

3. **Éditez `src/admin/config.yml`** :
   ```yaml
   backend:
     name: github
     repo: VOTRE-ORG/atelier-antoine   # ← modifier
     branch: main
     base_url: https://api.netlify.com
     auth_endpoint: auth
   ```

4. Accédez à `https://votre-domaine.vercel.app/admin/`

---

## Ajouter des réalisations via le CMS

Chaque réalisation possède :
- **Titre**, **description courte**
- **Catégorie** : exterieur / interieur / agencement
- **Sous-catégorie** : portes-exterieures, fenetres, escaliers-ext, escaliers-int, portes-int, parquet, dressing, cuisine, bibliotheque, mobilier
- **1 à 5 photos** avec attribut `alt` obligatoire

Les images sont automatiquement converties en **WebP** (400/800/1200 px), avec lazy loading natif.

---

## Formulaire de contact

Formulaire géré par [Formspree](https://formspree.io).
ID configuré dans `src/_data/site.json` → `formspree_id: "mkovvynr"`.
Redirection vers `/confirmation/` après envoi.

---

## Identité visuelle

| Variable | Valeur |
|----------|--------|
| Fond principal | `#FAF7F2` |
| Fond sections alternées | `#F0EBE1` |
| Texte | `#2C2016` |
| Accent (or mat) | `#8B7640` |
| Accent clair | `#D4C4A0` |
| Titres | Cormorant Garamond |
| Corps | Inter |
