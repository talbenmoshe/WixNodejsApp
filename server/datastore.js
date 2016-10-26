var config = require('./config/environment/index.js');
var gcloud = require('google-cloud');
var wix = require('./Wix.js');



var dataStore = gcloud.datastore({
  projectId: process.env.GCLOUD_PROJECT || config.GCLOUD_PROJECT_ID
});


function generateKey(keyParts) {
  var componentUniqueId = wix.getComponentUniqueId(keyParts);
  return dataStoreLibrary.setKey(['Data', componentUniqueId]);
}



var dataStoreLibrary = {
  dataStore: function () {
    return dataStore;
  },

  getRecordKey: function(req){
    var keyParts = [req.wixInstance.instanceId, req.widgetCompId];
    return generateKey(keyParts);
  },

  setKey: function (arrKeys) {
    return dataStore.key(arrKeys);
  },
  transaction: function () {
    return dataStore.transaction();
  },

  readWidgetSettings: function (transaction, key) {
    return new Promise(function (resolve, reject) {
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

  updateWidgetSettings: function ( key, data) {
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
  },

  incrementCounter:function (defaultSettings, key) {
    var count = 0;
    var settings;
    return new Promise(function (resolve, reject) {
      var transaction = dataStoreLibrary.transaction();
      transaction.run(function (transactionError) {
        if (transactionError) {
          reject(transactionError);
          return;
        }
        dataStoreLibrary.readWidgetSettings(transaction, key)
          .then(function (data) {
            if (typeof data !== 'undefined') {
              count = data.count + 1;
              settings = data.settings;
              resolve(count);
            }
          })
          .catch(function (readError) {
            if (readError.code === 404) {
              settings = defaultSettings;
            }
            else reject(readError);
          })
          .then(function () {
            var data = {
              'count': count,
              'settings': settings
            };

            dataStoreLibrary.updateWidgetSettings( key, data)
              .then(function (savedData) {
                resolve(savedData);
              })
              .catch(function (updateError) {
                reject(updateError);
              });
          });
      });
    });
  }
};

module.exports = dataStoreLibrary;
