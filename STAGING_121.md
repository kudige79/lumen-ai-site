# Lumen 1.2.1 website staging record

**Status:** FINAL SHIP VALUES RESOLVED; LOCAL GATES PASS; DEPLOYMENT PENDING

**Website repository:** `kudige79/lumen-ai-site`

**Staging branch:** `release/1.2.1`

**Base:** `185a5c414742fddcee47b855c30c30c2069b2ce1` (`origin/main`)

**F1 policy source inspected read-only:**
`b1699e8de921a5b714527e34599227236af80126` (unchanged at current app HEAD
`d08014a38446beec715e3a6bc0a69c17b280e5cc`)

**Mirror repository:** `kudige79/lumen-privacy`, staged separately on
`release/1.2.1` from `381a059e58fe4b07218f727aeed53d610f83892e`

## 1. Deploy boundary

`.github/workflows/deploy-pages.yml` runs on every push to `main`, validates
the repository, uploads `public/`, and deploys it to GitHub Pages. A merge,
fast-forward or direct push that reaches `main` therefore equals a deployment
attempt. The workflow can also be started manually, so it must not be
dispatched from this staging branch.

A push of `release/1.2.1` alone does not trigger that workflow. It remains
non-deploying until both reviewers have greenlit the staged copy and the final
ship delta. The new release gate runs before Pages uploads anything and exits
non-zero while an artefact/policy marker remains or the appcast is missing.

The mirror is a different repository. GitHub's generated Pages workflow serves
its `main` branch. Its `release/1.2.1` branch is non-deploying; a push or merge
to the mirror's `main` is its separate deploy boundary.

## 2. Sources and sequencing

- The local `website/` checkout is the `release/1.2.1` branch through F1
  synchronisation commit `5b178c4`, above pushed `origin/main` `185a5c4`,
  with this reviewed final ship delta on top. Before that delta, its only dirty
  entries were the two pre-existing untracked generated trees
  `.wrangler/` (52 KB cache/configuration state) and `dist/` (21 MB prior build
  output, including JavaScript and a copied legacy DMG). Neither residue enters
  this proposal; the new `public/updates/appcast.xml` is an intentional tracked
  release file, not a third residue.
- Current large-PDF behaviour and consent copy: `CloudConsentModal.swift`,
  `SettingsView.swift`, `UserGuide.swift`, `PDFExtractor.swift` and
  `JobOrchestrator.swift` at current app HEAD `d08014a`.
- Updater disclosure gold copy: `SettingsView.swift` as incorporated into F1.
- Current legal source: `PrivacyPolicy.swift` at `b1699e8`, unchanged at current
  app HEAD. F1 has landed: the policy now contains the truthful §1/§2 wording
  and final §12 software-update disclosure. Both staged HTML bodies project
  those exact 49 blocks.
- The effective date is final at **7 August 2026**, matching both fields in the
  policy embedded in the signed Lumen 1.2.1 build.
- The public GitHub Release is live. Its DMG is 21,615,590 bytes, has SHA-256
  `ab23bbf99c9d08c16b502ce16d2898dd27fceb90c01513297f4825d9d662eb15`,
  and is byte-identical to the notarised local artefact. The generated appcast
  is copied byte-for-byte from the app repository and has SHA-256
  `0c59484cb049c756eeb6b36f44cc02cbdfc6ca2ade5abd6db2ef72b17d352665`.

The F1 body copy and effective date are final in both staged policy copies.
Both local policy gates report 49/49 blocks with zero differences.

## 3. Staged-versus-live diff

### `kudige79/lumen-ai-site`

| File | Staged change from live 1.2 |
|---|---|
| `.github/workflows/deploy-pages.yml` | Runs the release-readiness gate after static tests and before the Pages artefact is uploaded. |
| `README.md` | Describes the 1.2.1 source files, exact deploy boundary and permanent cross-repository release checklist. The 1.1 preservation rule and “from 1.2 onward” GitHub Releases rule remain. |
| `STAGING_121.md` | Adds this audit/deployment trail. |
| `package.json` | Adds the dependency-free `release:gate` command. |
| `public/index.html` | Publishes the verified 1.2.1 URL, build 4, 20.6-MB display size, checksum and 16 August 2026 release date; corrects all current provider, cloud-summary and FAQ large-PDF claims; scopes the account/tracking statement around the separate updater path; makes session/cleanup prose version-neutral; adds two explicitly non-exhaustive 1.2.1 website-impact highlights; moves 1.2 to Previous release. The full historical 1.2 entry, including its then-true upload route, is unchanged. |
| `public/help/index.html` | Publishes all guide metadata/chrome at 1.2.1 build 4; corrects the Unprocessed, privacy and troubleshooting large-PDF text; removes the unsafe no-server absolute; adds a Software updates section using the Settings gold copy verbatim. |
| `public/privacy/index.html` | Projects F1's exact §1, §2 and numbered §12 into the already-audited policy body; restores final 1.2.1 chrome and contents labels; publishes the canonical 7 August 2026 effective date. |
| `public/updates/appcast.xml` | Byte-identical copy of the generated 795-byte Sparkle appcast from `Lumen/dist/appcast.xml`; points build 4 at the verified public DMG. |
| `scripts/release-gate.mjs` | Lists every complete or truncated pending token as `file:line`, rejects surviving staging-only privacy phrases, and exits 1 until the expected release fields and a structurally expected Sparkle appcast agree. It checks the marketing version, canonical repository/tag/filename path, exact numeric build and byte length, Sparkle namespace and version elements, and the shape of the EdDSA enclosure-signature attribute. |
| `tests/static-site.test.mjs` | Re-pins every final release value and the exact appcast SHA-256, locks the final policy chrome/§2/§12 copy, retains the adversarial appcast fixtures and keeps the 1.2 changelog and 1.1 binary locks unchanged. |

### `kudige79/lumen-privacy`

| File | Staged change from live 1 August copy |
|---|---|
| `index.html` | Preserves all HTML chrome and WEB-1's stable `https://lumen-ai.eu/` Download links; projects F1's exact §1, §2 and numbered §12; publishes the canonical 7 August 2026 effective date. |
| `support.html` | Removes the stale “nothing leaves”, “one-time” consent/download, permanent-folder-grant and unconditional iWork-preview claims; adds the updater disclosure and narrows intake/revert wording to supported and eligible files. |

The mirror is confirmed to live in `kudige79/lumen-privacy`, not the main site
repository.

## 4. Claim-to-code audit

| Changed statement and surfaces | Evidence at app `b1699e8` / current HEAD | Boundary kept in the copy |
|---|---|---|
| **Home model cards, cloud summary, FAQ; Help Unprocessed/privacy/troubleshooting; both staged policies:** an accepted PDF above about 30 MB is reduced locally to a temporary copy of up to the first five pages. | `CloudConsentModal.swift:208-214`; `PDFExtractor.swift:42-46,220-290`; `JobOrchestrator.swift:2661-2681`. | “Up to” is a ceiling; the copy never promises five pages exist or contain enough identifying text. |
| **Home and Help:** all five analysers can use locally extracted excerpt text for an accepted oversized PDF. | `JobOrchestrator.swift:2831-2835`; `UserGuide.swift:103,169`. | Copy says the analyser *can use* the text, not that every document will be named. Ordinary confidence/Unprocessed routing still applies. |
| **Home, Help and both staged policies:** only a weak Claude/OpenAI document result may send native bytes; an ordinary PDF may send its original inline, an oversized PDF may send only its excerpt, and an image document may send a re-encoded copy. | `CloudConsentModal.swift:224-232`; `JobOrchestrator.swift:2857-2877`; provider `supportsNativeFiles`. | Every occurrence keeps the inline request guard. Gemini/xAI are described as document-text-only, not globally text-only, because cloud photo captions can send re-encoded images. |
| **Home, Help and both policies:** the whole accepted large PDF is no longer uploaded by the production route; temporary excerpts are cleaned up after the attempt and again at launch if interrupted. | `PrivacyPolicy.swift` §4.1(a)/(b); `JobOrchestrator.swift:2661-2681,2831-2877`; `DocumentRenamerApp.swift:36-44,88-126`; no production caller constructs `.filesAPIPDF`. | Historical 1.2 changelog and legacy cleanup prose remain because older builds really did upload. |
| **Help:** files above roughly 500 MB are skipped, while the about-30-MB threshold selects the excerpt route rather than Unprocessed. | `UserGuide.swift:103,169`; the orchestrator intake-size cap and oversized-PDF routing. | The two thresholds are not conflated; “roughly” and “about” remain. |
| **Home and Help:** “Cloud only by choice”/“no developer-operated servers” is narrowed to optional cloud **AI**, no Lumen account and no analytics/advertising/tracking, with the separate updater request called out. | `SettingsView.swift:697-719`; `Info.plist` updater defaults; `RELEASE_AUDIT_121.md` F1/F2/F5. | No general no-network/no-server guarantee survives. “No document content” remains scoped to default document analysis or the update request. |
| **Help, home highlights, both staged policies and mirror Support:** checks are on by default, run after launch only when a daily check is due, identify Lumen/version, and expose IP/time to the server without document data or a Mac system profile. | Exact Settings gold paragraph incorporated by `b1699e8`; `Info.plist:9-24`; `UpdateController.swift:62-100`. | The gold paragraph is verbatim. The separate lead locates the control at Settings → Advanced → Software Updates; the copy does not claim anonymity. |
| **Help, home highlights, both staged policies and mirror Support:** available updates download from GitHub Releases; automatic checks can be disabled and a manual menu check remains; download/install stay user-chosen. | `SettingsView.swift`; `DocumentRenamerApp.swift:71-75`; `SUAutomaticallyUpdate = NO`; `SUAllowsAutomaticUpdates = NO`. | The `lumen-ai.eu` appcast host is distinguished from the GitHub asset host; no silent download/install is implied. |
| **Both staged policies:** the truthful §1/§2 wording, Z15 clauses, legacy-cleanup paragraph, §6(e) operational records and numbered §12 updater disclosure are transcribed from the current Swift constant. | All 49 blocks of `PrivacyPolicy.markdown` at `b1699e8`, unchanged at current HEAD. | Both local gates report `differing=0`; no F1 body or chrome marker remains. |
| **Both staged policy copies:** the effective date is 7 August 2026. | Both the constant and Markdown date in the signed build's `PrivacyPolicy.swift` say 7 August 2026. | Both HTML copies use that exact date; the local policy gates report zero body or header differences. |
| **Home changelog:** two website-impact items are labelled “Highlights in 1.2.1”, not a complete release inventory. | Z15 and UPD-1 entries in `APP_STORE_COMPLIANCE_ROADMAP.md`; this round's explicit scope. | A10, Z12, Z10, Z9, ITR, AF and other app work is not falsely represented as absent; full release notes remain a release artefact. The highlight block is copy-hashed. |
| **Home changelog:** 1.2 becomes Previous release while its then-true Files-API history remains unchanged. | Shipped 1.2 behaviour and the existing locked 1.2 digest; Z15 landed only for 1.2.1. | Historical truth is not rewritten into current behaviour. |
| **Mirror Support:** cloud analysis is optional/off by default and uses the user's key; consent is shown before the first file-related transmission to each provider, materially changed disclosures are shown again, and photo naming has separate consent. | `CloudConsentModal.swift`; `AppSettings` consent-version/revocation paths. | The wording leaves the user-invoked key-test probe outside file-egress consent, as the app does. “One-time” is removed; the separate default-on updater is disclosed immediately below. |
| **Mirror Support:** Local AI needs Apple silicon, 24 GB+ memory and an approximately 8.26-GB model download. | `UserGuide.swift`/`SettingsView.swift` Local AI requirements and model metadata. | “One-time” is removed because models can be removed, re-downloaded or revised. |
| **Mirror Support:** selected-file/folder access is sandbox-scoped and macOS may ask again; iWork is read from an embedded PDF/image preview only when available; revert applies to eligible prior files. | `AppSettings.ensureFolderAccessForRename`; security-scoped bookmark flow; `FileWalker`/iWork preview extraction; `RevertLogStore`. | No permanent-grant, guaranteed-preview, process-everything or undo-everything absolute remains. |
| **All current chrome:** 1.2.1 build 4 is the current download, using the public versioned GitHub Release asset. | Public Release API plus a fresh authenticated download: 21,615,590 bytes and SHA-256 `ab23bbf99c9d08c16b502ce16d2898dd27fceb90c01513297f4825d9d662eb15`. | The page uses the established binary-size display convention (`20.6 MB`), while the gate and appcast lock the exact byte count. The 1.1 legacy artefact remains independently locked. |

## 5. Final release-value census

All 27 main-site marker occurrences and the mirror's one date marker are
resolved. The release gate scans deployable/public copy, tests, workflow
metadata, README and package metadata and reports no pending or truncated
token and no provisional privacy phrase.

The final values are locked at every former marker site:

- eight download anchors use the canonical `v1.2.1` GitHub Release asset;
- Home publishes `20.6 MB`, build `4`, the exact DMG SHA-256 and the
  `2026-08-16` / `16 August 2026` release date;
- Help publishes build `4` and the same release URL;
- both privacy copies publish `7 August 2026`;
- the site gate pins build `4`, `21615590` bytes and the canonical URL; and
- the static suite pins every value plus the exact appcast SHA-256.

The mirror still deploys directly from its `main` branch and has no pre-upload
CI hook. It may move only with the main policy deployment after its local gate
passes, which it now does.

## 6. `/updates/` decision

The public 1.2.1 Release asset was published and verified first. The generated
795-byte appcast is now staged byte-for-byte at `public/updates/appcast.xml` for
the same deployment as the 1.2.1 site. Its enclosure URL, build, exact length
and Ed25519 signature pass the app's independent release gate. The production
endpoint remains a deliberate 404 until the reviewed main-site commit deploys.

The already-public `v1.2.1` tag points to the pre-cutover site base `185a5c4`
because the Release asset had to exist before the appcast/site deployment.
This does not affect the DMG asset, its stable URL or Sparkle. The public tag is
not silently moved after publication.

## 7. Ship checklist

The shorthand “merge, then fill placeholders” cannot be literal here: a main
merge is the deployment boundary. The safe order and current state are:

1. [x] Obtain Codex and Claude greenlights on the staged copy and F1 delta.
2. [x] Apply the canonical 7 August 2026 policy date to both staged copies;
   both local policy gates exit 0.
3. [x] Build/sign/notarise 1.2.1 and publish the GitHub Release asset first.
4. [x] Verify a fresh public download byte-for-byte, then fill every site,
   test and release-gate value from that exact artefact.
5. [x] Copy Round B's generated appcast byte-for-byte and verify its namespace,
   version/build elements, enclosure URL, length and Ed25519 signature.
6. [x] Run lint, static tests, the release gate, both local policy gates,
   local/remote checksum comparison and the app's cryptographic release gate.
7. [x] Complete the final value/copy adversarial review.
8. [ ] Merge/push the main-site release commit to `main` (this starts
   deployment), then merge/push the matching mirror commit to its `main`.
9. [ ] Wait for both Pages builds; run both live policy gates; verify the live
   appcast and 1.2.1 checksum; confirm the stable `/Lumen-1.1.dmg` URL.

## 8. Verification at staging

- Baseline `npm test`: 15/15 passed at `185a5c4`.
- Final `npm run lint`: passed.
- Final `npm test`: 16/16 passed, including the exact HTML-file set,
  zero-JavaScript locks, both changelog digests, and adversarial appcast
  validator cases.
- Final `npm run release:gate`: passed with no marker, expectation or appcast
  failure.
- Both local policy gates: passed with
  `blocks: swift=49 html=49 differing=0 date=ok title=ok`.
- Public DMG comparison: a fresh download is byte-identical to the notarised
  local DMG at 21,615,590 bytes and the published SHA-256.
- App release gate: 8/8 passed, including Ed25519 verification against the
  embedded public key and rejection of a one-byte-tampered DMG.
- Appcast identity: the staged file is byte-identical to `Lumen/dist/appcast.xml`
  and hashes to `0c59484cb049c756eeb6b36f44cc02cbdfc6ca2ade5abd6db2ef72b17d352665`.
- Codex adversarial copy review: **passed** after three independent scope, copy
  and release-gate attacks; all concrete findings were corrected and re-checked.
- Claude's word-by-word greenlight covers the staged copy and F1 clearance;
  the user supplied and approved the exact final release values.

## 9. Deliberately untouched

- The Lumen app repository: no Swift, app documentation, roadmap, version or
  build setting is modified by this website round.
- `public/Lumen-1.1.dmg`: preserved byte-for-byte at its stable URL; its size
  and SHA-256 locks remain.
- The full historical Lumen 1.2 changelog copy and digest, including the
  upload behaviour that was true in 1.2.
- `public/og.png`, icons, CSS, sitemap, robots file and 404 page.
- Mirror HTML chrome, including WEB-1's stable landing-page Download links;
  only the F1 policy-body sync, final effective date and the already-audited
  Support copy change.
- The generated appcast is copied, not regenerated or reformatted, in the site
  repository. The 1.2.1 DMG itself remains hosted only by GitHub Releases.
- Both `release/1.2.1` branches remain non-deploying until the final commits are
  pushed to their respective `main` branches.
- The canonical site's untracked `.wrangler/` and `dist/` trees: both remain
  untouched and excluded from the proposal.
