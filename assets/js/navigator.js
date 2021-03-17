"use strict";
let sidebar = document.getElementById("sidebar");
let content = document.getElementById("content");
let nav = document.getElementById("nav");

// The navbar contents are always shown by default,
// when we can execute JS, make sure to hide them off. Otherwise it will always be shown.
{
  let stylesheet = document.createElement("style");
  stylesheet.innerText = "ul:not(:first-child):not(.active) { visibility: hidden; } li > ul:not(.active) { display: none; }";
  document.head.appendChild(stylesheet);
}

// Get the actual elements the anchors refers to
let elements = [];
let anchors = Array.from(nav.getElementsByTagName("a"));
for (let e of anchors) {
  elements.push(document.getElementById(e.hash.slice(1)));
}
elements.reverse();

function iterParents(elm, cb) {
  while (elm) {
    if (cb.call(cb, elm) === false) break;
    elm = elm.parentElement;
  }
}

// Scroll-spy
let selected, lastAnchor;
function scrollSpy() {
  let current = elements.find((elm) => window.scrollY >= elm.offsetTop - 75);
  if (!current) { // Deactivate all anchors
    iterParents(lastAnchor, (elm) => { elm.nodeName === "UL" && elm.classList.remove("active"); });
    return;
  } else if (current === selected) {
    return;
  }
  selected = current;
  
  let anchor = anchors.find((elm) => elm.hash === "#" + current.id);
  if (!anchor) return;

  // Scroll the sidebar if necessary
  if (sidebar.scrollTop + sidebar.offsetHeight <= anchor.offsetTop + anchor.offsetHeight)
    sidebar.scrollBy({
      top: anchor.offsetHeight * 2,
      behavior: "smooth"
    });
  else if (sidebar.scrollTop > anchor.offsetTop)
    sidebar.scrollBy({
      top: -(anchor.offsetHeight * 2),
      behavior: "smooth"
    });

  // Deactivate previous anchors
  iterParents(lastAnchor, elm => {
    if (elm == anchor.parentElement.parentElement)
    return false;
    if (elm.nodeName === "UL")
    elm.classList.remove("active");
  });
  lastAnchor === null || lastAnchor === void 0 ? void 0 : lastAnchor.parentElement.classList.remove("selected");
  
  // Activate new anchor
  iterParents(anchor, (elm) => {
    if (elm.classList.contains('active'))
    return false;
    if (elm.nodeName === "UL")
    elm.classList.add("active");
  });
  anchor.parentElement.classList.add("selected");
  
  lastAnchor = anchor;
}

const positionSpy = (() => {
  const originalTop = sidebar.offsetTop;
  const originalMargin = getComputedStyle(sidebar).marginTop;
  
  return () => {
    if (window.scrollY < originalTop) {
      sidebar.style.position = "absolute";
      sidebar.style.top = "initial";
    } else {
      sidebar.style.position = "fixed";
      sidebar.style.top = '-' + originalMargin;
    }
  };
})();

// Initial positioning
positionSpy();
scrollSpy();

// TODO: Unassign the listener if the navigator is hidden
this.addEventListener("scroll", () => {
  positionSpy();
  scrollSpy();
});
