export async function renderResults(year) {
  const section = document.getElementById(`results_${year}`);
  section.innerHTML = `<div class="loading">Загрузка результатов...</div>`;

  try {
    const text = await loadCSV(year);

    const rows = parseCSV(text);

    const tables = parseTables(rows);

    const html = buildTablesHTML(tables);
    section.innerHTML = html;
  } catch (error) {
    console.error(`Failed to load results: ${error}`, error);
    section.innerHTML = `<div class="error">Ошибка загрузки результатов</div>`;
  }

  // const section = getResultsSection(year);
}

/* =========================
   LOAD CSV
========================= */

const csvCache = {};

async function loadCSV(year) {
  if (csvCache[year]) return csvCache[year];

  try {
    const response = await fetch(`js/results_${year}.csv`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    const text = decodeBuffer(buffer);

    csvCache[year] = text;

    return text;
  } catch (error) {
    console.error(`Failed to load CSV for ${year}`, error);
    throw error;
  }
}

function decodeBuffer(buffer) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("windows-1251").decode(buffer);
  }
}

/* =========================
   CSV PARSER (REGEX TOKENIZER)
========================= */

function parseCSV(text) {
  const rows = [];

  const pattern = /("(?:[^"]|"")*"|[^,\n]*)(,|\n|$)/g;

  let row = [];

  text.replace(pattern, (match, cell, separator) => {
    if (cell.startsWith('"')) {
      cell = cell.slice(1, -1).replace(/""/g, '"');
    }

    row.push(cell);

    if (separator === "\n" || separator === "") {
      rows.push(row);
      row = [];
    }

    return "";
  });

  return rows;
}

/* =========================
   TABLE PARSER (STATE MACHINE)
========================= */

function parseTables(rows) {
  const tables = [];

  let table = null;

  for (const cells of rows) {
    const type = cells[0]?.trim();

    switch (type) {
      case "Sport":
        pushTable();

        table = {
          sport: cells[1]?.trim() || "",
          tournament: "",
          headers: [],
          rows: []
        };

        break;

      case "Tournament":
        if (table) {
          table.tournament = cells[1]?.trim() || "";
        }

        break;

      case "Headers":
        if (table) {
          table.headers = cells.slice(1).map((c) => c.trim());
        }

        break;

      case "Row":
        if (table) {
          table.rows.push(cells.slice(1).map((c) => c.trim()));
        }

        break;
    }
  }

  pushTable();

  return tables;

  function pushTable() {
    if (table && table.headers.length && table.rows.length) {
      tables.push(table);
    }
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
  const placeClass = getPlaceClass(row[row.length - 1]);

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

// function getResultsSection(year) {
//   const section = document.getElementById(`results_${year}`);

//   if (!section) {
//     throw new Error(`results_${year} not found`);
//   }

//   return section;
// }

/* =========================
   UTIL
========================= */

function getPlaceClass(place) {
  if (place === "1") return "place-1";
  if (place === "2") return "place-2";
  if (place === "3") return "place-3";

  return "";
}
