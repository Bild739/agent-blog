#!/usr/bin/env node
/**
 * docs/posts/ の記事一覧から docs/index.html の記事リストを更新するスクリプト。
 * publish スキルから呼び出す: node docs/update-index.js
 */
const fs = require("fs");
const path = require("path");

const SCRIPT_DIR = __dirname;
const POSTS_DIR = path.join(SCRIPT_DIR, "posts");
const INDEX_FILE = path.join(SCRIPT_DIR, "index.html");

function parseFrontmatter(filepath) {
  const content = fs.readFileSync(filepath, "utf8");
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
    fm[k] = v;
  }
  return fm;
}

const entries = [];
if (fs.existsSync(POSTS_DIR)) {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  for (const filename of files) {
    const slug = filename.replace(/\.md$/, "");
    const fm = parseFrontmatter(path.join(POSTS_DIR, filename));
    const title = fm.title || slug;
    const date = fm.date || "";
    const summary = fm.summary || "";
    const tagsRaw = fm.tags || "";
    const tags = tagsRaw.match(/[\w\-]+/g) || [];
    const tagsHtml = tags.map((t) => `<span class="tag">${t}</span>`).join("");
    entries.push(
      `    <li>\n` +
      `      <div class="post-date">${date}</div>\n` +
      `      <div class="post-title"><a href="posts/${slug}.md">${title}</a></div>\n` +
      `      <div class="post-summary">${summary}</div>\n` +
      `      <div class="tags">${tagsHtml}</div>\n` +
      `    </li>`
    );
  }
}

let html = fs.readFileSync(INDEX_FILE, "utf8");

const newList =
  entries.length > 0
    ? entries.join("\n")
    : `    <li style="color:#999;font-size:0.9rem">記事を追加すると、ここに表示されます。</li>`;

html = html.replace(
  /(<ul[^>]*id="post-list"[^>]*>)[\s\S]*?(<\/ul>)/,
  `$1\n${newList}\n  $2`
);

fs.writeFileSync(INDEX_FILE, html, "utf8");
console.log(`index.html を更新しました（${entries.length} 件）`);
