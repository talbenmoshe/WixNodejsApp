'use strict';

var express = require('express');
var compression = require('compression');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');

var config = require('./environment');

module.exports = function (app) {

  var env = config.env;

  //console.log('config:',config);
  app.engine('.ejs',require('ejs').renderFile);
  app.set('view engine', 'ejs');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(compression());
  app.use(morgan('dev'));
  app.use(express.static(path.join(config.root, 'client')));
  app.set('appPath', 'client');
  app.set('views','client');

  if (env === 'development' || env === 'test') {
    app.use(require('errorhandler')());
  }

};
