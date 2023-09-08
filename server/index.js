const express = require("express");
const images = require("./routes/getImages.js");

const app = express();

app.use(express.json());

app.use("/", images);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
