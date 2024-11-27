// Function to fetch all guards and display them in the table
function fetchGuards() {
    fetch('/api/guards/guards-with-cell-assignments')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector('#guardsTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows
  
        data.guards.forEach(guard => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${guard.badgeNo}</td>
            <td>${guard.guardName}</td>
            <td>${guard.cellBlockID || 'Unassigned'}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(err => console.error('Error fetching guards:', err));
  }
  
  // Fetch guards when the page loads
  document.addEventListener('DOMContentLoaded', fetchGuards);
  