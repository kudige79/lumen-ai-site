import { readFile, readdir, stat } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const appcast = new URL("public/updates/appcast.xml", root);
const openMarker = "\u27e6";
const closeMarker = "\u27e7";
const pendingPrefix = `${openMarker}PENDING-`;
const provisionalPattern = /\b(?:pending F1|staged privacy policy|staging draft)\b/gi;
const scanRoots = [".github", "public", "scripts", "tests"];
const scannedFiles = ["README.md", "package.json"];
const expectedAppcast = {
  version: "1.2.1",
  build: "⟦PENDING-ARTEFACT:BUILD⟧",
  byteSize: "⟦PENDING-ARTEFACT:BYTE-SIZE⟧",
  assetUrl: "⟦PENDING-ARTEFACT:RELEASE-URL⟧",
};
const textExtensions = new Set([
  ".css", ".html", ".json", ".md", ".mjs", ".txt", ".xml", ".yaml", ".yml",
]);

async function collectFiles(relativePath) {
  const base = new URL(`${relativePath}/`, root);
  const entries = await readdir(base, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const child = `${relativePath}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...await collectFiles(child));
    } else if (
      entry.isFile()
      && textExtensions.has(child.slice(child.lastIndexOf(".")))
    ) {
      files.push(child);
    }
  }

  return files;
}

export function validateReleaseExpectation(expected) {
  const failures = [];
  const canonicalAsset = /^https:\/\/github\.com\/kudige79\/lumen-ai-site\/releases\/download\/v1\.2\.1\/Lumen-1\.2\.1\.dmg$/;
  if (expected.version !== "1.2.1") {
    failures.push("release expectation: wrong marketing version");
  }
  if (!canonicalAsset.test(expected.assetUrl)) {
    failures.push("release expectation: wrong canonical GitHub Release asset URL");
  }
  if (!/^[1-9][0-9]*$/.test(expected.build)) {
    failures.push("release expectation: build must be a positive integer");
  }
  if (!/^[1-9][0-9]*$/.test(expected.byteSize)) {
    failures.push("release expectation: byte size must be a positive integer");
  }
  return failures;
}

export function findPendingMarkers(line) {
  const markers = [];
  let start = line.indexOf(pendingPrefix);
  while (start >= 0) {
    const close = line.indexOf(closeMarker, start + pendingPrefix.length);
    markers.push(close >= 0 ? line.slice(start, close + 1) : line.slice(start));
    if (close < 0) break;
    start = line.indexOf(pendingPrefix, close + 1);
  }
  return markers;
}

export function validateAppcast(appcastContents, expected = expectedAppcast) {
  const failures = [];
  const attributeValue = (element, name) => {
    const match = element.match(
      new RegExp(`(?:^|\\s)${name}=(?:"([^"]*)"|'([^']*)')`),
    );
    return match?.[1] ?? match?.[2] ?? null;
  };
  const elementText = (element, name) => {
    const match = element.match(
      new RegExp(`<${name}\\b[^>]*>\\s*([^<]*?)\\s*</${name}>`),
    );
    return match?.[1] ?? null;
  };
  const items = [
    ...appcastContents.matchAll(/<item\b[^>]*>[\s\S]*?<\/item>/g),
  ].map((match) => match[0]);
  const releaseItems = items.filter((item) =>
    elementText(item, "sparkle:shortVersionString") === expected.version
  );

  if (!/<rss\b[^>]*\bxmlns:sparkle=["']http:\/\/www\.andymatuschak\.org\/xml-namespaces\/sparkle["'][^>]*>/i.test(appcastContents)) {
    failures.push("public/updates/appcast.xml: missing canonical Sparkle namespace");
  }
  if (releaseItems.length !== 1) {
    failures.push(`public/updates/appcast.xml: expected exactly one Lumen ${expected.version} item`);
  } else {
    const item = releaseItems[0];
    const enclosures = [
      ...item.matchAll(/<enclosure\b[^>]*\/?>/g),
    ].map((match) => match[0]);
    if (elementText(item, "sparkle:version") !== expected.build) {
      failures.push(`public/updates/appcast.xml: Lumen ${expected.version} item has the wrong build`);
    }
    if (enclosures.length !== 1) {
      failures.push(`public/updates/appcast.xml: Lumen ${expected.version} item must contain exactly one enclosure`);
      return failures;
    }

    const enclosure = enclosures[0];
    if (attributeValue(enclosure, "url") !== expected.assetUrl) {
      failures.push(`public/updates/appcast.xml: Lumen ${expected.version} enclosure has the wrong GitHub Release asset URL`);
    }
    const requiredAttributes = [
      ["length", expected.byteSize, "exact positive byte length"],
      ["sparkle:edSignature", /^[A-Za-z0-9+/]{86}==$/, "EdDSA signature"],
    ];

    for (const [name, expectedValue, label] of requiredAttributes) {
      const actual = attributeValue(enclosure, name) ?? "";
      const matches = expectedValue instanceof RegExp
        ? expectedValue.test(actual)
        : actual === expectedValue && /^[1-9][0-9]*$/.test(actual);
      if (!matches) {
        failures.push(`public/updates/appcast.xml: Lumen ${expected.version} enclosure missing ${label}`);
      }
    }
  }

  return failures;
}

async function main() {
  for (const scanRoot of scanRoots) {
    scannedFiles.push(...await collectFiles(scanRoot));
  }

  const failures = [];
  for (const file of scannedFiles.sort()) {
    const contents = await readFile(new URL(file, root), "utf8");
    for (const [index, line] of contents.split("\n").entries()) {
      const markers = findPendingMarkers(line);
      for (const marker of markers) {
        failures.push(`${file}:${index + 1}: ${marker}`);
      }
      if (file.startsWith("public/") && file.endsWith(".html")) {
        for (const match of line.matchAll(provisionalPattern)) {
          failures.push(`${file}:${index + 1}: provisional copy remains: ${match[0]}`);
        }
      }
    }
  }
  failures.push(...validateReleaseExpectation(expectedAppcast));

  let appcastContents = "";
  try {
    const appcastStat = await stat(appcast);
    if (!appcastStat.isFile()) {
      failures.push("public/updates/appcast.xml: must be a regular file");
    } else if (appcastStat.size === 0) {
      failures.push("public/updates/appcast.xml: must not be empty");
    } else {
      appcastContents = await readFile(appcast, "utf8");
    }
  } catch {
    failures.push("public/updates/appcast.xml: missing signed release appcast");
  }

  if (appcastContents !== "") {
    failures.push(...validateAppcast(appcastContents));
  }

  if (failures.length > 0) {
    console.error("Lumen release gate: BLOCKED");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log("Lumen release gate: PASS");
  }
}

if (
  process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}
