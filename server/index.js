const express = require("express");
const { Pool } = require("pg");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());

// Route to test the database connection
app.get("/api/test", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1"); // A simple query to test the connection
    client.release();
    res.json({ message: "Database connection successful" });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM images.images");
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
