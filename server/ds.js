var config = require('./config/environment');
var gcloud = require('google-cloud');
var wix = require('./Wix');

var ds = gcloud.datastore({
  projectId: process.env.GCLOUD_PROJECT||config.GCLOUD_PROJECT_ID
});
var key = null;
function generateKey(req){
  var metaSiteId = wix.getMetaSiteId(req);
  return dsLIB.setKey(['Data', metaSiteId]);
}



var dsLIB =  (function()  {
  return {
    ds: function () {
      return ds;
    },
    getKey: function () {
      return key;
    },
    setKey: function (arrKeys) {
      return ds.key(arrKeys);
    },
    transaction: function () {
      return ds.transaction();
    }
    , readDataFromDs: function (transaction, req) {

      return new Promise(function (resolve, reject) {
        var key = generateKey(req);
        transaction.get(key, function (err, entity) {
          if (err) {
            reject(err);
          }
          if (!entity) {
            reject({
              code: 404,
              message: 'Not found'
            });
          }
          else resolve(entity.data);
        });
      });
    }
  }
}
());


module.exports = dsLIB;

