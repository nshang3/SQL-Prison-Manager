const express = require('express');
require('dotenv').config({ path: '../.env' })
const router = express.Router();
const connection = require('../config/db') // Adjust the path if needed

// POST route to add a cell
router.post('/', async (req, res) => {
  const { cellBlockID, cellType, floorNo } = req.body;

  if (!cellBlockID || !cellType || !floorNo) {
    return res.status(400).json({ message: 'Missing required fields: cellBlockID, cellType, or floorNo' });
  }

  try {
    const [blockRows] = await connection.promise().query(
      'SELECT * FROM cell_Block WHERE cellBlockID = ?',
      [cellBlockID]
    );

    if (blockRows.length === 0) {
      return res.status(400).json({ message: `Cell Block ID ${cellBlockID} does not exist` });
    }

    const [cellRows] = await connection.promise().query('SELECT MAX(cellNo) AS maxCellNo FROM cell');
    const maxCellNo = cellRows[0].maxCellNo || 999;
    const nextCellNo = maxCellNo + 1;

    const query = `
      INSERT INTO cell (cellNo, cellBlockID, cellType, floorNo)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await connection.promise().query(query, [nextCellNo, cellBlockID, cellType, floorNo]);

    console.log('Insert result:', result);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Insert failed, no rows affected' });
    }

    res.status(201).json({
      message: 'Cell added successfully',
      cellNo: nextCellNo,
    });
  } catch (err) {
    console.error('Error inserting cell:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/get-cells', (req, res) => {
  const query = `
    SELECT 
    c.cellNo, 
    c.cellBlockID,  
    c.cellType,
    c.floorNo,
    cb.capacity,
    cb.occupancy
  FROM 
    cell c
  LEFT JOIN 
    cell_Block cb 
  ON 
    c.cellBlockID = cb.cellBlockID
  ORDER BY 
    cb.cellBlockID;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching cells and their corresponding cell blocks:', err.message);
      return res.status(500).json({ error: 'Failed to cells with their cell blocks' });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: 'No cells with cellblocks assignments found',
      });
    }

    res.status(200).json({
      message: 'cells with cell blocks fetched successfully',
      cells: results,
    });
  });
})
module.exports = router;

