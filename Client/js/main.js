// Add event listeners to buttons
document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', () => {
    const route = button.dataset.route;

    // Redirect based on the button clicked
    if (route === 'guards') {
      window.location.href = './functionalities/manage-guards/manage-guards.html';
    } else if (route === 'salary') {
      window.location.href = './functionalities/manage-salary/manage-salary.html';
    } else if (route === 'reports') {
      alert('Feature coming soon!');
    } else if (route === 'courses') {
      window.location.href = './functionalities/manage-courses/manage-courses.html';
    }
  });
});
