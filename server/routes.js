'use strict';

var config = require('./config/environment');

module.exports = function (app) {
  app.use('/api/things', require('./api/thing'));
  // API

  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  app.get('/index',function(req,res){
    res.render('index');
  });
  app.get('/settings',function(req,res){
    res.render('settings');
  });

  app.route('/')
    .get(function (req, res) {


      res.render('index.ejs');

    });

};
