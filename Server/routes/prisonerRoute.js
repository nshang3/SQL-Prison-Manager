const express = require('express');
const router = express.Router();
const connection = require('../config/db');  // Ensure the path to db is correct

// Define the route for getting prisoners
router.get('/get-prisoners', (req, res) => {
  const query = `
    SELECT * 
    FROM prisoner
    WHERE prisonerID BETWEEN 8006 AND 9006
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching prisoners:', err.message);
      return res.status(500).json({ error: 'Failed to fetch prisoners' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No prisoners found' });
    }

    res.status(200).json({
      message: 'Prisoners fetched successfully',
      prisoners: results,
    });
  });
});

module.exports = router;