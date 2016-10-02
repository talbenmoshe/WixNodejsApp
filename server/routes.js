'use strict';

var config = require('./config/environment');
var wix = require('wix');
var path = require('path');

wix.secret(config.APP_SECRET_KEY);

module.exports = function (app) {

  app.use(function(req,res,next){
    //return next();
    console.log('in wix middleware',wix.secret());
    try {
      /*
      if (!req.query || !req.query.instance ){
        return next();
      }
      */

        var instance = wix.parse(req.query.instance);
        if (instance !== null) {
          next();

        }
        else {
          res.send('unauthorized');
        }

    }catch(e){
      res.send('unauthorized');
    }
    //next();
  });
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
