const el = {
	select: document.getElementById("header_select_id"),
	day: document.getElementById("header_span_day_id"),
	date: document.getElementById("header_span_date_id"),
	month: document.getElementById("header_span_month_id"),
	year: document.getElementById("header_span_year_id"),
	info: document.getElementById("header_span_info_id"),
};
const data = {
	2024: {
		day: "Суббота",
		date: 10,
		month: "Августа",
		year: 2024,
		info: "доп. информация 2024",
	},
	2025: {
		day: "Суббота",
		date: 9,
		month: "Августа",
		year: 2025,
		info: "доп. информация 2025",
	},
	2026: {
		day: "не назначено",
		date: "не назначено",
		month: "не назначено",
		year: 2026,
		info: "доп. информация 2026",
	},
};
//
export function renderHeader(year) {
	const event = data[year];
	el.day.textContent = event.day;
	el.date.textContent = event.date;
	el.month.textContent = event.month;
	el.year.textContent = event.year;
	el.info.textContent = event.info;
}
// el.select.addEventListener("change", (e) => {
// 	renderHeader(e.target.value);
// });
