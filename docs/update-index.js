#!/usr/bin/env node
/**
 * docs/posts/ の記事一覧から docs/index.html の記事リストを更新し、
 * 各記事の .html ファイルを生成するスクリプト。
 * publish スキルから呼び出す: node docs/update-index.js
 */
const fs = require("fs");
const path = require("path");

const SCRIPT_DIR = __dirname;
const POSTS_DIR = path.join(SCRIPT_DIR, "posts");
const INDEX_FILE = path.join(SCRIPT_DIR, "index.html");

function parseFrontmatter(filepath) {
  const content = fs.readFileSync(filepath, "utf8").replace(/\r\n/g, "\n");
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return { _body: content };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
    fm[k] = v;
  }
  fm._body = content.slice(m[0].length).trim();
  return fm;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markdownToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeLines = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // コードブロック開始/終了
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        flushList();
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        inCodeBlock = false;
        const langAttr = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : "";
        out.push(`<pre><code${langAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        codeLang = "";
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // 見出し
    if (/^#{1,4} /.test(line)) {
      flushList();
      const m = line.match(/^(#{1,4}) (.*)/);
      const level = m[1].length;
      const text = inlineMarkdown(m[2]);
      out.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    // 水平線
    if (/^---+$/.test(line.trim())) {
      flushList();
      out.push("<hr>");
      continue;
    }

    // リスト項目
    if (/^[-*] /.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      continue;
    }

    // 番号付きリスト
    if (/^\d+\. /.test(line)) {
      if (!inList) {
        out.push('<ol>');
        inList = true;
      }
      out.push(`<li>${inlineMarkdown(line.replace(/^\d+\. /, ""))}</li>`);
      continue;
    }

    // 空行
    if (line.trim() === "") {
      flushList();
      out.push("");
      continue;
    }

    // 通常の段落行
    flushList();
    out.push(inlineMarkdown(line));
  }

  flushList();

  // 空行で区切られたテキストをまとめて <p> に
  const html = [];
  let paraLines = [];
  for (const line of out) {
    if (line === "") {
      if (paraLines.length > 0) {
        const joined = paraLines.join(" ");
        // すでに block 要素で始まっている場合はそのまま
        if (/^<(h[1-6]|ul|ol|li|pre|hr|blockquote)/.test(joined)) {
          html.push(joined);
        } else {
          html.push(`<p>${joined}</p>`);
        }
        paraLines = [];
      }
    } else {
      // block タグ単体の行はそのまま flush
      if (/^<(h[1-6]|ul|ol|li|pre|hr|blockquote|\/ul|\/ol|\/li)/.test(line)) {
        if (paraLines.length > 0) {
          html.push(`<p>${paraLines.join(" ")}</p>`);
          paraLines = [];
        }
        html.push(line);
      } else {
        paraLines.push(line);
      }
    }
  }
  if (paraLines.length > 0) {
    const joined = paraLines.join(" ");
    if (/^<(h[1-6]|ul|ol|li|pre|hr)/.test(joined)) {
      html.push(joined);
    } else {
      html.push(`<p>${joined}</p>`);
    }
  }

  return html.join("\n");
}

function inlineMarkdown(text) {
  // コードスパン（先に処理してエスケープを守る）
  const codePlaceholders = [];
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    const idx = codePlaceholders.length;
    codePlaceholders.push(`<code>${escapeHtml(code)}</code>`);
    return `\x00CODE${idx}\x00`;
  });

  // エスケープ
  text = text
    .replace(/&(?!amp;|lt;|gt;|quot;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // bold + italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // strikethrough
  text = text.replace(/~~(.+?)~~/g, "<del>$1</del>");
  // link
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // コードスパンを復元
  text = text.replace(/\x00CODE(\d+)\x00/g, (_, i) => codePlaceholders[Number(i)]);

  return text;
}

const CSS = `
    :root {
      --bg: #080e1a;
      --bg2: #0b1422;
      --surface: #0f1928;
      --surface2: #152236;
      --border: rgba(100,160,255,0.1);
      --border-bright: rgba(100,180,255,0.22);
      --accent:  #4c9eff;
      --accent2: #38e8b0;
      --accent3: #a78bfa;
      --accent4: #f59e0b;
      --text: #e0eeff;
      --muted: #5a7a9a;
      --muted2: #8aadcc;
      --font-en: 'Space Grotesk', sans-serif;
      --font-ja: 'Noto Sans JP', sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-ja);
      line-height: 1.8;
      overflow-x: hidden;
    }
    body::before {
      content: '';
      position: fixed; inset: 0;
      background:
        radial-gradient(ellipse 80% 50% at 10% 0%, rgba(30,80,180,0.28) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 90% 20%, rgba(30,200,140,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 50% 60% at 50% 80%, rgba(60,100,220,0.15) 0%, transparent 60%);
      pointer-events: none; z-index: 0;
    }
    nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(8,14,26,0.82);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-bright);
    }
    .nav-inner {
      max-width: 860px; margin: 0 auto;
      padding: 0 2rem;
      display: flex; align-items: center; justify-content: space-between;
      height: 54px;
    }
    .nav-logo {
      font-family: var(--font-en); font-weight: 600; font-size: 1rem;
      color: var(--text); text-decoration: none;
      display: flex; align-items: center; gap: 9px;
    }
    .nav-logo-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--accent2);
      box-shadow: 0 0 8px var(--accent2);
    }
    .back-link {
      font-size: .83rem; color: var(--muted2); text-decoration: none;
      display: inline-flex; align-items: center; gap: 5px;
      transition: color .2s;
    }
    .back-link:hover { color: var(--text); }
    .container {
      max-width: 860px; margin: 0 auto;
      padding: 3rem 2rem 5rem;
      position: relative; z-index: 1;
    }
    .post-header { margin-bottom: 2.5rem; }
    .post-date {
      font-family: var(--font-en); font-size: .75rem;
      color: var(--muted); margin-bottom: 1rem;
    }
    .post-title {
      font-family: var(--font-ja);
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      font-weight: 500; line-height: 1.45;
      color: var(--text); margin-bottom: 1rem;
    }
    .post-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .tag {
      font-family: var(--font-en); font-size: .62rem; padding: .2em .65em;
      background: rgba(76,158,255,.08); color: #6ab4ff;
      border-radius: 4px; border: 1px solid rgba(76,158,255,.18);
    }
    .post-summary {
      font-size: .95rem; color: var(--muted2); line-height: 1.8;
      border-left: 3px solid var(--accent); padding-left: 1rem;
    }
    .post-body { margin-top: 2.5rem; }
    .post-body h2 {
      font-size: 1.35rem; font-weight: 500; color: var(--text);
      margin: 2.5rem 0 1rem;
      padding-bottom: .4rem;
      border-bottom: 1px solid var(--border-bright);
    }
    .post-body h3 {
      font-size: 1.1rem; font-weight: 500; color: var(--text);
      margin: 1.8rem 0 .7rem;
    }
    .post-body h4 {
      font-size: .95rem; font-weight: 500; color: var(--muted2);
      margin: 1.4rem 0 .5rem;
    }
    .post-body p { margin-bottom: 1.2rem; color: var(--muted2); font-size: .95rem; }
    .post-body strong { color: var(--text); font-weight: 500; }
    .post-body a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
    .post-body ul, .post-body ol {
      margin: 1rem 0 1.2rem 1.5rem; color: var(--muted2); font-size: .95rem;
    }
    .post-body li { margin-bottom: .4rem; }
    .post-body code {
      background: rgba(76,158,255,.08); color: #7dd3fc;
      padding: .15em .45em; border-radius: 4px;
      font-family: 'Consolas', 'Menlo', monospace; font-size: .88em;
    }
    .post-body pre {
      background: rgba(10,20,40,.8);
      border: 1px solid var(--border-bright);
      border-radius: 10px; padding: 1.25rem 1.5rem;
      overflow-x: auto; margin: 1.2rem 0;
    }
    .post-body pre code {
      background: none; padding: 0; color: #a5d6f8; font-size: .87rem;
    }
    .post-body hr {
      border: none; border-top: 1px solid var(--border);
      margin: 2rem 0;
    }
    footer { border-top: 1px solid var(--border); padding: 2rem; margin-top: 3rem; }
    .footer-inner {
      max-width: 860px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between;
    }
    .footer-text { font-size: .8rem; color: var(--muted); }
    @media (max-width:520px) { .container { padding: 2rem 1.25rem 3rem; } }
`;

function generatePostHtml(slug, fm, bodyMd) {
  const title = fm.title || slug;
  const date = fm.date || "";
  const summary = fm.summary || "";
  const tagsRaw = fm.tags || "";
  const tags = tagsRaw.match(/[\w\-]+/g) || [];
  const tagsHtml = tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  const bodyHtml = markdownToHtml(bodyMd);

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Agent Blog</title>
  <meta name="description" content="${escapeHtml(summary)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>

<nav>
  <div class="nav-inner">
    <a href="../index.html" class="nav-logo"><span class="nav-logo-dot"></span>Agent Blog</a>
    <a href="../index.html" class="back-link">← 記事一覧</a>
  </div>
</nav>

<div class="container">
  <article>
    <header class="post-header">
      <div class="post-date">${escapeHtml(date)}</div>
      <h1 class="post-title">${escapeHtml(title)}</h1>
      <div class="post-tags">${tagsHtml}</div>
      ${summary ? `<p class="post-summary">${escapeHtml(summary)}</p>` : ""}
    </header>
    <div class="post-body">
${bodyHtml}
    </div>
  </article>
</div>

<footer>
  <div class="footer-inner">
    <span class="footer-text">Claude Code のエージェント機能で半自動生成しています</span>
    <a href="../index.html" class="back-link">← 記事一覧に戻る</a>
  </div>
</footer>

</body>
</html>
`;
}

// ---- メイン処理 ----

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
    const tagsHtml = tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    // 各記事の HTML ファイルを生成
    const postHtml = generatePostHtml(slug, fm, fm._body || "");
    fs.writeFileSync(path.join(POSTS_DIR, `${slug}.html`), postHtml, "utf8");
    console.log(`  生成: posts/${slug}.html`);

    entries.push({ slug, title, date, summary, tagsHtml, tags });
  }
}

// index.html の featured-card と post-grid を更新
let html = fs.readFileSync(INDEX_FILE, "utf8");

if (entries.length > 0) {
  const newest = entries[0];
  const newestTagsHtml = newest.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  // Featured セクション（最新1件）
  const featuredHtml =
    `    <a href="posts/${newest.slug}.html" style="text-decoration:none">\n` +
    `      <div class="featured-card">\n` +
    `        <div class="featured-content">\n` +
    `          <div>\n` +
    `            <span class="post-badge badge-new"><span class="badge-dot"></span>New</span>\n` +
    `            <h2 class="featured-title">${escapeHtml(newest.title)}</h2>\n` +
    `            <p class="featured-summary">${escapeHtml(newest.summary)}</p>\n` +
    `          </div>\n` +
    `          <div class="featured-meta">\n` +
    `            <span class="post-date">${escapeHtml(newest.date)}</span>\n` +
    `            <div class="post-tags">${newestTagsHtml}</div>\n` +
    `          </div>\n` +
    `        </div>\n` +
    `        <div class="featured-visual"></div>\n` +
    `      </div>\n` +
    `    </a>`;

  html = html.replace(
    /<!-- AUTO-FEATURED-START -->[\s\S]*?<!-- AUTO-FEATURED-END -->/,
    `<!-- AUTO-FEATURED-START -->\n${featuredHtml}\n    <!-- AUTO-FEATURED-END -->`
  );

  // Post grid（全件）
  const postCards = entries
    .map(
      (e) =>
        `      <a href="posts/${e.slug}.html" class="post-card">\n` +
        `        <div class="post-card-date">${escapeHtml(e.date)}</div>\n` +
        `        <div class="post-card-title">${escapeHtml(e.title)}</div>\n` +
        `        <div class="post-card-summary">${escapeHtml(e.summary)}</div>\n` +
        `        <div class="post-card-footer">${e.tagsHtml}</div>\n` +
        `      </a>`
    )
    .join("\n");

  html = html.replace(
    /<!-- AUTO-POSTS-START -->[\s\S]*?<!-- AUTO-POSTS-END -->/,
    `<!-- AUTO-POSTS-START -->\n${postCards}\n    <!-- AUTO-POSTS-END -->`
  );
}

fs.writeFileSync(INDEX_FILE, html, "utf8");
console.log(`index.html を更新しました（${entries.length} 件）`);
