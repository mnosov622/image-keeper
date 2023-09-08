const { pool } = require("../connection");
const router = require("express").Router();
const multer = require("multer");

// Multer storage configuration
const storage = multer.memoryStorage(); // Store the uploaded image in memory
const upload = multer({ storage: storage });

router.post("/api/images", upload.single("image"), async (req, res) => {
  try {
    const { label } = req.body;
    const imageBuffer = req.file.buffer; // Get the image buffer from multer
    console.log("image ", imageBuffer);
    // Insert the data into the database
    const query = "INSERT INTO images.images (image, label) VALUES ($1, $2) RETURNING *";
    const values = [imageBuffer, label]; // Use image buffer instead of image URL

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
