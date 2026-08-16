/* Selected Work — resilient client-side renderer. */
import { PROJECTS } from "./config.js";

export function initProjects(){
  const grid=document.getElementById("project-grid");
  const filterWrap=document.getElementById("project-filters");
  if(!grid)return;
  if(grid.dataset.rendered==="true")return;
  grid.dataset.rendered="true";

  const categories=["All",...new Set(PROJECTS.map(p=>p.category).filter(Boolean))];
  if(filterWrap){
    filterWrap.replaceChildren();
    categories.forEach((cat,i)=>{
      const btn=document.createElement("button");
      btn.className=`filter-btn${i===0?" is-active":""}`;btn.type="button";btn.textContent=cat;btn.dataset.category=cat;btn.setAttribute("data-cursor","link");filterWrap.appendChild(btn);
    });
    filterWrap.addEventListener("click",e=>{const btn=e.target.closest(".filter-btn");if(!btn)return;filterWrap.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("is-active"));btn.classList.add("is-active");const selected=btn.dataset.category;grid.querySelectorAll(".project-card").forEach(card=>{card.hidden=selected!=="All"&&card.dataset.category!==selected})});
  }

  const fragment=document.createDocumentFragment();
  PROJECTS.forEach((project,index)=>fragment.appendChild(createCard(project,index)));
  grid.replaceChildren(fragment);
  grid.querySelectorAll(".project-card").forEach(card=>card.classList.add("is-visible"));
}

function createCard(project,index){
  const card=document.createElement("article");card.className="project-card reveal is-visible";card.dataset.category=project.category||"Other";
  const href=project.link||project.video||"";const num=String(index+1).padStart(2,"0");
  card.innerHTML=`<div class="project-thumb"><div class="thumb-fallback">${escapeHtml(project.category||"Project")}</div><img alt="${escapeHtml(project.title||"Project")} thumbnail" loading="lazy" decoding="async"><span class="project-cat">${escapeHtml(project.category||"Project")}</span></div><div class="project-body"><span class="project-index">Project ${num}</span><h3>${escapeHtml(project.title||"Untitled Project")}</h3><p class="project-desc">${escapeHtml(project.description||"")}</p><p class="project-meta"><strong>Role:</strong> ${escapeHtml(project.role||"")} — ${escapeHtml(project.contribution||"")}</p><p class="project-meta">${escapeHtml(project.tools||"")}</p>${href?`<a class="project-link" data-cursor="link" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">View Project</a>`:`<span class="project-link project-link-disabled">Project details</span>`}</div>`;
  const img=card.querySelector("img");
  img.src=project.image||"";
  img.addEventListener("error",()=>{img.removeAttribute("src");img.style.display="none"},{once:true});
  return card;
}
function escapeHtml(value=""){return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function escapeAttr(value=""){return escapeHtml(value).replace(/"/g,"&quot;")}
