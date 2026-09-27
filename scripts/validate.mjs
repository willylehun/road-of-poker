import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dist = join(root, "dist");
const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "poker-engine.js",
  "manifest.webmanifest",
  "service-worker.js",
  "offline.html",
  "offline.js",
  "privacy.html",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

for (const file of requiredFiles) {
  assert.ok(existsSync(join(dist, file)), `Fichier PWA manquant : ${file}`);
}

const avatars = readdirSync(join(dist, "assets/avatars")).filter(name => /^avatar-\d{2}\.webp$/.test(name));
const tableImages = readdirSync(join(dist, "assets/tables")).filter(name => name.endsWith(".webp"));
assert.equal(avatars.length, 100, "Les 100 avatars existants doivent être conservés");
assert.equal(tableImages.length, 15, "Les 15 identités visuelles de table doivent être conservées");

const manifest = JSON.parse(readFileSync(join(dist, "manifest.webmanifest"), "utf8"));
assert.equal(manifest.start_url, "./", "start_url doit rester dans le périmètre de la PWA");
assert.equal(manifest.scope, "./", "scope doit rester dans le périmètre de la PWA");
assert.equal(manifest.prefer_related_applications, false);
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "Icônes PWA insuffisantes");

const indexHtml = readFileSync(join(dist, "index.html"), "utf8");
assert.match(indexHtml, /http-equiv="Content-Security-Policy"/i, "CSP absente");
assert.match(indexHtml, /name="referrer" content="no-referrer"/i, "Referrer Policy absente");
assert.match(indexHtml, /href="privacy\.html"/i, "Lien vers la politique de confidentialité absent");
assert.doesNotMatch(indexHtml, /\son[a-z]+\s*=/i, "Gestionnaire JavaScript inline interdit");
assert.doesNotMatch(indexHtml, /<(script|iframe|object|embed)\b[^>]+https?:\/\//i, "Ressource active externe interdite");

const serviceWorker = readFileSync(join(dist, "service-worker.js"), "utf8");
const coreBlock = serviceWorker.match(/const CORE_ASSETS = \[([\s\S]*?)\];/);
assert.ok(coreBlock, "Liste CORE_ASSETS introuvable");
for (const match of coreBlock[1].matchAll(/["']\.\/([^"']+)["']/g)) {
  assert.ok(existsSync(join(dist, match[1])), `Ressource de cache manquante : ${match[1]}`);
}

const sensitiveNames = /(^|\/)(\.env(?:\..+)?|local\.properties|[^/]+\.(?:jks|keystore|pem|key|p12))$/i;
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[opusr]_[A-Za-z0-9_]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/
];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.name === ".git" || entry.name === ".sites-runtime" || entry.name === "build") return [];
    return entry.isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(root)) {
  const repoPath = relative(root, file).replaceAll("\\", "/");
  assert.ok(!sensitiveNames.test(repoPath), `Fichier sensible suivi : ${repoPath}`);
  const extension = extname(file).toLowerCase();
  if (![".html", ".css", ".js", ".json", ".xml", ".gradle", ".yml", ".yaml", ".md"].includes(extension)) continue;
  if (statSync(file).size > 2_000_000) continue;
  const source = readFileSync(file, "utf8");
  for (const pattern of secretPatterns) {
    if (repoPath === "scripts/validate.mjs") continue;
    assert.doesNotMatch(source, pattern, `Secret potentiel détecté dans ${repoPath}`);
  }
}

for (const file of walk(dist)) {
  const extension = extname(file).toLowerCase();
  if (![".html", ".css", ".js", ".json", ".webmanifest"].includes(extension)) continue;
  const source = readFileSync(file, "utf8");
  assert.doesNotMatch(source, /\bhttp:\/\//i, `Ressource HTTP non sécurisée dans ${relative(root, file)}`);
}

console.log("Validation de sécurité et intégrité réussie.");
