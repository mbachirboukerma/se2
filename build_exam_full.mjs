import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const base = dirname(fileURLToPath(import.meta.url));

const index = readFileSync(join(base, "index.html"), "utf-8");
const banque = readFileSync(join(base, "banque_exo1 (2).html"), "utf-8");
const exo3 = readFileSync(join(base, "exam_exercice3.html"), "utf-8");

function extractStyle(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  return m ? m[1] : "";
}

function extractBodyInner(html) {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  return m ? m[1].trim() : "";
}

function extractScript(html) {
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  return m ? m[1].trim() : "";
}

function getWrapContent(html) {
  const body = extractBodyInner(html);
  const m = body.match(/<div class="wrap">([\s\S]*)<\/div>\s*(?:<script|$)/);
  return m ? m[1].trim() : body;
}

let idxStyle = extractStyle(index);
const banqueStyle = extractStyle(banque);
const exo3Style = extractStyle(exo3);

let idxContent = getWrapContent(index);
const banqueContent = getWrapContent(banque);

let exo3Body = extractBodyInner(exo3);
exo3Body = exo3Body.replace(/<nav class="topnav">[\s\S]*?<\/nav>\s*/, "");
const exo3Main = exo3Body.match(/<main class="notion-shell">([\s\S]*)<\/main>/);
let exo3Content = exo3Main ? exo3Main[1].trim() : exo3Body;

let idxScript = extractScript(index);
const exo3Script = extractScript(exo3);

const idMap = {
  player: "mxPlayer",
  phaseChip: "mxPhaseChip",
  progFill: "mxProgFill",
  pcount: "mxPcount",
  svgHost: "mxSvgHost",
  side: "mxSide",
  prevBtn: "mxPrevBtn",
  restartBtn: "mxRestartBtn",
  nextBtn: "mxNextBtn",
  givenMx: "mxGivenMx",
};
for (const [oldId, newId] of Object.entries(idMap)) {
  idxContent = idxContent.replaceAll(`id="${oldId}"`, `id="${newId}"`);
  idxScript = idxScript.replaceAll(`getElementById("${oldId}")`, `getElementById("${newId}")`);
}

idxStyle = idxStyle.replace(/url\(#ah\)/g, "url(#mx-ah)").replace(/url\(#ahr\)/g, "url(#mx-ahr)");
idxScript = idxScript.replace(/marker\("ah"/g, 'marker("mx-ah"');
idxScript = idxScript.replace(/marker\("ahr"/g, 'marker("mx-ahr"');

const banqueOnly = banqueStyle.includes("/* ===== static-page additions")
  ? banqueStyle.split("/* ===== static-page additions")[1].replace(/^\s*\([^)]*\)\s*=====\s*\*\/\s*/, "")
  : "";

const homeCss = `
html{scroll-behavior:smooth;scroll-padding-top:16px}
.site-home{text-align:center;padding:28px 14px 20px}
.site-home .ey{display:inline-block;font-size:.72rem;letter-spacing:.14em;color:var(--accent);background:var(--chip);border:1px solid var(--line);padding:5px 12px;border-radius:999px;margin-bottom:12px}
.site-home h1{font-size:1.45rem;font-weight:800;background:linear-gradient(90deg,#fff,#aeb9ff);-webkit-background-clip:text;background-clip:text;color:transparent;line-height:1.35;margin:0 0 .5em}
.site-home .lead{color:var(--muted);max-width:680px;margin:0 auto;font-size:.94rem}
.nav-cards{display:grid;grid-template-columns:1fr;gap:12px;margin:22px 0 8px;padding:0 2px}
.nav-card{display:block;text-decoration:none;color:inherit;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px 16px;box-shadow:0 16px 40px -28px #000;transition:transform .18s,border-color .18s,box-shadow .18s}
.nav-card:hover{transform:translateY(-2px);border-color:#44508a;box-shadow:0 20px 48px -24px #000}
.nav-card .num{font-size:.72rem;font-weight:800;color:var(--accent);letter-spacing:.08em;margin-bottom:6px}
.nav-card h2{font-size:1.05rem;margin:0 0 6px;font-weight:800;line-height:1.35}
.nav-card p{margin:0;font-size:.88rem;color:var(--muted);line-height:1.6}
.nav-card .go{display:inline-block;margin-top:10px;font-size:.82rem;font-weight:700;color:var(--accent2)}
.exam-section{scroll-margin-top:12px}
.section-divider{height:1px;background:linear-gradient(90deg,transparent,var(--line),transparent);margin:36px 0 28px;border:none}
.section-banner{display:flex;align-items:center;gap:12px;margin:0 0 18px;padding:14px 16px;background:var(--panel2);border:1px solid var(--line);border-radius:14px}
.section-banner .sn{flex:0 0 auto;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-weight:800;font-size:1.1rem;color:#0b0e1c;background:linear-gradient(135deg,var(--accent),var(--accent2))}
.section-banner h2{margin:0;font-size:1.05rem;font-weight:800;line-height:1.35}
.back-top-wrap{display:flex;justify-content:center;padding:24px 14px 8px}
.back-top{display:inline-flex;align-items:center;gap:8px;padding:11px 22px;font-size:.88rem;font-weight:700;color:var(--ink);background:var(--chip);border:1px solid var(--line);border-radius:999px;text-decoration:none;transition:.18s;width:auto;min-height:0}
.back-top:hover{transform:translateY(-1px);border-color:var(--accent);color:var(--accent)}
@media(min-width:600px){
 .site-home{padding:36px 18px 24px}
 .site-home h1{font-size:1.85rem}
 .nav-cards{grid-template-columns:repeat(3,1fr);gap:14px;margin:28px 0 12px}
 .nav-card{padding:20px 18px}
 .nav-card h2{font-size:1.12rem}
 .section-banner .sn{width:52px;height:52px;font-size:1.2rem}
 .section-banner h2{font-size:1.2rem}
}
@media(min-width:921px){.site-home h1{font-size:2.2rem}}
`;

function scopeExo3Css(css) {
  return css
    .replace(/:root\s*\{/g, "#section-exo3 {")
    .replace(/\bbody\s*\{/g, "#section-exo3 {")
    .replace(/^(\s*)button,/gm, "$1#section-exo3 button,")
    .replace(/^(\s*)input,/gm, "$1#section-exo3 input,")
    .replace(/^(\s*)select,/gm, "$1#section-exo3 select,")
    .replace(/^(\s*)textarea\s*\{/gm, "$1#section-exo3 textarea {")
    .replace(/^(\s*)label\s*\{/gm, "$1#section-exo3 label {")
    .replace(/^(\s*)fieldset\s*\{/gm, "$1#section-exo3 fieldset {")
    .replace(/^(\s*)legend\s*\{/gm, "$1#section-exo3 legend {")
    .replace(/^(\s*)a\s*\{/gm, "$1#section-exo3 a {")
    .replace(/^(\s*)hr\s*\{/gm, "$1#section-exo3 hr {")
    .replace(/^(\s*)img\s*\{/gm, "$1#section-exo3 img {")
    .replace(/^(\s*)h1,/gm, "$1#section-exo3 h1,")
    .replace(/^(\s*)h2\s*\{/gm, "$1#section-exo3 h2 {")
    .replace(/^(\s*)h3\s*\{/gm, "$1#section-exo3 h3 {")
    .replace(/^(\s*)h4\s*\{/gm, "$1#section-exo3 h4 {")
    .replace(/^(\s*)p\s*\{/gm, "$1#section-exo3 p {")
    .replace(/^(\s*)ul,/gm, "$1#section-exo3 ul,")
    .replace(/^(\s*)ol\s*\{/gm, "$1#section-exo3 ol {")
    .replace(/^(\s*)li\s*\{/gm, "$1#section-exo3 li {")
    .replace(/^(\s*)blockquote\s*\{/gm, "$1#section-exo3 blockquote {")
    .replace(/^(\s*)table\s*\{/gm, "$1#section-exo3 table {")
    .replace(/^(\s*)th,/gm, "$1#section-exo3 th,")
    .replace(/^(\s*)details\s*\{/gm, "$1#section-exo3 details {")
    .replace(/^(\s*)summary\s*\{/gm, "$1#section-exo3 summary {")
    .replace(/^(\s*)pre,/gm, "$1#section-exo3 pre,")
    .replace(/^(\s*)code\s*\{/gm, "$1#section-exo3 code {")
    .replace(/^(\s*)main\s*\{/gm, "$1#section-exo3 main {")
    .replace(/^(\s*)main,/gm, "$1#section-exo3 main,")
    .replace(/^(\s*)section\s*\{/gm, "$1#section-exo3 section {")
    .replace(/^(\s*)\./gm, "$1#section-exo3 .")
    .replace(/^(\s*)\[/gm, "$1#section-exo3 [")
    .replace(/#section-exo3 #section-exo3/g, "#section-exo3");
}

const exo3Scoped = `
${scopeExo3Css(exo3Style)}
#section-exo3 {
  border-top: 3px solid #d5803b;
  margin-top: 8px;
  padding: 16px 14px 32px;
  background: var(--notion-bg);
  color: var(--notion-text);
  font-family: "Segoe UI", "Noto Sans Arabic", "Noto Naskh Arabic", Tahoma, ui-sans-serif, system-ui, sans-serif;
  line-height: 1.5;
}
#section-exo3 main.notion-shell,
#section-exo3 .notion-shell { max-width: 1000px; margin: 0 auto; padding: 0; }
#section-exo3 .back-top { background: var(--notion-surface); color: var(--notion-text); border-color: var(--notion-border); width: auto; min-height: 0; }
#section-exo3 .back-top:hover { border-color: var(--notion-blue); color: var(--notion-blue); }
@media(min-width:600px){ #section-exo3 { padding: 24px 18px 40px; } }
@media(min-width:921px){ #section-exo3 { padding: 32px 24px 48px; } }
`;

function scopeCss(css, scope) {
  return css
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t || t.startsWith("/*") || t.startsWith("@") || t.startsWith("}")) return line;
      if (t.startsWith(":root")) return line;
      return scope + " " + line;
    })
    .join("\n")
    .replace(/@media\(max-width:760px\)\{#section-exo1 \.grid2/g, "@media(max-width:760px){#section-exo1 .grid2");
}

const banqueScoped = "/* exo1 extras */\n" + scopeCss(banqueOnly, "#section-exo1");

const backTop = `
<div class="back-top-wrap">
  <a class="back-top" href="#top">↑ العودة إلى الأعلى</a>
</div>`;

const homeHtml = `
<div id="top"></div>
<div class="wrap">
  <header class="site-home">
    <span class="ey">Distributed Systems · Exam Solutions</span>
    <h1>دروس تفاعلية لحلّ تمارين الامتحان</h1>
    <p class="lead">ثلاثة تمارين كاملة مع الشرح خطوة بخطوة، الرسوم التفاعلية، والحسابات المُتحقَّق منها. اختر تمرينًا للانتقال مباشرة.</p>
    <nav class="nav-cards" aria-label="Exercise navigation">
      <a class="nav-card" href="#section-exo1">
        <div class="num">EXERCISE 1</div>
        <h2>Banker's Algorithm Exercise</h2>
        <p>خوارزمية المصرفي — تحديد المجهولات، الحالة الآمنة، التنفيذ المباشر، والانسداد الكلي.</p>
        <span class="go">انتقل إلى التمرين ←</span>
      </a>
      <a class="nav-card" href="#section-exo3">
        <div class="num">EXERCISE 3</div>
        <h2>Vector Clock Exercise</h2>
        <p>الساعات الشعاعية — مخطّط زمني تفاعلي، قيم الشعاع، Ricart–Agrawala.</p>
        <span class="go">انتقل إلى التمرين ←</span>
      </a>
      <a class="nav-card" href="#section-exo4">
        <div class="num">EXERCISE 4</div>
        <h2>Matrix Clock Exercise</h2>
        <p>Raynal Matrix Clock — إعادة بناء المخطط، حساب المصفوفات، شرط التسليم.</p>
        <span class="go">انتقل إلى التمرين ←</span>
      </a>
    </nav>
  </header>
</div>`;

const full = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exam Full — Distributed Systems Interactive Lessons</title>
<style>
${idxStyle}
${homeCss}
${banqueScoped}
${exo3Scoped}
</style>
</head>
<body>
${homeHtml}
<hr class="section-divider">
<div class="wrap exam-section" id="section-exo1">
${banqueContent}
</div>
${backTop}
<hr class="section-divider">
<section id="section-exo3" class="exam-section">
<main class="notion-shell">
${exo3Content}
</main>
${backTop}
</section>
<hr class="section-divider">
<div class="wrap exam-section" id="section-exo4">
${idxContent}
</div>
${backTop}
<script>
(function(){
${exo3Script}
})();
</script>
<script>
(function(){
${idxScript}
})();
</script>
</body>
</html>`;

writeFileSync(join(base, "examFull.html"), full, "utf-8");
console.log("Written examFull.html", full.length, "bytes");
