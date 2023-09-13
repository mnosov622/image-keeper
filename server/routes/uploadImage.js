const { pool } = require("../connection");
const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/api/images", upload.single("image"), async (req, res) => {
  try {
    const { label, date } = req.body;
    if (!req?.file?.buffer) {
      res.status(500).json({ error: "image is not provided" });
    }
    const imageBuffer = req.file.buffer;
    const query = "INSERT INTO images (image, label, date) VALUES ($1, $2, $3) RETURNING *";
    const values = [imageBuffer, label, date];

    const client = await pool.connect();
    const result = await client.query(query, values);
    const insertedData = result.rows[0];

    client.release();

    res.json(insertedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
