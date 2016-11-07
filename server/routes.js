'use strict';

var wixMiddleware = require('./wixMiddleware.js');
var dataAPI = require('./api/data/data.controller');
var indexRoute = require('./routers/indexRoute');
var seoRoute = require('./routers/seoRoute');
var designRoute = require('./routers/designRoute.js');


module.exports = function(app) {
  app.use(wixMiddleware);

  app.use('/api', dataAPI);
  app.get('/design',designRoute);
  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function(req, res) {
      res.status(404).end();
    });

  app.get('/seo', seoRoute);
  app.get(['/', '/index'], indexRoute);
  app.get('/settings', function(req, res) {
    res.render('settings');
  });
  app.get('/mobile', function(req, res) {
    res.render('mobile');
  });

};
