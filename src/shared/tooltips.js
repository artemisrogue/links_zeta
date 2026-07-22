
function $id(id) { return document.getElementById(id); }

function $q(s) { return document.querySelector(s); }

function $qa(s) { return document.querySelectorAll(s); }

function $el(t) { return document.createElement(t); }


function ttFocusable(root) {
  (root || document).querySelectorAll(".tt:not([tabindex])").forEach(el => {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-expanded", "false");
  });
}


let ttDescribed = null;
function ttAnnounce(t) {
  // One shared live region serves every tooltip, so it must be wired to exactly
  // one element at a time; otherwise each previously-touched .tt keeps pointing
  // at a node now holding some other tooltip's text.
  if (ttDescribed && ttDescribed !== t) ttDescribed.removeAttribute("aria-describedby");
  $id("ttReadout").textContent = t.getAttribute("data-tip") || "";
  t.setAttribute("aria-describedby", "ttReadout");
  ttDescribed = t;
}

function ttWantsBelow(t) {
  // A pinned tip may be up to 55vh tall, so a fixed 340px threshold under-flips on a
  // tall screen and over-flips on a short one. Compare the real space on each side.
  const r = t.getBoundingClientRect();
  const cap = Math.min(0.55 * innerHeight, 560) + 14;
  return r.top < cap && (innerHeight - r.bottom) > r.top;
}

function ttSet(t, open) {
  t.classList.toggle("tt-open", open);
  t.setAttribute("aria-expanded", String(open));
  t.classList.toggle("tt-below", open && ttWantsBelow(t));
  if (open) ttAnnounce(t);
}

// The header advertises hover as the first way in, but only the click path ever chose
// a side, so a hovered tip near the top of the screen was clipped away. Delegated so
// it covers tooltips rendered after load too.
document.addEventListener("mouseover", e => {
  const t = e.target.closest && e.target.closest(".tt");
  if (t && !t.classList.contains("tt-open")) t.classList.toggle("tt-below", ttWantsBelow(t));
});

function ttCloseAll(except) {
  $qa(".tt.tt-open").forEach(el => { if (el !== except) ttSet(el, false); });
}

document.addEventListener("click", e => {
  const t = e.target.closest(".tt");
  ttCloseAll(t);
  if (t) ttSet(t, !t.classList.contains("tt-open"));
});

document.addEventListener("focusin", e => {
  if (e.target.classList && e.target.classList.contains("tt")) ttAnnounce(e.target);
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { ttCloseAll(null); return; }
  if (e.key !== "Enter" && e.key !== " ") return;
  const t = e.target.closest ? e.target.closest(".tt") : null;
  if (t) { e.preventDefault(); ttCloseAll(t); ttSet(t, !t.classList.contains("tt-open")); }
});
