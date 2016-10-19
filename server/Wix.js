/**
 * WixModel application file
 */

'use strict';



var config = require('./config/environment');
var wix = require('wix');

var WixModel = (function() {

  var appSecretKey = config.APP_SECRET_KEY;
  var appId = config.APP_DEFINITION_ID;
  wix.secret(appSecretKey); // Sets the Wix secret key
  //console.log('wix secret key is %s',appSecretKey);
  var that = this;
  return {
    checkInstance: function (ainstance) {
      try {
        var parsedInstance = wix.parse(ainstance);
        return parsedInstance ;
      }
      catch (err) {
        console.log('checkInstance err:',err);
        return null;
      }
    },

    getMetaSiteId: function (req){
      var instance = WixModel.checkInstance(req.query.instance);
      var compId = req.query.origCompId || req.query.compId;
      return (instance.instanceId+'_'+ compId) || 'demo';
    },

    checkIsOwner:function(req){
      var parsedInstance = WixModel.checkInstance(req.query.instance);
      if (parsedInstance === null) return false;

      if( parsedInstance.permissions !== null && parsedInstance.permissions=='OWNER') {
        return true;
      }
      return false;
    },
    middleware: function(req,res,next){
      try {
        // if (!req.instance) return next();

        var instance = WixModel.checkInstance(req.query.instance);
        if (instance !== null) {
          next();
        }
        else {
          console.log('url1: %s\nquery:%s',req.url,req.query);
          res.send('unauthorized');
        }

      }catch(e){
        console.log('url2: %s\nquery:%s',e,req.query);
        res.send('unauthorized!');
      }

    }
  }
}
());

module.exports = WixModel;
