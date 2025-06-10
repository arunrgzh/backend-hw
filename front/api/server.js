// strike-mentor/api/server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

const characters = require("./characters.json");

app.use(cors());

app.get("/api/characters", (req, res) => {
  const search = req.query.search?.toLowerCase() || "";
  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(search)
  );
  res.json(filtered);
});

app.get("/api/authors", (_req, res) => {
  res.json({
    creators: ["Valve", "Hidden Path Entertainment"],
    year: 2012,
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
