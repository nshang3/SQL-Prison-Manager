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

router.post('/', async (req, res) => {
  const { cellNo, prisonerName, dateOfBirth, heightCm, weightKg, eyeColor, hairColor, offenseType, dangerLevel } = req.body;
  if (!cellNo || !prisonerName || !dateOfBirth || !offenseType || !dangerLevel) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const [rows] = await connection.promise().query('SELECT MAX(prisonerID) AS maxID FROM prisoner');
    const maxID = rows[0].maxID || 0; 
    const nextID = maxID + 1;
    const query = `
      INSERT INTO prisoner (prisonerID, cellNo, prisonerName, dateOfBirth, heightCm, weightKg, eyeColor, hairColor, offenseType, dangerLevel)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.promise().query(query, [
      nextID,
      cellNo,
      prisonerName,
      dateOfBirth,
      heightCm || null,
      weightKg || null,
      eyeColor || null,
      hairColor || null,
      offenseType,
      dangerLevel
    ]);
    res.status(201).json({
      message: 'Prisoner added successfully',
      prisonerID: nextID,
    });
  } catch (err) {
    console.error('Error inserting prisoner:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get the number of prisoners grouped by security level
router.get('/prisoners-by-security-level', (req, res) => {
  const query = `
    SELECT cb.securityLevel, COUNT(p.prisonerID) AS numberOfPrisoners
    FROM cell_Block cb
    JOIN cell c ON cb.cellBlockID = c.cellBlockID
    JOIN prisoner p ON c.cellNo = p.cellNo
    GROUP BY cb.securityLevel;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching prisoners by security level:', err.message);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    res.status(200).json({
      message: 'Prisoners by security level fetched successfully',
      data: results,
    });
  });
});

// Adjust Danger Level (Threat Level)
router.put('/adjust-threat-level', (req, res) => {
  const { prisonerID, newThreatLevel } = req.body;

  // Validate inputs
  if (!prisonerID || !newThreatLevel) {
    return res.status(400).json({ error: 'Prisoner ID and new threat level are required.' });
  }

  if (!['Low', 'Medium', 'High'].includes(newThreatLevel)) {
    return res.status(400).json({ error: 'Invalid threat level. Must be Low, Medium, or High.' });
  }

  const query = `
    UPDATE prisoner
    SET dangerLevel = ?
    WHERE prisonerID = ?;
  `;

  connection.query(query, [newThreatLevel, prisonerID], (err, results) => {
    if (err) {
      console.error('Error updating threat level:', err.message);
      return res.status(500).json({ error: 'Failed to update threat level.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Prisoner not found.' });
    }

    res.status(200).json({ message: 'Threat level updated successfully.' });
  });
});


module.exports = router;