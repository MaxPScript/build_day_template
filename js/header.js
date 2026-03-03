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
		info: "Сбор участников в 9.00 на спортплощадке возле ДЮСШ",
	},
	2025: {
		day: "Суббота",
		date: 9,
		month: "Августа",
		year: 2025,
		info: "Сбор участников в 9.00 на спортплощадке возле школы",
	},
	2026: {
		day: "не назначено",
		date: "не назначено",
		month: "не назначено",
		year: 2026,
		info: "не назначено",
	},
};
//
export function renderHeader(year) {
	const event = data[year];
	el.day.textContent = event.day;
	if(el.day.textContent === "не назначено"){
		el.day.style.border = `2px dashed red`
	}
	el.date.textContent = event.date;
	if(el.date.textContent === "не назначено"){
		el.date.style.border = `2px dashed red`
	}
	el.month.textContent = event.month;
	if(el.month.textContent === "не назначено"){
		el.month.style.border = `2px dashed red`
	}
	el.year.textContent = event.year;
	el.info.textContent = event.info;

	if(el.info.textContent === "не назначено"){
		el.info.style.border = `2px dashed red`
	}
}
// el.select.addEventListener("change", (e) => {
// 	renderHeader(e.target.value);
// });
