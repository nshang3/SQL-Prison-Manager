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

  document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('cellModal');
    const addCellBtn = document.getElementById('addCellBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('cellForm');
  
    // Open modal when "Add prisoner" button is clicked
    addCellBtn.onclick = function() {
      modal.style.display = "block";
    };
  
    // Close modal when the "X" button is clicked
    closeBtn.onclick = function() {
      modal.style.display = "none";
    };
  
    // Close modal if the user clicks outside the modal content
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  

    form.onsubmit = function(e) {
      e.preventDefault(); 
  
      const newCell = {
        cellBlockID: document.getElementById('cellBlockID').value,
        cellType: document.getElementById('cellType').value,
        floorNo: document.getElementById('floorNo').value,
      };
  

      fetch('/api/cells', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCell),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Cell added successfully:', data);
        if (data.message) {
          alert(data.message);
          fetchCells(); 
        } else {
          alert('An error occurred while adding the cell.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the cell.');
      });
  

      modal.style.display = "none";
  

      form.reset();
    };
  });