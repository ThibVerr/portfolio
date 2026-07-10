// ============================================================
// Thibault Verrue - portfolio interactions
// ============================================================

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- language toggle (Dutch / English) ----------
(function initLang() {
  const root = document.documentElement;
  const stored = localStorage.getItem("lang");
  const initial = stored || (navigator.language && navigator.language.toLowerCase().startsWith("nl") ? "nl" : "en");
  root.setAttribute("lang", initial);

  // apply per-page translations to <title>, meta[name=description] and any [data-i18n-*] pairs
  applyLangAttrs(initial);

  const btn = document.querySelector(".lang-toggle");
  if (!btn) return;
  const updateBtn = (lang) => {
    btn.setAttribute("aria-label", lang === "nl" ? "Switch to English" : "Overschakelen naar Nederlands");
    btn.setAttribute("title", lang === "nl" ? "Switch to English" : "Overschakelen naar Nederlands");
  };
  updateBtn(initial);
  btn.addEventListener("click", () => {
    const next = root.getAttribute("lang") === "nl" ? "en" : "nl";
    root.setAttribute("lang", next);
    localStorage.setItem("lang", next);
    updateBtn(next);
    applyLangAttrs(next);
  });
})();

function applyLangAttrs(lang) {
  const other = lang === "nl" ? "en" : "nl";
  document.querySelectorAll(`[data-title-${lang}]`).forEach((el) => {
    const t = el.getAttribute(`data-title-${lang}`);
    if (el.tagName === "TITLE") document.title = t;
    else if (el.tagName === "META") el.setAttribute("content", t);
  });
  document.querySelectorAll("[data-aria-nl][data-aria-en]").forEach((el) => {
    el.setAttribute("aria-label", el.getAttribute(`data-aria-${lang}`));
  });
  document.querySelectorAll("[data-alt-nl][data-alt-en]").forEach((el) => {
    el.setAttribute("alt", el.getAttribute(`data-alt-${lang}`));
  });
}

// ---------- theme toggle (dark / light) ----------
(function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  const btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    btn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    // notify particle system so it can restyle if needed
    window.dispatchEvent(new CustomEvent("theme:change", { detail: { theme: next } }));
  });
})();

// ---------- mobile nav toggle ----------
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

// ---------- reveal on scroll ----------
const items = document.querySelectorAll(".reveal");
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("in"));
}

// ---------- scroll progress bar ----------
(function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = Math.max(0, Math.min(1, scrolled)) * 100 + "%";
  };
  document.addEventListener("scroll", update, { passive: true });
  update();
})();

// ---------- footer year ----------
const y = document.querySelector("#year");
if (y) y.textContent = new Date().getFullYear();

// ---------- horizontal project rails ----------
document.querySelectorAll(".rail-wrap").forEach((wrap) => {
  const rail = wrap.querySelector(".rail");
  const scope = wrap.closest("section") || document;
  if (!rail) return;

  // arrow buttons
  scope.querySelectorAll("[data-rail-dir]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = rail.firstElementChild;
      const step = card ? card.offsetWidth + 26 : 380;
      rail.scrollBy({
        left: btn.dataset.railDir === "next" ? step : -step,
        behavior: reduce ? "auto" : "smooth",
      });
    });
  });

  // toggle the left fade once the user has scrolled
  const onScroll = () => {
    wrap.classList.toggle("scrolled", rail.scrollLeft > 8);
  };
  rail.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});

// ---------- tsParticles neural network background ----------
(function initParticles() {
  if (reduce) return; // respect motion preferences
  if (!window.tsParticles) return;

  const getAccent = () => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    return v || "#2B4BE6";
  };

  const config = () => ({
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      number: { value: 55, density: { enable: true, area: 900 } },
      color: { value: getAccent() },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.25, max: 0.6 },
        animation: { enable: true, speed: 0.5, sync: false },
      },
      size: { value: { min: 1, max: 2.5 } },
      links: {
        enable: true,
        distance: 150,
        color: getAccent(),
        opacity: 0.28,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        outModes: { default: "bounce" },
      },
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        grab: { distance: 180, links: { opacity: 0.55 } },
        push: { quantity: 3 },
      },
    },
    detectRetina: true,
  });

  tsParticles.load({ id: "tsparticles", options: config() });

  // reload with new accent color on theme change
  window.addEventListener("theme:change", () => {
    const container = tsParticles.dom()[0];
    if (container) container.destroy();
    tsParticles.load({ id: "tsparticles", options: config() });
  });
})();
