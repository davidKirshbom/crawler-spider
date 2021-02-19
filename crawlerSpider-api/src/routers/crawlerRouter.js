const express = require("express");
const crawlerSpider = require("../utils/crawler");
const router = express.Router();
router.get("/", async (req, res) => {
  console.log(
    "🚀 ~ file: crawlerRouter.js ~ line 5 ~ router.get ~ req",
    req.query
  );

  const { startUrl, maxDepth, maxTotalPages } = req.query;
  try {
    const result = await crawlerSpider(startUrl, maxDepth, maxTotalPages);
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
