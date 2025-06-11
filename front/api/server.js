const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Set up the PostgreSQL connection
const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:mypassword@localhost:5432/characters_db",
});

client.connect();

app.get("/api/characters", async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || "";
    // Query database for characters
    const result = await client.query(
      "SELECT * FROM characters WHERE LOWER(name) LIKE $1",
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching characters:", err);
    res.status(500).send("Server error");
  }
});

// Add new character
app.post("/api/characters", async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }

  try {
    // Insert character into the database
    const result = await client.query(
      "INSERT INTO characters (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    // Send back the newly added character
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding character:", err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
