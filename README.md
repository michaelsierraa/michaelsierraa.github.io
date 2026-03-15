# sierraarevalo.com

Personal academic website for Michael Sierra-Arévalo, Associate Professor of Sociology at UT Austin. Built with Hugo, hosted on GitHub Pages, served via Cloudflare at [sierraarevalo.com](https://sierraarevalo.com).

---

## Stack

| Layer | Tool |
|---|---|
| Static site generator | Hugo 0.157.0 (extended), pinned in `.github/workflows/deploy.yml` |
| Theme | [Adritian](https://github.com/zetxek/adritian-free-hugo-theme) v1.9.8 via Hugo modules |
| CSS | Bootstrap 5 (via npm) + custom palette in `assets/css/custom.css` |
| Hosting | GitHub Pages, deployed via GitHub Actions on push to `main` |
| DNS / CDN | Cloudflare (apex domain, SSL) |
| Forms | Formspree (contact form, no server needed) |
| Analytics | Cloudflare Web Analytics |

---

## Local Development

```bash
# First-time setup
hugo mod tidy && npm install

# Dev server (always use --disableFastRender to avoid stale HTML)
hugo server --buildDrafts --disableFastRender

# Production build
hugo --minify
```

The site runs at `http://localhost:1313` by default. If you get a port conflict:

```bash
lsof -ti :1313 | xargs kill -9
```

---

## Deployment

Push to `main` → GitHub Actions builds and deploys automatically via `.github/workflows/deploy.yml`.

Site data and `cv.pdf` are synced into this repo from a separate private repository that manages CV content. Do not edit `data/` files directly here — they will be overwritten on the next sync.

---

## Architecture

All substantive content lives in `data/` YAML files. Files in `content/` are routing stubs only — they carry front matter but no prose. The Hugo templates in `layouts/` read from `data/` to render every page.

```
content/
  home/home.md                          # Homepage (about text, contact shortcodes)
  book/_index.md                        # Stub — content in data/book.yaml
  research/_index.md                    # Stub — content from data/publications.yaml + data/project_cards.yaml
  writing/_index.md                     # Stub — content in data/writing.yaml
  media/_index.md                       # Stub — content in data/media.yaml
  research/everyday-respect/index.md    # Stub — content in data/projects/everyday-respect.yaml
  research/aces/index.md                # Stub — content in data/projects/aces.yaml
  research/pfie/index.md                # Stub — content in data/projects/pfie.yaml
```

### Data files

```
data/
  publications.yaml       # All publications: articles, working papers, chapters, journalism, etc.
                          # Each entry has a sequential integer id, category, authors, year,
                          # title, journal/outlet, URL, abstract, tags, and optional project slug.

  media.yaml              # All media appearances: press, podcasts, TV/film.
                          # Each entry has a sequential integer id, type, outlet, title, date, URL.

  writing.yaml            # Op-eds, essays, and journalism for the Writing page.

  book.yaml               # Book page content: description, awards, endorsements, reviews.

  project_cards.yaml      # Short project summaries shown as cards on the Research page.
                          # Each card links to a dedicated project page via its slug.

  projects/
    everyday-respect.yaml # Full content for the Everyday Respect project page:
                          # description, hero image, SVG icon, buttons, media_ids list.
    aces.yaml             # Full content for the ACES project page.
    pfie.yaml             # Full content for the PFIE project page.

static/
  files/cv.pdf            # Downloadable CV — synced in from the private cv repo; not edited here.
```

### How publications connect to project pages

Publications in `publications.yaml` carry an optional `project` field (e.g., `project: pfie`). The project page template automatically discovers and displays all publications tagged with its slug — no changes to the project YAML are needed when a new paper is added.

Media appearances work differently: a media item's integer `id` must be explicitly added to the `media_ids` list in the relevant project YAML to appear on that project page.

### Layouts

```
layouts/
  research/single.html    # Project detail page (hero image, description, papers, media)
  research/list.html      # Research index (project cards + full publications list)
  writing/list.html       # Writing page
  book/list.html          # Book page
  media/list.html         # Media page
  partials/
    collect-tags.html     # Returns sorted unique tag list from a publication slice
    pub-list-item.html    # Renders a single publication row (tags + abstract toggle)
```

---

## Color Palette

| Role | Name | Hex |
|---|---|---|
| Background | Ethereal Ivory | `#E4E4DE` |
| Surfaces / nav | Sophisticated Sage | `#C4C5BA` |
| Primary text | Eerie Black | `#1B1B1B` |
| Accents / links / headings | Muted Moss | `#595f39` |

Dark mode variants are defined in `assets/css/custom.css` under `[data-bs-theme="dark"]`.

---

## CSS Notes

- `custom.css` loads **before** Bootstrap/theme CSS. Use `!important` only when Bootstrap is overriding a custom rule.
- The Adritian theme injects fake bullets on `.section ul li` via `::before` pseudo-elements. Suppress with `content: none !important` — `list-style: none` has no effect on these.
- Dark mode: target with `[data-bs-theme="dark"]`. CSS variables defined in `:root` must be re-declared there.

## Hugo Notes

- Hugo data file filenames with hyphens (e.g. `everyday-respect.yaml`) are accessed via `index site.Data.projects "everyday-respect"` — the `index` function preserves hyphens. Dot-notation access converts hyphens to underscores.
- Images in `assets/images/` are processed via `resources.Get` (Hugo image pipeline). Images in `static/images/` are served as-is by URL. Project card templates use `static/` via direct URL; project page hero images use `assets/` via `resources.Get`.
- Always use `substr` not `slice` for string extraction: `{{ substr .date 0 4 }}` → `2024`.
