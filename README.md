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

The landing page lives at `public/index.html`. The detailed Lumen 1.2.3 guide
lives at `public/help/index.html`; at ship, every current download link must
point to the Lumen 1.2.3 GitHub Release asset. The full in-site Privacy Policy lives at
`public/privacy/index.html` and mirrors the policy compiled into the app. Keep
each page's release copy aligned with the downloadable DMG.

## Deployment

`.github/workflows/deploy-pages.yml` validates and deploys `public/` whenever
`main` changes. The custom domain is configured in GitHub Pages settings rather
than with a repository `CNAME` file; the Actions deployment does not require a
`.nojekyll` file.

The release branch is not a preview environment. A push to `release/*`
does not deploy, but a push, merge or fast-forward that reaches `main` starts
the Pages workflow and therefore crosses the deploy boundary. Do not manually
dispatch the Pages workflow from a staging branch.

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

## Release gate

The static tests describe the staged copy. `npm run release:gate` is the
separate ship gate: it fails while any pending release or policy token remains,
or unless `public/updates/appcast.xml` is a non-empty regular file with the
expected marketing version, a canonical numeric build strictly newer than the
last shipped build, canonical GitHub Release URL, exact positive byte length
and EdDSA signature attribute. The Pages workflow runs both checks before it
uploads `public/`.

For each release:

1. Obtain both review greenlights on the non-deploying release branch.
2. Build, sign and notarise the DMG, publish its GitHub Release asset, and verify
   the asset's byte count and SHA-256 locally and after download.
3. Replace every pending artefact value with that release's URL, display size,
   exact byte size, build, checksum and date. Re-pin the release gate's
   expected marketing version and canonical GitHub Release path for the new
   release. Set `lastShippedBuild` to the build of the release immediately
   preceding the candidate, never to the candidate being prepared.
4. Regenerate both hosted policy pages from the final
   `PrivacyPolicy.markdown`, using the one effective date chosen at ship.
5. Add the generated, signed appcast at `public/updates/appcast.xml`.
6. Run the static tests, release gate, both local policy gates and the checksum
   verification. Obtain both greenlights again on this final ship delta.
7. Merge or push the reviewed site commit to `main`, then merge the matching
   policy-mirror commit to its `main`; wait for both Pages deployments.
8. Run both policy gates against the live URLs, verify the live appcast and
   download checksum, and confirm the legacy `/Lumen-1.1.dmg` URL still works.
