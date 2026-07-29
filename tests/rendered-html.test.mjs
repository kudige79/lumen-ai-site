import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const isPagesBuild = process.env.LUMEN_PAGES_BUILD === "true";

async function render() {
  if (isPagesBuild) {
    const html = await readFile(new URL("out/index.html", root), "utf8");
    return new Response(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the finished Lumen download page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Lumen — Meaningful filenames for Mac<\/title>/i);
  assert.match(html, /Turn messy files into meaningful names\./);
  assert.match(html, /Download Lumen 1\.1/);
  assert.match(html, /Download the 20 MB DMG/);
  assert.match(html, /href="\/Lumen-1\.1\.dmg"/);
  assert.match(html, /macOS 26\.4 or later/);
  assert.match(html, /Apple silicon with 24 GB\+ memory/);
  assert.match(html, /https:\/\/kudige79\.github\.io\/lumen-privacy\//);
  assert.match(html, /Local-first by design\. Cloud only by choice\./);
  assert.match(html, /images containing little or no readable text are sent in full/);
  assert.match(html, /embedded GPS coordinates to Apple Maps/);
  assert.match(html, /No Lumen account/);
  assert.match(html, /PDF · DOCX · XLSX · PPTX · TXT/);
  assert.match(html, /href="#models"/);
  assert.match(
    html,
    /id="models"[^>]+aria-labelledby="models-title"/,
  );
  assert.match(html, /One local model\. Four optional cloud models\./);
  assert.match(html, /Phi-4 14B/);
  assert.match(html, /mlx-community\/phi-4-4bit/);
  assert.match(html, /claude-sonnet-5/);
  assert.match(html, /gpt-5\.6-luna/);
  assert.match(html, /gemini-3\.5-flash/);
  assert.match(html, /grok-4\.3/);
  assert.match(
    html,
    /Native PDF\/image fallback for weak text results/,
  );
  assert.match(
    html,
    /Extracted text only; oversized PDFs go to Unprocessed\./,
  );
  assert.match(html, /href="#changelog"/);
  assert.match(
    html,
    /id="changelog"[^>]+aria-labelledby="changelog-title"/i,
  );
  assert.match(
    html,
    /article[^>]+aria-labelledby="release-1-1-title"/i,
  );
  assert.match(
    html,
    /article[^>]+aria-labelledby="release-1-0-title"/i,
  );
  assert.match(html, /id="release-1-1-title"/);
  assert.match(html, /id="release-1-0-title"/);
  assert.match(html, /datetime="2026-07-16"/i);
  assert.match(html, /datetime="2026-06"/i);
  assert.match(html, /Strengthened rename and reversion handling/);
  assert.match(html, /optional cloud photo descriptions/);
  assert.match(html, /not through the Mac App Store/);
  assert.match(html, /Current release/);

  const version11Index = html.indexOf('id="release-1-1-title"');
  const version10Index = html.indexOf('id="release-1-0-title"');
  assert.ok(version11Index >= 0 && version10Index >= 0);
  assert.ok(version11Index < version10Index);
  assert.doesNotMatch(html, /Lumen 1\.2/);

  assert.match(html, /Skip to main content/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Codex is working/);
});

test("ships the approved release artefacts", async () => {
  const builtAssetRoot = isPagesBuild ? "out/" : "dist/client/";
  const [dmg, builtDmg, packageJson] = await Promise.all([
    readFile(new URL("public/Lumen-1.1.dmg", root)),
    readFile(new URL(`${builtAssetRoot}Lumen-1.1.dmg`, root)),
    readFile(new URL("package.json", root), "utf8"),
  ]);

  assert.equal(dmg.byteLength, 19_913_800);
  const approvedChecksum =
    "6aa7156364b1a6d99965e744b81e68ef6ca347788ee459bd51e23d6498aecb43";
  assert.equal(createHash("sha256").update(dmg).digest("hex"), approvedChecksum);
  assert.equal(
    createHash("sha256").update(builtDmg).digest("hex"),
    approvedChecksum,
  );
  if (!isPagesBuild) {
    const headers = await readFile(
      new URL("dist/client/_headers", root),
      "utf8",
    );
    assert.match(headers, /\/Lumen-1\.1\.dmg/);
    assert.match(headers, /\/assets\/\*/);
    assert.match(headers, /Content-Type: application\/x-apple-diskimage/);
    assert.match(
      headers,
      /Content-Disposition: attachment; filename="Lumen-1.1.dmg"/,
    );
    assert.match(headers, /Cache-Control: public, max-age=31536000, immutable/);
  }

  await access(new URL("public/lumen-icon.png", root));
  await access(new URL("public/favicon.png", root));
  await access(new URL(`${builtAssetRoot}lumen-icon.png`, root));
  await access(new URL(`${builtAssetRoot}favicon.png`, root));
  assert.doesNotMatch(packageJson, /react-loading-skeleton|drizzle/);
  await assert.rejects(access(new URL("app/_sites-preview", root)));
});
