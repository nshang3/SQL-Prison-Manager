function fetchCells() {
    fetch('/api/cells/get-cells')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector('#cellsTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows
  
        data.cells.forEach(cell => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${cell.cellNo}</td>
            <td>${cell.cellBlockID}</td>
            <td>${cell.cellType}</td>
            <td>${cell.floorNo}</td>
            <td>${cell.capacity}</td>
            <td>${cell.occupancy}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(err => console.error('Error fetching cells:', err));
  }
  
  // Fetch guards when the page loads
  document.addEventListener('DOMContentLoaded', fetchCells);