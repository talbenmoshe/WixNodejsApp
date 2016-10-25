'use strict';

var config = require('./config/environment');
var wix = require('wix');

// COMMENT: this entire file should be called wix-middleware and all functions below should be merged into one middleware function

var WixModel = (function () {
  var appSecretKey = config.APP_SECRET_KEY;
  var appId = config.APP_DEFINITION_ID;
  wix.secret(appSecretKey); // Sets the Wix secret key
  //console.log('wix secret key is %s',appSecretKey);
  // COMMENT: 'that' is not used
  var that = this;
  return {
    checkInstance: function (ainstance) {
      try {
        var parsedInstance = wix.parse(ainstance);
        // COMMENT: #4
        return parsedInstance;
      }
      catch (err) {
        console.log('checkInstance err:', err);
        // COMMENT: #4
        return null;
      }
    },

    getMetaSiteId: function (req) {
      // COMMENT: 'req.wixInstance' (comment below)
      var instance = WixModel.checkInstance(req.query.instance);
      var compId = req.query.origCompId || req.query.compId;

      // COMMENT: this is not a metasiteId - this is a component unique Id
      return (instance.instanceId + '_' + compId) || 'demo';
    },

    checkIsOwner: function (req) {
      // COMMENT: This can also be a middleware that is applied only on specific routes
      // COMMENT: Look at the comment below - If you do that, you wont need to call 'WixModel.checkInstance' here.. You'll have the instance on the req.wixInstance property
      var parsedInstance = WixModel.checkInstance(req.query.instance);
      // COMMENT: #4
      if (parsedInstance === null) return false;

      if (parsedInstance.permissions !== null && parsedInstance.permissions == 'OWNER') {
        // COMMENT: #4
        return true;
      }
      return false;
    },
    middleware: function (req, res, next) {
      try {
        var instance = WixModel.checkInstance(req.query.instance);
        /* COMMENT: you can store the instance with all its parameters on the 'req' object so you can reference it inside the routers
         i.e. req.wixInstance = instance;

         You can also use the checkIsOwner here and place it on the req.wixInstance object
         */
        if (instance !== null) {
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

module.exports = WixModel;
