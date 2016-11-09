'use strict';
var express = require('express');
var config = require('./config/environment/index.js');
var chalk = require('chalk');
var compression = require('compression');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var constants = require('./config/app/constants.js');

var app = express();

var env = config.env;
var http = require('http');

var setApplicationRoutes = require('./routes.js');

app.locals.constants = constants.asJSON();
app.locals.appConstants = constants.appConstantsAsJSON();

app.engine('.ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(config.root, 'client')));
app.set('appPath', 'client');
app.set('views', 'client');


if (env === 'development' || env === 'test') {
  app.use(require('errorhandler')());
}

setApplicationRoutes(app);
var server = http.createServer(app);

server.listen(config.port, config.ip, function () {
  console.log(
    chalk.red('\nExpress server listening on port ')
    + chalk.yellow('%d')
    + chalk.red(', in ')
    + chalk.yellow('%s')
    + chalk.red(' mode.\n'),
    config.port,
    app.get('env')
  );

  if (env === 'development') {
    require('ripe').ready();
  }
});

module.exports = server;
