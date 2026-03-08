import { renderHeader } from "./header.js";
import { initRouter } from "./router.js";
import { renderResults } from "./results.js";

const select = document.getElementById("header_select_id");

renderHeader(select.value);

initRouter(select);

select.addEventListener("change", (e) => {
  const year = e.target.value;

  updateHeader(year);

  if (location.hash === "#results") {
    document
      .querySelectorAll(".results")
      .forEach((el) => el.classList.add("hidden"));

    document.getElementById(`results_${year}`).classList.remove("hidden");

    renderResults(year);
  }
});

function updateHeader(year) {
  if (!document.startViewTransition) {
    renderHeader(year);
    return;
  }

  document.startViewTransition(() => {
    renderHeader(year);
  });
}
