
# Assignment 4 Group 19 - MySQL Node.js App

## **Getting Started**

Follow these instructions to set up the application on your local machine.

---

### **Prerequisites**

1. Install **Node.js** (v14+ recommended).
2. Install **MySQL** (ensure it's running locally or remotely).
3. Clone this repository to your machine.

---

### **Setup Instructions**

1. **Clone the Repository**:
   ```bash
   git clone <REPO_URL>
   cd assignment-4-group-19
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up `.env` File**:
   - In the root directory, create a `.env` file based on the following template:

     ```env
     DB_HOST=localhost
     DB_USER=yourUsername
     DB_PASSWORD=yourPasswordonMYSQLWorkBench
     DB_NAME=yourDatabaseName
     DB_PORT=3306
     ```

4. **Start the Application**:
   - Test the MySQL connection:
     ```bash
     node src/server.js
     ```
   - If successful, you will see:
     ```
     Connected to MySQL as ID <threadId>
     Available Tables:
     <list_of_tables>
     ---
     ```

---

## **File Structure**

| **Folder/File**         | **Description**                                                                                   |
|--------------------------|---------------------------------------------------------------------------------------------------|
| `src/config/db.js`       | Contains the MySQL connection logic. Exports a reusable connection instance.                     |
| `src/server.js`          | Entry point of the app. Tests the database connection and prints available tables to the console.|
| `src/middleware/`        | Folder for reusable middleware functions (e.g., logging, validation).                            |
| `src/models/`            | Folder for database models. This will include all SQL-related queries and table interactions.    |
| `src/routes/`            | Folder for API routes. Each file will define specific routes and their logic.                    |
| `.env`                   | Environment variables for sensitive data (e.g., database credentials).                          |
| `package.json`           | Manages project dependencies and scripts for development and production.                        |
| `README.md`              | Documentation file to guide team members on setting up and running the project.                 |

---


## **Troubleshooting**

- **Database Connection Issues**:
  - Ensure your `.env` file contains valid MySQL credentials.
  - Check if the MySQL server is running and accessible.

- **Node.js Errors**:
  - Run `npm install` to ensure all dependencies are installed.
  - Check if you're using a supported version of Node.js (`v14+`).

---
