const express = require("express");
const images = require("./routes/getImages.js");
const uploadImage = require("./routes/uploadImage.js");
const deleteImageById = require("./routes/deleteImageById.js");
const editLabelById = require("./routes/editLabelById.js");

const cors = require("cors");

const app = express();

// not the best practice, but we will allow requests from any origin
app.use(cors());

app.use(express.json());

app.use("/", images);
app.use("/", uploadImage);
app.use("/", deleteImageById);
app.use("/", editLabelById);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
