const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const routes = require('./routes/index')
const errorHandlers = require('./handlers/errorHandlers');

// App setup
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
app.use('/', routes);
app.use(errorHandlers.notFound);

if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

app.use(errorHandlers.productionErrors);


module.exports = app;
