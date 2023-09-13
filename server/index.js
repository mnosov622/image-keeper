const express = require("express");
const images = require("./routes/getImages.js");
const uploadImage = require("./routes/uploadImage.js");
const deleteImageById = require("./routes/deleteImageById.js");
const editLabelById = require("./routes/editLabelById.js");

const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://image-keeper.vercel.app"],
  })
);

app.use(express.json());

app.use("/", images);
app.use("/", uploadImage);
app.use("/", deleteImageById);
app.use("/", editLabelById);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
