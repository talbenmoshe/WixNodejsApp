'use strict';

var config = require('./config/environment');
var wix = require('./Wix');
var path = require('path');


module.exports = function (app) {

  app.use(function(req,res,next){
    try {
        var instance = wix.checkInstance(req.query.instance);
        if (instance !== null) {
          next();
        }
        else {
          res.send('unauthorized');
        }

    }catch(e){
      res.send('unauthorized');
    }

  });
  app.use('/api/things', require('./api/thing'));
  // API

  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  app.get('/seo',function(req,res){
    var mysplit= req.url.split('?');
    mysplit= mysplit.length<2?'':mysplit[1];
    res.render('seo',{myquery:mysplit});
  });
  app.get('/index',function(req,res){
    if (config.env !== 'production' && req.query.deviceType &&  req.query.deviceType == 'mobile' ){
      res.render('mobile');
    }
    else res.render('index');
  });
  app.get('/settings',function(req,res){
    res.render('settings');
  });
  app.get('/mobile',function(req,res){
    res.render('settings');
  });

  app.route('/')
    .get(function (req, res) {
      if (config.env !== 'production' && req.query.deviceType &&  req.query.deviceType == 'mobile' ){
        res.render('mobile');
      }
      else res.render('index.ejs');

    });

};
