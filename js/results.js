export async function renderResults(year) {
	const response = await fetch(`js/results_${year}.csv`);
	const arrayBuffer = await response.arrayBuffer();

	let textDecoded;
	try {
		textDecoded = new TextDecoder("utf-8", { fatal: true }).decode(arrayBuffer);
	} catch {
		textDecoded = new TextDecoder("windows-1251").decode(arrayBuffer);
	}

	const lines = textDecoded.trim().split("\n");
	console.log("Lines:", lines);

	// State machine to track current section
	let currentSport = "";
	let currentTournament = "";
	let currentHeaders = [];
	let currentRows = [];
	let tables = [];

	for (const line of lines) {
		const cells = line.split(",");
		const type = cells[0]?.trim();

		if (type === "Sport") {
			// Save previous table if exists
			if (currentHeaders.length > 0 && currentRows.length > 0) {
				tables.push({
					sport: currentSport,
					tournament: currentTournament,
					headers: currentHeaders,
					rows: currentRows,
				});
			}
			// New sport
			currentSport = cells[1]?.trim() || "";
			currentTournament = "";
			currentHeaders = [];
			currentRows = [];
		} else if (type === "Tournament") {
			// Save previous table if exists
			if (currentHeaders.length > 0 && currentRows.length > 0) {
				tables.push({
					sport: currentSport,
					tournament: currentTournament,
					headers: currentHeaders,
					rows: currentRows,
				});
			}
			currentTournament = cells[1]?.trim() || "";
			currentHeaders = [];
			currentRows = [];
		} else if (type === "Headers") {
			currentHeaders = cells.slice(1).map((h) => h.trim());
			// .filter((h) => h);
		} else if (type === "Row") {
			const rowData = cells.slice(1).map((c) => c.trim());
			// .filter((c) => c);
			if (rowData.length > 0) {
				currentRows.push(rowData);
			}
		}
	}

	// Save last table
	if (currentHeaders.length > 0 && currentRows.length > 0) {
		tables.push({
			sport: currentSport,
			tournament: currentTournament,
			headers: currentHeaders,
			rows: currentRows,
		});
	}

	console.log("Tables:", tables);

	const section = document.getElementById(`results_${year}`);
	if (!section) {
		console.error(`Section results_${year} not found`);
		return;
	}

	section.innerHTML = tables
		.map(
			(table) => `
		<table class="results_table">
			<caption>
				<span class="results_table_caption_sport">${table.sport}</span>
				<span>${table.tournament}</span>
			</caption>
			<thead>
				<tr>
					${table.headers.map((h) => `<th>${h}</th>`).join("")}
				</tr>
			</thead>
			<tbody>
				${table.rows
					.map(
						(row) => `
					<tr>
						${row.map((cell) => `<td>${cell}</td>`).join("")}
					</tr>
				`,
					)
					.join("")}
			</tbody>
		</table>
	`,
		)
		.join("");
}
