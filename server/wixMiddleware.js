'use strict';

var config = require('./config/environment/index.js');
var wix = require('wix');

function checkInstance(ainstance){
  var parsedInstance = null;
  try {
    parsedInstance = wix.parse(ainstance);
  }
  catch (err) {
    console.log('checkInstance err:', err);
  }

  return parsedInstance;
}

function checkIsOwner(parsedInstance){
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
  //console.log('wix secret key is %s',appSecretKey);
  return {
    middleware: function (req, res, next) {
      try {
        var instance = checkInstance(req.query.instance);
        req.wixInstance = instance;

        if (instance !== null) {
          req.wixInstance.isOwner = checkIsOwner(instance);
          req.widgetCompId = req.query.origCompId || req.query.compId;

          next();
        }
        else {
          console.log('url1: %s\nquery:%s', req.url, req.query);
          res.send('unauthorized');
        }

      } catch (e) {
        console.log('url2: %s\nquery:%s', e, req.query);
        res.send('unauthorized!');
      }

    }
  }
}
());

module.exports = WixMiddleware;
