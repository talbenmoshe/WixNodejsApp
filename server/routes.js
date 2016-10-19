'use strict';




var routingLogic = require('./routingLogic');
module.exports = function (app) {
  app.use(require('./Wix').middleware);
  app.use('/api/data', require('./api/data'));
  // API

  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  app.get('/seo',routingLogic.seoRoute);
  app.get('/index',routingLogic.indexRoute);
  app.get('/settings',function(req,res){
    res.render('settings');
  });
  app.get('/mobile',function(req,res){
    res.render('mobile');
  });

  app.get('/',routingLogic.indexRoute);

};
