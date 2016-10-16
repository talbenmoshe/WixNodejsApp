var config = require('./config/environment');
var gcloud = require('google-cloud');
var ds = gcloud.datastore({
  projectId: process.env.GCLOUD_PROJECT||config.GCLOUD_PROJECT_ID
});
var key = null;

module.exports = {

  ds: function(){
    return ds;
  },
  getKey: function(){
    return key;
  },
  setKey:function(arrKeys){
    return ds.key(arrKeys);
  },
  transaction: function(){
    return ds.transaction();
  }

};
