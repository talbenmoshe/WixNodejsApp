'use strict';
var routingLogic = require('./routingLogic');
var indexRoute = routingLogic.indexRoute;
var wixMiddleware = require('./Wix').middleware;
// COMMENT: See #3
var dataAPI = require('./api/data');

module.exports = function (app) {
  app.use(wixMiddleware);

  /**
   * COMMENT: Every route domain should be handled by a controller (you call them Route like: 'indexRoute' & seoRoute - but usually they're called controllers)
   *
   * I recommend creating a folder called controllers and place all relevant controllers there.
   */

  // COMMENT: why '/api/data' - why not '/api'
  app.use('/api/data', dataAPI);
  // API

  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  // COMMENT: no need for 'routingLogic.seoRoute' - just create an seo-controller that will be in charge of the seo domain
  app.get('/seo', routingLogic.seoRoute);
  app.get('/index', indexRoute); // COMMENT: index-controller
  app.get('/settings', function (req, res) {
    res.render('settings');
  });
  app.get('/mobile', function (req, res) {
    res.render('mobile');
  });
  app.get('/', indexRoute); // COMMENT: you already have an indexRoute - why twice?
};
