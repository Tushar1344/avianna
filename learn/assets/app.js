/* ===========================================================================
   LeetMath — shared app logic.
   Progress lives in localStorage only (key: leetmath.v1). No accounts, no
   telemetry. Answer checking accepts fractions, decimals, and percentages.
   =========================================================================== */

const LM_KEY = "leetmath.v1";
const DAY = 24 * 60 * 60 * 1000;

/* ------------------------------------------------------------ store ------ */

function lmLoad() {
  try { return JSON.parse(localStorage.getItem(LM_KEY)) || { problems: {} }; }
  catch (e) { return { problems: {} }; }
}
function lmSave(s) { localStorage.setItem(LM_KEY, JSON.stringify(s)); }

function lmRec(state, id) {
  if (!state.problems[id]) {
    state.problems[id] = { status: null, attempts: 0, hints: 0,
                           due: null, interval: 0, scratch: "", conf: null };
  }
  return state.problems[id];
}

/* Schedule the next review. Clean solve waits longest; misses come back fast. */
function lmSchedule(rec, kind) {
  const days = { clean: 7, assisted: 3, studied: 1, missed: 1 }[kind] || 3;
  rec.interval = days;
  rec.due = Date.now() + days * DAY;
}

function lmStatus(id) { return (lmLoad().problems[id] || {}).status || null; }

function lmDue() {
  const s = lmLoad(), now = Date.now();
  return LM_PROBLEMS.filter(p => {
    const r = s.problems[p.id];
    return r && r.status && r.due && r.due <= now;
  });
}

function lmStats() {
  const s = lmLoad();
  let solved = 0, studied = 0, missed = 0;
  for (const p of LM_PROBLEMS) {
    const st = (s.problems[p.id] || {}).status;
    if (st === "solved") solved++;
    else if (st === "studied") studied++;
    else if (st === "missed") missed++;
  }
  return { solved, studied, missed, total: LM_PROBLEMS.length, due: lmDue().length };
}

/* ---------------------------------------------------- answer checking ---- */

/* Parse "1/6", "0.1667", "16.67%" → number, else NaN. */
function lmParse(txt) {
  if (!txt) return NaN;
  let t = txt.trim().toLowerCase().replace(/\s+/g, "");
  let pct = false;
  if (t.endsWith("%")) { pct = true; t = t.slice(0, -1); }
  const frac = t.match(/^([+-]?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  let v;
  if (frac) v = parseFloat(frac[1]) / parseFloat(frac[2]);
  else if (/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(t)) v = parseFloat(t);
  else return NaN;
  return pct ? v / 100 : v;
}

function lmCorrect(input, target) {
  const u = lmParse(input);
  if (isNaN(u)) return null;               // unparseable — not an attempt
  return Math.abs(u - target.v) <= Math.max(1e-9, 0.005 * Math.abs(target.v || 1));
}

/* ------------------------------------------------------------ helpers ---- */

function lmProblem(id) { return LM_PROBLEMS.find(p => p.id === id); }

function lmModuleOf(p) {
  if (p.id.startsWith("BOSS")) return "Boss";
  return p.module === "Mixed" ? "Mixed" : p.module;
}

function lmModuleLabel(p) {
  if (p.id.startsWith("BOSS")) return "Boss fight";
  if (p.module === "Mixed") return "Mixed arena";
  const m = LM_MODULES[p.module];
  return m ? p.module + " · " + m.title : p.module;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function lmNavDue() {
  const el = document.getElementById("nav-due");
  if (!el) return;
  const n = lmDue().length;
  el.innerHTML = n > 0 ? 'Review<span class="due-pip">' + n + "</span>" : "Review";
}
document.addEventListener("DOMContentLoaded", lmNavDue);

/* ===========================================================================
   PROBLEMS PAGE
   =========================================================================== */

const LM_LEVELS = ["Easy", "Medium", "Hard", "Elite", "Boss"];
let lmFilter = { mod: "All", lvl: "All" };

function arenaInit() {
  if (!document.getElementById("arena")) return;
  renderFilters();
  window.addEventListener("hashchange", arenaRoute);
  arenaRoute();
}

function arenaRoute() {
  const id = location.hash.replace("#", "");
  const p = id && lmProblem(id);
  document.getElementById("list-view").hidden = !!p;
  document.getElementById("problem-view").hidden = !p;
  if (p) renderProblem(p); else renderList();
  window.scrollTo(0, 0);
  lmNavDue();
}

function renderFilters() {
  const mods = ["All", "P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "Mixed", "Boss"];
  const mkRow = (items, key) => items.map(v =>
    '<button data-k="' + key + '" data-v="' + v + '"' +
    (lmFilter[key] === v ? ' class="on"' : "") + ">" + v + "</button>").join("");
  document.getElementById("filter-mod").innerHTML = mkRow(mods, "mod");
  document.getElementById("filter-lvl").innerHTML = mkRow(["All"].concat(LM_LEVELS), "lvl");
  document.querySelectorAll(".filters button").forEach(b => {
    b.onclick = () => { lmFilter[b.dataset.k] = b.dataset.v; renderFilters(); renderList(); };
  });
}

function lmFiltered() {
  return LM_PROBLEMS.filter(p =>
    (lmFilter.mod === "All" || lmModuleOf(p) === lmFilter.mod) &&
    (lmFilter.lvl === "All" || p.level === lmFilter.lvl));
}

function renderList() {
  const list = lmFiltered();
  const st = lmLoad();
  document.getElementById("problem-list").innerHTML = list.map(p => {
    const status = (st.problems[p.id] || {}).status;
    return '<li><a href="#' + p.id + '">' +
      '<span class="dot ' + (status || "") + '"></span>' +
      '<span class="pid">' + p.id + "</span>" +
      '<span class="ptitle">' + esc(p.title) + "</span>" +
      '<span class="lvl lvl-' + p.level + '">' + p.level + "</span></a></li>";
  }).join("") || '<li class="muted">No problems match this filter.</li>';
  document.getElementById("list-count").textContent =
    list.length + " of " + LM_PROBLEMS.length + " problems";
}

/* ------------------------------------------------------- problem view ---- */

let pvState = null; // per-problem transient UI state

function renderProblem(p) {
  const store = lmLoad();
  const rec = lmRec(store, p.id);
  lmSave(store);
  pvState = { attempted: false, resolved: false, hintsShown: 0, conf: null };

  const checkable = LM_CHECK[p.id];
  const yesno = LM_YESNO[p.id];
  const el = document.getElementById("problem-view");

  let answerUI;
  if (checkable) {
    answerUI =
      (checkable.prompt ? '<p class="small muted">' + esc(checkable.prompt) + "</p>" : "") +
      '<div class="answer-row">' +
      '<input type="text" id="ans" placeholder="e.g. 5/12 or 0.4167" autocomplete="off">' +
      '<button class="btn primary" id="check">Check</button>' +
      '<button class="btn quiet" id="giveup">Show me the solution</button></div>';
  } else if (yesno) {
    answerUI = '<div class="answer-row">' +
      '<button class="btn" id="yes">Yes</button>' +
      '<button class="btn" id="no">No</button>' +
      '<button class="btn quiet" id="giveup">Show me the solution</button></div>';
  } else {
    answerUI = '<p class="small muted">This one wants a derivation, not a number. ' +
      "Work it out on the scratchpad, then compare.</p>" +
      '<div class="answer-row">' +
      '<button class="btn primary" id="reveal">Reveal answer &amp; compare</button></div>';
  }

  el.innerHTML =
    '<p class="pv-eyebrow"><a href="#">&larr; All problems</a>' +
    "<span>" + p.id + " · " + esc(lmModuleLabel(p)) + "</span>" +
    '<span class="lvl lvl-' + p.level + '">' + p.level + "</span>" +
    '<span id="pv-tags"></span></p>' +
    "<h1>" + esc(p.title) + "</h1>" +
    '<p class="statement">' + esc(p.statement) + "</p>" +
    '<textarea class="scratch" id="scratch" placeholder="Scratchpad — plain text is fine. Saved locally.">' +
    esc(rec.scratch || "") + "</textarea>" +
    '<div class="conf" id="conf"><span>confidence</span>' +
    '<button data-c="low">low</button><button data-c="medium">medium</button>' +
    '<button data-c="high">high</button></div>' +
    answerUI +
    '<div id="feedback"></div>' +
    '<div class="hints" id="hints"></div>' +
    '<div id="after"></div>';

  document.getElementById("scratch").oninput = e => {
    const s = lmLoad(); lmRec(s, p.id).scratch = e.target.value; lmSave(s);
  };
  document.querySelectorAll("#conf button").forEach(b => {
    b.onclick = () => {
      pvState.conf = b.dataset.c;
      document.querySelectorAll("#conf button").forEach(x => x.classList.toggle("on", x === b));
    };
  });

  renderHints(p);

  if (checkable) {
    const input = document.getElementById("ans");
    document.getElementById("check").onclick = () => submitNumeric(p, checkable, input.value);
    input.addEventListener("keydown", e => { if (e.key === "Enter") submitNumeric(p, checkable, input.value); });
  }
  if (yesno) {
    document.getElementById("yes").onclick = () => submitYN(p, "yes");
    document.getElementById("no").onclick = () => submitYN(p, "no");
  }
  const giveup = document.getElementById("giveup");
  if (giveup) giveup.onclick = () => studySolution(p);
  const reveal = document.getElementById("reveal");
  if (reveal) reveal.onclick = () => revealOpen(p);
}

/* Tags stay hidden until the learner has committed, to avoid cueing. */
function revealTags(p) {
  const el = document.getElementById("pv-tags");
  if (!el || el.dataset.done) return;
  el.dataset.done = "1";
  el.innerHTML = (p.hardness || []).map(h => {
    const code = h.split(" ")[0];
    const meta = LM_HARDNESS[code];
    return '<span class="chip orange" title="' + (meta ? esc(meta.q) : "") + '">' + esc(h) + "</span>";
  }).join("");
}

function renderHints(p) {
  const code = (p.hardness && p.hardness[0] || "").split(" ")[0];
  const hq = LM_HARDNESS[code] ? LM_HARDNESS[code].q : "What is really being asked?";
  const mod = LM_MODULES[p.module];
  const moves = mod && mod.moves.length ? mod.moves : ["Identify which module's move applies before computing."];
  const rungs = [
    { label: "Hint 1 — ask the diagnostic question", body: "<em>" + esc(hq) + "</em>" },
    { label: "Hint 2 — name the move", body: "This is a <b>" + esc(mod ? mod.title : "mixed") +
      "</b> problem. The moves that usually work:<ul>" +
      moves.map(m => "<li>" + esc(m.move || m) + "</li>").join("") + "</ul>" },
    { label: "Hint 3 — open the solution", body: null }
  ];
  document.getElementById("hints").innerHTML = rungs.map((r, i) =>
    '<div class="hint" id="hint-' + i + '"><button>' + r.label + "</button>" +
    '<div class="body" hidden></div></div>').join("");
  rungs.forEach((r, i) => {
    const box = document.getElementById("hint-" + i);
    box.querySelector("button").onclick = () => {
      if (i > pvState.hintsShown) return flashMsg("Take the hints in order — earlier rungs first.");
      if (i === 2) { studySolution(p); return; }
      const body = box.querySelector(".body");
      if (!body.hidden) return;
      body.hidden = false;
      body.innerHTML = r.body;
      pvState.hintsShown = Math.max(pvState.hintsShown, i + 1);
      const s = lmLoad(); lmRec(s, p.id).hints++; lmSave(s);
      if (i === 0) revealTags(p);
    };
  });
}

function flashMsg(msg) {
  const fb = document.getElementById("feedback");
  fb.innerHTML = '<p class="small muted">' + esc(msg) + "</p>";
}

function submitNumeric(p, target, value) {
  if (pvState.resolved) return;
  const ok = lmCorrect(value, target);
  if (ok === null) {
    flashMsg("Enter a fraction like 1/6, a decimal with 3+ places, or a percentage.");
    return;
  }
  recordAttempt(p);
  if (ok) markSolved(p, target.show);
  else markWrong(p);
}

function submitYN(p, choice) {
  if (pvState.resolved) return;
  recordAttempt(p);
  if (choice === LM_YESNO[p.id]) markSolved(p, LM_YESNO[p.id] === "no" ? "No" : "Yes");
  else markWrong(p);
}

function recordAttempt(p) {
  pvState.attempted = true;
  revealTags(p);
  const s = lmLoad(); lmRec(s, p.id).attempts++; lmSave(s);
}

function markSolved(p, shownAnswer) {
  pvState.resolved = true;
  const s = lmLoad(); const rec = lmRec(s, p.id);
  const assisted = rec.hints > 0 || rec.status === "missed" || rec.attempts > 1;
  rec.status = "solved";
  rec.conf = pvState.conf;
  lmSchedule(rec, assisted ? "assisted" : "clean");
  lmSave(s);
  document.getElementById("feedback").innerHTML =
    '<div class="fb right"><p class="label">Solved — ' + esc(shownAnswer) + "</p>" +
    "<p>" + esc(p.solution) + "</p>" +
    "<p><b>Autopsy.</b> " + esc(p.autopsy) + "</p></div>";
  renderAfter(p, assisted);
}

function markWrong(p) {
  const s = lmLoad(); const rec = lmRec(s, p.id);
  rec.status = "missed";
  lmSchedule(rec, "missed");
  lmSave(s);
  document.getElementById("feedback").innerHTML =
    '<div class="fb wrong"><p class="label">Not yet — here is the likely reason</p>' +
    "<p><b>Tempting wrong path.</b> " + esc(p.wrong) + "</p>" +
    "<p><b>Diagnosis.</b> " + esc(p.diagnosis) + "</p>" +
    "<p><b>Repair drill.</b> " + esc(p.remediation) + "</p>" +
    '<p class="small">Adjust your reasoning and try again — or climb the hint ladder.</p></div>';
  lmNavDue();
}

function studySolution(p) {
  pvState.resolved = true;
  revealTags(p);
  const s = lmLoad(); const rec = lmRec(s, p.id);
  if (rec.status !== "solved") { rec.status = "studied"; lmSchedule(rec, "studied"); }
  lmSave(s);
  document.getElementById("feedback").innerHTML =
    '<div class="fb study"><p class="label">Studied — answer: ' + esc(p.answer) + "</p>" +
    "<p>" + esc(p.solution) + "</p>" +
    "<p><b>Autopsy.</b> " + esc(p.autopsy) + "</p>" +
    '<p class="small">Studied, not solved. This card comes back tomorrow — solve it then.</p></div>';
  renderAfter(p, true);
}

/* Open-answer problems: reveal, then self-grade honestly. */
function revealOpen(p) {
  if (pvState.resolved) return;
  revealTags(p);
  document.getElementById("feedback").innerHTML =
    '<div class="fb study"><p class="label">Answer</p>' +
    "<p><code>" + esc(p.answer) + "</code></p>" +
    "<p>" + esc(p.solution) + "</p>" +
    "<p><b>Autopsy.</b> " + esc(p.autopsy) + "</p>" +
    '<div class="btn-row"><button class="btn primary" id="had">I had it</button>' +
    '<button class="btn" id="miss">I missed it</button></div></div>';
  document.getElementById("had").onclick = () => {
    recordAttempt(p); pvState.resolved = true;
    const s = lmLoad(); const rec = lmRec(s, p.id);
    const assisted = rec.hints > 0 || rec.status === "missed";
    rec.status = "solved"; rec.conf = pvState.conf;
    lmSchedule(rec, assisted ? "assisted" : "clean"); lmSave(s);
    document.querySelector("#feedback .btn-row").remove();
    renderAfter(p, assisted);
  };
  document.getElementById("miss").onclick = () => {
    recordAttempt(p); pvState.resolved = true;
    const s = lmLoad(); const rec = lmRec(s, p.id);
    rec.status = "missed"; lmSchedule(rec, "missed"); lmSave(s);
    document.querySelector("#feedback .btn-row").remove();
    document.getElementById("feedback").insertAdjacentHTML("beforeend",
      '<div class="fb wrong"><p class="label">Where this usually goes wrong</p>' +
      "<p><b>Tempting wrong path.</b> " + esc(p.wrong) + "</p>" +
      "<p><b>Diagnosis.</b> " + esc(p.diagnosis) + "</p>" +
      "<p><b>Repair drill.</b> " + esc(p.remediation) + "</p></div>");
    renderAfter(p, true);
  };
}

function renderAfter(p, assisted) {
  const next = nextUnsolved(p);
  const days = assisted ? (lmStatus(p.id) === "solved" ? 3 : 1) : 7;
  document.getElementById("after").innerHTML =
    '<div class="card"><h3>Transfer variant</h3>' +
    "<p>" + esc(p.variant) + "</p>" +
    '<p class="small muted">Same hidden idea, different surface. Try it on the scratchpad — ' +
    "this is what the review card will probe.</p></div>" +
    '<p class="small muted">Scheduled for review in ' + days + (days === 1 ? " day." : " days.") + "</p>" +
    '<div class="btn-row">' +
    (next ? '<a class="btn primary" href="#' + next.id + '">Next problem &rarr;</a>' : "") +
    '<a class="btn" href="#">Back to all problems</a></div>';
  lmNavDue();
}

function nextUnsolved(p) {
  const list = lmFiltered();
  const i = list.findIndex(x => x.id === p.id);
  const order = list.slice(i + 1).concat(list.slice(0, i));
  return order.find(x => lmStatus(x.id) !== "solved") || null;
}

/* ===========================================================================
   TRACK PAGE
   =========================================================================== */

function trackInit() {
  const host = document.getElementById("track-modules");
  if (!host) return;
  const st = lmLoad();
  const order = ["P0","P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","Mixed","Boss"];
  host.innerHTML = order.map(key => {
    const meta = key === "Boss"
      ? { title: "Boss Fights", tag: "Multi-method synthesis under an ambiguous surface.", concepts: [], moves: [], traps: [] }
      : LM_MODULES[key];
    const probs = LM_PROBLEMS.filter(p => lmModuleOf(p) === key);
    const solved = probs.filter(p => (st.problems[p.id] || {}).status === "solved").length;
    const pct = probs.length ? Math.round(100 * solved / probs.length) : 0;
    const label = key === "Mixed" || key === "Boss" ? "" : key;
    return '<details class="mod"><summary>' +
      '<span class="mid">' + (label || (key === "Boss" ? "★" : "MX")) + "</span>" +
      '<span class="mtitle">' + esc(meta.title) + "</span>" +
      '<span class="mbar"><i style="width:' + pct + '%"></i></span>' +
      '<span class="mcount">' + solved + "/" + probs.length + "</span></summary>" +
      '<div class="mod-body"><p class="tagline">' + esc(meta.tag) + "</p>" +
      (meta.concepts.length ? "<h4>Concepts</h4><p>" +
        meta.concepts.map(c => '<span class="chip">' + esc(c) + "</span>").join("") + "</p>" : "") +
      (meta.moves.length ? "<h4>Mental moves</h4><ul class='moves'>" +
        meta.moves.map(m => typeof m === "string"
          ? "<li>" + esc(m) + "</li>"
          : "<li><b>" + esc(m.move) + "</b><p class='why'>" + esc(m.why) + "</p></li>"
        ).join("") + "</ul>" : "") +
      (meta.traps.length ? "<h4>Common traps</h4><ul>" +
        meta.traps.map(t => "<li>" + esc(t) + "</li>").join("") + "</ul>" : "") +
      "<h4>Problems</h4><ol class='plist'>" +
      probs.map(p => {
        const status = (st.problems[p.id] || {}).status;
        return '<li><a href="problems.html#' + p.id + '">' +
          '<span class="dot ' + (status || "") + '"></span>' +
          '<span class="pid">' + p.id + "</span>" +
          '<span class="ptitle">' + esc(p.title) + "</span>" +
          '<span class="lvl lvl-' + p.level + '">' + p.level + "</span></a></li>";
      }).join("") + "</ol></div></details>";
  }).join("");
}

/* ===========================================================================
   REVIEW PAGE
   =========================================================================== */

let revQueue = [];

function reviewInit() {
  const host = document.getElementById("review-host");
  if (!host) return;
  revQueue = lmDue();
  renderReview();
}

function renderReview() {
  const host = document.getElementById("review-host");
  const stats = lmStats();
  if (!revQueue.length) {
    const s = lmLoad();
    const upcoming = LM_PROBLEMS
      .map(p => ({ p, r: s.problems[p.id] }))
      .filter(x => x.r && x.r.status && x.r.due)
      .sort((a, b) => a.r.due - b.r.due)[0];
    host.innerHTML = '<div class="card"><h3>Nothing due</h3>' +
      (stats.solved + stats.studied + stats.missed === 0
        ? '<p>You have not attempted anything yet. Start in the <a href="problems.html">arena</a> — every attempt schedules its own review.</p>'
        : "<p>The graph is warm. " + (upcoming
            ? "Next card returns " + new Date(upcoming.r.due).toLocaleDateString() + " (<i>" + esc(upcoming.p.title) + "</i>)."
            : "") + ' Meanwhile: <a href="problems.html">a fresh problem</a>.</p>') +
      "</div>";
    return;
  }
  const p = revQueue[0];
  host.innerHTML =
    '<div class="rev-card"><p class="rev-meta">' + revQueue.length + " due · " +
    p.id + " · " + esc(lmModuleLabel(p)) + "</p>" +
    "<h2 style='margin-top:0'>" + esc(p.title) + "</h2>" +
    '<p class="statement">' + esc(p.statement) + "</p>" +
    '<div class="btn-row"><button class="btn primary" id="show">Show answer</button></div>' +
    '<div id="rev-body"></div></div>';
  document.getElementById("show").onclick = () => {
    document.getElementById("rev-body").innerHTML =
      '<div class="fb study"><p class="label">Answer</p><p><code>' + esc(p.answer) + "</code></p>" +
      "<p>" + esc(p.solution) + "</p></div>" +
      '<div class="btn-row">' +
      '<button class="btn" id="g-miss">Missed it</button>' +
      '<button class="btn" id="g-fuzzy">Fuzzy</button>' +
      '<button class="btn primary" id="g-got">Got it</button></div>';
    document.getElementById("show").disabled = true;
    const grade = q => () => {
      const s = lmLoad(); const rec = lmRec(s, p.id);
      if (q === "got") { rec.interval = Math.max(3, Math.round(rec.interval * 2.2)); rec.status = "solved"; }
      else if (q === "fuzzy") { rec.interval = Math.max(2, rec.interval); }
      else { rec.interval = 1; rec.status = "missed"; }
      rec.due = Date.now() + rec.interval * DAY;
      lmSave(s);
      revQueue.shift();
      renderReview();
      lmNavDue();
    };
    document.getElementById("g-miss").onclick = grade("miss");
    document.getElementById("g-fuzzy").onclick = grade("fuzzy");
    document.getElementById("g-got").onclick = grade("got");
  };
}

/* ===========================================================================
   PROGRESS FILE (export / import / reset)
   =========================================================================== */

function lmExport() {
  const raw = localStorage.getItem(LM_KEY) || '{"problems":{}}';
  const blob = new Blob([raw], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "leetmath-progress-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

/* Throws if the text is not a LeetMath progress file. */
function lmImportText(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== "object" || typeof data.problems !== "object") {
    throw new Error("Not a LeetMath progress file.");
  }
  localStorage.setItem(LM_KEY, JSON.stringify(data));
}

function progressInit() {
  const host = document.getElementById("progress-tools");
  if (!host) return;
  const stats = lmStats();
  document.getElementById("progress-summary").textContent =
    stats.solved + " solved · " + stats.studied + " studied · " +
    stats.missed + " missed · " + stats.due + " due";

  document.getElementById("btn-export").onclick = lmExport;

  const fileInput = document.getElementById("import-file");
  document.getElementById("btn-import").onclick = () => fileInput.click();
  fileInput.onchange = () => {
    const f = fileInput.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        lmImportText(reader.result);
        location.reload();
      } catch (e) {
        document.getElementById("progress-msg").textContent =
          "Import failed: " + e.message;
      }
    };
    reader.readAsText(f);
    fileInput.value = "";
  };

  document.getElementById("btn-reset").onclick = () => {
    if (confirm("Erase all local progress? Export first if you want a backup.")) {
      localStorage.removeItem(LM_KEY);
      location.reload();
    }
  };
}

/* ===========================================================================
   LANDING PAGE
   =========================================================================== */

function homeInit() {
  const el = document.getElementById("home-stats");
  if (!el) return;
  const s = lmStats();
  if (s.solved + s.studied + s.missed === 0) {
    el.textContent = s.total + " problems · 11 modules · progress stays in your browser";
  } else {
    el.textContent = s.solved + " of " + s.total + " solved · " +
      (s.due ? s.due + " review" + (s.due > 1 ? "s" : "") + " due" : "no reviews due");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  arenaInit(); trackInit(); reviewInit(); homeInit(); progressInit();
});
