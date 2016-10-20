'use strict';
var routingLogic = require('./routingLogic');
var indexRoute = routingLogic.indexRoute;
var wixMiddleware = require('./Wix').middleware;
var dataAPI = require('./api/data');

module.exports = function (app) {
  app.use(wixMiddleware);
  app.use('/api/data', dataAPI);
  // API

  app.route('/:url(api|app|bower_components|assets)/*')
  .get(function (req, res) {
    res.status(404).end();
  });

  app.get('/seo',routingLogic.seoRoute);
  app.get('/index',indexRoute);
  app.get('/settings',function(req,res){
    res.render('settings');
  });
  app.get('/mobile',function(req,res){
    res.render('mobile');
  });
  app.get('/',indexRoute);

};
