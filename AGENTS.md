# Patrice's Brainyard — Notes for AI Agents

## Stack
- **Hugo** v0.160.1 (extended) — static site generator
- **CSS pur** — pas de framework, pas de Tailwind
- **GitHub Pages** + GitHub Actions (déploiement auto)
- **Zéro JavaScript** — lightbox CSS-only (`:target`), hamburger CSS-only (checkbox hack)

## Configuration directory (`config/`)
On split `hugo.toml` par root key dans `config/_default/` :

```
config/_default/
├── hugo.toml      # baseURL, title, locale, paginate, uglyURLs, buildFuture, enableRobotsTXT
├── params.toml    # sections : [site], [ui], [hero], [seo], [social]
├── menus.toml     # menu.main
└── markup.toml    # goldmark unsafe = true
```

**Important (v0.160)** : Dans les fichiers splittés, on **omet** la root key.
- `params.toml` → sections `[site]`, `[hero]`, `[seo]` etc. (pas `[params]`)
- `menus.toml` → `[[main]]` (pas `[menus]`)

La fonctionnalité 'root key unwrapping' (inclure `[params]` dans `params.toml`) est arrivée en **v0.162.0** — NE PAS utiliser sur ce projet.

### Clés notables
- `[site].email` — utilisé dans `single.html` pour injecter le contact sur `/a-propos/`
- `[site].bg` — fond global optionnel (cascade page > section > site, voir détails ci-dessous)
- `[hero].logo` — chemin relatif (`images/avatar.png`), fonctionne car le hero n'est que sur `/`
- `[seo].favicon` — **chemin absolu** (`/favicon.svg`), fonctionne depuis toutes les pages
- `[seo].ogImage` — chemin relatif (`images/og.svg`), passe par `absURL` dans le template
- `buildFuture = true` dans `hugo.toml` — les articles futurs sont inclus dans le build

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
│   ├── baseof.html       # squelette HTML (header block, bodyClass block)
│   ├── list.html         # sections (brainyard listing, etc.)
│   ├── single.html       # pages (à propos, etc.) — injecte email configuré sur /a-propos/
│   ├── taxonomy.html     # page de tag/catégorie avec liste d'articles
│   └── terms.html        # page listant tous les tags/catégories avec badges
├── brainyard/
│   └── single.html       # article avec date affichée, navigation
├── projets/
│   ├── list.html         # grille de cartes projet (6-col, overlay, width/height sur images)
│   └── single.html       # page projet modal-like (header global caché)
├── index.html            # accueil : hero optionnel (showHero) + {{ .Content }} depuis _index.md
├── 404.html              # self-hosted GIF (static/images/404.gif)
├── shortcodes/
│   ├── compare.html      # comparateur avant/après avec slider CSS-only
│   ├── gallery.html      # wrapper `<div class="project-gallery">`
│   ├── img.html          # image + lightbox (width/height 800x500 thumb, dimensions réelles lightbox)
│   ├── img-abs.html      # image par chemin absolu (hors leaf bundle), même structure lightbox
│   ├── vimeo.html        # iframe Vimeo embed
│   └── youtube.html      # iframe YouTube embed (no-cookie)
└── partials/
    ├── head.html         # meta + SEO (og, twitter), preload Inter, preconnect Vimeo, CSS fingerprint + SRI
    ├── header.html       # nav responsive (checkbox CSS hack), liens sociaux depuis params.social
    ├── json-ld.html      # schema.org structuré (WebSite, Article, ProfilePage, CreativeWork, WebPage)
    ├── social-icon.html  # SVGs inline pour réseaux (réserves: twitter, bluesky, youtube, mastodon, etc.)
    └── footer.html       # copyright
```

## Navigation
- Menu : **Projets** / **Brainyard** / **À propos**
- **Header** : `position: fixed`, transparent, z-index 1000
- **Hamburger** CSS-only via `#menu-toggle:checked ~ nav` (checkbox cachée)
- Mobile (<768px) : menu vertical, background blanc, caché par défaut
- Desktop : menu horizontal, `nav a` avec border-radius et hover accent

## Page d'accueil (`index.html`)
- **Hero optionnel** : contrôlé par `showHero:` dans le front matter de `content/_index.md` (défaut `true`)
- **Contenu** : `{{ .Content }}` depuis `content/_index.md` — l'utilisateur écrit en markdown + shortcodes
- **Texte éditorial** dans `.home-content > p, h1, h2, etc.` : `max-width: 540px; margin: auto`
- Pas de hardcodage de projets ou brainyard dans le template — tout passe par le contenu

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
- Rendu : `<figure class="layout">` avec thumbnail `Fill 800x500` + lightbox `:target`
- **width/height** : thumb `width="800" height="500"` ; lightbox `width="{{ $img.Width }}" height="{{ $img.Height }}"`
- Copyright : chaîne de fallback — param shortcode `copyright=""` → `.Page.Params.copyright` → `site.Params.site.copyright`
- IDs uniques : `lightbox-{{ .Ordinal }}`

### `{{< img-abs src="..." layout="..." name="..." >}}`
Variante pour images hors leaf bundle (chemin absolu, ex: `/projets/foo/img.png`).
Pas de Hugo image processing, pas de width/height automatique — fournir `width`/`height` manuellement si besoin.
Utilisé dans les articles brainyard.

### `{{< vimeo ID "layout" >}}`
- **ID** : identifiant Vimeo (positional, obligatoire)
- **layout** : `"half"` (défaut) ou `"full"` (positionnel, optionnel)
- Rendu : `<figure class="layout">` avec iframe 16:9 aspect-ratio, fond noir, attribut `title="Vimeo video"`

### `{{< youtube ID "layout" >}}`
- **ID** : identifiant YouTube (positional, obligatoire)
- **layout** : `"half"` (défaut) ou `"full"` (positionnel, optionnel)
- Utilise `youtube-nocookie.com` pour le respect de la vie privée
- Rendu : `<figure class="layout">` avec iframe 16:9 aspect-ratio, fond noir, attribut `title="YouTube video"`

### `{{< compare before="..." after="..." layout="..." beforeName="..." afterName="..." >}}`
Comparateur avant/après CSS-only (zéro JS).
- **before** / **after** : chemin de l'image (`/projets/foo/img.png` pour absolu, ou nom fichier pour leaf bundle)
- **layout** : `"half"` (défaut) ou `"full"`
- **beforeName** / **afterName** : labels affichés sur l'image (défaut `"Avant"` / `"Après"`)
- Rendu : `<figure class="layout">` avec slider `<input type="range">`, poignée + ligne verticale CSS
- **Convention** : handle à gauche → full after, handle à droite → full before
- **Fonctionnement** : image before en `position: absolute` (z-index supérieur), clip `inset(0 calc(100% - var(--pct)) 0 0)`, handle + ligne à `left: var(--pct)` — la frontière clipée EST pile sous le handle
- **Pas besoin de wrapper `gallery`** : le shortcode émet son propre `<figure>`

**Important** : Toujours wrapper les appels sauf `compare` dans `{{< gallery >}}` pour éviter que Hugo n'encapsule le shortcode dans une balise `<p>`.

## Lightbox (CSS-only)
- Pseudo-classe `:target` : `.lightbox:target { opacity: 1; visibility: visible }`
- **Fermeture** : clic sur ✕ **OU** clic sur le fond noir (via `.lightbox-bg` : anchor invisible inset:0 z-index:1)
- `.lightbox-content` a `pointer-events: auto` → les clics image/meta ne remontent pas
- Zéro JavaScript

## Grille projet (listing)
- `grid-template-columns: repeat(6, 1fr)`
- **card-wide** (index 0-1) : `span 3`, aspect-ratio `1 / 0.85`
- **card-small** (index 2+) : `span 2`, aspect-ratio `1 / 1.1`
- Overlay titre en bas : gradient `linear-gradient(transparent 40%, rgba(0,0,0,0.6))` + text-shadow
- Desktop 6-col, mobile 2-col

## Image processing
- Thumbnails galerie : `Fill "800x500"` → `width="800" height="500"`
- Couverture projet : `Fill "800x600"` → `width="800" height="600"`
- Lightbox : dimensions réelles via `$img.Width` / `$img.Height`
- Attributs `width`/`height` sur toutes les images pour éviter CLS

## SEO & Performance
- **Preload** : Inter Variable font (`<link rel="preload">` avec `crossorigin`)
- **Preconnect** : `player.vimeo.com`, `www.youtube-nocookie.com`
- **CSS fingerprinté** : `resources.Get | resources.Minify | resources.Fingerprint "sha256"` avec attribut `integrity` (SRI)
- **Open Graph** : `og:image` avec `absURL` (chemin relatif depuis config → URL absolue)
- **Twitter Cards** : `summary_large_image`
- **JSON-LD** : schema.org structuré (WebSite, Article, ProfilePage, CreativeWork, WebPage)
- **Sitemap** : auto-généré par Hugo (`/sitemap.xml`)
- **Canonical** : sur toutes les pages
- **Favicon** : `/favicon.svg` (chemin absolu fonctionne depuis toutes les pages)

## Accessibilité
- `:focus` désactivé, `:focus-visible` défini (outline accent `2px solid var(--accent)` + `outline-offset: 2px`)
- `aria-label` sur le lien hero logo et le hamburger
- `aria-current="page"` sur le lien de navigation actif
- `alt` et `loading="lazy"` sur toutes les images
- Skip link (`Aller au contenu`) en premier élément du body

## Build & deploy
- CI : `.github/workflows/hugo.yml`
- Branche : `main` → build → `actions/upload-pages-artifact` → `actions/deploy-pages`
- `hugo --minify` en prod

## Content structure
```
content/
├── _index.md                         # page d'accueil (contenu éditable, hero optionnel)
├── a-propos/_index.md                # bio + contact (email depuis params.toml, injecté par single.html)
├── brainyard/
│   ├── _index.md                     # listing (title: "Brainyard")
│   ├── bienvenue-dans-le-brainyard.md  # article
│   └── louis-v-bag.md                # article (utilise compare + img-abs)
└── projets/                          # leaf bundles
    ├── _index.md                     # params.copyright (fallback global)
    ├── showreel/                     # weight:5 — vidéo + images
    ├── coucher-de-soleil/            # weight:10 — 10 images
    ├── reflets-eau/                  # weight:20 — 10 images
    ├── louis-v-bag/                  # weight:25 — 8 images (avant/après, 2 couleurs)
    ├── architecture-moderne/         # weight:40 — 10 images
    └── mer-agitee/                   # weight:50 — 10 images
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

## Archétypes
```
archetypes/
├── brainyard.md      # article brainyard (draft:true, title, description, date)
├── default.md        # page basique (draft:true, title, date)
└── projets/
    └── index.md      # projet (weight, year, description, cover, cardColor)
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

Scopes courants : `brainyard`, `projets`, `home`, `galerie`, `css`, `config`, `ci`, `fonts`, `content`, `layout`, `lightbox`, `shortcodes`, `a11y`, `perf`, `seo`, `compare`

Ne jamais commit sans raison. Un commit = un changement atomique.
**Ne jamais push sans instruction explicite** — commits locaux uniquement, sauf demande contraire.

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
- Les shortcodes `{{< img >}}`, `{{< vimeo >}}` et `{{< youtube >}}` doivent être wrappés dans `{{< gallery >}}` pour éviter la balise `<p>` parasite

## Navigation projet — swap PrevInSection / NextInSection
Hugo trie les pages d'une section par **poids décroissant** pour `PrevInSection`/`NextInSection`. Le listing projets utilise un tri **croissant** (`.Pages.ByParam "weight"`). Pour que les flèches de navigation projet correspondent à l'ordre du listing, les deux variables sont **swappées** :

```go
{{ $prev := .NextInSection }}
{{ $next := .PrevInSection }}
```

Ne PAS "corriger" ce swap — il est volontaire.

## Chaîne de fallback copyright
Les shortcodes `img.html` et `img-abs.html` utilisent la chaîne suivante pour le copyright affiché dans la lightbox :

1. Paramètre explicite du shortcode : `{{< img copyright="..." >}}`
2. `$.Page.Params.copyright` — le front matter de la page courante (leaf bundle ou section)
3. `site.Params.site.copyright` — le copyright global dans `params.toml`

Pas de `params:` wrapper en front matter pour les sections (Hugo v0.160.1 ne supporte pas l'unwrap et `.Params.copyright` ne fonctionnerait pas).

## Fond de page configurable (`bg` + `bgCascade`)

Le paramètre `bg` dans le frontmatter définit un fond de page via `style="background:..."` sur `<body>`. Accepte toute valeur CSS valide (couleur, gradient, image).

**Cascade** (page → section → site) :
1. `page.Params.bg` — le plus prioritaire
2. `.CurrentSection.Params.bg` — hérité de la section si pas défini sur la page
3. `site.Params.site.bg` — global dans `params.toml`

**`bgCascade: false`** bloque la remontée : la page/section n'hérite pas du niveau supérieur.

Exemples :
```yaml
# config/_default/params.toml → global
[site]
bg = "#1a1a2e"

# content/brainyard/_index.md → section
bg = "#f5f0e8"

# content/brainyard/article.md → page
bg = "url(/images/bg.jpg) center/cover"
bgCascade: false   # n'hérite pas du fond de la section
```

## Session History

### 2026-06-09 — CSS split, compare slider, copyright chain, divers fixes

**CSS split**: `main.css` → 9 fichiers modulaires dans `assets/css/` (base, layout, content, articles, taxonomy, shortcodes, brainyard, projets, responsive). Concatenation via `resources.Concat` dans `head.html` avec fingerprint + SRI inchangé.

**Compare slider corrigé**: clip `inset(0 calc(100% - var(--pct)) 0 0)` sur `.compare-before` — le handle, la ligne et la frontière clipée sont toujours alignés à `var(--pct)`. Supprimé `dir="rtl"` et `--clip`. Convention : glisser à droite = révéler plus d'avant.

**Copyright chain unifiée** dans `img.html` et `img-abs.html` : param shortcode → `.Page.Params.copyright` → `site.Params.site.copyright`. Retiré `params:` wrapper dans `content/projets/_index.md`.

**Lightbox z-index** : `200` → `1002` (au-dessus du header à 1000). Doublon `.lightbox-close` supprimé.

**Navigation projets** : swap `PrevInSection`/`NextInSection` conservé (volontaire — Hugo trie les sections par poids décroissant).

**Divers** : date en français (`2 janvier 2006`), weight `louis-v-bag` 10→25, sub-pixel border 0.5px→1px, line-clamp articles, padding `.page-content`, hamburger checkbox avant nav dans le DOM, `.error-page h1` responsive (6rem→3.5rem), JSON-LD `.Lastmod` avec garde `.IsZero`, iframe Vimeo avec `title`.

**Commits** : `227de69`, `f44f711`, `a2149e6`, `8f3c458`, `1493df6`, `1d8cbf9`, `bb803d4`
