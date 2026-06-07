# Patrice's Brainyard — Notes for AI Agents

## Stack
- **Hugo** v0.160.1 (extended) — static site generator
- **CSS pur** — pas de framework, pas de Tailwind
- **GitHub Pages** + GitHub Actions (déploiement auto)

## Configuration directory (`config/`)
On split `hugo.toml` par root key dans `config/_default/` :

```
config/_default/
├── hugo.toml      # baseURL, title, locale, paginate, uglyURLs
├── params.toml    # params : description, email, accentColor, darkBg
└── menus.toml     # menu.main
```

**Important (v0.160)** : Dans les fichiers splittés, on **omet** la root key.
- `params.toml` → `description = "..."` (pas `[params]`)
- `menus.toml` → `[[main]]` (pas `[menus]`)

La fonctionnalité 'root key unwrapping' (inclure `[params]` dans `params.toml`) est arrivée en **v0.162.0** — NE PAS utiliser sur ce projet.

## Environments
- `config/development/hugo.toml` → `buildDrafts = true` (pour `hugo server`)
- `config/production/` → optionnel (pour `hugo build`)

## Design system
- **Couleurs** : fond `#f8f9fc`, texte `#131313`, accent `#7ec8e3` (bleu ciel), hover `#5ab0d0`
- **Body** : `Klee One`, serif fallback
- **Headings / UI** : `Inter Variable`, system-ui fallback
- **Code** : `MapleMono-Regular`, `Cascadia Code`, `Fira Code` fallback
- **Fonts** self-hosted in `static/fonts/{inter,klee-one,maple-mono}/`
- **Variable font** : Inter via woff2-variations format

## Layout structure
```
layouts/
├── _default/
│   ├── baseof.html     # squelette HTML
│   ├── list.html        # sections (blog list, etc.)
│   └── single.html      # pages (à propos, contact)
├── blog/
│   └── single.html      # article avec date et nav prev/next
├── galerie/
│   └── list.html        # grille responsive + lightbox CSS-only
├── index.html           # accueil personnalisée
├── 404.html             # page 404
└── partials/
    ├── head.html        # meta + CSS asset pipeline
    ├── header.html      # nav responsive (checkbox CSS hack)
    └── footer.html      # copyright + email
```

## Navigation responsive
CSS-only hamburger via `#menu-toggle:checked ~ nav` (checkbox cachée).
- Mobile (<768px) : menu vertical, caché par défaut
- Desktop : menu horizontal

## Gallery (CSS-only lightbox)
Lightbox via `:target` pseudo-class :
- `<a href="#lightbox-0">` → thumbnail
- `<div id="lightbox-0" class="lightbox">` → overlay avec `:target { display: flex }`
- Zéro JavaScript

## Image processing
- Galerie : `{{ $img.Fill "400x300" }}` pour les thumbnails
- Original chargé dans la lightbox

## Build & deploy
- CI : `.github/workflows/hugo.yml`
- Branche : `main` → build → `actions/upload-pages-artifact` → `actions/deploy-pages`
- `hugo --minify` en prod

## Content structure
```
content/
├── _index.md            # headless — used by index.html layout
├── a-propos/_index.md   # "À propos"
├── blog/_index.md       # listing
├── blog/2026-06-01-*    # articles (datés)
├── galerie/_index.md    # headless — images via .Resources
└── contact/_index.md    # email
```

## Conventional commits
Tous les commits doivent suivre le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajouter la galerie lightbox
fix(css): corriger le padding mobile de la nav
chore(blog): mettre à jour l'article de bienvenue
style: reformater le CSS
docs: lire le README
refactor: simplifier le template list
```

Scopes courants : `blog`, `galerie`, `css`, `config`, `ci`, `fonts`, `content`, `layout`

Ne jamais commit sans raison. Un commit = un changement atomique.

## Commandes utiles
```bash
hugo server              # dev (with drafts)
hugo server -D           # dev with drafts visible
hugo build               # prod build
hugo build --minify      # prod build minified
hugo config              # show current config
```

## Constraints (Hugo v0.160.1)
- `locale` OK (depuis v0.158.0), `languageCode` déprécié mais fonctionne
- `[page]`, `[pagination]`, `[build.buildStats]` OK
- Pas de root key unwrapping dans fichiers splittés (v0.162+)
- Pas de `_merge` dans config files (v0.162+)
