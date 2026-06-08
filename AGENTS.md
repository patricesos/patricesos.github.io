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
├── params.toml    # params : description, accentColor, darkBg
├── menus.toml     # menu.main
└── markup.toml    # goldmark unsafe = true
```

**Important (v0.160)** : Dans les fichiers splittés, on **omet** la root key.
- `params.toml` → `description = "..."` (pas `[params]`)
- `menus.toml` → `[[main]]` (pas `[menus]`)

La fonctionnalité 'root key unwrapping' (inclure `[params]` dans `params.toml`) est arrivée en **v0.162.0** — NE PAS utiliser sur ce projet.

## Environments
- `config/development/hugo.toml` → `buildDrafts = true` (pour `hugo server`)

## Design system
- **Couleurs** : fond `#EFEFED`, texte `#131313`, accent `#7ec8e3` (bleu ciel), hover `#5ab0d0`
- **Body** : `Klee One`, serif fallback
- **Headings / UI** : `Inter Variable`, system-ui fallback
- **Code** : `MapleMono-Regular`, `Cascadia Code`, `Fira Code` fallback
- **Fonts** self-hosted in `static/fonts/{inter,klee-one,maple-mono}/`
- **Variable font** : Inter via woff2-variations format
- **Card bg** : blanc `#ffffff`
- **Bordure** : `#e2e8f0`

## Layout structure
```
layouts/
├── _default/
│   ├── baseof.html     # squelette HTML (header block, bodyClass block)
│   ├── list.html       # sections (brainyard listing, etc.)
│   └── single.html     # pages (à propos, etc.)
├── brainyard/
│   └── single.html     # article avec date
├── projets/
│   ├── list.html       # grille de cartes projet (6-col, overlay)
│   └── single.html     # page projet modal-like
├── index.html          # accueil (spacer + grille 6-col + brainyard)
├── 404.html
├── shortcodes/
│   ├── gallery.html    # wrapper `<div class="project-gallery">`
│   ├── img.html        # image + lightbox
│   └── vimeo.html      # iframe Vimeo embed
└── partials/
    ├── head.html       # meta + CSS asset pipeline
    ├── header.html     # nav responsive (checkbox CSS hack)
    └── footer.html     # copyright
```

## Navigation
- Menu : **Projets** / **Brainyard** / **À propos**
- **Header** : `position: fixed`, transparent, z-index 1000
- **Hamburger** CSS-only via `#menu-toggle:checked ~ nav` (checkbox cachée)
- Mobile (<768px) : menu vertical, background blanc, caché par défaut
- Desktop : menu horizontal, `nav a` avec border-radius et hover accent

## Page projet (single)
- **Header global caché** via `{{ if not (and (eq .Section "projets") .IsPage) }}`
- **Modal-like** : fond blanc, `.project-page` min-height 100vh
- **`.project-header`** : sticky, close (→ `/projets/`), titre, client optionnel, hr
- **`.project-body`** : full-width (padding 2rem 1.5rem)
- **Texte éditorial** : `p, h1, h2, ul, ol, blockquote, pre` → `max-width: 540px; margin: auto`
- **`.project-description`** : `max-width: 480px; center; color #999`
- **`.project-gallery`** : grille 4 colonnes gap 4px, `max-width: 900px; margin: auto`

## Shortcodes

### `{{< gallery >}}...{{< /gallery >}}`
Wrapper qui émet `<div class="project-gallery">`. Contient des `{{< img >}}` ou `{{< vimeo >}}`.

### `{{< img src="..." layout="..." name="..." >}}`
- **src** : nom du fichier image dans le leaf bundle (ex: `"img-1.jpg"`)
- **layout** : `"half"` (défaut, span 2 cols) ou `"full"` (toute la largeur)
- **name** : texte affiché dans la lightbox
- Rendu : `<figure class="layout">` avec thumbnail (Fill 800x500) + lightbox `:target`
- Copyright : paramètre `params.copyright` dans `content/projets/_index.md` (fallback global)
- IDs uniques : `lightbox-{{ .Ordinal }}`

### `{{< vimeo ID "layout" >}}`
- **ID** : identifiant Vimeo (positional, obligatoire)
- **layout** : `"half"` (défaut) ou `"full"` (positionnel, optionnel)
- Rendu : `<figure class="layout">` avec iframe 16:9 aspect-ratio, fond noir

**Important** : Toujours wrapper les appels dans `{{< gallery >}}` pour éviter que Hugo n'encapsule le shortcode dans une balise `<p>`.

## Lightbox (CSS-only)
- Pseudo-classe `:target` : `.lightbox:target { opacity: 1; visibility: visible }`
- **Fermeture** : clic sur ✕ **OU** clic sur le fond noir (via `.lightbox-bg` : anchor invisible inset:0 z-index:1)
- `.lightbox-content` a `pointer-events: auto` → les clics image/meta ne remontent pas
- Zéro JavaScript

## Grille projet (listing + home)
- `grid-template-columns: repeat(6, 1fr)`
- **card-wide** (index 0-1) : `span 3`, aspect-ratio `1 / 0.85`
- **card-small** (index 2+) : `span 2`, aspect-ratio `1 / 1.1`
- Overlay titre en bas : gradient `linear-gradient(transparent 40%, rgba(0,0,0,0.6))` + text-shadow
- Desktop 6-col, mobile 2-col

## Image processing
- Thumbnails galerie : `Fill "800x500"`
- Couverture projet : `Fill "800x600"`
- Original affiché dans la lightbox

## Build & deploy
- CI : `.github/workflows/hugo.yml`
- Branche : `main` → build → `actions/upload-pages-artifact` → `actions/deploy-pages`
- `hugo --minify` en prod

## Content structure
```
content/
├── _index.md                         # headless (home)
├── a-propos/_index.md                # bio + contact (email mergé)
├── brainyard/
│   ├── _index.md                     # listing (title: "Brainyard")
│   └── bienvenue-dans-le-brainyard.md  # article
└── projets/                          # leaf bundles
    ├── _index.md                     # params.copyright (fallback global)
    ├── showreel/                     # weight:5 — vidéo + images
    ├── coucher-de-soleil/            # weight:10 — 10 images
    ├── reflets-eau/                  # weight:20 — 10 images
    ├── promenade-foret/              # weight:30 — 10 images
    ├── architecture-moderne/         # weight:40 — 10 images
    ├── mer-agitee/                   # weight:50 — 10 images
    └── nuit-etoilee/                 # weight:60 — 10 images
```

### Front matter projet
```yaml
---
title: "Nom du projet"
weight: XX            # ordre d'affichage (5, 10, 20, etc.)
year: 2026
cardColor: "#fff"     # couleur du texte overlay sur la carte
cover: "img-1.jpg"    # image utilisée pour la carte liste/home
description: "..."    # affiché dans la page projet (480px centré)
---
```

Les images sont listées via shortcodes dans le body, pas dans le front matter.

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

Scopes courants : `brainyard`, `projets`, `galerie`, `css`, `config`, `ci`, `fonts`, `content`, `layout`, `lightbox`, `shortcodes`

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
- Goldmark renderer en `unsafe = true` (HTML brut autorisé dans le markdown)
- Les shortcodes `{{< img >}}` doivent être wrappés dans `{{< gallery >}}` pour éviter la balise `<p>` parasite
