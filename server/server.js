'use strict';
var express = require('express');
var config = require('./config/environment');
var chalk = require('chalk');
var compression = require('compression');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var env = config.env;



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

var routes = require('./routes')(app);
var server = require('http').createServer(app);

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
