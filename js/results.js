export async function renderResults(year) {
  const text = await loadCSV(year);
  console.log(text);
  // test_1.innerText = text;
  // test_2.innerHTML = text;
  // test_3.textContent = text;
  // const lines = splitLines(text);
  let lines = splitLines(text);
  console.log(lines);
  // We handle the “error” of parsing an Excel cell with a line break inside
  lines = ((lines) => {
    let res = [];
    let buffer = "";
    lines.forEach((line) => {
      buffer += (buffer === "" ? "" : "\n") + line;
      const quoteCount = (buffer.match(/"/g) || []).length;
      if (quoteCount % 2 === 0) {
        res.push(buffer);
        buffer = "";
      }
    });
    return res;
  })(lines);
  console.log(lines);
  //

  const tables = parseTables(lines);

  const html = buildTablesHTML(tables);

  const section = getResultsSection(year);

  insertHTML(section, html);

  /* =========================
     LOAD CSV
  ========================= */

  async function loadCSV(year) {
    const response = await fetch(`js/results_${year}.csv`);

    const buffer = await response.arrayBuffer();

    return decodeBuffer(buffer);
  }

  function decodeBuffer(buffer) {
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    } catch {
      return new TextDecoder("windows-1251").decode(buffer);
    }
  }

  /* =========================
     TEXT PROCESSING
  ========================= */

  function splitLines(text) {
    return text.trim().split("\n");
  }

  function parseHeaders(cells) {
    return cells.slice(1).map((c) => c.trim());
  }

  function parseRow(cells) {
    const _cells = cells.slice(1).map((c) => c.trim().replaceAll('"', ""));
    console.log(_cells);
    return _cells;
  }

  /* =========================
     PARSER
  ========================= */

  function parseTables(lines) {
    let currentSport = "";
    let currentTournament = "";
    let currentHeaders = [];
    let currentRows = [];

    const tables = [];

    for (const line of lines) {
      const cells = line.split(",");

      const type = cells[0]?.trim();

      if (type === "Sport") {
        pushTable();

        currentSport = cells[1]?.trim() || "";

        resetTable();
      } else if (type === "Tournament") {
        pushTable();

        currentTournament = cells[1]?.trim() || "";

        resetTable();
      } else if (type === "Headers") {
        currentHeaders = parseHeaders(cells);
      } else if (type === "Row") {
        currentRows.push(parseRow(cells));
      }
    }

    pushTable();

    return tables;

    function pushTable() {
      if (currentHeaders.length && currentRows.length) {
        tables.push({
          sport: currentSport,
          tournament: currentTournament,
          headers: currentHeaders,
          rows: currentRows
        });
      }
    }

    function resetTable() {
      currentHeaders = [];
      currentRows = [];
    }
  }

  /* =========================
     HTML BUILDING
  ========================= */

  function buildTablesHTML(tables) {
    return tables.map(buildTableHTML).join("");
  }

  function buildTableHTML(table) {
    return `
<table class="results_table">

<caption>
<span class="results_table_caption_sport">
${table.sport}
</span>

<span>
${table.tournament}
</span>
</caption>

<thead>
<tr>
${table.headers.map((h) => `<th>${h}</th>`).join("")}
</tr>
</thead>

<tbody>
${table.rows.map(buildRowHTML).join("")}
</tbody>

</table>
`;
  }

  function buildRowHTML(row) {
    const placeClass = getPlaceClass(row[0]);

    return `
<tr>

${row
  .map((cell, index) => {
    const className = index === row.length - 1 && placeClass ? placeClass : "";

    return `<td class="${className}">
${cell.replaceAll("\n", "<br>")}
</td>`;
  })
  .join("")}

</tr>
`;
  }

  /* =========================
     DOM
  ========================= */

  function getResultsSection(year) {
    const section = document.getElementById(`results_${year}`);

    if (!section) {
      throw new Error(`results_${year} not found`);
    }

    return section;
  }

  function insertHTML(el, html) {
    el.innerHTML = html;
  }

  /* =========================
     UTIL
  ========================= */

  function getPlaceClass(place) {
    if (place === "1") return "place-1";
    if (place === "2") return "place-2";
    if (place === "3") return "place-3";

    return "";
  }
}
