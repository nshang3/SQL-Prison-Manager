const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sumail123',
    database: 'prisoner_System',
});

// Middleware to parse JSON requests
router.use(express.json());

/**
 * Enroll in Course
 */
router.post('/enroll', (req, res) => {
    const { prisonerID, programID } = req.body;

    // Validate programID and prisonerID exist
    const validateQuery = `
        SELECT (SELECT COUNT(*) FROM education_Course WHERE programID = ?) AS validProgram,
               (SELECT COUNT(*) FROM prisoner WHERE prisonerID = ?) AS validPrisoner;
    `;
    db.query(validateQuery, [programID, prisonerID], (err, results) => {
        if (err) return res.status(500).send('Error validating IDs.');

        const [validation] = results;
        if (validation.validProgram === 0) return res.status(404).send('Program not found.');
        if (validation.validPrisoner === 0) return res.status(404).send('Prisoner not found.');

        // Check course capacity
        const capacityCheckQuery = `
            SELECT capacity, enrolment
            FROM education_Course
            WHERE programID = ?;
        `;
        db.query(capacityCheckQuery, [programID], (err, results) => {
            if (err) return res.status(500).send('Error checking course capacity.');

            const { capacity, enrolment } = results[0];
            if (enrolment >= capacity) {
                return res.status(400).send('Course is already full.');
            }

            // Enroll prisoner in course
            const enrollQuery = `
                INSERT INTO prisoner_Education (prisonerID, programID, grade, attendance)
                VALUES (?, ?, NULL, NULL);
            `;
            db.query(enrollQuery, [prisonerID, programID], (err, results) => {
                if (err) return res.status(500).send('Error enrolling prisoner in course.');
                res.status(200).send('Prisoner successfully enrolled in course.');
            });
        });
    });
});

/**
 * Remove from Course
 */
router.delete('/remove', (req, res) => {
    const { prisonerID, programID } = req.body;

    // Remove enrollment record
    const removeQuery = `
        DELETE FROM prisoner_Education
        WHERE prisonerID = ? AND programID = ?;
    `;
    db.query(removeQuery, [prisonerID, programID], (err, results) => {
        if (err) return res.status(500).send('Error removing prisoner from course.');
        if (results.affectedRows === 0) {
            return res.status(404).send('No enrollment record found for this prisoner and course.');
        }
        res.status(200).send('Prisoner successfully removed from course.');
    });
});

/**
 * Course Summary
 */
router.get('/summary', (req, res) => {
    const summaryQuery = `
        SELECT programID, programName, programType, instructorName, capacity, enrolment
        FROM education_Course;
    `;
    db.query(summaryQuery, (err, results) => {
        if (err) return res.status(500).send('Error retrieving course summary.');
        res.status(200).json(results);
    });
});

/**
 * Update Grade and Attendance
 */
router.put('/update-grade-attendance', (req, res) => {
    const { prisonerID, programID, grade, attendance } = req.body;

    // Validate grade and attendance values
    if (grade < 0 || grade > 100) {
        return res.status(400).send('Grade must be between 0 and 100.');
    }
    if (attendance < 0 || attendance > 100) {
        return res.status(400).send('Attendance must be between 0 and 100.');
    }

    // Check if the enrollment exists
    const validateEnrollmentQuery = `
        SELECT COUNT(*) AS enrollmentExists
        FROM prisoner_Education
        WHERE prisonerID = ? AND programID = ?;
    `;
    db.query(validateEnrollmentQuery, [prisonerID, programID], (err, results) => {
        if (err) return res.status(500).send('Error validating enrollment.');
        const { enrollmentExists } = results[0];
        if (!enrollmentExists) {
            return res.status(404).send('Enrollment not found for this prisoner and course.');
        }

        // Update grade and attendance
        const updateQuery = `
            UPDATE prisoner_Education
            SET grade = ?, attendance = ?
            WHERE prisonerID = ? AND programID = ?;
        `;
        db.query(updateQuery, [grade, attendance, prisonerID, programID], (err, results) => {
            if (err) return res.status(500).send('Error updating grade and attendance.');
            res.status(200).send('Grade and attendance successfully updated.');
        });
    });
});

module.exports = router;