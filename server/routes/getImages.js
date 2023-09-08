const { pool } = require("../connection");

const router = require("express").Router();

router.get("/api/images", async (req, res) => {
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

module.exports = router;
