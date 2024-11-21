const connection = require('./config/db');

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
      console.log(row.TABLE_NAME); // Corrected key for table name
    });

    console.log('---------------------------'); // Dashed line
    process.exit(0);
  });
});
