'use strict';

var wixMiddleware = require('./wixMiddleware.js').middleware;
var dataAPI = require('./api/data/index.js');

module.exports = function (app) {
  app.use(wixMiddleware);


  app.use('/api', dataAPI);
  // API

  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  app.get('/seo', require('./routers/seoRoute.js'));
  app.get(['/', '/index'], require('./routers/indexRoute.js'));
  app.get('/settings', function (req, res) {
    res.render('settings');
  });
  app.get('/mobile', function (req, res) {
    res.render('mobile');
  });

};
