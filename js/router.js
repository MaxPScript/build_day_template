import { renderResults } from "./results.js";
//
export function initRouter(select) {
  window.addEventListener("hashchange", () => {
    handleRoute(select);
  });
  handleRoute(select);
}
function handleRoute(select) {
  const hash = location.hash || "home";
  hideAll();
  hash === "#home" ? showHome() : null;
  hash === "#results" ? showResults(select.value) : null;
  hash === "#gallery" ? showGallery() : null;
}
function hideAll() {
  document.querySelector(".hero")?.classList.add("hidden");
  document
    .querySelectorAll(".results")
    .forEach((_) => _.classList.add("hidden"));
  document.querySelector(".gallery")?.classList.add("hidden");
}
function showHome() {
  document.querySelector(".hero")?.classList.remove("hidden");
}
function showResults(year) {
  const section = document.getElementById(`results_${year}`);
  section?.classList.remove("hidden");
  renderResults(year);
}
function showGallery() {
  document.getElementById("gallery")?.classList.remove("hidden");
}
