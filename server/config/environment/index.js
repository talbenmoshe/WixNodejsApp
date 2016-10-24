'use strict';

/**
 * COMMENT: environment files in this folder all have the same values, why?
 * Either put different values (if its relevant) or have just 1 file.
 */

var path = require('path');
var _ = require('lodash');

var all = {
  env: process.env.NODE_ENV || 'local',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9001
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
