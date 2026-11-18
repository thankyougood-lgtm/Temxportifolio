(function () {
  "use strict";

  /* ---------- DEBUG HELPERS ---------- */
  const log   = (...a) => console.log  ("%c[portfolio]", "color:#00f2fe;font-weight:bold", ...a);
  const warn  = (...a) => console.warn ("%c[portfolio]", "color:#fbbf24;font-weight:bold", ...a);
  const error = (...a) => console.error("%c[portfolio]", "color:#ef4444;font-weight:bold", ...a);

  log("script loaded");

  /* ---------- PROJECT DATA ---------- */
  const projectsData = [
    {
      category: "PWA / MOBILE",
      title: "Notes App",
      description:
        "A clean, responsive note-taking application with search, folders, favorites, and trash features. Built for quick productivity.",
      tags: ["HTML", "CSS", "JS", "Tailwind"],
      image: "./assets/noteapp.png",
      liveLink: "https://thankyougood-lgtm.github.io/note-app/",
      githubLink: "https://github.com/thankyougood-lgtm/note-app",
    },
    {
      category: "DASHBOARD",
      title: "Super Excel (Markbook)",
      description:
        "A powerful, offline-capable markbook and attendance system for teachers. Features easy mark entry, data analysis charts, and Excel exports.",
      tags: ["React", "TypeScript", "PWA", "Data"],
      image: "./assets/supperexcle.png",
      liveLink: "https://markbook.temtysson.workers.dev/",
      githubLink: "https://github.com/thankyougood-lgtm/markbook",
    },
    {
      category: "WEB APP / PWA",
      title: "Grade Tracker",
      description:
        "A student management interface for teachers. Includes intuitive data entry, quick undo/redo, and a clean mobile-first dashboard.",
      tags: ["React", "Node.js", "UI/UX"],
      image: "./assets/markbook-app.png",
      liveLink: "https://markbook.temtysson.workers.dev/",
      githubLink: "https://github.com/thankyougood-lgtm/markbook",
    },
  ];

  /* ---------- HELPERS ---------- */
  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
    }[c]));

  const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#02040a"/>
            <stop offset="100%" stop-color="#0f3b44"/>
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill="url(#g)"/>
        <circle cx="400" cy="220" r="44" fill="none" stroke="#00f2fe" stroke-width="4" opacity="0.6"/>
        <path d="M360 250l30-30 24 24 20-20 26 26" fill="none" stroke="#00f2fe" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
        <text x="400" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="#cbd5e1" opacity="0.8">Project image</text>
      </svg>
    `);

  const prefersReducedMotion = () =>
    typeof window.matchMedia === "function" &&
    false /* forced ON — animations always play */;

  function renderProjectLink(url, label, className) {
    const safeUrl = String(url || "").trim();
    if (!safeUrl || safeUrl === "#") {
      return `<span class="btn-disabled" aria-disabled="true">${escapeHtml(label)}</span>`;
    }
    return `<a href="${escapeHtml(safeUrl)}" class="${className}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  }

  /* ==========================================================
     PROJECTS
     ========================================================== */
  function initProjects() {
    const grid = document.getElementById("projectsGrid");
    if (!grid) return warn("initProjects: #projectsGrid not found");

    grid.innerHTML = projectsData.map((p) => {
      const tags = p.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("");
      return `
        <article class="project-card">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)} screenshot"
               loading="lazy" decoding="async" width="800" height="500">
          <span class="project-tag">${escapeHtml(p.category)}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.description)}</p>
          <div class="project-meta">${tags}</div>
          <div class="project-links">
            ${renderProjectLink(p.liveLink, "Live Demo", "btn-primary")}
            ${renderProjectLink(p.githubLink, "GitHub Code", "btn-secondary")}
          </div>
        </article>`;
    }).join("");

    const applyFallback = (img) => {
      if (img.dataset.fallbackApplied === "true") return;
      img.dataset.fallbackApplied = "true";
      img.src = PLACEHOLDER_IMAGE;
      img.alt = "Project image placeholder";
    };

    grid.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => applyFallback(img), { once: true });
      if (img.complete && img.naturalWidth === 0) applyFallback(img);
    });
  }

  /* ==========================================================
     HERO NAME: TYPEWRITER + PARALLAX  (unchanged behaviour)
     ========================================================== */
  function initHeroName() {
    const heroTitle = document.getElementById("heroTitle");
    if (!heroTitle) return warn("initHeroName: #heroTitle not found");

    const fullText = (heroTitle.textContent || "").trim();
    if (!fullText) return warn("initHeroName: #heroTitle is empty");

    log("initHeroName: starting typing effect for:", JSON.stringify(fullText));

    const reduced = prefersReducedMotion();
    if (reduced) log("initHeroName: reduced motion → softer effect, no parallax");

    const typingSpeed  = reduced ? 45 : 380;
    const typingJitter = reduced ? 15 : 140;
    const deleteSpeed  = reduced ? 20 : 45;
    const deleteJitter = reduced ? 8  : 30;
    const holdDelay    = reduced ? 2200 : 4200;
    const emptyDelay   = reduced ? 400  : 900;
    const introDelay   = reduced ? 100  : 900;

    const makeLetter = (char) => {
      const s = document.createElement("span");
      s.className = "letter";
      s.textContent = char === " " ? "\u00A0" : char;
      s.setAttribute("aria-hidden", "true");
      return s;
    };

    const restoreText = () => { heroTitle.textContent = fullText; };

    try {
      heroTitle.textContent = "";

      const cursor = document.createElement("span");
      cursor.className = "type-cursor";
      cursor.setAttribute("aria-hidden", "true");
      heroTitle.appendChild(cursor);

      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const letters = [];

      const typeOnce = async () => {
        for (const ch of fullText) {
          const letter = makeLetter(ch);
          heroTitle.insertBefore(letter, cursor);
          letters.push(letter);
          await sleep(typingSpeed + Math.random() * typingJitter);
        }
      };

      const deleteOnce = async () => {
        while (letters.length) {
          const last = letters.pop();
          if (last && last.parentNode) last.parentNode.removeChild(last);
          await sleep(deleteSpeed + Math.random() * deleteJitter);
        }
      };

      (async () => {
        try {
          await sleep(introDelay);
          log("initHeroName: typewriter loop started");
          while (true) {
            await typeOnce();
            heroTitle.classList.add("is-typed");
            await sleep(holdDelay);
            heroTitle.classList.remove("is-typed");
            heroTitle.querySelectorAll(".letter").forEach((l) => { l.style.transform = ""; });
            await deleteOnce();
            await sleep(emptyDelay);
          }
        } catch (err) {
          error("initHeroName: typewriter loop failed", err);
          restoreText();
        }
      })();

      if (reduced) return;

      /* Parallax */
      const hero = document.querySelector(".hero");
      if (!hero) return warn("initHeroName: .hero not found, skipping parallax");

      let tx = 0, ty = 0, cx = 0, cy = 0, inside = false, rafId = null;
      const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
      const isTyped = () => heroTitle.classList.contains("is-typed");
      const clearT = () => heroTitle.querySelectorAll(".letter").forEach((l) => { l.style.transform = ""; });

      const animate = () => {
        if (!isTyped()) { clearT(); rafId = null; return; }
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        heroTitle.querySelectorAll(".letter").forEach((l, i) => {
          const d = 3 + (i % 6) * 1.4;
          const x = cx * d * 2.4;
          const y = cy * d * 2.4;
          const r = (i % 2 === 0 ? 1 : -1) * cx * 4;
          l.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${r.toFixed(2)}deg)`;
        });
        const settled = Math.abs(cx - tx) < 0.001 && Math.abs(cy - ty) < 0.001;
        if (settled) { if (!inside) clearT(); rafId = null; return; }
        rafId = requestAnimationFrame(animate);
      };
      const start = () => { if (rafId === null) rafId = requestAnimationFrame(animate); };

      hero.addEventListener("pointermove", (e) => {
        if (!isTyped()) return;
        const r = hero.getBoundingClientRect();
        if (!r.width || !r.height) return;
        tx = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5);
        ty = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5);
        inside = true;
        start();
      }, { passive: true });

      hero.addEventListener("pointerleave", () => {
        tx = 0; ty = 0; inside = false; start();
      }, { passive: true });

    } catch (err) {
      error("initHeroName: unexpected error", err);
      restoreText();
    }
  }

  /* ==========================================================
     BOUNCE LINE: "I'm Temesgen"
     ========================================================== */
  function initBounceLine() {
    const line = document.getElementById("bounceLine");
    if (!line) return warn("initBounceLine: #bounceLine not found");

    const originalText = (line.dataset.text || line.textContent || "").trim();
    if (!originalText) return warn("initBounceLine: empty text");

    log("initBounceLine: building bounce for", JSON.stringify(originalText));

    line.textContent = "";
    let idx = 0;
    const words = originalText.split(/\s+/);

    words.forEach((word, wordIdx) => {
      for (const ch of word) {
        const span = document.createElement("span");
        span.className = "bounce-letter";
        span.textContent = ch;
        span.style.setProperty("--i", String(idx));
        span.setAttribute("aria-hidden", "true");
        line.appendChild(span);
        idx++;
      }
      if (wordIdx < words.length - 1) {
        const space = document.createElement("span");
        space.className = "bounce-space";
        space.textContent = "\u00A0";
        space.setAttribute("aria-hidden", "true");
        line.appendChild(space);
        idx++;
      }
    });
  }

  /* ==========================================================
     ROTATING ROLES: "I am a …"  auto-typewriter
     ========================================================== */
  function initRotatingRoles() {
    const target = document.getElementById("roleTyped");
    if (!target) return warn("initRotatingRoles: #roleTyped not found");

    const roles = [
      "Full Stack Developer",
      "Web Developer",
      "Progressive Web App (PWA) Developer",
    ];

    if (prefersReducedMotion()) {
      log("initRotatingRoles: reduced motion → static first role");
      target.textContent = roles[0];
      const cursor = document.querySelector(".role-cursor");
      if (cursor) cursor.style.display = "none";
      return;
    }

    const typeDelay  = 85;
    const typeJitter = 45;
    const delDelay   = 40;
    const delJitter  = 20;
    const holdTime   = 1600;
    const gapTime    = 450;

    let roleIndex = 0;
    let charIndex = 0;
    let deleting  = false;

    const step = () => {
      const role = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        target.textContent = role.slice(0, charIndex);
        if (charIndex >= role.length) {
          deleting = true;
          setTimeout(step, holdTime);
          return;
        }
        setTimeout(step, typeDelay + Math.random() * typeJitter);
      } else {
        charIndex--;
        if (charIndex < 0) charIndex = 0;
        target.textContent = role.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting  = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(step, gapTime);
          return;
        }
        setTimeout(step, delDelay + Math.random() * delJitter);
      }
    };

    log("initRotatingRoles: starting with", roles.length, "roles");
    setTimeout(step, 900);
  }

  /* ==========================================================
     ACTIVE NAV
     ========================================================== */
  function initActiveNav() {
    const links = Array.from(document.querySelectorAll("[data-nav]"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    const sections = links.map((l) => {
      const href = l.getAttribute("href");
      if (!href || href === "#") return null;
      const section = document.querySelector(href);
      return section ? { link: l, section, href } : null;
    }).filter(Boolean);

    if (!sections.length) return;

    const setActive = (href) => {
      links.forEach((l) => {
        const on = l.getAttribute("href") === href;
        l.classList.toggle("active", on);
        on ? l.setAttribute("aria-current", "page") : l.removeAttribute("aria-current");
      });
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const matched = sections.find(({ section }) => section === visible[0].target);
      if (matched) setActive(matched.href);
    }, {
      rootMargin: "-50% 0px -50% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sections.forEach(({ section }) => observer.observe(section));
  }

  /* ---------- FOOTER YEAR ---------- */
  function updateYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- SAFE BOOT ---------- */
  function safeInit(name, fn) {
    try { fn(); } catch (err) { error(`init(${name}) failed:`, err); }
  }

  function boot() {
    safeInit("projects",       initProjects);
    safeInit("heroName",       initHeroName);
    safeInit("bounceLine",     initBounceLine);
    safeInit("rotatingRoles",  initRotatingRoles);
    safeInit("activeNav",      initActiveNav);
    safeInit("year",           updateYear);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();