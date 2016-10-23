'use strict';

var express = require('express');
var controller = require('./data.controller.js');

var router = express.Router();

router.get('/read', controller.read);
router.post('/settings', controller.writeSettings);
router.get('/settings', controller.readSettings);
router.post('/', controller.index);
module.exports = router;
