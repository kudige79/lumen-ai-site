# Lumen website

The public download site for **Lumen**, a free, local-first file renamer for
macOS. The site is a single responsive Next.js page exported statically for
GitHub Pages. The existing OpenAI Sites build is retained temporarily as a
rollback while the GitHub Pages deployment and `lumen-ai.eu` are verified.

## Local development

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
npm test
npm run test:pages
```

- `npm test` verifies the existing Sites worker build.
- `npm run test:pages` verifies the static GitHub Pages export in `out/`.

## Deployment

`.github/workflows/deploy-pages.yml` builds and deploys `out/` whenever `main`
changes. The custom domain is configured in GitHub Pages settings rather than
with a repository `CNAME` file.

## Release assets

- `public/Lumen-1.1.dmg` is the signed and notarised release artefact.
- `public/lumen-icon.png` and `public/favicon.png` are web exports of the
  shipped app icon.
- The published checksum must match the DMG whenever the release is replaced.

The app version, minimum macOS version, download size, local-model requirements
and privacy wording are intentionally explicit in `app/page.tsx`. Update them
together when a new Lumen release is published.
