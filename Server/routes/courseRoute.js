const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = require('../config/db'); // Import the database connection


// // MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Sumail123',
//   database: 'prisoner_System',
// });

// Middleware to parse JSON requests
router.use(express.json());

// Helper functions
function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

// Middleware for validation
function validateEnroll(req, res, next) {
  const { prisonerID, programID } = req.body;

  const parsedPrisonerID = parseInt(prisonerID, 10);
  const parsedProgramID = parseInt(programID, 10);

  if (!isPositiveInteger(parsedPrisonerID) || !isPositiveInteger(parsedProgramID)) {
    return res.status(400).json({ error: 'Prisoner ID and Program ID must be positive integers.' });
  }

  req.body.prisonerID = parsedPrisonerID;
  req.body.programID = parsedProgramID;

  next();
}

// Enroll in Course
router.post('/enroll', validateEnroll, (req, res) => {
  const { prisonerID, programID } = req.body;

  const capacityCheckQuery = `
    SELECT capacity, enrolment FROM education_Course WHERE programID = ?;
  `;
  connection.query(capacityCheckQuery, [programID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error checking course capacity.' });
    if (results.length === 0) return res.status(404).json({ error: 'Course not found.' });

    const { capacity, enrolment } = results[0];
    if (enrolment >= capacity) {
      return res.status(400).json({ error: 'Course is already full.' });
    }

    const enrollQuery = `
      INSERT INTO prisoner_Education (prisonerID, programID, grade, attendance)
      VALUES (?, ?, NULL, NULL);
    `;
    connection.query(enrollQuery, [prisonerID, programID], (err) => {
      if (err) return res.status(500).json({ error: 'Error enrolling prisoner in course.' });
      res.status(200).json({ message: 'Prisoner successfully enrolled in course.' });
    });
  });
});

// Remove from Course
router.delete('/remove', validateEnroll, (req, res) => {
  const { prisonerID, programID } = req.body;

  const removeQuery = `
    DELETE FROM prisoner_Education WHERE prisonerID = ? AND programID = ?;
  `;
  connection.query(removeQuery, [prisonerID, programID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error removing prisoner from course.' });
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Enrollment not found.' });
    }
    res.status(200).json({ message: 'Prisoner successfully removed from course.' });
  });
});

// Update Grade and Attendance
router.put('/update-grade-attendance', (req, res) => {
  const { prisonerID, programID, grade, attendance } = req.body;

  if (!isPositiveInteger(prisonerID) || !isPositiveInteger(programID)) {
    return res.status(400).json({ error: 'Prisoner ID and Program ID must be positive integers.' });
  }
  if (grade < 0 || grade > 100 || attendance < 0 || attendance > 100) {
    return res.status(400).json({ error: 'Grade and Attendance must be between 0 and 100.' });
  }

  const updateQuery = `
    UPDATE prisoner_Education
    SET grade = ?, attendance = ?
    WHERE prisonerID = ? AND programID = ?;
  `;
  connection.query(updateQuery, [grade, attendance, prisonerID, programID], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error updating grade and attendance.' });
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Enrollment not found.' });
    }
    res.status(200).json({ message: 'Grade and Attendance successfully updated.' });
  });
});

// Course Summary
router.get('/summary', (req, res) => {
  const summaryQuery = `
    SELECT programID, 
           COALESCE(programName, '') AS programName, 
           COALESCE(programType, '') AS programType, 
           COALESCE(instructorName, '') AS instructorName, 
           capacity, 
           enrolment
    FROM education_Course;
  `;

  connection.query(summaryQuery, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error retrieving course summary.' });
    res.status(200).json(results);
  });
});

module.exports = router;
