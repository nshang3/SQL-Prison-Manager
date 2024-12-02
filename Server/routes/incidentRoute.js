const express = require('express');
const connection = require('../config/db'); // Import the database connection
const router = express.Router();

// Route to fetch incident reports based on date
router.get('/fetch-incident-reports', (req, res) => {
  const { date } = req.query;

  // Validate the required parameters
  if (!date || typeof date !== 'string' || date.trim() === '') {
    return res.status(400).json({
      error: 'Invalid date: date is required and must be a non-empty string',
    });
  }

  const query = `
    SELECT 
      incidentReportID, 
      prisonerID, 
      badgeNo, 
      incidentReportDate 
    FROM incident_report 
    WHERE incidentReportDate = ?;
  `;

  connection.query(query, [date], (err, results) => {
    if (err) {
      console.error('Error fetching incident reports:', err.message);
      return res.status(500).json({ error: 'Failed to fetch incident reports' });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'No incident reports found for the given date',
      });
    }

    res.status(200).json({
      message: 'Incident reports fetched successfully',
      incidentReports: results,
    });
  });
});

// Route to fetch all incident reports, ordered by date
router.get('/all-incident-reports', (req, res) => {
  const query = `
    SELECT 
      incidentReportID, 
      prisonerID, 
      badgeNo, 
      incidentReportDate 
    FROM 
      incident_report 
    ORDER BY 
      incidentReportDate;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all incident reports:', err.message);
      return res.status(500).json({ error: 'Failed to fetch all incident reports' });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'No incident reports found',
      });
    }

    res.status(200).json({
      message: 'All incident reports fetched successfully',
      incidentReports: results,
    });
  });
});

module.exports = router;