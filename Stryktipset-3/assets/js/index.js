import fetchJsonApiData from './fetchJsonApiData.js';
import { createRowNumberCell, createTeamsCell, createOutcomeCells } from './tableGrid.js';

const table = document.querySelector("#table");

async function resultsPool() {
    const games = await fetchJsonApiData();
  
    games.forEach(game => {
      const tableRow = createTableRow(game);
      table.appendChild(tableRow);
    });
  }

function createTableRow(game) {
  const tableRow = document.createElement("tr");

  tableRow.appendChild(createRowNumberCell(game.id));
  tableRow.appendChild(createTeamsCell(game.teams));
  tableRow.append(...createOutcomeCells(game.outcome)); // Spread operatorn pga arreyen

  return tableRow;
}

resultsPool();
