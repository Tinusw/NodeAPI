// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

const http = require("http");
const app = require('./app');

// Server setup
const port = process.env.PORT || 3030;
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
