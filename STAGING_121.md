# Lumen 1.2.1 website staging record

**Status:** STAGED FOR DUAL REVIEW; NOT DEPLOYABLE

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

- The local `website/` checkout is the committed `release/1.2.1` branch at
  `5b5c794`, two commits above pushed `origin/main` `185a5c4`. Its tracked tree
  is clean. Its two pre-existing dirty entries are untracked generated trees:
  `.wrangler/` (52 KB cache/configuration state) and `dist/` (21 MB prior build
  output, including JavaScript and a copied legacy DMG). Neither residue enters
  this proposal.
- Current large-PDF behaviour and consent copy: `CloudConsentModal.swift`,
  `SettingsView.swift`, `UserGuide.swift`, `PDFExtractor.swift` and
  `JobOrchestrator.swift` at current app HEAD `d08014a`.
- Updater disclosure gold copy: `SettingsView.swift` as incorporated into F1.
- Current legal source: `PrivacyPolicy.swift` at `b1699e8`, unchanged at current
  app HEAD. F1 has landed: the policy now contains the truthful §1/§2 wording
  and final §12 software-update disclosure. Both staged HTML bodies project
  those exact 49 blocks.
- The effective date remains a pending user decision. Both hosted copies keep
  the same explicit date token until the single ship date is chosen.
- Release artefact values and the signed appcast do not exist yet. They are
  deliberately represented by fail-closed tokens.

The F1 body copy is now final in both staged policies. The only deliberate
policy difference from `PrivacyPolicy.markdown` is the pending effective date.

## 3. Staged-versus-live diff

### `kudige79/lumen-ai-site`

| File | Staged change from live 1.2 |
|---|---|
| `.github/workflows/deploy-pages.yml` | Runs the release-readiness gate after static tests and before the Pages artefact is uploaded. |
| `README.md` | Describes the 1.2.1 source files, exact deploy boundary and permanent cross-repository release checklist. The 1.1 preservation rule and “from 1.2 onward” GitHub Releases rule remain. |
| `STAGING_121.md` | Adds this audit/deployment trail. |
| `package.json` | Adds the dependency-free `release:gate` command. |
| `public/index.html` | Stages 1.2.1 labels and artefact tokens; corrects all current provider, cloud-summary and FAQ large-PDF claims; scopes the account/tracking statement around the separate updater path; makes session/cleanup prose version-neutral; adds two explicitly non-exhaustive 1.2.1 website-impact highlights; moves 1.2 to Previous release. The full historical 1.2 entry, including its then-true upload route, is unchanged. |
| `public/help/index.html` | Stages all guide metadata/chrome at 1.2.1; corrects the Unprocessed, privacy and troubleshooting large-PDF text; removes the unsafe no-server absolute; adds a Software updates section using the Settings gold copy verbatim. |
| `public/privacy/index.html` | Projects F1's exact §1, §2 and numbered §12 into the already-audited policy body; restores final 1.2.1 chrome and contents labels; keeps only the effective-date token. |
| `scripts/release-gate.mjs` | Lists every complete or truncated pending token as `file:line`, rejects surviving staging-only privacy phrases, and exits 1 until the expected release fields and a structurally expected Sparkle appcast agree. It checks the marketing version, canonical repository/tag/filename path, exact numeric build and byte length, Sparkle namespace and version elements, and the shape of the EdDSA enclosure-signature attribute. |
| `tests/static-site.test.mjs` | Re-pins the F1 policy digest and remaining marker counts, locks the final chrome/§2/§12 copy, retains the adversarial appcast fixtures and keeps the 1.2 changelog and 1.1 binary locks unchanged. |

### `kudige79/lumen-privacy`

| File | Staged change from live 1 August copy |
|---|---|
| `index.html` | Preserves all HTML chrome and WEB-1's stable `https://lumen-ai.eu/` Download links; projects F1's exact §1, §2 and numbered §12; keeps only the effective-date token. |
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
| **Both staged policies:** the effective date remains provisional. | Ship-date decision is still pending; `PrivacyPolicy.swift` currently says 7 August 2026. | The one retained date token keeps both copies non-publishable until the same approved date is applied to the app and both sites. |
| **Home changelog:** two website-impact items are labelled “Highlights in 1.2.1”, not a complete release inventory. | Z15 and UPD-1 entries in `APP_STORE_COMPLIANCE_ROADMAP.md`; this round's explicit scope. | A10, Z12, Z10, Z9, ITR, AF and other app work is not falsely represented as absent; full release notes remain a release artefact. The highlight block is copy-hashed. |
| **Home changelog:** 1.2 becomes Previous release while its then-true Files-API history remains unchanged. | Shipped 1.2 behaviour and the existing locked 1.2 digest; Z15 landed only for 1.2.1. | Historical truth is not rewritten into current behaviour. |
| **Mirror Support:** cloud analysis is optional/off by default and uses the user's key; consent is shown before the first file-related transmission to each provider, materially changed disclosures are shown again, and photo naming has separate consent. | `CloudConsentModal.swift`; `AppSettings` consent-version/revocation paths. | The wording leaves the user-invoked key-test probe outside file-egress consent, as the app does. “One-time” is removed; the separate default-on updater is disclosed immediately below. |
| **Mirror Support:** Local AI needs Apple silicon, 24 GB+ memory and an approximately 8.26-GB model download. | `UserGuide.swift`/`SettingsView.swift` Local AI requirements and model metadata. | “One-time” is removed because models can be removed, re-downloaded or revised. |
| **Mirror Support:** selected-file/folder access is sandbox-scoped and macOS may ask again; iWork is read from an embedded PDF/image preview only when available; revert applies to eligible prior files. | `AppSettings.ensureFolderAccessForRename`; security-scoped bookmark flow; `FileWalker`/iWork preview extraction; `RevertLogStore`. | No permanent-grant, guaranteed-preview, process-everything or undo-everything absolute remains. |
| **All current chrome:** 1.2.1 is the next downloadable version, but build, URL, display/exact size, checksum and date are unknown. | Roadmap 1.2.1 ship gate; no 1.2.1 DMG/Release yet. | Every unknown is a blocking token. Nothing from 1.2 is reused or guessed; the 1.1 legacy artefact remains independently locked. |

## 5. Placeholder census

The main-site gate scans deployable/public copy, tests, workflow metadata,
README and package metadata. It intentionally excludes this staging record,
which documents the literal token names.

### Main site: deployable HTML (16 occurrences)

1. `public/index.html:47` — `⟦PENDING-ARTEFACT:RELEASE-URL⟧` (header).
2. `public/index.html:66` — `⟦PENDING-ARTEFACT:RELEASE-URL⟧` (hero).
3. `public/index.html:69` — `⟦PENDING-ARTEFACT:FILE-SIZE⟧`.
4. `public/index.html:546` — `⟦PENDING-ARTEFACT:BUILD⟧`.
5. `public/index.html:554` — `⟦PENDING-ARTEFACT:RELEASE-URL⟧`.
6. `public/index.html:554` — `⟦PENDING-ARTEFACT:FILE-SIZE⟧`.
7. `public/index.html:605` — `⟦PENDING-ARTEFACT:SHA256⟧`.
8. `public/index.html:629` — `⟦PENDING-ARTEFACT:RELEASE-DATE-ISO⟧`.
9. `public/index.html:629` — `⟦PENDING-ARTEFACT:RELEASE-DATE-DISPLAY⟧`.
10. `public/index.html:885` — `⟦PENDING-ARTEFACT:RELEASE-URL⟧` (footer).
11. `public/help/index.html:44` — `⟦PENDING-ARTEFACT:RELEASE-URL⟧`.
12. `public/help/index.html:65` — `⟦PENDING-ARTEFACT:BUILD⟧`.
13. `public/help/index.html:439` — `⟦PENDING-ARTEFACT:RELEASE-URL⟧`.
14. `public/privacy/index.html:44` — `⟦PENDING-ARTEFACT:RELEASE-URL⟧`.
15. `public/privacy/index.html:60` — `⟦PENDING-F1:POLICY-EFFECTIVE-DATE⟧`.
16. `public/privacy/index.html:197` — `⟦PENDING-ARTEFACT:RELEASE-URL⟧`.

### Main site: release-gate expectations (3 occurrences)

17. `scripts/release-gate.mjs:14` — expected appcast build.
18. `scripts/release-gate.mjs:15` — exact appcast byte size.
19. `scripts/release-gate.mjs:16` — canonical release URL.

### Main site: test constants (8 occurrences)

20. `tests/static-site.test.mjs:46` — release URL.
21. `tests/static-site.test.mjs:48` — SHA-256.
22. `tests/static-site.test.mjs:49` — display file size.
23. `tests/static-site.test.mjs:50` — exact byte size.
24. `tests/static-site.test.mjs:51` — build.
25. `tests/static-site.test.mjs:52` — ISO release date.
26. `tests/static-site.test.mjs:53` — display release date.
27. `tests/static-site.test.mjs:54` — policy effective date.

In addition, `public/updates/appcast.xml` is deliberately absent and is an
independent release-gate failure. The permanent provisional-copy defence remains,
but finds zero staging-only privacy phrases after F1. Release-expectation checks
also remain red while build, byte size and URL carry artefact tokens.

### Separate policy mirror (1 occurrence)

28. `kudige79/lumen-privacy:index.html:534` —
    `⟦PENDING-F1:POLICY-EFFECTIVE-DATE⟧`.

The mirror's legacy Pages service deploys directly from its `main` branch and
has no enforceable pre-upload hook. Its release branch therefore remains
local/unpushed until the effective date is resolved; the mirror `main` push is
permitted only after the local word-identity gate exits 0 and the final delta
has both greenlights.

## 6. `/updates/` decision

Do not pre-publish an appcast. Treat the public 1.2.1 GitHub Release, generated
signed `public/updates/appcast.xml` and final site commit as one coordinated
ship cutover: verify the Release asset first, then deploy the appcast/site
immediately afterwards. A 404 before then is deliberate for
development/staging 1.2.1 builds and their silent scheduled checks. Shipped
1.2 has no updater, so publishing early would be harmless but useless and
would create another artefact that could drift.

## 7. Ship checklist

The shorthand “merge, then fill placeholders” cannot be literal here: a main
merge is the deployment boundary. The safe order is:

1. Obtain Codex and Claude greenlights on this staged branch.
2. F1 is landed and both local policy bodies are aligned. Choose and apply the
   single ship effective date to `PrivacyPolicy.swift` and both HTML copies,
   then require both local policy gates to exit 0.
3. Build/sign/notarise 1.2.1 and publish the GitHub Release asset first.
4. Fill the release URL, display size, exact byte size, build, SHA-256 and date
   tokens from that exact public artefact; re-pin the matching test constants
   and the release gate's version/path expectation.
5. Add Round B's generated, signed `public/updates/appcast.xml` and verify its
   Sparkle namespace, child version/build elements, enclosure URL, EdDSA
   signature and exact length against the Release.
6. Run `npm run lint`, `npm test`, `npm run release:gate`, both local
   `policy_gate.py` invocations and local/remote checksum comparisons. Every
   command must exit 0.
7. Obtain both greenlights on the final ship delta.
8. Merge/push the main-site release commit to `main` (this starts deployment),
   then merge/push the matching mirror commit to its `main`.
9. Wait for both Pages builds. Run `policy_gate.py` against both live policy
   URLs; verify the live appcast and 1.2.1 checksum; confirm the stable
   `/Lumen-1.1.dmg` URL still returns the preserved 1.1 artefact.

## 8. Verification at staging

- Baseline `npm test`: 15/15 passed at `185a5c4`.
- Staged `npm run lint`: passed.
- Staged `npm test`: 16/16 passed, including the exact HTML-file set,
  zero-JavaScript locks, both changelog digests, and adversarial appcast
  validator cases.
- Staged `npm run release:gate`: **expected exit 1**, enumerating 27 main-site
  markers, zero staging-only privacy phrases, three unresolved release
  expectations and the missing appcast. This is the intended deploy block.
- Both staged policy gates: **expected exit 1** solely for the pending effective
  date. Each reports `blocks: swift=49 html=49 differing=0 date=DRIFT title=ok`.
  The body is word-identical; publication remains blocked until the one ship
  date is applied everywhere.
- Codex adversarial copy review: **passed** after three independent scope, copy
  and release-gate attacks; all concrete findings were corrected and re-checked.
- Claude's word-by-word greenlight covers the committed staging base. The F1
  clearance delta remains pending review and approval before local application.

## 9. Deliberately untouched

- The Lumen app repository: no Swift, app documentation, roadmap, version or
  build setting is modified by this website round.
- `public/Lumen-1.1.dmg`: preserved byte-for-byte at its stable URL; its size
  and SHA-256 locks remain.
- The full historical Lumen 1.2 changelog copy and digest, including the
  upload behaviour that was true in 1.2.
- `public/og.png`, icons, CSS, sitemap, robots file and 404 page.
- `public/updates/`: no unsigned or speculative appcast is staged.
- Mirror HTML chrome, including WEB-1's stable landing-page Download links;
  only the F1 policy-body sync and the already-audited Support copy change, while
  the effective-date marker remains.
- The staged base is committed locally on both `release/1.2.1` branches. This F1
  clearance delta remains only in disposable review clones until explicit
  approval; no remote branch or deploying `main` branch has moved.
- The canonical site's untracked `.wrangler/` and `dist/` trees: both remain
  untouched and excluded from the proposal.
