/* ==========================================================
   Kenneth Fernandez Portfolio - script.js
   ========================================================== */

/* ---------- 1. CREDENTIALS DATA (edit this list) ----------
   Add one object per document. Put the files inside the /credentials folder.
   category: any name you like (filter buttons are created automatically)
   file:     path to the file, e.g. "credentials/TESDA-NC-II.pdf"
   icon:     any Bootstrap Icons name (without the "bi-" prefix)
---------------------------------------------------------- */
const CREDENTIALS = [
  { title: "Resume", category: "Resume", description: "Current resume (PDF).", file: "credentials/Resume.pdf", icon: "file-earmark-person" }
  // Examples - copy, edit, and remove the slashes to use:
  // { title: "Diploma - Associate in Computer Technology", category: "Education", description: "Clark College of Science and Technology", file: "credentials/Diploma.pdf", icon: "mortarboard" },
  // { title: "Certificate of Employment", category: "Employment", description: "Assessment Center Manager", file: "credentials/COE.pdf", icon: "briefcase" },
  // { title: "Training Certificate", category: "Certificates", description: "Short description", file: "credentials/Certificate1.pdf", icon: "patch-check" }
];

document.documentElement.classList.remove("no-js");

(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile navigation ---------- */
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (toggle && menu) {
    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.firstElementChild.className = open ? "bi bi-x-lg" : "bi bi-list";
    };
    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  /* ---------- Active nav link while scrolling ---------- */
  const navLinks = $$(".nav-menu a:not(.nav-cta)");
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Back to top button ---------- */
  const toTop = $("#toTop");
  if (toTop) {
    window.addEventListener("scroll", () => { toTop.hidden = window.scrollY < 600; }, { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Profile photo fallback (shows initials if image fails) ---------- */
  const img = $("#profileImg");
  const avatar = $("#avatar");
  if (img && avatar) {
    const fail = () => avatar.classList.add("no-img");
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  }

  /* ---------- Project filters ---------- */
  const filterBtns = $$(".filter-btn[data-filter]");
  const projects = $$("#projectGrid .project");
  const projectEmpty = $("#projectEmpty");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filterBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      let shown = 0;
      projects.forEach((p) => {
        const match = f === "all" || p.dataset.category.split(/\s+/).includes(f);
        p.classList.toggle("is-hidden", !match);
        if (match) { shown++; p.classList.add("is-visible"); }
      });
      if (projectEmpty) projectEmpty.hidden = shown !== 0;
    });
  });

  /* ---------- Credentials grid + filters ---------- */
  const credGrid = $("#credGrid");
  const credFilters = $("#credFilters");
  const credEmpty = $("#credEmpty");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function renderCreds(filter) {
    if (!credGrid) return;
    const list = CREDENTIALS.filter((c) => filter === "All" || c.category === filter);
    credGrid.innerHTML = list.map((c) => `
      <article class="card cred">
        <i class="bi bi-${esc(c.icon || "file-earmark-text")}" aria-hidden="true"></i>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.description || "")}</p>
        <div class="btn-row">
          <a class="btn btn-sm btn-outline" href="${esc(c.file)}" target="_blank" rel="noopener noreferrer"><i class="bi bi-eye" aria-hidden="true"></i> View</a>
          <a class="btn btn-sm btn-ghost" href="${esc(c.file)}" download><i class="bi bi-download" aria-hidden="true"></i> Download</a>
        </div>
      </article>`).join("");
    if (credEmpty) credEmpty.hidden = list.length !== 0;
  }

  if (credGrid && credFilters) {
    const cats = ["All", ...new Set(CREDENTIALS.map((c) => c.category))];
    credFilters.innerHTML = cats.map((c, i) =>
      `<button type="button" class="filter-btn${i === 0 ? " is-active" : ""}" data-cat="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join("");
    credFilters.hidden = cats.length < 3; // hide filters when there is only one category
    credFilters.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-cat]");
      if (!b) return;
      $$("button", credFilters).forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", String(x === b)); });
      renderCreds(b.dataset.cat);
    });
    renderCreds("All");
  }

  /* ---------- Resume link check (friendly message if the file is missing) ---------- */
  const resumeNotice = $("#resumeNotice");
  $$("[data-resume-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      if (location.protocol === "file:") return; // cannot check when opened from disk
      e.preventDefault();
      fetch(a.getAttribute("href"), { method: "HEAD" })
        .then((r) => {
          if (!r.ok) throw new Error("missing");
          const tmp = document.createElement("a");
          tmp.href = a.getAttribute("href"); tmp.download = "Kenneth-Fernandez-Resume.pdf";
          document.body.appendChild(tmp); tmp.click(); tmp.remove();
        })
        .catch(() => {
          if (resumeNotice) {
            resumeNotice.textContent = "The resume file is not uploaded yet. Please email me and I will send it right away.";
            resumeNotice.hidden = false;
            resumeNotice.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
    });
  });

  /* ---------- Contact form (validates, then opens the visitor's email app) ---------- */
  const form = $("#contactForm");
  if (form) {
    const status = $("#formStatus");
    const RECEIVER = "fkenneth605@gmail.com";
    const rules = {
      name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."),
      subject: (v) => (v.trim().length < 3 ? "Please enter a subject." : ""),
      message: (v) => (v.trim().length < 10 ? "Please write at least 10 characters." : "")
    };
    const fieldId = { name: "cName", email: "cEmail", subject: "cSubject", message: "cMessage" };

    const check = (key) => {
      const input = $("#" + fieldId[key]);
      const msg = rules[key](input.value);
      $("#" + fieldId[key] + "Err").textContent = msg;
      input.classList.toggle("invalid", !!msg);
      input.setAttribute("aria-invalid", String(!!msg));
      return !msg;
    };
    Object.keys(rules).forEach((k) => $("#" + fieldId[k]).addEventListener("blur", () => check(k)));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = Object.keys(rules).map(check).every(Boolean);
      if (!ok) { const bad = $(".invalid", form); if (bad) bad.focus(); return; }
      const d = new FormData(form);
      const body = `${d.get("message")}\n\n- ${d.get("name")} (${d.get("email")})`;
      window.location.href = `mailto:${RECEIVER}?subject=${encodeURIComponent(d.get("subject"))}&body=${encodeURIComponent(body)}`;
      status.textContent = "Thank you! Your email app should open with your message ready to send.";
      status.hidden = false;
      form.reset();
    });
  }
})();
