const connection = require('./config/db');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define the static folder for serving frontend files
const STATIC_FOLDER = path.join(__dirname, '../Client');
app.use(express.static(STATIC_FOLDER));

// Database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    process.exit(1);
  }

  console.log('Connected to MySQL as ID', connection.threadId);
  console.log('---------------------------'); // Dashed line

  const query = `
    SELECT TABLE_NAME 
    FROM information_schema.tables 
    WHERE table_schema = '${process.env.DB_NAME}'
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
      process.exit(1);
    }

    console.log('Available Tables:');
    results.forEach((row) => {
      console.log(row.TABLE_NAME);
    });

    console.log('---------------------------'); // Dashed line
  });
});

// API Routes
const prisonerRoute = require('./routes/prisonerRoute');
const cellRoute = require('./routes/cellRoute');
const guardRoutes = require('./routes/guardRoutes');
const courseRoutes = require('./routes/courseRoute')
const incidentRoutes = require('./routes/incidentRoute')
app.use('/api/prisoners', prisonerRoute);
app.use('/api/cells', cellRoute);
app.use('/api/guards', guardRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/cells', cellRoute);

// Route to serve the homepage (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(STATIC_FOLDER, 'index.html'));
});

// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).sendFile(path.join(STATIC_FOLDER, '404.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${STATIC_FOLDER}`);
});
