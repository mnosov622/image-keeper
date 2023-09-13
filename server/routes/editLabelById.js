const express = require("express");
const router = express.Router();
const { pool } = require("../connection");

router.put("/api/images/:id/label", async (req, res) => {
  const imageId = req.params.id;
  const newLabel = req.body.label;
  if (!imageId) {
    res.json({ error: "image id is not provided" });
  }
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM images WHERE id = $1", [imageId]);

    if (!result || result.rows.length === 0) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    await client.query("UPDATE images.images SET label = $1 WHERE id = $2", [newLabel, imageId]);

    client.release();

    res.status(200).json({ message: "Image label updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
