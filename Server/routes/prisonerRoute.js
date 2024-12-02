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
module.exports = router;