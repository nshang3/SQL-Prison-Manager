function fetchPrisoners() {
    fetch('/api/prisoners/get-prisoners')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#prisonersTable tbody');
      tableBody.innerHTML = ''; // Clear existing rows

      data.prisoners.forEach(prisoner => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${prisoner.prisonerID}</td>
          <td>${prisoner.cellNo}</td>
          <td>${prisoner.prisonerName}</td>
          <td>${prisoner.dateOfBirth}</td>
          <td>${prisoner.heightCm}</td>
          <td>${prisoner.weightKg}</td>
          <td>${prisoner.eyeColor}</td>
          <td>${prisoner.hairColor}</td>
          <td>${prisoner.offenseType}</td>
          <td>${prisoner.dangerLevel}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => console.error('Error fetching prisoners:', err));
}
document.addEventListener('DOMContentLoaded', fetchPrisoners);


document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('prisonerModal');
    const addPrisonerBtn = document.getElementById('addPrisonerBtn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('prisonerForm');
  
    // Open modal when "Add prisoner" button is clicked
    addPrisonerBtn.onclick = function() {
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
  
    // Handle form submission (send data to your server or handle it as needed)
    form.onsubmit = function(e) {
      e.preventDefault(); // Prevent form from submitting normally
  
      const newPrisoner = {

        cellNo: document.getElementById('cellNo').value,
        prisonerName: document.getElementById('prisonerName').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        heightCm: document.getElementById('heightCm').value,
        weightKg: document.getElementById('weightKg').value,
        eyeColor: document.getElementById('eyeColor').value,
        hairColor: document.getElementById('hairColor').value,
        offenseType: document.getElementById('offenseType').value,
        dangerLevel: document.getElementById('dangerLevel').value,
      };
  
      fetch('/api/prisoners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrisoner),
      })
      .then(response => response.json())
      .then(data => {
        console.log('prisoner added successfully:', data);
        if (data.message) {
          alert(data.message);
          fetchPrisoners(); 
        } else {
          alert('An error occurred while adding the cell.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the cell.');
      });
  
      // Close the modal after form submission
      modal.style.display = "none";
  
      // Optionally, clear the form fields
      form.reset();
    };
  });

document.addEventListener('DOMContentLoaded', function () {
  const fetchSecurityBtn = document.getElementById('fetchSecurityBtn');
  const securityModal = document.getElementById('securityModal');
  const closeSecurityModal = document.getElementById('closeSecurityModal');
  const securityDataList = document.getElementById('securityDataList');

  // Function to fetch and display security level data
  function fetchPrisonersBySecurityLevel() {
    fetch('/api/prisoners/prisoners-by-security-level')
      .then(response => response.json())
      .then(data => {
        securityDataList.innerHTML = ''; // Clear existing data

        if (!data.data || data.data.length === 0) {
          const listItem = document.createElement('li');
          listItem.textContent = 'No data available';
          securityDataList.appendChild(listItem);
          return;
        }

        data.data.forEach(item => {
          const listItem = document.createElement('li');
          listItem.textContent = `${item.securityLevel} Security: ${item.numberOfPrisoners} Prisoners`;
          securityDataList.appendChild(listItem);
        });

        // Show the modal after fetching data
        securityModal.style.display = 'block';
      })
      .catch(err => {
        console.error('Error fetching security levels:', err);
        alert('An error occurred while fetching the data. Please try again later.');
      });
  }

  // Open modal when button is clicked
  fetchSecurityBtn.addEventListener('click', fetchPrisonersBySecurityLevel);

  // Close modal when the "X" button is clicked
  closeSecurityModal.addEventListener('click', function () {
    securityModal.style.display = 'none';
  });

  // Close modal if the user clicks outside the modal content
  window.addEventListener('click', function (event) {
    if (event.target === securityModal) {
      securityModal.style.display = 'none';
    }
  });
});

// Adjust Threat Level
document.addEventListener('DOMContentLoaded', function () {
  const threatModal = document.getElementById('threatModal');
  const adjustThreatBtn = document.getElementById('adjustThreatBtn');
  const closeThreatModal = document.getElementById('closeThreatModal');
  const threatForm = document.getElementById('threatForm');

  // Open modal when "Adjust Threat Level" button is clicked
  adjustThreatBtn.onclick = function () {
    threatModal.style.display = "block";
  };

  // Close modal when the "X" button is clicked
  closeThreatModal.onclick = function () {
    threatModal.style.display = "none";
  };

  // Close modal if the user clicks outside the modal content
  window.onclick = function (event) {
    if (event.target == threatModal) {
      threatModal.style.display = "none";
    }
  };

  // Handle form submission
  threatForm.onsubmit = function (e) {
    e.preventDefault(); // Prevent form from submitting normally

    const prisonerID = document.getElementById('prisonerID').value;
    const newThreatLevel = document.getElementById('newThreatLevel').value;

    fetch('/api/prisoners/adjust-threat-level', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prisonerID, newThreatLevel }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(data.message);
          fetchPrisoners(); // Refresh the prisoner list
        } else {
          alert('An error occurred while adjusting the threat level.');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('An error occurred while adjusting the threat level.');
      });

    // Close the modal after form submission
    threatModal.style.display = "none";
    threatForm.reset(); // Clear form fields
  };
});

