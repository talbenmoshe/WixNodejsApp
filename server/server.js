'use strict';

var express = require('express');
var chalk = require('chalk');
var config = require('./config/environment');

var app = express();
var server = require('http').createServer(app);

require('./config/express')(app);
var gcloud = require('google-cloud');
var ds = gcloud.datastore({
  projectId: process.env.GCLOUD_PROJECT||config.GCOLUD_PROJECT_ID
});

// Passing params to request
app.use(function(req,res,next){
  req.ds = ds;
  next();
});
require('./routes')(app);

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

  if (config.env === 'development') {
    require('ripe').ready();
  }

});

module.exports = server;
