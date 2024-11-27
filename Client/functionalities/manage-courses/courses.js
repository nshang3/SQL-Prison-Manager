// Helper function to validate numerical input
function isValidNumber(value) {
    return Number.isInteger(value) && value > 0; // Ensure positive integers only
  }
  
  // Helper function to validate percentage values
  function isValidPercentage(value) {
    return Number.isInteger(value) && value >= 0 && value <= 100;
  }
  
  // Helper function to sanitize and convert input
  function sanitizeAndConvertInput(value) {
    if (typeof value === 'string') {
      const sanitizedValue = value.trim();
      return sanitizedValue === '' ? null : parseInt(sanitizedValue, 10);
    }
    return Number.isInteger(value) ? value : null; // Return the value if it's already a valid number
  }
  
  // Enroll in Course with Validation and Sanitization
  document.getElementById('enrollForm').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const prisonerID = sanitizeAndConvertInput(document.getElementById('enrollPrisonerID').value);
    const programID = sanitizeAndConvertInput(document.getElementById('enrollProgramID').value);
  
    if (!isValidNumber(prisonerID)) {
      alert('Invalid Prisoner ID. It must be a positive integer.');
      return;
    }
  
    if (!isValidNumber(programID)) {
      alert('Invalid Program ID. It must be a positive integer.');
      return;
    }
  
    fetch('/api/courses/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prisonerID, programID }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || 'Failed to enroll prisoner'); });
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        document.getElementById('enrollForm').reset();
      })
      .catch(err => alert(err.message));
  });
  
  // Remove from Course with Validation and Sanitization
  document.getElementById('removeForm').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const prisonerID = sanitizeAndConvertInput(document.getElementById('removePrisonerID').value);
    const programID = sanitizeAndConvertInput(document.getElementById('removeProgramID').value);
  
    if (!isValidNumber(prisonerID)) {
      alert('Invalid Prisoner ID. It must be a positive integer.');
      return;
    }
  
    if (!isValidNumber(programID)) {
      alert('Invalid Program ID. It must be a positive integer.');
      return;
    }
  
    fetch('/api/courses/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prisonerID, programID }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || 'Failed to remove prisoner'); });
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        document.getElementById('removeForm').reset();
      })
      .catch(err => alert(err.message));
  });
  
  // Update Grade and Attendance with Validation and Sanitization
  document.getElementById('updateForm').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const prisonerID = sanitizeAndConvertInput(document.getElementById('updatePrisonerID').value);
    const programID = sanitizeAndConvertInput(document.getElementById('updateProgramID').value);
    const grade = sanitizeAndConvertInput(document.getElementById('updateGrade').value);
    const attendance = sanitizeAndConvertInput(document.getElementById('updateAttendance').value);
  
    if (!isValidNumber(prisonerID)) {
      alert('Invalid Prisoner ID. It must be a positive integer.');
      return;
    }
  
    if (!isValidNumber(programID)) {
      alert('Invalid Program ID. It must be a positive integer.');
      return;
    }
  
    if (!isValidPercentage(grade)) {
      alert('Invalid Grade. It must be a number between 0 and 100.');
      return;
    }
  
    if (!isValidPercentage(attendance)) {
      alert('Invalid Attendance. It must be a number between 0 and 100.');
      return;
    }
  
    fetch('/api/courses/update-grade-attendance', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prisonerID, programID, grade, attendance }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error || 'Failed to update grade and attendance'); });
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        document.getElementById('updateForm').reset();
      })
      .catch(err => alert(err.message));
  });
  
  // Fetch Course Summary
  function fetchCourseSummary() {
    fetch('/api/courses/summary')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch course summary');
        }
        return response.json();
      })
      .then(data => {
        const tableBody = document.querySelector('#courseSummaryTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows
  
        data.forEach(course => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${course.programID}</td>
            <td>${course.programName || 'N/A'}</td>
            <td>${course.programType || 'N/A'}</td>
            <td>${course.instructorName || 'N/A'}</td>
            <td>${course.capacity}</td>
            <td>${course.enrolment}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(err => console.error(err.message));
  }
  
  // Fetch course summary on page load
  document.addEventListener('DOMContentLoaded', fetchCourseSummary);
  