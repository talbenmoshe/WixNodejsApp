'use strict';

var path = require('path');
var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'local',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9001
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
