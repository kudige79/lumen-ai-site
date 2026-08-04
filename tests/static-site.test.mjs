import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const publicRoot = new URL("public/", root);

const [
  html,
  helpHtml,
  privacyHtml,
  helpCss,
  notFoundHtml,
  css,
  robotsText,
  sitemapText,
  packageText,
  workflow,
  readme,
] = await Promise.all([
    readFile(new URL("index.html", publicRoot), "utf8"),
    readFile(new URL("help/index.html", publicRoot), "utf8"),
    readFile(new URL("privacy/index.html", publicRoot), "utf8"),
    readFile(new URL("help/help.css", publicRoot), "utf8"),
    readFile(new URL("404.html", publicRoot), "utf8"),
    readFile(new URL("styles.css", publicRoot), "utf8"),
    readFile(new URL("robots.txt", publicRoot), "utf8"),
    readFile(new URL("sitemap.xml", publicRoot), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8"),
    readFile(new URL("README.md", root), "utf8"),
  ]);

const packageJson = JSON.parse(packageText);

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function normalisePolicyArticle(value) {
  return value
    .replace(/<p class="section-number">[\s\S]*?<\/p>/gi, "")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(?:p|h2|h3|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .normalize("NFC")
    .split(/\n/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .join("\n");
}

test("publishes a complete zero-JavaScript landing page", async () => {
  assert.match(html, /^<!DOCTYPE html>/i);
  assert.match(html, /<html lang="en-AU">/i);
  assert.match(
    html,
    /<title>Lumen — Local-first AI file renamer for Mac<\/title>/i,
  );
  assert.match(html, /<link rel="stylesheet" href="\/styles\.css">/i);
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(helpHtml, /<script\b/i);
  assert.doesNotMatch(privacyHtml, /<script\b/i);
  assert.doesNotMatch(html, /\/_next\//i);
  assert.doesNotMatch(html, /__next_f|javascript:/i);
  assert.doesNotMatch(html, /\son[a-z]+=/i);
  assert.doesNotMatch(css, /@import|--theme\(/i);

  const publishedFiles = await readdir(publicRoot, { recursive: true });
  assert.deepEqual(
    publishedFiles.filter((file) => /\.html$/i.test(file)).sort(),
    ["404.html", "help/index.html", "index.html", "privacy/index.html"],
  );
  assert.equal(
    publishedFiles.filter((file) => /\.(?:c|m)?js$/i.test(file)).length,
    0,
  );
});

test("ships canonical and search/social-preview metadata for lumen-ai.eu", () => {
  assert.match(
    html,
    /<meta name="description" content="Lumen is a free, local-first AI file renamer for Mac\. It proposes clean filenames for supported documents and opted-in photos; you approve every change\."\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta name="robots" content="index, follow"\s*\/?>/i,
  );
  assert.doesNotMatch(html, /<meta name="keywords"/i);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/lumen-ai\.eu\/"\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta property="og:title" content="Lumen — Local-first AI file renamer for Mac"\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta property="og:description" content="Lumen is a free, local-first AI file renamer for Mac\. It proposes clean filenames for supported documents and opted-in photos; you approve every change\."\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/lumen-ai\.eu\/"\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/lumen-ai\.eu\/og\.png"\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta property="og:image:width" content="1200"\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta property="og:image:height" content="630"\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta name="twitter:card" content="summary_large_image"\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta name="twitter:title" content="Lumen — Local-first AI file renamer for Mac"\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta name="twitter:description" content="Lumen is a free, local-first AI file renamer for Mac\. It proposes clean filenames for supported documents and opted-in photos; you approve every change\."\s*\/?>/i,
  );
  assert.match(
    html,
    /<meta name="twitter:image" content="https:\/\/lumen-ai\.eu\/og\.png"\s*\/?>/i,
  );
});

test("declares one preferred WebSite identity for Google", () => {
  assert.equal(
    countMatches(
      html,
      /itemtype="https:\/\/schema\.org\/WebSite"/g,
    ),
    1,
  );

  const siteHeader =
    html.match(/<header class="site-header"[\s\S]*?<\/header>/i)?.[0] ?? "";

  assert.notEqual(siteHeader, "");
  assert.match(
    siteHeader,
    /<header class="site-header" itemscope itemtype="https:\/\/schema\.org\/WebSite">/i,
  );
  assert.match(
    siteHeader,
    /<link itemprop="url" href="https:\/\/lumen-ai\.eu\/"\s*\/?>/i,
  );
  assert.match(
    siteHeader,
    /<meta itemprop="alternateName" content="lumen-ai\.eu"\s*\/?>/i,
  );
  assert.match(
    siteHeader,
    /<span itemprop="name">Lumen<\/span>/i,
  );
  assert.match(
    html,
    /<meta property="og:site_name" content="Lumen"\s*\/?>/i,
  );
});

test("publishes crawler discovery files for the canonical URL", () => {
  assert.equal(
    robotsText,
    [
      "User-agent: *",
      "Allow: /",
      "",
      "Sitemap: https://lumen-ai.eu/sitemap.xml",
      "",
    ].join("\n"),
  );

  assert.match(
    sitemapText,
    /^<\?xml version="1\.0" encoding="UTF-8"\?>/,
  );
  assert.match(
    sitemapText,
    /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/,
  );

  const locations = [
    ...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((match) => match[1]);

  assert.deepEqual(locations, [
    "https://lumen-ai.eu/",
    "https://lumen-ai.eu/help/",
    "https://lumen-ai.eu/privacy/",
  ]);
  assert.doesNotMatch(
    sitemapText,
    /Lumen-1\.1\.dmg|404\.html|github\.io/i,
  );
  assert.match(sitemapText, /<\/urlset>\s*$/);
});

test("preserves the approved Lumen 1.1 product and model facts", () => {
  assert.match(html, /Turn messy files into meaningful names\./);
  assert.match(
    html,
    /Lumen is a free, local-first AI file renamer for Mac that proposes clean, consistent filenames for supported documents and opted-in photos\./,
  );
  assert.match(html, /Download Lumen 1\.1/);
  assert.match(html, /Download the 20 MB DMG/);
  assert.match(html, /macOS 26\.4 or later/);
  assert.match(html, /Apple silicon with 24 GB\+ memory/);
  assert.match(html, /One local model\. Four optional cloud models\./);
  assert.match(html, /Phi-4 14B/);
  assert.match(html, /mlx-community\/phi-4-4bit/);
  assert.match(html, /claude-sonnet-5/);
  assert.match(html, /gpt-5\.6-luna/);
  assert.match(html, /gemini-3\.5-flash/);
  assert.match(html, /grok-4\.3/);
  assert.match(html, /Native PDF\/image fallback for weak text results/);
  assert.match(
    html,
    /No original document file; oversized PDFs go to Unprocessed\./,
  );
  assert.match(
    html,
    /A document’s filename and locally extracted text are normally sent\./,
  );
  assert.match(html, /optional cloud photo descriptions/);
  assert.match(html, /not through the Mac App Store/);
  assert.match(
    html,
    /Lumen 1\.2 is in development and is not yet available to download\. The current download remains Lumen 1\.1/,
  );
  assert.match(html, /Lumen 1\.2 feature preview/);
  assert.match(
    html,
    /These features document Lumen 1\.2 while its release is prepared\. The current public download remains Lumen 1\.1\./,
  );
  assert.match(
    html,
    /The in-development Lumen 1\.2 also stores local session-recovery snapshots/,
  );
  assert.match(
    html,
    /return them to their original tab until they are renamed or a new processing run starts/,
  );
  assert.match(
    html,
    /Uses whichever selected Label, location and capture-date fields are available/,
  );
  assert.match(html, /Test a provider key without sending document data/);
  assert.match(
    html,
    /After a run, see how many skipped files the AI declined for safety and, for cloud runs, approximate input and output tokens when reported/,
  );
  assert.doesNotMatch(html, /Download Lumen 1\.2|Lumen-1\.2\.dmg/);
});

test("preserves the labelled product sections and shipped changelog", () => {
  assert.match(html, /href="#models"/);
  assert.match(html, /id="models"[^>]+aria-labelledby="models-title"/);
  assert.match(
    html,
    /href="\/privacy\/"/,
  );
  assert.match(html, /Local-first by design\. Cloud only by choice\./);
  assert.match(
    html,
    /images containing little or no readable text are sent to the selected provider as a re-encoded copy/,
  );
  assert.match(html, /up to 300 of them are sent with every document/);
  assert.doesNotMatch(html, /sent in full/);
  assert.match(html, /No Lumen account/);
  assert.match(html, /PDF · DOCX · XLSX · PPTX · TXT/);

  assert.match(html, /href="#changelog"/);
  assert.match(
    html,
    /id="changelog"[^>]+aria-labelledby="changelog-title"/i,
  );
  assert.match(
    html,
    /article[^>]+aria-labelledby="release-1-2-title"/i,
  );
  assert.match(
    html,
    /article[^>]+aria-labelledby="release-1-1-title"/i,
  );
  assert.match(
    html,
    /article[^>]+aria-labelledby="release-1-0-title"/i,
  );
  assert.match(html, /datetime="2026-07-16"/i);
  assert.match(html, /datetime="2026-06"/i);
  assert.match(html, /Strengthened rename and reversion handling/);
  assert.match(html, /Current release/);
  assert.match(html, /In development/);
  assert.match(html, /Not yet available to download/);
  assert.match(html, /Names database backup and restore\./);
  assert.match(html, /Session recovery\./);
  assert.match(html, /Crash-safe undo\./);
  assert.match(html, /Name-database safety/);

  const release12Article =
    html.match(
      /<article class="release-entry release-entry-preview"[\s\S]*?<\/article>/i,
    )?.[0] ?? "";
  const release12Copy =
    release12Article.match(
      /<div class="release-groups">([\s\S]*?)<\/div>/i,
    )?.[1] ?? "";
  assert.notEqual(release12Copy, "");
  // Normalised CHANGELOG_1_2.md lines 18–149 at app commit 43e19f5,
  // with the five code-truth corrections recorded in WEBSITE_12_REVIEW.md.
  assert.equal(
    createHash("sha256")
      .update(normalisePolicyArticle(release12Copy.replace(/h4/g, "h3")))
      .digest("hex"),
    "318ae61c2e238b044e0ed08c98e16e35f67d42745115d3cd5b253a3f195ed2ae",
  );

  const version12Index = html.indexOf('id="release-1-2-title"');
  const version11Index = html.indexOf('id="release-1-1-title"');
  const version10Index = html.indexOf('id="release-1-0-title"');
  assert.ok(version12Index >= 0 && version11Index >= 0 && version10Index >= 0);
  assert.ok(version12Index < version11Index);
  assert.ok(version11Index < version10Index);
});

test("includes every agreed audit correction", () => {
  assert.match(
    html,
    /asks for permission before it first sends file-related content to that provider\./,
  );
  assert.doesNotMatch(html, /shows what will be sent and asks first/i);
  assert.doesNotMatch(html, /asks before the first transmission/i);

  assert.match(
    html,
    /The Lumen app has no developer-operated servers or account system, and includes no analytics, advertising or tracking\./,
  );
  const privacySection =
    html.match(/<section class="section privacy-section"[\s\S]*?<\/section>/i)?.[0] ?? "";
  const footer = html.match(/<footer>[\s\S]*?<\/footer>/i)?.[0] ?? "";

  assert.doesNotMatch(privacySection, /GitHub Pages/);
  assert.match(
    footer,
    /Website hosting privacy/,
  );
  assert.match(
    footer,
    /href="https:\/\/docs\.github\.com\/en\/site-policy\/privacy-policies\/github-general-privacy-statement"/,
  );
  assert.doesNotMatch(html, /GitHub Pages may collect standard request data/);

  assert.match(
    html,
    /A document’s filename and locally extracted text are normally sent\./,
  );
  assert.match(
    html,
    /Gemini and xAI do not receive original document files; oversized PDFs go to Unprocessed\./,
  );
  assert.doesNotMatch(html, /Extracted text only/);
  assert.match(
    html,
    /Intel Macs require a configured cloud provider for AI analysis/,
  );
  assert.doesNotMatch(
    html,
    /Intel Macs use an optional cloud provider for AI analysis/,
  );
  assert.match(
    html,
    /Seaside Walk - Bondi, AU - 2026-02-08\.HEIC/,
  );
  assert.doesNotMatch(
    html,
    /Seaside Walk - Bondi, AU - 2026-02-08\.heic/,
  );
  assert.equal(countMatches(html, /Apple’s geocoding service/g), 3);
  assert.doesNotMatch(html, /Apple Maps/);
  assert.match(
    html,
    /Pages · Numbers · Keynote · via embedded preview/,
  );
  assert.match(html, /Install in four steps/);
  assert.match(
    html,
    /If macOS asks about an app downloaded from the internet, click Open\./,
  );
  assert.match(
    html,
    /Files over 500 MB are not processed and are listed in Unprocessed with a reason\./,
  );
  assert.match(
    html,
    /<span class="feature-mark" aria-hidden="true">RV<\/span>/,
  );
  assert.match(html, /<span><i><\/i>Revert Renames<\/span>/);
  assert.match(html, /<span><i><\/i>Name Mappings<\/span>/);
  assert.match(
    html,
    /class="rename-example" role="group" aria-label="Filename before and after example"/,
  );
  assert.match(
    html,
    /class="support-options" role="group" aria-label="Choose a contribution amount"/,
  );
  assert.match(css, /\.release-title\s*\{[^}]*color: #303844;/s);
  assert.match(css, /\.trust-list\s*\{[^}]*gap: 6px;/s);
  assert.match(css, /\.trust-list li\s*\{[^}]*padding: 7px 8px;/s);
  assert.match(css, /html\s*\{[^}]*-webkit-text-size-adjust: 100%;/s);
  assert.match(css, /\.checksum summary::after\s*\{/);
  assert.match(css, /\.checksum\[open\] summary::after\s*\{/);
});

test("includes the optional Wise support section", () => {
  assert.match(
    html,
    /id="support" aria-labelledby="support-title"/,
  );
  assert.match(
    html,
    /Enjoying Lumen\? Buy the developer a coffee\./,
  );
  assert.match(html, /Lumen is freeware\./);

  const links = [
    ["fFLQLXd8oYCayZY", "1 euro", "€1"],
    ["Fjx05YUR26df10o", "2 euros", "€2"],
    ["f_gg0hWz2u01rVg", "5 euros", "€5"],
  ];

  for (const [token, label, amount] of links) {
    const pattern = new RegExp(
      `<a class="button support-button" href="https://wise\\.com/pay/r/${token}" target="_blank" rel="noopener noreferrer" aria-label="Contribute ${label} through Wise">${amount}</a>`,
    );
    assert.match(html, pattern);
  }

  assert.match(html, /<a href="#support">Support<\/a>/);
  assert.match(html, /Payments open on Wise\./);
  assert.match(css, /\.support-card\s*\{/);
});

test("publishes a detailed Lumen 1.2 guide preview without changing the 1.1 download", () => {
  assert.match(helpHtml, /^<!DOCTYPE html>/i);
  assert.match(helpHtml, /<html lang="en-AU">/i);
  assert.match(
    helpHtml,
    /<title>Lumen 1\.2 User Guide Preview — Help for the Mac file renamer<\/title>/i,
  );
  assert.match(
    helpHtml,
    /<link rel="canonical" href="https:\/\/lumen-ai\.eu\/help\/"\s*\/?>/i,
  );
  assert.match(
    helpHtml,
    /<meta name="description" content="Preview the Lumen 1\.2 User Guide: names backup, session recovery, multi-select, safe undo, photo naming, cloud AI and troubleshooting\."\s*\/?>/i,
  );
  assert.match(helpHtml, /<meta name="robots" content="index, follow"\s*\/?>/i);
  assert.match(helpHtml, /<meta property="og:title" content="Lumen 1\.2 User Guide Preview"\s*\/?>/i);
  assert.match(helpHtml, /<meta property="og:url" content="https:\/\/lumen-ai\.eu\/help\/"\s*\/?>/i);
  assert.match(helpHtml, /<meta name="twitter:title" content="Lumen 1\.2 User Guide Preview"\s*\/?>/i);
  assert.match(helpHtml, /<meta property="og:image" content="https:\/\/lumen-ai\.eu\/og\.png"\s*\/?>/i);
  assert.match(helpHtml, /<meta name="twitter:image" content="https:\/\/lumen-ai\.eu\/og\.png"\s*\/?>/i);
  assert.match(helpHtml, /Lumen 1\.2 · Build 3 · not yet released/);
  assert.match(helpHtml, /The current public download remains Lumen 1\.1/);
  assert.match(helpHtml, /href="\/Lumen-1\.1\.dmg"[^>]*download/);
  assert.doesNotMatch(helpHtml, /Lumen-1\.2\.dmg|Download 1\.2/);
  assert.match(
    helpHtml,
    /together with up to 300 of your saved name mappings/,
  );
  assert.match(
    helpHtml,
    /Cloud photo descriptions send a re-encoded copy of eligible images/,
  );
  assert.match(html, /<a href="\/help\/">Help<\/a>/);
  assert.match(html, /<a href="\/help\/">User Guide<\/a>/);
  assert.equal(countMatches(html, /href="\/help\/"/g), 2);

  const requiredSections = [
    "how-it-works",
    "first-run",
    "choose-ai",
    "filename-format",
    "photo-naming",
    "name-review",
    "results",
    "session-recovery",
    "unprocessed",
    "batch-rename",
    "revert",
    "name-mappings",
    "privacy-permissions",
    "shortcuts",
    "troubleshooting",
  ];

  for (const id of requiredSections) {
    assert.match(helpHtml, new RegExp(`id="${id}"`));
    assert.match(helpHtml, new RegExp(`href="#${id}"`));
  }

  assert.match(helpHtml, /Settings → AI Provider/);
  assert.match(
    helpHtml,
    /short authentication check using that provider’s key and no document data/,
  );
  assert.match(
    helpHtml,
    /how many skipped files the AI declined for safety and, for cloud runs, approximate input and output tokens when reported/,
  );
  assert.match(helpHtml, /Phi-4 14B model download of approximately 8\.26 GB/);
  assert.match(helpHtml, /Try Selected with \[provider\]/);
  assert.match(helpHtml, /Send to Batch Rename/);
  assert.match(helpHtml, /Return to Results/);
  assert.match(helpHtml, /Return to Unprocessed/);
  assert.match(helpHtml, /Restored document proposals are reconciled with your current Name Mappings/);
  assert.match(helpHtml, /Rules run in this order/);
  assert.match(helpHtml, /New proposals arrive approved \(ticked\) by default/);
  assert.match(helpHtml, /mark for removal in Drop Zone/);
  assert.match(helpHtml, /Counters follow the order currently shown in the preview/);
  assert.match(helpHtml, /every highlighted row/);
  assert.match(helpHtml, /Export Share-Safe Log/);
  assert.match(helpHtml, /Names Backup/);
  assert.match(helpHtml, /those tokens retain no original file extension/);
  assert.match(helpHtml, /or raw coordinates/);
  assert.match(helpHtml, /every visible row when none are ticked/);
  assert.match(
    helpHtml,
    /A later run replaces the saved session once it produces recoverable results/,
  );
  assert.match(
    helpHtml,
    /Up to 300 saved mappings are sent with each document request/,
  );
  assert.doesNotMatch(
    helpHtml,
    /Mappings persist between launches and are used in later analyses and are sent with each document/,
  );
  assert.match(helpHtml, /Description, Place, Date or Label is left out when that value is unavailable or blank/);
  assert.match(helpHtml, /Apple’s geocoding service/);
  assert.doesNotMatch(helpHtml, /Apple Maps/);
  assert.doesNotMatch(helpHtml, /<script\b|\/_next\/|javascript:|\son[a-z]+=/i);
  assert.doesNotMatch(helpCss, /@import|--theme\(/i);
});

test("keeps help-page references, labels and local assets intact", async () => {
  const ids = [...helpHtml.matchAll(/\bid="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(new Set(ids).size, ids.length, "Help HTML IDs must be unique");
  const idSet = new Set(ids);

  for (const match of helpHtml.matchAll(/\bhref="#([^"]+)"/g)) {
    assert.ok(idSet.has(match[1]), `Missing help fragment target #${match[1]}`);
  }

  const landingIds = new Set(
    [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
  );
  for (const match of helpHtml.matchAll(/\bhref="\/#([^"]+)"/g)) {
    assert.ok(
      landingIds.has(match[1]),
      `Missing landing-page fragment target /#${match[1]}`,
    );
  }

  for (const match of helpHtml.matchAll(/\baria-labelledby="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      assert.ok(idSet.has(id), `Missing help aria-labelledby target #${id}`);
    }
  }

  const disclosures = [
    ...helpHtml.matchAll(/<details\b[\s\S]*?<\/details>/g),
  ];
  assert.equal(disclosures.length, 8);
  for (const disclosure of disclosures) {
    assert.match(disclosure[0], /<summary>[\s\S]*?<\/summary>/);
  }

  const localAssets = new Set(
    [...helpHtml.matchAll(/\b(?:href|src)="\/([^"#?]+)"/g)].map(
      (match) => match[1],
    ),
  );
  await Promise.all(
    [...localAssets].map((path) => access(new URL(path, publicRoot))),
  );

  assert.match(helpHtml, /Skip to main content/);
  assert.match(helpCss, /\.guide-layout\s*\{/);
  assert.match(helpCss, /@media \(max-width: 620px\)/);
  assert.match(
    css,
    /@media \(max-width: 840px\)[\s\S]*?\.site-header \.desktop-nav\s*\{[^}]*flex-wrap: wrap;/,
  );
});

test("publishes the complete 1 August 2026 in-app Privacy Policy on lumen-ai.eu", async () => {
  assert.match(privacyHtml, /^<!DOCTYPE html>/i);
  assert.match(privacyHtml, /<html lang="en-AU">/i);
  assert.match(privacyHtml, /<title>Privacy Policy — Lumen for Mac<\/title>/i);
  assert.match(
    privacyHtml,
    /<link rel="canonical" href="https:\/\/lumen-ai\.eu\/privacy\/"\s*\/?>/i,
  );
  assert.match(privacyHtml, /Effective date: 1 August 2026/);
  assert.match(
    privacyHtml,
    /complete privacy policy included in Lumen 1\.2, which is currently in development/,
  );
  assert.match(
    privacyHtml,
    /The current public download remains Lumen 1\.1/,
  );
  assert.match(
    privacyHtml,
    /A cleanup entry for an upload with a saved provider identifier holds that opaque identifier and may also hold a non-reversible cryptographic fingerprint of the credential used for the upload/,
  );
  assert.match(
    privacyHtml,
    /It cannot be used to locate or delete a provider-side copy, and it holds no credential, credential fingerprint, filename, or document content/,
  );
  assert.match(
    privacyHtml,
    /A snapshot holds no credential, credential fingerprint, or document content/,
  );
  assert.match(
    privacyHtml,
    /may remain in the Application's container indefinitely/,
  );
  assert.match(
    privacyHtml,
    /does not transmit snapshot files or include them in the share-safe diagnostic-log export/,
  );

  const article =
    privacyHtml.match(/<article class="guide-copy">([\s\S]*?)<\/article>/i)?.[1] ?? "";
  assert.notEqual(article, "");
  assert.equal(
    createHash("sha256").update(normalisePolicyArticle(article)).digest("hex"),
    "0dae5a4e1b52866209052a6862974b41cf147fb57d3e79b2de3843100e2c2378",
  );
  assert.equal(
    countMatches(article, /<section class="guide-section"/g),
    11,
  );

  const ids = [...privacyHtml.matchAll(/\bid="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(new Set(ids).size, ids.length, "Privacy HTML IDs must be unique");
  const idSet = new Set(ids);
  for (const match of privacyHtml.matchAll(/\bhref="#([^"]+)"/g)) {
    assert.ok(idSet.has(match[1]), `Missing privacy fragment target #${match[1]}`);
  }
  for (const match of privacyHtml.matchAll(/\baria-labelledby="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      assert.ok(idSet.has(id), `Missing privacy aria-labelledby target #${id}`);
    }
  }

  const localAssets = new Set(
    [...privacyHtml.matchAll(/\b(?:href|src)="\/([^"#?]+)"/g)].map(
      (match) => match[1],
    ),
  );
  await Promise.all(
    [...localAssets].map((path) => access(new URL(path, publicRoot))),
  );
  assert.doesNotMatch(privacyHtml, /kudige79\.github\.io\/lumen-privacy/);
  assert.doesNotMatch(privacyHtml, /Apple Maps/);
  assert.doesNotMatch(privacyHtml, /<script\b|\/_next\/|javascript:|\son[a-z]+=/i);
});

test("keeps native page behaviour and internal references intact", async () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, "HTML IDs must be unique");
  const idSet = new Set(ids);

  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
    assert.ok(idSet.has(match[1]), `Missing fragment target #${match[1]}`);
  }

  for (const match of html.matchAll(/\baria-labelledby="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      assert.ok(idSet.has(id), `Missing aria-labelledby target #${id}`);
    }
  }
  assert.doesNotMatch(
    html,
    /<div\b(?=[^>]*\baria-label=)(?![^>]*\brole=)[^>]*>/i,
  );

  const disclosures = [...html.matchAll(/<details\b[\s\S]*?<\/details>/g)];
  assert.equal(disclosures.length, 6);
  for (const disclosure of disclosures) {
    assert.match(disclosure[0], /<summary>[\s\S]*?<\/summary>/);
  }

  const localAssets = new Set(
    [...html.matchAll(/\b(?:href|src)="\/([^"#?]+)"/g)].map(
      (match) => match[1],
    ),
  );
  await Promise.all(
    [...localAssets].map((path) => access(new URL(path, publicRoot))),
  );

  assert.match(html, /Skip to main content/);
  assert.doesNotMatch(
    html,
    /codex-preview|Your site is taking shape|Codex is working/,
  );
});

test("ships the approved release artefact and local images", async () => {
  const [dmg, socialCard] = await Promise.all([
    readFile(new URL("Lumen-1.1.dmg", publicRoot)),
    readFile(new URL("og.png", publicRoot)),
  ]);

  assert.equal(dmg.byteLength, 19_913_800);
  const approvedChecksum =
    "6aa7156364b1a6d99965e744b81e68ef6ca347788ee459bd51e23d6498aecb43";
  assert.equal(createHash("sha256").update(dmg).digest("hex"), approvedChecksum);
  assert.match(html, new RegExp(approvedChecksum));

  const downloadLinks = [
    ...html.matchAll(
      /<a\b[^>]*href="\/Lumen-1\.1\.dmg"[^>]*\bdownload(?:>|="")/g,
    ),
  ];
  assert.equal(downloadLinks.length, 4);

  const allSiteHtml = [html, helpHtml, privacyHtml].join("\n");
  assert.doesNotMatch(
    allSiteHtml,
    /Lumen-1\.2\.dmg|Download(?: Lumen)? 1\.2/,
  );
  assert.equal(
    countMatches(
      allSiteHtml,
      /href="\/Lumen-1\.1\.dmg"[^>]*\bdownload(?:>|="")/g,
    ),
    8,
  );
  for (const page of [html, helpHtml, privacyHtml]) {
    assert.match(
      page,
      /<a class="button button-small" href="\/Lumen-1\.1\.dmg" download>Download 1\.1<\/a>/,
    );
  }

  assert.equal(socialCard.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(
    createHash("sha256").update(socialCard).digest("hex"),
    "85402b537b615a45a7ba5e0fdd0370010662d776756b0ddca554b22b1f1a92c0",
  );
  assert.equal(socialCard.readUInt32BE(16), 1200);
  assert.equal(socialCard.readUInt32BE(20), 630);
  assert.ok(socialCard.byteLength < 850_000);

  await Promise.all([
    access(new URL("lumen-icon.png", publicRoot)),
    access(new URL("favicon.png", publicRoot)),
  ]);
});

test("provides a branded static 404 page", () => {
  assert.match(notFoundHtml, /^<!DOCTYPE html>/i);
  assert.match(notFoundHtml, /<title>Page not found — Lumen<\/title>/i);
  assert.match(notFoundHtml, /That page is not here\./);
  assert.match(notFoundHtml, /href="\/">Return to Lumen<\/a>/);
  assert.doesNotMatch(notFoundHtml, /<script\b|\/_next\//i);
});

test("uses one dependency-free GitHub Pages deployment path", async () => {
  assert.deepEqual(packageJson.dependencies ?? {}, {});
  assert.deepEqual(packageJson.devDependencies ?? {}, {});
  assert.equal(
    packageJson.scripts["test:pages"],
    "node --test tests/static-site.test.mjs",
  );
  assert.equal(
    packageJson.scripts.lint,
    "node --check tests/static-site.test.mjs",
  );

  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm run test:pages/);
  assert.match(workflow, /path: \.\/public/);
  assert.doesNotMatch(workflow, /next build|vinext|path: \.\/out/);

  assert.match(readme, /https:\/\/lumen-ai\.eu/);
  assert.match(readme, /zero-JavaScript/i);
  assert.match(readme, /GitHub Pages/);
  assert.doesNotMatch(readme, /OpenAI Sites|rollback/i);

  await Promise.all([
    assert.rejects(access(new URL(".openai/hosting.json", root))),
    assert.rejects(access(new URL("app/page.tsx", root))),
    assert.rejects(access(new URL("worker/index.ts", root))),
    assert.rejects(access(new URL("next.config.ts", root))),
  ]);
});
