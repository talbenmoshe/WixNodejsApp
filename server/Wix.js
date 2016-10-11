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
  var parsedInstance = null;
  //var that = this;
  return {
    checkInstance: function (ainstance) {
      try {
        parsedInstance = wix.parse(ainstance);
        return parsedInstance ;
      }
      catch (err) {
        console.log('checkInstance err:',err);
        return null;
      }
    },

    getMetaSiteId: function (req){
      var instance = this.initWix(req.query.instance);
      var compId = req.query.origCompId || req.query.compId;
      return (instance.instanceId+'_'+ compId) || 'demo';
    },

    checkIsOwner:function(){
      if (parsedInstance=== null) return false;

      if( parsedInstance.permissions !== null && parsedInstance.permissions=='OWNER') {
        return true;
      }
      return false;
    }
  }
}
());

module.exports = WixModel;
