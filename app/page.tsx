/* eslint-disable @next/next/no-img-element -- Small local app-icon assets are served directly by Sites. */
const downloadHref = "/Lumen-1.1.dmg";
const privacyHref = "https://kudige79.github.io/lumen-privacy/";
const supportHref =
  "mailto:kudige@icloud.com?subject=Lumen%20feedback%20or%20support";
const checksum =
  "6aa7156364b1a6d99965e744b81e68ef6ca347788ee459bd51e23d6498aecb43";

const workflow = [
  {
    number: "01",
    title: "Drop in files or folders",
    body: "Queue one file, several folders or a whole mixed collection. Quick Look anything before processing.",
  },
  {
    number: "02",
    title: "Review meaningful names",
    body: "Lumen extracts document details and photo metadata to propose consistent filenames. Cloud photo descriptions are optional.",
  },
  {
    number: "03",
    title: "Rename with a safety net",
    body: "Execute only the names you approved. Every successful rename is logged so eligible files can be restored later.",
  },
];

const features = [
  {
    mark: "ON",
    title: "Local by default",
    body: "Use the on-device model for document analysis on an Apple-silicon Mac with 24 GB+ memory. No Lumen account or API key required.",
  },
  {
    mark: "AI",
    title: "Your choice of provider",
    body: "For difficult files or visual photo descriptions, optionally use your own Claude, OpenAI, Gemini or xAI API key after a clear consent prompt.",
  },
  {
    mark: "OK",
    title: "Nothing changes unseen",
    body: "Compare every original and proposed filename, inspect the notes, then decide exactly what gets renamed.",
  },
  {
    mark: "RX",
    title: "Powerful batch tools",
    body: "Find and replace with regular expressions, add prefixes or counters, change case and catch conflicts live.",
  },
  {
    mark: "ID",
    title: "Names that stay consistent",
    body: "Map name variations once and Lumen remembers the canonical form for later documents.",
  },
  {
    mark: "↶",
    title: "Undo built in",
    body: "Review rename history and restore eligible files when they remain accessible and their previous names are available.",
  },
];

const resultRows = [
  {
    original: "scan_0042.pdf",
    proposed: "Alex Morgan - AU - Tax Notice - 2026-03-14.pdf",
    type: "Document",
  },
  {
    original: "IMG_4831.HEIC",
    proposed: "Seaside Walk - Bondi, AU - 2026-02-08.heic",
    type: "Photo · cloud description",
  },
  {
    original: "invoice-final-v3.pdf",
    proposed: "Harbour Dental - AU - Invoice - Alex Morgan - 2026-01-29.pdf",
    type: "Document",
  },
];

const formatGroups = [
  ["Documents", "PDF · DOCX · XLSX · PPTX · TXT"],
  ["Photos", "JPEG · PNG · HEIC · TIFF · GIF · BMP · WebP"],
  ["Apple iWork", "Embedded preview · Pages · Numbers · Keynote"],
];

const cloudModels = [
  {
    provider: "Claude",
    name: "Claude Sonnet 5",
    identifier: "claude-sonnet-5",
    documents:
      "Native PDF/image fallback for weak text results, plus oversized-PDF upload.",
  },
  {
    provider: "OpenAI",
    name: "GPT-5.6 Luna",
    identifier: "gpt-5.6-luna",
    documents:
      "Native PDF/image fallback for weak text results, plus oversized-PDF upload.",
  },
  {
    provider: "Gemini",
    name: "Gemini 3.5 Flash",
    identifier: "gemini-3.5-flash",
    documents: "Extracted text only; oversized PDFs go to Unprocessed.",
  },
  {
    provider: "xAI",
    name: "Grok 4.3",
    identifier: "grok-4.3",
    documents: "Extracted text only; oversized PDFs go to Unprocessed.",
  },
];

const releases = [
  {
    id: "1-1",
    version: "1.1",
    date: "16 July 2026",
    dateTime: "2026-07-16",
    headline: "Safer renames, clearer reviews and smoother folder workflows.",
    current: true,
    delivery: "Current direct download",
    changes: [
      "Strengthened rename and reversion handling with case-only changes, multi-folder access, better collision checks and changed-file warnings.",
      "Improved folder intake and Batch Rename responsiveness, reduced memory use for images and oversized PDFs, and made cancellation more reliable.",
      "Added provider-key testing and a post-run summary covering named, skipped and AI-declined files plus approximate cloud token usage.",
      "Made “Try with…” re-checks clearer, applied accepted Name Review mappings to the current run, and labelled providers in comparison sheets.",
      "Added more consistent Space, Y/N and Return keyboard controls, with expanded in-app Help.",
      "Added share-safe diagnostic export, protection against corrupt name-mapping files, stronger cloud-upload clean-up, Third-Party Notices and clearer cloud disclosures.",
    ],
  },
  {
    id: "1-0",
    version: "1.0",
    date: "June 2026",
    dateTime: "2026-06",
    headline:
      "The first Lumen release: meaningful filenames, with you in control.",
    current: false,
    delivery: "Initial direct freeware release",
    changes: [
      "Proposed structured names for supported PDFs, DOCX, XLSX, PPTX, text files, images and iWork embedded previews, with review before renaming.",
      "Used Local AI by default on supported Apple-silicon Macs, with optional bring-your-own Claude, OpenAI, Gemini and xAI providers.",
      "Added customisable document and photo schemas, metadata-based photo dates and places, optional cloud photo descriptions, and canonical name mappings.",
      "Added a multi-folder Drop Zone with Quick Look, grouped queues and per-file inclusion, plus rule-based Batch Rename with regular expressions, dates, counters, case changes and live conflict checks.",
      "Added sandboxed access, first-use cloud and location consent, locally stored rename history and eligible-file reversion.",
    ],
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="nav-shell">
          <a className="brand" href="#top" aria-label="Lumen home">
            <img src="/lumen-icon.png" alt="" width="42" height="42" />
            <span>Lumen</span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#features">Features</a>
            <a href="#models">Models</a>
            <a href="#privacy">Privacy</a>
            <a href="#requirements">Requirements</a>
          </nav>
          <a className="button button-small" href={downloadHref} download>
            Download
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero" id="top">
          <div className="hero-glow" aria-hidden="true" />
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Freeware for macOS</p>
              <h1>Turn messy files into meaningful names.</h1>
              <p className="hero-intro">
                Lumen reads supported documents, names photos when you switch
                Photo naming on, and proposes clean, consistent filenames.
                Review every change before anything is renamed. Use on-device
                AI on an Apple-silicon Mac with 24 GB+ memory, or bring your own
                cloud AI key.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href={downloadHref} download>
                  <span>Download Lumen 1.1</span>
                  <span aria-hidden="true">↓</span>
                </a>
                <a className="button button-secondary" href="#how-it-works">
                  See how it works
                </a>
              </div>
              <p className="download-meta">
                20 MB <span aria-hidden="true">·</span> macOS 26.4 or later
                <span aria-hidden="true">·</span> Universal app
              </p>
              <ul className="trust-list" aria-label="Release assurances">
                <li>Free to use</li>
                <li>Apple-notarised</li>
                <li>Sandboxed</li>
                <li>No Lumen account</li>
              </ul>
            </div>

            <figure className="product-stage">
              <figcaption className="visually-hidden">
                Example of Lumen showing three approved filename proposals
                before a rename.
              </figcaption>
              <div aria-hidden="true">
                <div className="prism-orbit" />
                <div className="app-window">
                  <div className="window-bar">
                    <div className="traffic-lights">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="window-title">Lumen · Results</span>
                    <span className="window-count">3 approved</span>
                  </div>
                  <div className="window-body">
                    <aside>
                      <div className="sidebar-brand">
                        <img
                          src="/lumen-icon.png"
                          alt=""
                          width="32"
                          height="32"
                        />
                        <strong>Lumen</strong>
                      </div>
                      {[
                        "Drop Zone",
                        "Progress",
                        "Name Review",
                        "Results",
                        "Unprocessed",
                        "Batch Rename",
                      ].map((item) => (
                        <span
                          className={item === "Results" ? "active" : undefined}
                          key={item}
                        >
                          <i />
                          {item}
                        </span>
                      ))}
                    </aside>
                    <div className="results-panel">
                      <div className="results-heading">
                        <div>
                          <span className="panel-kicker">Ready to rename</span>
                          <h2>Review proposed names</h2>
                        </div>
                        <span className="mock-action">Execute Renames</span>
                      </div>
                      <div className="result-list">
                        {resultRows.map((row) => (
                          <div className="result-row" key={row.original}>
                            <span className="approval">✓</span>
                            <div>
                              <span className="field-label">
                                Original · {row.type}
                              </span>
                              <code className="original-name">
                                {row.original}
                              </code>
                              <span className="field-label proposed-label">
                                Proposed
                              </span>
                              <code>{row.proposed}</code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="safety-note">
                  <span>✓</span>
                  <div>
                    <strong>You stay in control</strong>
                    <small>Nothing is renamed until you approve it.</small>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </section>

        <section className="section workflow-section" id="how-it-works" aria-labelledby="workflow-title">
          <div className="shell">
            <div className="section-heading centred">
              <p className="eyebrow">A calmer file workflow</p>
              <h2 id="workflow-title">From mystery scan to useful filename.</h2>
              <p>
                Lumen keeps the process simple, inspectable and reversible from
                the first drop to the final rename.
              </p>
            </div>
            <div className="workflow-grid">
              {workflow.map((step) => (
                <article className="workflow-card" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
            <div className="rename-example" aria-label="Filename before and after example">
              <div>
                <span>Before</span>
                <code>scan_0042.pdf</code>
              </div>
              <span className="rename-arrow" aria-hidden="true">→</span>
              <div>
                <span>After</span>
                <code>Alex Morgan - AU - Tax Notice - 2026-03-14.pdf</code>
              </div>
            </div>
          </div>
        </section>

        <section className="section features-section" id="features" aria-labelledby="features-title">
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">More than an AI rename button</p>
                <h2 id="features-title">Built for the decisions around the name.</h2>
              </div>
              <p>
                Handle everyday documents, photo collections and rule-based
                clean-ups without surrendering control of your files.
              </p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <span className="feature-mark" aria-hidden="true">{feature.mark}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
            <div className="formats-band">
              <div>
                <p className="eyebrow">Supported formats</p>
                <h3>Ready for the files that fill a Mac.</h3>
              </div>
              <div className="format-groups">
                {formatGroups.map(([label, formats]) => (
                  <div key={label}>
                    <strong>{label}</strong>
                    <span>{formats}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="section models-section"
          id="models"
          aria-labelledby="models-title"
        >
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">Models in Lumen 1.1</p>
                <h2 id="models-title">
                  One local model. Four optional cloud models.
                </h2>
              </div>
              <p>
                Choose the privacy, hardware and capability balance that fits
                each run. Lumen never turns a cloud provider on for you.
              </p>
            </div>

            <article className="local-model-card">
              <div className="model-summary">
                <span className="model-type">On-device · MLX</span>
                <h3>Phi-4 14B</h3>
                <code className="model-id">
                  mlx-community/phi-4-4bit
                </code>
                <p>
                  Lumen&apos;s sole local model analyses documents on your Mac.
                  It needs no API key, and local inference has no per-use fee.
                </p>
                <p className="model-note">
                  Best suited to English-heavy documents; extraction from
                  other languages may be less accurate.
                </p>
              </div>
              <dl className="model-facts">
                <div>
                  <dt>Hardware</dt>
                  <dd>Apple silicon · 24 GB+ unified memory</dd>
                </div>
                <div>
                  <dt>Setup</dt>
                  <dd>
                    You start a one-time model download of approximately
                    8.26 GB before local AI can be used.
                  </dd>
                </div>
                <div>
                  <dt>Photos</dt>
                  <dd>
                    Uses available capture date and optional location metadata;
                    it does not generate a visual description. Resolving
                    coordinates into a place name can contact Apple Maps after
                    separate consent.
                  </dd>
                </div>
              </dl>
            </article>

            <p className="cloud-model-label">Optional cloud AI</p>
            <ul
              className="cloud-model-grid"
              aria-label="Supported cloud AI models"
            >
              {cloudModels.map((model) => (
                <li className="cloud-model-card" key={model.identifier}>
                  <span className="model-type">{model.provider} · Cloud</span>
                  <h3>{model.name}</h3>
                  <code className="model-id">{model.identifier}</code>
                  <dl className="model-facts">
                    <div>
                      <dt>Documents</dt>
                      <dd>{model.documents}</dd>
                    </div>
                    <div>
                      <dt>Photos</dt>
                      <dd>Visual descriptions for eligible photos.</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            <div className="cloud-model-note">
              <strong>Cloud AI is always opt-in.</strong>
              <p>
                Providers are off by default and use your own API key; their
                API charges may apply. Lumen asks before the first
                transmission. A document&apos;s filename and locally extracted
                text are normally sent. Claude and OpenAI may also receive a
                PDF or image for a weak-result fallback, and oversized PDFs may
                be uploaded through their Files APIs. Gemini and xAI use
                extracted text only for document analysis; oversized PDFs go
                to Unprocessed. All four may receive eligible images when
                visual photo descriptions are enabled and consented.
              </p>
            </div>
          </div>
        </section>

        <section className="section privacy-section" id="privacy" aria-labelledby="privacy-title">
          <div className="shell privacy-grid">
            <div className="privacy-copy">
              <p className="eyebrow">Privacy that is easy to understand</p>
              <h2 id="privacy-title">Local-first by design. Cloud only by choice.</h2>
              <p>
                In the default configuration, document analysis runs on your Mac
                and no document content is transmitted. Lumen has no developer
                servers, accounts, analytics, advertising or tracking.
              </p>
              <p>
                If you choose a cloud provider, Lumen shows what will be sent and
                asks first. Requests go directly from your Mac to that provider
                using your own API key; they never pass through the developer.
              </p>
              <p>
                With cloud photo naming enabled, images containing little or no
                readable text are sent in full to the selected provider. If you
                use Resolved photo location, Lumen separately asks before sending
                embedded GPS coordinates to Apple Maps for a place-name lookup.
              </p>
              <a className="text-link" href={privacyHref}>
                Read the full Privacy Policy <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="privacy-card">
              <div className="shield" aria-hidden="true">
                <span>✓</span>
              </div>
              <ul>
                <li>
                  <strong>On-device default</strong>
                  <span>Local extraction, OCR and analysis.</span>
                </li>
                <li>
                  <strong>Explicit cloud consent</strong>
                  <span>Per provider, revoked when its key changes.</span>
                </li>
                <li>
                  <strong>Keychain protection</strong>
                  <span>
                    API keys are stored in the macOS Keychain and sent only to
                    the selected provider to authenticate requests.
                  </span>
                </li>
                <li>
                  <strong>Sandboxed file access</strong>
                  <span>Lumen scans only locations you select.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section download-section" id="requirements" aria-labelledby="download-title">
          <div className="shell download-card">
            <div className="download-lead">
              <img src="/lumen-icon.png" alt="Lumen app icon" width="112" height="112" />
              <div>
                <p className="eyebrow">Lumen 1.1 · Build 2</p>
                <h2 id="download-title">Download Lumen for Mac.</h2>
                <p>
                  Free to download and use. Distributed directly as a signed,
                  notarised and Gatekeeper-checked disk image.
                </p>
                <a className="button button-primary" href={downloadHref} download>
                  Download the 20 MB DMG <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
            <div className="requirements-grid">
              <div>
                <h3>System requirements</h3>
                <ul className="plain-list">
                  <li>macOS 26.4 or later</li>
                  <li>Universal app: Apple silicon or Intel</li>
                  <li>Local AI: Apple silicon with 24 GB+ memory</li>
                  <li>Intel Macs use an optional cloud provider for AI analysis</li>
                  <li>Local model: approximately 8.26 GB before first use</li>
                </ul>
              </div>
              <div>
                <h3>Install in three steps</h3>
                <ol className="install-list">
                  <li><span>1</span> Open Lumen-1.1.dmg.</li>
                  <li><span>2</span> Drag Lumen into Applications.</li>
                  <li><span>3</span> Eject the disk image and launch Lumen.</li>
                </ol>
              </div>
            </div>
            <details className="checksum">
              <summary>Verify the download checksum</summary>
              <div>
                <span>SHA-256</span>
                <code>{checksum}</code>
              </div>
            </details>
          </div>
        </section>

        <section
          className="section changelog-section"
          id="changelog"
          aria-labelledby="changelog-title"
        >
          <div className="shell">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">Version history</p>
                <h2 id="changelog-title">What changed in Lumen.</h2>
              </div>
              <p>
                Lumen is distributed directly as a signed and notarised
                Developer-ID disk image, not through the Mac App Store.
                Development work appears here only after it ships.
              </p>
            </div>

            <ol className="release-list" role="list">
              {releases.map((release) => (
                <li key={release.version}>
                  <article
                    className="release-entry"
                    aria-labelledby={`release-${release.id}-title`}
                  >
                    <div className="release-meta">
                      {release.current ? (
                        <span className="release-status">Current release</span>
                      ) : null}
                      <time dateTime={release.dateTime}>{release.date}</time>
                      <span className="release-delivery">
                        {release.delivery}
                      </span>
                    </div>
                    <div className="release-copy">
                      <h3 id={`release-${release.id}-title`}>
                        Lumen {release.version}
                      </h3>
                      <p className="release-title">{release.headline}</p>
                      <ul className="release-highlights">
                        {release.changes.map((change) => (
                          <li key={change}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div className="shell faq-grid">
            <div className="section-heading">
              <p className="eyebrow">Good to know</p>
              <h2 id="faq-title">A few straight answers.</h2>
            </div>
            <div className="faq-list">
              <details>
                <summary>Is Lumen really free?</summary>
                <p>
                  Yes. Lumen is free to download and use, with no Lumen account,
                  subscription or in-app purchase. Local AI has no per-use fee.
                  Optional cloud providers use your own account and may charge
                  for their API usage.
                </p>
              </details>
              <details>
                <summary>Do my files ever leave my Mac?</summary>
                <p>
                  Not in the default Local AI configuration. If you enable a
                  cloud provider, Lumen asks for consent before transmitting
                  content. Extracted text is ordinarily sent. Claude and OpenAI
                  may also receive an original PDF or image for quality
                  escalation, and oversized PDFs may be uploaded through their
                  Files APIs. Cloud photo naming sends qualifying images in full.
                  Resolved photo location separately sends embedded GPS
                  coordinates to Apple Maps after another consent prompt.
                </p>
              </details>
              <details>
                <summary>What can Lumen rename?</summary>
                <p>
                  PDF, DOCX, XLSX, PPTX and TXT documents; JPEG, PNG, HEIC, TIFF,
                  GIF, BMP and WebP images; plus Pages, Numbers and Keynote files
                  read through their embedded previews. Unsupported files remain
                  visible with a reason.
                </p>
              </details>
              <details>
                <summary>Can I undo a rename?</summary>
                <p>
                  Lumen keeps rename history on your Mac. Select a previous run
                  in Revert Renames to restore eligible files that remain
                  accessible when their original names are available.
                </p>
              </details>
              <details>
                <summary>Why is Lumen not in the Mac App Store?</summary>
                <p>
                  Lumen is distributed directly as freeware. The download is
                  signed with Developer ID, notarised by Apple, sandboxed and
                  checked by Gatekeeper before release.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <a className="brand footer-brand" href="#top" aria-label="Back to the top">
            <img src="/lumen-icon.png" alt="" width="38" height="38" />
            <span>Lumen</span>
          </a>
          <p>Local-first file renaming for macOS.</p>
          <div className="footer-links">
            <a href="#changelog">Changelog</a>
            <a href={privacyHref}>Privacy</a>
            <a href={supportHref}>Contact</a>
            <a href={downloadHref} download>Download 1.1</a>
          </div>
          <small>© 2026 Kudige Panduranga Shenoy</small>
        </div>
      </footer>
    </>
  );
}
