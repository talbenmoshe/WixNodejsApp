/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 */

'use strict';

var dsLIB = require('../../ds');

var defaultSettings = { show: false };
var ds = dsLIB.ds();

// COMMENT: this functions should be in the data store
function incrementDataInDs(ds, req) {
  var count = 0;
  var settings;
  return new Promise(function (resolve, reject) {
    var transaction = dsLIB.transaction();
    transaction.run(function (transactionError) {
      if (transactionError) {
        reject(transactionError);
        return;
      }
      dsLIB.readDataFromDs(transaction, req)
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
          // COMMENT: data store should not aware of the req object.. only relevant parameters should be passed to it.
          dsLIB.updateDataInDs(ds, req, data)
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

module.exports = {
  // COMMENT: see #5
  // Gets a list of Things
  index: function (req, res) {
    incrementDataInDs(ds, req)
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
    var transaction = dsLIB.transaction();
    dsLIB.readDataFromDs(transaction, req)
      .then(function (data) {
        //  console.log('then data',data);
        res.json({ data, "first": false });
      })
      .catch(function (err) {
        //  console.log('catch error',err)
        if (err.code === 404) {
          var data = {
            'count': count,
            'settings': defaultSettings
          };
          dsLIB.updateDataInDs(ds, req, data)
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
    var transaction = dsLIB.transaction();
    dsLIB.readDataFromDs(transaction, req)
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
          dsLIB.updateDataInDs(ds, req, data)
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

    var transaction = dsLIB.transaction();
    var isShow = req.body.show;
    var settings = { show: isShow };

    dsLIB.readDataFromDs(transaction, req)
      .then(function (dbData) {
        var data = {
          'count': dbData.count,
          'settings': settings
        };
        dsLIB.updateDataInDs(ds, req, data)
          .then(function (savedData) {
            res.json({ settings: savedData.settings });
          })
          .catch(function (err) {
            res.status(err.code).send({ status: err })
          });
      })
      .catch(function (err) {
        if (err.code === 404) {
          var data = {
            'count': count,
            'settings': settings
          };
          dsLIB.updateDataInDs(ds, req, data)
            .then(function (savedData) {
              res.json({ settings: savedData.settings });
            })
            .catch(function (err) {
              res.status(500).send({ status: err });
            });
        }
        else res.status(err.code).send({ status: err });
      });
  }
};
