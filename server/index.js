const express = require("express");
const images = require("./routes/getImages.js");
const uploadImage = require("./routes/uploadImage.js");
const deleteImageById = require("./routes/deleteImageById.js");

const cors = require("cors"); // Import the cors middleware

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", images);
app.use("/", uploadImage);
app.use("/", deleteImageById);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
