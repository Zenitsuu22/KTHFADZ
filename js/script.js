/* ==========================================================
   Kenneth Fernandez Portfolio - script.js
   Beginner notes:
   1. EDIT THE `credentials` LIST below to add/remove documents.
   2. Put the matching files inside assets/credentials/.
   3. Optionally set FORM_ENDPOINT to connect the contact form.
   ========================================================== */

"use strict";

/* ---------- 1. CREDENTIALS LIST (edit me) ----------
   category must be exactly one of the names in CREDENTIAL_CATEGORIES.
   file: relative path to the PDF, image (jpg/png/webp) or DOCX.
   Remove the sample entries you do not have, and replace the filenames
   with your real ones. Only list documents you approve for public viewing. */
const CREDENTIAL_CATEGORIES = [
  "Resume / CV",
  "Educational Credentials",
  "Training Certificates",
  "Technical Certificates",
  "Other Supporting Documents"
];

const credentials = [
  {
    title: "Resume - Kenneth Fernandez",
    category: "Resume / CV",
    description: "My updated professional resume.",
    file: "assets/credentials/Kenneth_Fernandez_Resume.pdf"
  },
  {
    title: "Educational Credential",
    category: "Educational Credentials",
    description: "Supporting document for my educational background.",
    file: "assets/credentials/educational_credential.pdf"
  },
  {
    title: "Training Certificate",
    category: "Training Certificates",
    description: "Supporting documentation for relevant training.",
    file: "assets/credentials/training_certificate.pdf"
  }
];

/* ---------- 2. CONTACT FORM SETTING (edit me) ----------
   Leave empty while the site is static: the form will validate but will
   tell visitors it is not connected yet (it never fakes a "sent" message).
   To make it work, create a free form at Formspree, Web3Forms or Getform
   and paste its endpoint URL here, e.g. "https://formspree.io/f/xxxxxxx". */
const FORM_ENDPOINT = "";

/* ---------- Helpers ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const isLocalFile = window.location.protocol === "file:";

function getExtension(path) {
  const clean = path.split("?")[0].split("#")[0];
  const dot = clean.lastIndexOf(".");
  return dot === -1 ? "" : clean.slice(dot + 1).toLowerCase();
}

function getFileName(path) {
  return path.split("/").pop();
}

/* Checks whether a file exists. Browsers block this check on file:// previews,
   so in that case we return null ("unknown") and show the document normally. */
async function fileExists(path) {
  if (isLocalFile) return null;
  try {
    const res = await fetch(path, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/* ---------- Footer year ---------- */
function setYear() {
  const el = $("#year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Mobile navigation ---------- */
function initNav() {
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    const icon = $("i", toggle);
    if (icon) icon.className = open ? "bi bi-x-lg" : "bi bi-list";
  };

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setOpen(false);
  });
}

/* ---------- Active nav link while scrolling ---------- */
function initActiveNav() {
  const links = $$("#navMenu a");
  const sections = links
    .map((a) => $(a.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
          );
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observer.observe(s));
}

/* ---------- Reveal on scroll (respects reduced motion) ---------- */
function initReveal() {
  const items = $$(".reveal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- Back-to-top button ---------- */
function initBackToTop() {
  const btn = $("#toTop");
  if (!btn) return;
  const toggle = () => { btn.hidden = window.scrollY < 500; };
  window.addEventListener("scroll", toggle, { passive: true });
  toggle();
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Profile photo fallback ---------- */
function initProfileImage() {
  const img = $("#profileImg");
  const avatar = $("#avatar");
  if (!img || !avatar) return;
  const showFallback = () => avatar.classList.add("no-photo");
  img.addEventListener("error", showFallback);
  if (img.complete && img.naturalWidth === 0) showFallback();
}

/* ---------- Project image placeholders ---------- */
function initProjectImages() {
  $$(".project-img img").forEach((img) => {
    const replace = () => {
      const box = img.parentElement;
      const ph = document.createElement("div");
      ph.className = "img-placeholder";
      ph.innerHTML = '<span><i class="bi bi-image" aria-hidden="true"></i>Screenshot coming soon</span>';
      box.replaceChildren(ph);
    };
    img.addEventListener("error", replace);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("loading") !== "lazy") replace();
  });
}

/* ---------- Project category filters ---------- */
function initProjectFilters() {
  const buttons = $$(".filter-btn[data-filter]");
  const cards = $$("#projectGrid .project");
  const empty = $("#projectEmpty");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      let shown = 0;
      cards.forEach((card) => {
        const cats = (card.dataset.category || "").split(/\s+/);
        const match = filter === "all" || cats.includes(filter);
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  });
}

/* ---------- Credentials gallery ---------- */
function createButton(label, iconClass, href, opts = {}) {
  const a = document.createElement("a");
  a.className = "btn btn-sm " + (opts.primary ? "btn-primary" : "btn-outline");
  a.href = href;
  if (opts.newTab) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  if (opts.download) a.setAttribute("download", "");
  a.innerHTML = '<i class="bi ' + iconClass + '" aria-hidden="true"></i> ';
  a.appendChild(document.createTextNode(label));
  return a;
}

function buildCredentialCard(item, exists) {
  const ext = getExtension(item.file);
  const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
  const isPdf = ext === "pdf";

  const card = document.createElement("article");
  card.className = "card cred-card" + (exists === false ? " cred-missing" : "");
  card.dataset.category = item.category;

  // Thumbnail (images) or icon (PDF / DOCX / other)
  if (isImage && exists !== false) {
    const thumb = document.createElement("div");
    thumb.className = "cred-thumb";
    const img = document.createElement("img");
    img.src = item.file;
    img.alt = "Preview of " + item.title;
    img.loading = "lazy";
    thumb.appendChild(img);
    card.appendChild(thumb);
  } else {
    const icon = document.createElement("i");
    icon.className = "bi cred-icon " + (isPdf ? "bi-file-earmark-pdf" : ext === "docx" || ext === "doc" ? "bi-file-earmark-word" : "bi-file-earmark");
    icon.setAttribute("aria-hidden", "true");
    card.appendChild(icon);
  }

  const cat = document.createElement("span");
  cat.className = "cred-cat";
  cat.textContent = item.category;
  const title = document.createElement("h3");
  title.textContent = item.title;
  const desc = document.createElement("p");
  desc.textContent = item.description;
  card.append(cat, title, desc);

  const row = document.createElement("div");
  row.className = "btn-row";

  if (exists === false) {
    const msg = document.createElement("span");
    msg.className = "btn btn-sm btn-disabled";
    msg.setAttribute("aria-disabled", "true");
    msg.textContent = "File not added yet (" + getFileName(item.file) + ")";
    row.appendChild(msg);
  } else if (isPdf || isImage) {
    // PDFs and images open in a new tab; both can also be downloaded.
    row.appendChild(createButton("View Document", "bi-box-arrow-up-right", item.file, { primary: true, newTab: true }));
    row.appendChild(createButton("Download", "bi-download", item.file, { download: true }));
  } else {
    // DOCX and other formats: browsers cannot display them, so download only.
    row.appendChild(createButton("Download Document", "bi-download", item.file, { primary: true, download: true }));
  }
  card.appendChild(row);
  return card;
}

async function initCredentials() {
  const grid = $("#credGrid");
  const filterBox = $("#credFilters");
  const empty = $("#credEmpty");
  if (!grid || !filterBox) return;

  // Check every file (in parallel) so missing files get a friendly message.
  const results = await Promise.all(credentials.map((c) => fileExists(c.file)));
  const cards = credentials.map((item, i) => buildCredentialCard(item, results[i]));
  grid.replaceChildren(...cards);

  // Build category filter buttons only for categories that are used.
  const used = CREDENTIAL_CATEGORIES.filter((cat) => credentials.some((c) => c.category === cat));
  const allCats = ["All", ...used];
  filterBox.replaceChildren(
    ...allCats.map((cat, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "filter-btn" + (i === 0 ? " is-active" : "");
      b.setAttribute("aria-pressed", String(i === 0));
      b.textContent = cat;
      b.addEventListener("click", () => {
        $$(".filter-btn", filterBox).forEach((x) => {
          x.classList.toggle("is-active", x === b);
          x.setAttribute("aria-pressed", String(x === b));
        });
        let shown = 0;
        cards.forEach((card) => {
          const match = cat === "All" || card.dataset.category === cat;
          card.hidden = !match;
          if (match) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      });
      return b;
    })
  );

  if (!credentials.length && empty) {
    empty.textContent = "No documents have been added yet.";
    empty.hidden = false;
  }
}

/* ---------- Resume links: friendly message if the PDF is missing ---------- */
function initResumeLinks() {
  const links = $$("[data-resume-link]");
  const notice = $("#resumeNotice");
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", async (e) => {
      const exists = await fileExists(link.getAttribute("href"));
      if (exists === false) {
        e.preventDefault();
        if (notice) {
          notice.textContent =
            "The resume file has not been added to the site yet. Please use the additional files link or contact me directly.";
          notice.hidden = false;
          notice.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    });
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = $("#contactForm");
  if (!form) return;
  const status = $("#formStatus");

  const fields = [
    { id: "cName", err: "cNameErr", label: "name", min: 2 },
    { id: "cEmail", err: "cEmailErr", label: "email", email: true },
    { id: "cSubject", err: "cSubjectErr", label: "subject", min: 3 },
    { id: "cMessage", err: "cMessageErr", label: "message", min: 10 }
  ];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(f) {
    const input = $("#" + f.id);
    const errEl = $("#" + f.err);
    const value = input.value.trim();
    let message = "";
    if (!value) message = "Please enter your " + f.label + ".";
    else if (f.email && !emailPattern.test(value)) message = "Please enter a valid email address.";
    else if (f.min && value.length < f.min) message = "Your " + f.label + " is too short (at least " + f.min + " characters).";
    errEl.textContent = message;
    input.classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  function showStatus(text, ok) {
    status.textContent = text;
    status.classList.toggle("ok", Boolean(ok));
    status.hidden = false;
  }

  fields.forEach((f) => $("#" + f.id).addEventListener("blur", () => validateField(f)));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.hidden = true;
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      const firstBad = fields.find((f) => $("#" + f.id).classList.contains("invalid"));
      if (firstBad) $("#" + firstBad.id).focus();
      return;
    }

    if (!FORM_ENDPOINT) {
      showStatus(
        "Thank you! Your details look good, but this contact form is not connected to an email service yet, so nothing was sent. Please use the OnlineJobs.ph profile link or the contact details listed here.",
        false
      );
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      showStatus("Thank you! Your message has been sent.", true);
    } catch (err) {
      showStatus("Sorry, the message could not be sent. Please try again later or use the other contact details.", false);
    }
  });
}

/* ---------- Start everything ---------- */
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initNav();
  initActiveNav();
  initReveal();
  initBackToTop();
  initProfileImage();
  initProjectImages();
  initProjectFilters();
  initCredentials();
  initResumeLinks();
  initContactForm();
});
