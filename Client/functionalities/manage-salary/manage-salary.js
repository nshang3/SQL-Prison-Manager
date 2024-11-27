// Function to fetch guards in 'Maximum' security level
function fetchMaximumSecurityGuards() {
    fetch('/api/guards/guards-in-maximum-security')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector('#maximumSecurityGuardsTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows
  
        data.guards.forEach(guard => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${guard.badgeNo}</td>
            <td>${guard.guardName}</td>
            <td>${guard.salary}</td>
            <td>
              <button class="update-salary-btn" data-badgeNo="${guard.badgeNo}">Update Salary</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
  
        // Add event listeners to the "Update Salary" buttons
        document.querySelectorAll('.update-salary-btn').forEach(button => {
          button.addEventListener('click', handleUpdateSalary);
        });
      })
      .catch(err => console.error('Error fetching maximum security guards:', err));
  }
  
  // Function to handle the "Update Salary" button click
  function handleUpdateSalary(event) {
    const badgeNo = event.target.dataset.badgeno; // Correct dataset attribute access
  
    if (!badgeNo) {
      console.error('Error: badgeNo is undefined');
      alert('Unable to retrieve guard Badge No. Please try again.');
      return;
    }
  
    console.log('Badge No:', badgeNo); // Debug log to confirm badgeNo value
  
    const multiplierInput = prompt(`Enter the salary multiplier for guard with Badge No ${badgeNo}:`, 1.1);
  
    if (multiplierInput && !isNaN(multiplierInput)) {
      const multiplier = parseFloat(multiplierInput);
      updateGuardSalary(badgeNo, multiplier);
    } else {
      alert('Invalid multiplier. Please enter a valid number.');
    }
  }
  
  
  
  // Function to update the guard's salary
  function updateGuardSalary(badgeNo, multiplier) {
    console.log(`Updating salary for badgeNo: ${badgeNo} with multiplier: ${multiplier}`); // Debug log
  
    fetch('/api/guards/update-salary', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ badgeNo, multiplier }), // Pass badgeNo and multiplier in request body
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Failed to update salary');
          });
        }
        return response.json();
      })
      .then(data => {
        alert(data.message || 'Salary updated successfully');
        fetchMaximumSecurityGuards(); // Refresh the table
      })
      .catch(err => {
        console.error('Error updating salary:', err.message);
        alert(err.message);
      });
  }
  
  // Fetch guards when the page loads
  document.addEventListener('DOMContentLoaded', fetchMaximumSecurityGuards);
  