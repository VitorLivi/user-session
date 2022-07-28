const express = require("express");

const app = express();

const port = 5000;

app.get("/", (req, res) => {
  res.send("Welcome to express application.");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});