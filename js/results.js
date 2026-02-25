export async function renderResults(year) {
	const response = await fetch(`js/results_${year}.csv`);

	const arrayBuffer = await response.arrayBuffer();
	let textDecoded;
	try {
		textDecoded = new TextDecoder("utf-8", { fatal: true }).decode(arrayBuffer);
	} catch {
		textDecoded = new TextDecoder("windows-1251").decode(arrayBuffer);
	}
	// ReadableStream
	console.log(response);
	//
	// string consist of lines related to rows in Excel file
	console.log(textDecoded);

	const lines = textDecoded.trim().split("\n");
	// array of textDecoded string
	console.log(lines);
	// So, for clarity, Excel file should be structured in the particular way
	// for properly father processing
	// In our case Excel file structure as below
	//			/(\bSport\b)+/g
	//			/(\bTournament\b)+/g
	//			/(\bHeaders\b)+/
	//			/(\bRow\b)+/gm
	// So, amount of Tournament (Headers) reflect amount of HTML tables on the page
	//
	// Now we have array of strings. Each string consist of items, separated by comma
	// item,item,,item
	// item can be empty
	// that said in source Excel file we not allowed to have any comma inside cells!
	//
	// in each string the first item have a special meaning
	// Sport, Tournament -> will be some captions of the html table
	// and Headers -> rest items will be <th>s
	// and Row -> rest items will be <td>s
	//
	const sport = lines[0].split(",")[1];
	// sport: волейбол
	console.log(`sport: ${sport}`);
	const tournament = lines[1].split(",")[1];
	// tournament: формат 4*4 игрока
	console.log(`tournament: ${tournament}`);
	// year related tables inside this section
	const section = document.getElementById(`results_${year}`);
	console.log(section);
	//
	const tableHeaders = lines[2].split(",").slice(1);
	console.log(`tableHeaders: ${tableHeaders}`);

	//
	section.innerHTML = `
		<table class="results_table">
			<caption>
				<span style="display: block; width: max-content" class="results_table_caption_sport">${sport}</span>
				<span style="display: block; width: max-content">${tournament}</span>
			</caption>
			<thead>
				<tr>
					${tableHeaders.map((h) => `<th>${h}</th>`).join("")}
				</tr>
			</thead>
			<tbody>

			</tbody>
		</table>
	`;
	// take first row in Excel assuming that will be <th> elements
	const headers = lines[0].split(",");
	// array of strings; each string is a Excel cell's value going to be placed as <th>.innerText
	console.log(headers);
	//
	const resultsData = {};
	// start from the second Excel row (i = 1)
	// for (let i = 1; i < lines.length; i++) {
	// 	const [team, place] = lines[i].split(",");
	// skip empty lines
	// 	if (!team || !place) continue;

	// 	if (!resultsData[year]) {
	// 		resultsData[year] = [];
	// 	}
	// 	resultsData[year].push({
	// 		team: team.trim(),
	// 		place: place.trim(),
	// 	});
	// }
	// console.log(resultsData);
	// return resultsData;
}
