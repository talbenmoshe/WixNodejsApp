'use strict';

var config = require('./config/environment/index.js');
var wix = require('wix');

function checkIsOwner(parsedInstance) {
  var isOwner = false;
  if (parsedInstance === null) {
    isOwner = false;
  }
  else if (parsedInstance.permissions !== null && parsedInstance.permissions == 'OWNER') {
    isOwner = true;
  }
  return isOwner;
}

var WixMiddleware = (function () {
  var appSecretKey = config.APP_SECRET_KEY;
  var appId = config.APP_DEFINITION_ID;
  wix.secret(appSecretKey); // Sets the Wix secret key

  return function (req, res, next) {
    try {
      var instance = wix.parse(req.query.instance);

      if (instance !== null) {
        req.wixInstance = instance;
        req.wixInstance.isOwner = checkIsOwner(instance);
        req.widgetCompId = req.query.origCompId || req.query.compId;

        next();
      }
      else {
        console.log('url1: %s\nquery:%s', req.url, req.query);
        res.status(401).send('unauthorized');
      }

    } catch (e) {
      console.log('url2: %s\nquery:%s', e, req.query);
      res.status(401).send('unauthorized!');
    }
  }
})();

module.exports = WixMiddleware;
