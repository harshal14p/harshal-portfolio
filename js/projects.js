/* ==========================================================================
   SELECTED WORK
   Renders category filter pills and project cards entirely from the
   PROJECTS array in config.js. Edit config.js to add/update projects —
   this file does not need to change.
   ========================================================================== */

import { PROJECTS } from "./config.js";

export function initProjects() {
  const grid = document.getElementById("project-grid");
  const filterWrap = document.getElementById("project-filters");
  if (!grid) return;

  const categories = ["All", ...new Set(PROJECTS.map((p) => p.category))];

  // ---- Filter pills ----
  if (filterWrap) {
    categories.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn" + (i === 0 ? " is-active" : "");
      btn.type = "button";
      btn.textContent = cat;
      btn.dataset.category = cat;
      btn.setAttribute("data-cursor", "link");
      filterWrap.appendChild(btn);
    });

    filterWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      filterWrap.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const selected = btn.dataset.category;
      grid.querySelectorAll(".project-card").forEach((card) => {
        const match = selected === "All" || card.dataset.category === selected;
        card.style.display = match ? "" : "none";
      });
    });
  }

  // ---- Project cards ----
  PROJECTS.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.dataset.category = project.category;

    const href = project.link || project.video || "";
    const num = String(index + 1).padStart(2, "0");

    card.innerHTML = `
      <div class="project-thumb">
        <div class="thumb-fallback">${escapeHtml(project.category)}</div>
        <img alt="${escapeHtml(project.title)} thumbnail" loading="lazy" />
        <span class="project-cat">${escapeHtml(project.category)}</span>
      </div>
      <div class="project-body">
        <span class="project-index">Project ${num}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="project-desc">${escapeHtml(project.description)}</p>
        <p class="project-meta"><strong>Role:</strong> ${escapeHtml(project.role)} — ${escapeHtml(project.contribution)}</p>
        <p class="project-meta">${escapeHtml(project.tools)}</p>
        ${
          href
            ? `<a class="project-link" data-cursor="link" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">View Project</a>`
            : `<span class="project-link" style="color:var(--text-mute); cursor:default;">Add a link in config.js</span>`
        }
      </div>
    `;

    // Load the thumbnail image; if it fails (placeholder not replaced yet),
    // quietly fall back to the category-label tile already underneath it.
    const img = card.querySelector("img");
    img.addEventListener("error", () => { img.style.display = "none"; });
    img.src = project.image;

    grid.appendChild(card);

    // Newly created reveal elements need the same observer behaviour as
    // the rest of the page — re-run a lightweight version here.
    requestAnimationFrame(() => observeSingle(card));
  });
}

function observeSingle(el) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    el.classList.add("is-visible");
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
  observer.observe(el);
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(str = "") {
  return escapeHtml(str).replace(/"/g, "&quot;");
}
