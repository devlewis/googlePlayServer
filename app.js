const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(morgan("common"));
app.use(cors());

const apps = require("./playstore-data");

app.get("/apps", (req, res) => {
  const { sort, genre } = req.query;

  let results = apps;

  if (genre) {
    if (
      !["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(
        genre
      )
    ) {
      return res.status(400).send("Genre must be one of the list.");
    }
    results = apps.filter(app => app.Genres.includes(genre));
  }

  if (sort) {
    if (!["Rating", "App"].includes(sort)) {
      return res.status(400).send("Sort must be one of rating or app.");
    }
    if ("Rating".includes(sort)) {
      results.sort((a, b) => {
        return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
      });
    }
    if ("App".includes(sort)) {
      results.sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      });
    }
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log("Server started on PORT 8000");
});
