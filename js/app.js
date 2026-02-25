import { renderHeader } from "./header.js";
import { renderResults } from "./results.js";
renderResults(2024);
//
// helper function to hide/reveal element
function toggleClass(el) {
	if (!el) {
		console.log(`Can't found ${el}`);
	} else {
		el.toggleClass(".hidden");
	}
}
// initial header rendering
const select = document.getElementById("header_select_id");
renderHeader(select.value);
// update header when user select year
function updateHeader(selectYear) {
	if (!document.startViewTransition) {
		renderHeader(selectYear);
		return;
	}
	document.startViewTransition(() => {
		renderHeader(selectYear);
	});
}
select.addEventListener("change", (e) => {
	updateHeader(e.target.value);
});
//
//

let resultsData = {};

//
// function renderResults(year) {
// 	const tbody = document.getElementById("results_body");
// 	const yearSpan = document.getElementById("results_year");
// 	if (!tbody || !yearSpan) {
// 		console.log("Where your table?");
// 	}
// 	yearSpan.textContent = year;
// 	const data = resultsData[year] || [];
// 	tbody.innerHTML = data
// 		.map(
// 			(row) => `
// 			<tr>
// 				<td>${row.team}</td>
// 				<td>${row.place}</td>
// 			</tr>
// 		`,
// 		)
// 		.join("");
// }
//
select.addEventListener("change", (e) => {
	// updateHeader(e.target.value);
	renderResults(e.target.value);
});
// loadResultsFromCSV("2024").then((data) => {
// 	resultsData = data;
// 	console.log(data);
// 	renderResults(select.value);
// });
