# -*- coding: utf-8 -*-
import re
from pathlib import Path

base = Path(__file__).parent

index = (base / "index.html").read_text(encoding="utf-8")
banque = (base / "banque_exo1 (2).html").read_text(encoding="utf-8")
exo3 = (base / "exam_exercice3.html").read_text(encoding="utf-8")


def extract_style(html):
    m = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
    return m.group(1) if m else ""


def extract_body_inner(html):
    m = re.search(r"<body[^>]*>(.*?)</body>", html, re.DOTALL)
    return m.group(1).strip() if m else ""


def extract_script(html):
    m = re.search(r"<script>(.*?)</script>", html, re.DOTALL)
    return m.group(1).strip() if m else ""


def get_wrap_content(html):
    body = extract_body_inner(html)
    m = re.search(r'<div class="wrap">(.*)</div>\s*(?:<script|$)', body, re.DOTALL)
    if m:
        return m.group(1).strip()
    return body


idx_style = extract_style(index)
banque_style = extract_style(banque)
exo3_style = extract_style(exo3)

idx_content = get_wrap_content(index)
banque_content = get_wrap_content(banque)

exo3_body = extract_body_inner(exo3)
exo3_body = re.sub(r'<nav class="topnav">.*?</nav>\s*', "", exo3_body, flags=re.DOTALL)
m = re.search(r'<main class="notion-shell">(.*)</main>', exo3_body, re.DOTALL)
exo3_content = m.group(1).strip() if m else exo3_body

idx_script = extract_script(index)
exo3_script = extract_script(exo3)

# Prefix matrix DOM ids
id_map = {
    "player": "mxPlayer",
    "phaseChip": "mxPhaseChip",
    "progFill": "mxProgFill",
    "pcount": "mxPcount",
    "svgHost": "mxSvgHost",
    "side": "mxSide",
    "prevBtn": "mxPrevBtn",
    "restartBtn": "mxRestartBtn",
    "nextBtn": "mxNextBtn",
    "givenMx": "mxGivenMx",
}
for old, new in id_map.items():
    idx_content = idx_content.replace(f'id="{old}"', f'id="{new}"')
    idx_script = idx_script.replace(f'getElementById("{old}")', f'getElementById("{new}")')

idx_style_scoped = idx_style.replace("url(#ah)", "url(#mx-ah)").replace("url(#ahr)", "url(#mx-ahr)")
idx_script = idx_script.replace('marker("ah"', 'marker("mx-ah"')
idx_script = idx_script.replace('marker("ahr"', 'marker("mx-ahr"')

# Banque-only CSS (dt, calc, etc.) - lines not in index
banque_only = banque_style
# Remove duplicate base that's same as index - keep from /* static-page additions */
if "/* ===== static-page additions" in banque_only:
    banque_only = banque_only.split("/* ===== static-page additions")[1]

# Shared dark theme: use index responsive CSS as base
shared_dark = idx_style_scoped

home_css = """
/* ===== Site home ===== */
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
.back-top{display:inline-flex;align-items:center;gap:8px;padding:11px 22px;font-size:.88rem;font-weight:700;color:var(--ink);background:var(--chip);border:1px solid var(--line);border-radius:999px;text-decoration:none;transition:.18s}
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
@media(min-width:921px){
 .site-home h1{font-size:2.2rem}
}
"""

# Scope exo3 notion styles
exo3_scoped = "#section-exo3 {\n" + exo3_style.replace("\n", "\n") + "\n}\n"
# Reset body styles inside exo3 section - notion uses light theme on body
exo3_scoped += """
#section-exo3 {
  --notion-bg: #ffffff;
  --notion-bg-soft: #f9f9f8;
  --notion-surface: #ffffff;
  --notion-surface-hover: #f6f5f4;
  --notion-text: #191918;
  --notion-text-soft: rgba(0, 0, 0, 0.54);
  --notion-text-faint: rgba(0, 0, 0, 0.3);
  --notion-border: rgba(0, 0, 0, 0.1);
  --notion-border-soft: rgba(0, 0, 0, 0.05);
  background: var(--notion-bg);
  color: var(--notion-text);
  font-family: "Segoe UI", "Noto Sans Arabic", "Noto Naskh Arabic", Tahoma, ui-sans-serif, system-ui, sans-serif;
  line-height: 1.5;
  padding: 16px 14px 32px;
  border-top: 3px solid #d5803b;
  margin-top: 8px;
}
@media (prefers-color-scheme: dark) {
  #section-exo3 {
    --notion-bg: #000000;
    --notion-bg-soft: #191918;
    --notion-surface: #191918;
    --notion-surface-hover: #31302e;
    --notion-text: #ffffff;
    --notion-text-soft: rgba(255, 255, 255, 0.5);
    --notion-text-faint: rgba(255, 255, 255, 0.3);
    --notion-border: rgba(255, 255, 255, 0.2);
    --notion-border-soft: rgba(255, 255, 255, 0.1);
    --notion-blue-bg: rgba(41, 139, 253, 0.061);
    --notion-yellow-bg: rgba(203, 145, 47, 0.08);
    --notion-orange-bg: rgba(246, 126, 35, 0.08);
    --notion-green-bg: rgba(42, 157, 118, 0.08);
    --notion-red-bg: rgba(246, 73, 50, 0.08);
    --notion-gray-bg: #31302e;
  }
}
#section-exo3 main.notion-shell,
#section-exo3 .notion-shell { max-width: 1000px; margin: 0 auto; padding: 0; }
#section-exo3 .back-top { background: var(--notion-surface); color: var(--notion-text); border-color: var(--notion-border); }
#section-exo3 .back-top:hover { border-color: var(--notion-blue); color: var(--notion-blue); }
@media(min-width:600px){ #section-exo3 { padding: 24px 18px 40px; } }
@media(min-width:921px){ #section-exo3 { padding: 32px 24px 48px; } }
"""

# Scope banque extra styles under exo1
banque_scoped = "#section-exo1 " + banque_only.replace("\n", "\n#section-exo1 ")
banque_scoped = "#section-exo1 " + banque_only
# Better: prefix each rule block - simpler to wrap as:
banque_scoped = "/* exo1 extras */\n" + "\n".join(
    ("#section-exo1 " + line if line.strip() and not line.strip().startswith("/*") and not line.strip().startswith("@") else line)
    for line in banque_only.split("\n")
)

# Fix media queries
banque_scoped = re.sub(
    r"@media\(max-width:760px\)\{\.grid2",
    "@media(max-width:760px){#section-exo1 .grid2",
    banque_scoped,
)

home_html = """
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
</div>
"""

back_top = """
<div class="back-top-wrap">
  <a class="back-top" href="#top">↑ العودة إلى الأعلى</a>
</div>
"""

banner1 = """
<div class="section-banner" id="section-exo1">
  <div class="sn">1</div>
  <h2>التمرين 1 — خوارزمية المصرفي (Banker's Algorithm)</h2>
</div>
"""

banner3 = """
<div class="section-banner exo3-banner">
  <div class="sn" style="background:linear-gradient(135deg,#d5803b,#eca964)">3</div>
  <h2>التمرين 3 — الساعات الشعاعية (Vector Clock)</h2>
</div>
"""

banner4 = """
<div class="section-banner" id="section-exo4">
  <div class="sn" style="background:linear-gradient(135deg,#8a6cff,#6c8cff)">4</div>
  <h2>التمرين 4 — الساعة المصفوفية (Matrix Clock)</h2>
</div>
"""

# Fix exo3 section id - change id="ex3" to stay but section wrapper gets section-exo3
exo3_content = exo3_content.replace('id="ex3"', 'id="ex3-inner"')

full = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exam Full — Distributed Systems Interactive Lessons</title>
<style>
{shared_dark}
{home_css}
{banque_scoped}
{exo3_scoped}
</style>
</head>
<body>
{home_html}
<hr class="section-divider">
<div class="wrap exam-section">
{banner1}
{banque_content}
</div>
{back_top}
<hr class="section-divider">
<section id="section-exo3" class="exam-section">
{banner3}
<main class="notion-shell">
{exo3_content}
</main>
{back_top}
</section>
<hr class="section-divider">
<div class="wrap exam-section">
{banner4}
{idx_content}
{back_top}
</div>
<script>
(function(){{
{exo3_script}
}})();
</script>
<script>
(function(){{
{idx_script}
}})();
</script>
</body>
</html>
"""

out = base / "examFull.html"
out.write_text(full, encoding="utf-8")
print(f"Written {out} ({len(full)} bytes)")
