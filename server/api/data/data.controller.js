/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/data              ->  index
 */

'use strict';

var dataStoreLibrary = require('../../datastore.js');

var defaultSettings = { show: false };
var dataStore = dataStoreLibrary.dataStore();



module.exports = {
  index: function (req, res) {
    var key = dataStoreLibrary.getRecordKey(req);
    dataStoreLibrary.incrementCounter(defaultSettings, key)
      .then(function (count) {
        //callbackRead
        // console.log('index post success',count);
        res.json({ data: { count: count } });
      })
      .catch(function (err) {
        console.log('index post fail', err);
      });
  },
  read: function (req, res) {
    var count = 0;
    var transaction = dataStoreLibrary.transaction();
    var key = dataStoreLibrary.getRecordKey(req);
    dataStoreLibrary.readWidgetSettings(transaction, key)
      .then(function (data) {
        //  console.log('then data',data);
        res.json({ data, "first": false });
      })
      .catch(function (err) {
         // console.log('catch error',err);
        if (err.code === 404) {
          var data = {
            'count': count,
            'settings': defaultSettings
          };
          dataStoreLibrary.updateWidgetSettings(key, data)
            .then(function (savedData) {
              res.json({ savedData, "first": true });
            })
            .catch(function (updateError) {
              res.status(500).send({ status: updateError });
            });
        }
        else res.status(err.code).send({ status: err });
      }
      //done();
      );
  },
  readSettings: function (req, res) {
    var count = 0;
    var transaction = dataStoreLibrary.transaction();
    var key = dataStoreLibrary.getRecordKey(req);
    dataStoreLibrary.readWidgetSettings(transaction, key)
      .then(function (data) {
        //  console.log('got res count from datastore', data);
        res.json({ settings: data.settings });
      })
      .catch(function (err) {
        if (err.code === 404) {
          var data = {
            'count': count,
            'settings': defaultSettings
          };
          dataStoreLibrary.updateWidgetSettings( key, data)
            .then(function (savedData) {
              res.json({ settings: savedData.settings });
            })
            .catch(function (err) {
              res.status(500).send({ status: err });
            });
        }
        else res.status(err.code).send({ status: err });
      }

      //done();
      );
  }
  , writeSettings: function (req, res) {
    var count = 0;

    var transaction = dataStoreLibrary.transaction();
    var isShow = req.body.show;
    var settings = { show: isShow };
    var key = dataStoreLibrary.getRecordKey(req);
    dataStoreLibrary.readWidgetSettings(transaction, key)
      .then(function (dbData) {
        var data = {
          'count': dbData.count,
          'settings': settings
        };
        dataStoreLibrary.updateWidgetSettings(key, data)
          .then(function (savedData) {
            res.json({ settings: savedData.settings });
          })
          .catch(function (err) {
            console.log('catch error',err)
            res.status(err.code).send({ status: err })
          });
      })
      .catch(function (err) {
        console.log('catch error',err)
        if (err.code === 404) {
          var data = {
            'count': count,
            'settings': settings
          };
          dataStoreLibrary.updateWidgetSettings( key, data)
            .then(function (savedData) {
              res.json({ settings: savedData.settings });
            })
            .catch(function (err) {
              console.log('catch error',err)
              res.status(500).send({ status: err });
            });
        }
        else res.status(err.code).send({ status: err });
      });
  }
};
