var config = require('./config/environment');
var gcloud = require('google-cloud');
var wix = require('./Wix');

/**
 * COMMENT:
 * call this file data-store and not ds (make it specific)
 */

// COMMENT: dataStore
var ds = gcloud.datastore({
  projectId: process.env.GCLOUD_PROJECT || config.GCLOUD_PROJECT_ID
});
var key = null;
// COMMENT: this should not be aware of the req object. Pass it the metaSiteId from the outside
function generateKey(req) {
  var metaSiteId = wix.getMetaSiteId(req);
  return dsLIB.setKey(['Data', metaSiteId]);
}

// COMMENT: dataStoreLibrary
// COMMENT: why is this a self invoked function? there's no closure here.. use a plain object.. (unless you have a real reason not to)
// COMMENT: this object should have meanningful function names that serve the business logic of the application. 'readDataFromDs' has no meanning for the application.. You should have names like 'incementLoveCounter' and not 'updateDataInDs' which is too generic for the application
var dsLIB = (function () {
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
    },
    readDataFromDs: function (transaction, req) {
      return new Promise(function (resolve, reject) {
        var key = generateKey(req);
        transaction.get(key, function (err, entity) {
          if (err) {
            //console.log('error got res from datastore', err);
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
    },
    // COMMENT: the name of this function is meanningless. As a prive method its fine, but this method is used from the outside in other components.. The problem with that is that you do not know what this function does until you read the caller's code
    updateDataInDs: function (ds, req, data) {
      var key = generateKey(req);
      var entity = {
        key: key,
        data: data
      };
      return new Promise(function (resolve, reject) {
        ds.save(
          entity,
          function (err) {
            if (!err) resolve(entity.data);
            else reject(err);
          }
        );
      });
    }
  }
} ());

module.exports = dsLIB;
