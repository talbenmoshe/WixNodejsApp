var config = require('./config/environment/index.js');
var gcloud = require('google-cloud');
var wix = require('./Wix.js');



var dataStore = gcloud.datastore({
  projectId: process.env.GCLOUD_PROJECT || config.GCLOUD_PROJECT_ID
});
var key = null;

function generateKey(wixInstance,widgetCompId) {
  var componentUniqueId = wix.getComponentUniqueId(wixInstance,widgetCompId);
  return dataStoreLibrary.setKey(['Data', componentUniqueId]);
}

// COMMENT: this object should have meanningful function names that serve the business logic of the application.
// 'readDataFromDs' has no meanning for the application..
// You should have names like 'incementLoveCounter' and not 'updateDataInDs' which is too generic for the application
var dataStoreLibrary = {
  dataStore: function () {
    return dataStore;
  },
  getKey: function () {
    return key;
  },
  setKey: function (arrKeys) {
    return dataStore.key(arrKeys);
  },
  transaction: function () {
    return dataStore.transaction();
  },
  readDataFromDs: function (transaction, req) {
    return new Promise(function (resolve, reject) {
      var key = generateKey(req.wixInstance,req.widgetCompId);
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
  // COMMENT: the name of this function is meanningless.
  // As a prive method its fine, but this method is used from the outside in other components..
  // The problem with that is that you do not know what this function does until you read the caller's code
  updateDataInDs: function (dataStore, req, data) {
    var key = generateKey(req.wixInstance,req.widgetCompId);
    var entity = {
      key: key,
      data: data
    };
    return new Promise(function (resolve, reject) {
      dataStore.save(
        entity,
        function (err) {
          if (!err) resolve(entity.data);
          else reject(err);
        }
      );
    });
}};

module.exports = dataStoreLibrary;
