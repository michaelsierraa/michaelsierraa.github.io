# sierraarevalo.com

Personal academic website for Michael Sierra-Arévalo. Built with Hugo, hosted on GitHub Pages, served via Cloudflare at [sierraarevalo.com](https://sierraarevalo.com).

---

## Stack

| Layer | Tool |
|---|---|
| Static site generator | Hugo 0.157.0 (extended), pinned in `.github/workflows/deploy.yml` |
| Theme | [Adritian](https://github.com/zetxek/adritian-free-hugo-theme) v1.9.8 via Hugo modules |
| CSS | Bootstrap 5 (via npm) + custom palette in `assets/css/custom.css` |
| Hosting | GitHub Pages, deployed via GitHub Actions on push to `main` |
| DNS / CDN | Cloudflare (apex domain, SSL, redirect from dangerimperative.com) |
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

The site runs at `http://localhost:1313` by default. If you get a port conflict, kill old servers first:

```bash
lsof -ti :1313 | xargs kill -9
```

---

## Deployment

Push to `main` → GitHub Actions builds and deploys automatically. The workflow is at `.github/workflows/deploy.yml`.

To enable deployment (currently disabled): set `if: true` on the deploy job at line 60 of the workflow file.

---

## Architecture

All substantive content lives in `data/` YAML files. Files in `content/` are routing stubs only — they contain front matter but no prose. Edit data files, not content files, for all site content.

```
content/
  home/home.md                          # Homepage shortcodes (headshot, about, contact)
  book/_index.md                        # Stub — content in data/book.yaml
  research/_index.md                    # Stub — content driven by data/publications.yaml + data/project_cards.yaml
  writing/_index.md                     # Stub — content in data/writing.yaml
  media/_index.md                       # Stub — content in data/media.yaml
  research/everyday-respect/index.md    # Stub — content in data/projects/everyday-respect.yaml
  research/aces/index.md                # Stub — content in data/projects/aces.yaml
  research/pfie/index.md                # Stub — content in data/projects/pfie.yaml

data/
  publications.yaml                     # All publications (articles, working papers, datasets)
  media.yaml                            # All media appearances
  writing.yaml                          # Op-eds, essays, journalism
  book.yaml                             # Book page content
  project_cards.yaml                    # Project cards on the Research page grid
  projects/
    everyday-respect.yaml               # Everyday Respect project page content
    aces.yaml                           # ACES project page content
    pfie.yaml                           # PFIE project page content

assets/
  css/custom.css                        # Palette overrides and all custom styling
  js/publication-filter.js              # Tag filter and abstract toggle logic
  images/                               # All images (processed via Hugo pipeline)

static/
  CNAME                                 # sierraarevalo.com
  files/cv.pdf                          # Downloadable CV
  images/                               # Static images served as-is (project card images)

layouts/
  research/single.html                  # Project detail page template
  research/list.html                    # Research index page template
  writing/list.html                     # Writing page template
  book/list.html                        # Book page template
  media/list.html                       # Media page template
  partials/
    collect-tags.html                   # Returns sorted unique tag list from a publication slice
    pub-list-item.html                  # Renders a single publication list item (tags + abstract toggle)
    showcase.html                       # Homepage hero section
    contact.html                        # Contact form section
    selector-theme.html                 # Light/dark/auto theme toggle
    breadcrumb.html                     # Breadcrumb nav for detail pages
  shortcodes/
    scholar-link.html                   # Google Scholar icon link
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

## How to Edit Content

### Update the CV
Replace `static/files/cv.pdf` with the new file (same filename) and push.

### Edit the About Me / Homepage
Edit `content/home/home.md`. The about text is the `content` parameter of the `about-section` shortcode. It renders raw HTML, so use `<a>`, `<em>`, `<br>` etc. directly.

### Edit the Book Page
Edit `data/book.yaml`. Fields: `title`, `subtitle`, `cover_image`, `description`, `purchase_url`, `awards`, `blurbs`, `media_ids`.

### Add a Publication

Add an entry to `data/publications.yaml`. Required fields:

```yaml
- id: <next integer>          # sequential, check the last entry for current max
  category: article           # article | working_paper | dataset
  authors: "Last, F., & Last, F."
  year: 2024
  title: "Title of the Paper"
  journal: "Journal Name"
  volume: "52"                # optional
  issue: "3"                  # optional
  pages: "100-120"            # optional
  url: "https://..."          # optional
  tags:                       # optional, use kebab-case
    - police-culture
    - use-of-force
  abstract: |                 # optional
    Abstract text here.
  project: everyday-respect   # optional — links paper to a project page
  status: forthcoming         # optional — use for forthcoming articles
  reprint: "Reprinted in..."  # optional
  notes: "Winner of..."       # optional
```

To make a paper appear on a project page, add `project: <slug>` where slug matches the project directory name (`everyday-respect`, `pfie`, `aces`).

### Add a Working Paper

Same as above but use `category: working_paper`. The citation will display "(Working Paper)" instead of a year. Working papers appear in a separate "Papers" section on project pages.

### Add a Dataset

Same structure, use `category: dataset`. Requires `publisher` and `doi` fields:

```yaml
- id: <next integer>
  category: dataset
  authors: "..."
  year: 2026
  title: "Dataset Title"
  publisher: "OSF"
  doi: "10.17605/OSF.IO/XXXXX"
  url: "https://doi.org/10.17605/OSF.IO/XXXXX"
  project: pfie
```

### Add a Media Appearance

Add an entry to `data/media.yaml`:

```yaml
- id: <next integer>          # sequential
  title: "Article or segment title"
  outlet: "Outlet Name"
  url: "https://..."
  date: "2024-03-15"
  category: press             # press | podcast_radio | tv_film
```

To link a media item to a project page, add the `id` to the `media_ids` list in the project's YAML file (e.g., `data/projects/everyday-respect.yaml`).

**Current ID counts:** publications `id` 1–48, media `id` 1–111. New entries always get the next integer.

### Add a Writing Item

Add an entry to `data/writing.yaml`:

```yaml
- title: "Piece Title"
  outlet: "Texas Monthly"
  url: "https://..."
  date: "2024-06"
  format: op-ed               # journalism | op-ed | essay | policy-brief
  tags:
    - policing
    - policy
```

---

## How to Add a New Project Page

1. **Create the content stub:**

```bash
mkdir content/research/<slug>
```

Create `content/research/<slug>/index.md`:

```yaml
---
title: "Project Title"
project_id: "<slug>"
---
```

2. **Create the data file** at `data/projects/<slug>.yaml`:

```yaml
image: "images/<slug>.jpg"        # path relative to assets/
icon_viewbox: "0 0 16 16"         # SVG viewBox for the h1 icon
icon_paths: '<path d="..."/>'     # inline SVG path data from Bootstrap Icons

description: |
  Project description in Markdown.

buttons:
  - label: "Button Label"
    url: "https://..."
    icon_paths: '<path d="..."/>'  # optional icon

media_ids: []                      # list of media.yaml id integers
```

3. **Add the project card** to `data/project_cards.yaml`:

```yaml
- id: <slug>
  title: "Project Title"
  description: "One-sentence description."
  status: active
  collaborators: "Name, Name"      # optional
  image: images/<slug>.jpg         # relative to static/
  url: /research/<slug>/
```

4. **Add images:** project card image goes in `static/images/`, hero image goes in `assets/images/` (same file can live in both).

5. **Tag publications** to the project by adding `project: <slug>` to entries in `data/publications.yaml`.

---

## CSS Notes

- `custom.css` loads **before** Bootstrap/theme CSS. Use `!important` only when Bootstrap is overriding a custom rule.
- The Adritian theme injects fake bullets on `.section ul li` via `::before` pseudo-elements. Suppress with `content: none !important` — `list-style: none` has no effect on these.
- Dark mode: target with `[data-bs-theme="dark"]`. CSS variables defined in `:root` must be re-declared there.

## Hugo Notes

- Hugo data file filenames with hyphens (e.g. `everyday-respect.yaml`) are accessed via `index site.Data.projects "everyday-respect"` — the `index` function preserves hyphens. Dot-notation access (`site.Data.foo_bar`) converts hyphens to underscores, so data files in `data/` should use underscores in their names.
- Images in `assets/images/` are processed via `resources.Get` (Hugo image pipeline). Images in `static/images/` are served as-is by URL. Project card templates use `static/` via direct URL; project page hero images use `assets/` via `resources.Get`.
- Always use `substr` not `slice` for string extraction: `{{ substr .date 0 4 }}` → `2024`.
