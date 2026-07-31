# Lumen website

The public download and help site for **Lumen**, a free, local-first file
renamer for macOS. The canonical site is a responsive, zero-JavaScript HTML5
site published at [lumen-ai.eu](https://lumen-ai.eu) through GitHub Pages.

This repository (`kudige79/lumen-ai-site`) is the single source of truth for the
public product site. The site uses native HTML disclosures and links, with no
framework or generator; Lumen adds no cookies or analytics.

## Local development

Requires Node.js 22.13 or later.

```bash
npm ci
npm run lint
npm run test:pages
```

For an optional browser preview, if Python 3 is installed:

```bash
python3 -m http.server 8080 --directory public
```

Then open `http://localhost:8080`. The tests do not require Python; they check
the product copy, metadata, internal links, native disclosures, social card,
download size and checksum.

The landing page lives at `public/index.html`. The detailed guide for the
current public release lives at `public/help/index.html`; update its visible
version boundary and app instructions whenever a new Lumen release ships.

## Deployment

`.github/workflows/deploy-pages.yml` validates and deploys `public/` whenever
`main` changes. The custom domain is configured in GitHub Pages settings rather
than with a repository `CNAME` file; the Actions deployment does not require a
`.nojekyll` file.

## Release assets

- `public/Lumen-1.1.dmg` is the signed and notarised release artefact.
- `public/lumen-icon.png` and `public/favicon.png` are web exports of the
  shipped app icon.
- `public/og.png` is the 1200 × 630 social-preview card.
- The published checksum must match the DMG whenever the release is replaced.

The app version, minimum macOS version, download size, local-model requirements
and privacy wording are intentionally explicit in `public/index.html`. Update
them together when a new Lumen release is published.

Lumen 1.1 remains bundled here so its existing download URL stays stable. From
Lumen 1.2 onward, publish versioned installers through GitHub Releases and point
the website download links at the matching release asset, avoiding further
binary growth in this repository’s history.
