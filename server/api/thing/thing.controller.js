/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 */

'use strict';
var wix = require('../../Wix');
var defaultSettings = {show:false};
var dsLIB = require('../../ds');
var ds = dsLIB.ds();

function generateKey(req){
  var metasiteId = getMetaSiteId(req);
  return dsLIB.setKey(['love', metasiteId]);
}



module.exports = {
// Gets a list of Things
  index: function (req, res) {
    incrementLoveInDs(ds, req)
      .then(function(count) {
        //callbackRead
       // console.log('index post success',count);
        res.json({loveCount: count})
      })
    .catch(function (err) {
      console.log('index post fail',err);
    });
  }

, read: function (req,res){
    var count = 0;
    var transaction = dsLIB.transaction();
    readLoveFromDs(ds, transaction, req)
      .then(function (data) {
      //  console.log('then data',data);
          res.json({loveCount: data.count, settings: data.settings, data: data, "first": false});
      })
      .catch(function(err){
      //  console.log('catch error',err)
        if (err.code === 404) {
          updateLoveInDs (ds, req, count, defaultSettings).then(function(data) {
            res.json({loveCount: data.count, settings: data.settings, data: data, "first": true});
          })
            .catch(function(updateError){res.status(500).send({status:updateError});
          });
        }
        else res.status(err.code).send({status:err});
      }
      //done();
    );
  }
  ,readSettings : function(req,res){
    var  count = 0;
    var transaction = dsLIB.transaction();
    readLoveFromDs(ds, transaction, req)
      .then(function(data) {
      //  console.log('got res count from datastore', data);
          res.json({settings: data.settings});
      })
      .catch(function(err){
        //  console.log('error got res count from datastore', error);
        if (err.code === 404) {
          updateLoveInDs (ds, req, count,  defaultSettings)
            .then(function(data) {
              //if (typeof data !== null) {
                res.json({settings: data.settings});
              //}
            })
            .catch(function(err){
              res.status(500).send({status:err});
          });
        }
        else res.status(err.code).send({status:err});
      }

      //done();
    );
  }
  ,writeSettings : function(req,res){
    var  count = 0;

    var transaction = dsLIB.transaction();
    var isShow = req.body.show;
    var settings = {show:isShow};

    readLoveFromDs(ds,transaction, req)
      .then(function (data) {
          updateLoveInDs(ds, req, data.count, settings)
            .then(function (data) {
             // if (typeof data !== null) {
                res.json({settings: data.settings});
             // }
            })
            .catch(function(err){
              res.status(err.code).send({status: err})
          });
      })
      .catch(function(err) {
        if (err.code === 404) {
          updateLoveInDs(ds, req, count, settings)
            .then(function (data) {
              // if(typeof data !== null) {
              res.json({settings: data.settings});
              // }
            })
            .catch(function (err) {
              res.status(500).send({status: err});
            });
        }
        else res.status(err.code).send({status:err});
      }
    );
  }
};

function getMetaSiteId (req){
  var instance = wix.checkInstance(req.query.instance);
  var compId = req.query.origCompId || req.query.compId;
  return (instance.instanceId+'_'+ compId) || 'demo';
}

function incrementLoveInDs(ds, req){
  var error;
  var count = 0;
  var dbData;
  var settings;
  return new Promise(function(resolve, reject){
    var transaction = dsLIB.transaction();
    transaction.run(function(transactionError) {
      if (transactionError){
        reject(transactionError);
        return;
      }

      readLoveFromDs(ds,transaction, req)
        .then(function(data){
          if (typeof data !== 'undefined') {
            console.log('got count from datastore', data);
            count = data.count + 1;
            settings = data.settings;
            resolve(count);
          }
        })
        .catch(function(readError){
          if (readError.code == 404){
           settings=defaultSettings;
          }
          else reject(readError);
        })
        .then(function(){
            updateLoveInDs(ds, req, count, settings)
              .then(function(count){
                resolve(count);
              })
              .catch(function(updateError){
                reject(updateError);
              });
      });
    });
  });
}


function updateLoveInDs (ds, req, count, settings) {
  var key = generateKey(req);

  var entity = {
    key: key,
    data: {'count':count,
            'settings':settings
          }
  };
  return new Promise(function(resolve, reject) {
    ds.save(
      entity,
      function (err) {
        if (!err) resolve(entity.data);
        else reject(err);
      }
    );
  });
}
function readLoveFromDs (ds, transaction,req) {
  return new Promise(function(resolve, reject) {
    var key = generateKey(req);
    transaction.get(key, function (err, entity) {
      if (err) {
        //return callback(err);
        reject(err);
      }
      if (!entity) {
        reject ({
          code: 404,
          message: 'Not found'
        });
      }
      else resolve(entity.data);
    });
  });
}
