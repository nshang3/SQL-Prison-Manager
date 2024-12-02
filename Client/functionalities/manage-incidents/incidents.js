document.addEventListener('DOMContentLoaded', function () {
  const fetchIncidentsBtn = document.getElementById('fetchIncidentsBtn');
  const dateFilter = document.getElementById('dateFilter');
  const tableBody = document.querySelector('#incidentsTable tbody');
  const refreshBtn = document.getElementById('refreshBtn');

  // Function to fetch and display incidents based on the selected date
  function fetchIncidents(date) {
    const url = date 
      ? `/api/incidents/fetch-incident-reports?date=${date}` 
      : '/api/incidents/all-incident-reports';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        tableBody.innerHTML = ''; // Clear existing rows

        if (!data.incidentReports || data.incidentReports.length === 0) {
          const row = document.createElement('tr');
          row.innerHTML = `<td colspan="4">No incident reports found</td>`;
          tableBody.appendChild(row);
          return;
        }

        data.incidentReports.forEach(incident => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${incident.incidentReportID}</td>
            <td>${incident.prisonerID}</td>
            <td>${incident.badgeNo}</td>
            <td>${incident.incidentReportDate}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(err => {
        console.error('Error fetching incidents:', err);
        alert('An error occurred while fetching incidents. Please try again later.');
      });
  }

  // Fetch all incidents when the page loads
  fetchIncidents();

  // Fetch incidents based on the date when the button is clicked
  fetchIncidentsBtn.addEventListener('click', function () {
    const date = dateFilter.value;

    if (!date) {
      alert('Please select a valid date.');
      return;
    }

    fetchIncidents(date);
  });

  // Refresh the list back to all data (original view)
  refreshBtn.addEventListener('click', function () {
    dateFilter.value = ''; // Clear the date filter input
    fetchIncidents(); // Fetch all data
  });
});