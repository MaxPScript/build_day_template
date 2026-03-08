// router.js
import { renderResults } from "./results.js";

export function initRouter(select) {
  if (!location.hash) {
    location.hash = "#home";
  }

  window.addEventListener("hashchange", () => handleRoute(select));

  handleRoute(select);
}

function handleRoute(select) {
  const route = location.hash.slice(1);

  hideAll(); // This should hide everything first

  switch (route) {
    case "home":
      show("home");
      break;

    case "results":
      // Show the specific results section for selected year
      showResults(select.value);
      renderResults(select.value);
      break;

    case "gallery":
      show("gallery");
      break;

    default:
      location.hash = "#home";
  }
}

function hideAll() {
  // Hide ALL sections with class 'view' - this includes home, gallery, and all results sections
  document.querySelectorAll(".view").forEach((el) => {
    el.classList.add("hidden");
  });

  // Also explicitly hide all results sections to be safe
  document.querySelectorAll(".results").forEach((el) => {
    el.classList.add("hidden");
  });
}

function show(id) {
  hideAll();
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("hidden");
  }
}

function showResults(year) {
  // First hide all results sections
  document.querySelectorAll(".results").forEach((el) => {
    el.classList.add("hidden");
  });

  // Then show the specific one
  const section = document.getElementById(`results_${year}`);
  if (section) {
    section.classList.remove("hidden");
  }
}
