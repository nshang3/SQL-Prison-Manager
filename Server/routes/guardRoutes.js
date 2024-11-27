const express = require('express');
const connection = require('../config/db'); // Import the database connection
const router = express.Router();

// Route to get guards in 'Maximum' security level
router.get('/guards-in-maximum-security', (req, res) => {
  const query = `
    SELECT g.badgeNo, g.guardName, g.salary
    FROM guard g
    JOIN cell_Block cb ON g.cellBlockID = cb.cellBlockID
    WHERE cb.securityLevel = 'Maximum';
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching guards in Maximum security:', err.message);
      return res.status(500).json({ error: 'Failed to fetch guards' });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'No guards found in Maximum security level',
      });
    }

    res.status(200).json({
      message: 'Guards in Maximum security fetched successfully',
      guards: results,
    });
  });
});

// Route to update guard salary
router.put('/update-salary', (req, res) => {
  const { badgeNo, multiplier } = req.body;

  // Validate the required parameters
  if (!badgeNo || typeof badgeNo !== 'string' || badgeNo.trim() === '') {
    return res.status(400).json({
      error: 'Invalid badgeNo: badgeNo is required and must be a non-empty string',
    });
  }

  if (!multiplier || isNaN(multiplier) || multiplier <= 0) {
    return res.status(400).json({
      error: 'Invalid multiplier: multiplier is required and must be a positive number',
    });
  }

  const sanitizedMultiplier = parseFloat(multiplier);

  // SQL query to update guard salary
  const query = `
    UPDATE guard g
    SET salary = salary * ?
    WHERE g.badgeNo = ? 
      AND g.cellBlockID IN (
          SELECT cb.cellBlockID 
          FROM cell_Block cb
          WHERE cb.securityLevel = 'Maximum'
      )
      AND g.salary < (SELECT MAX(cb.occupancy) FROM cell_Block cb) * 500;
  `;

  console.log('Executing query:', query); // Log query
  console.log('Parameters:', sanitizedMultiplier, badgeNo); // Log parameters

  connection.query(query, [sanitizedMultiplier, badgeNo], (err, result) => {
    if (err) {
      console.error('Error executing the query:', err.message);
      return res.status(500).json({ error: 'Failed to update guard salary' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'No guard found matching the criteria or salary conditions not met',
      });
    }

    res.status(200).json({
      message: 'Guard salary updated successfully',
      affectedRows: result.affectedRows,
    });
  });
});

// Route to get all guards and their cell assignments, ordered by cellBlockID
router.get('/guards-with-cell-assignments', (req, res) => {
  const query = `
    SELECT 
      g.badgeNo, 
      g.guardName, 
      cb.cellBlockID 
    FROM 
      guard g
    LEFT JOIN 
      cell_Block cb 
    ON 
      g.cellBlockID = cb.cellBlockID
    ORDER BY 
      cb.cellBlockID;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching guards with cell assignments:', err.message);
      return res.status(500).json({ error: 'Failed to fetch guards with cell assignments' });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'No guards with cell assignments found',
      });
    }

    res.status(200).json({
      message: 'Guards with cell assignments fetched successfully',
      guards: results,
    });
  });
});

module.exports = router;
