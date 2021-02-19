const express = require("express");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3000;
const crawlerRouter = require("./routers/crawlerRouter");
const app = express();
app.use(cors());
app.use(express.json());
app.use(crawlerRouter);

app.listen(port, () => {
  console.log("Server connected, port:", port);
});
