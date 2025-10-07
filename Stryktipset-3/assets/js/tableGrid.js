// Celler för radnummer
export function createRowNumberCell(id) {
    const td = document.createElement("td");
    td.textContent = id;
    return td;
  }
  
  // Celler för lag-länkarna
  export function createTeamsCell(teams) {
    const td = document.createElement("td");
    td.innerHTML = `
      <a href="${teams[0].homepage}" target="_blank">${teams[0].teamName}</a> - 
      <a href="${teams[1].homepage}" target="_blank">${teams[1].teamName}</a>
    `;
    return td;
  }
  
  // Celler för 1, X, 2 och checkmark
  export function createOutcomeCells(outcome) {
    const outcomes = ["1", "X", "2"];
    return outcomes.map(o => {
      const td = document.createElement("td");
      if (outcome === o) {
        td.innerHTML = `
          <div class="checkmark">
            <span class="stem"></span>
            <span class="kick"></span>
          </div>
        `;
      }
      return td;
    });
  }
  