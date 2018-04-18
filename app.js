const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const routes = require("./routes/index");
const errorHandlers = require("./handlers/errorHandlers");
const cors = require('cors');

// App setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (app.get("env") === "development") {
  /* Development Error Handler - Prints stack trace */
  app.use(morgan("combined"));
  app.use(errorHandlers.developmentErrors);
}

app.use("/", routes);
app.use(errorHandlers.notFound);

app.use(errorHandlers.productionErrors);

module.exports = app;
