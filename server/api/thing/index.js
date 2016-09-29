'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();
//console.log('router',router);
router.get('/read', controller.read);
router.post('/settings', controller.writeSettings);
router.get('/settings', controller.readSettings);
//router.get('/', controller.index);
router.post('/', controller.index);
module.exports = router;
