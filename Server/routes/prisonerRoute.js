const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Adjust the path if needed

// POST route to add a prisoner
router.post('/', async (req, res) => {
  const { cellNo, prisonerName, dateOfBirth, heightCm, weightKg, eyeColor, hairColor, offenseType } = req.body;

  if (!cellNo || !prisonerName || !dateOfBirth || !offenseType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const [rows] = await connection.promise().query('SELECT MAX(prisonerID) AS maxID FROM prisoner');
    const maxID = rows[0].maxID || 0; 

    const nextID = maxID + 1;

    const query = `
      INSERT INTO prisoner (prisonerID, cellNo, prisonerName, dateOfBirth, heightCm, weightKg, eyeColor, hairColor, offenseType)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
