const express = require("express");
const router = express.Router();
const { pool } = require("../connection");

router.delete("/api/images/:id", async (req, res) => {
  const imageId = req.params.id;
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM images WHERE id = $1", [imageId]);

    if (!result || result.rows.length === 0) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    await client.query("DELETE FROM images.images WHERE id = $1", [imageId]);

    client.release();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
