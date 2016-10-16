/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 */

'use strict';
var wix = require('../../Wix');
var defaultSettings = {show:false};
var dsLIB = require('../ds');
var ds = dsLIB.ds();

function generateKey(req){
  var metasiteId = getMetaSiteId(req);
  return ds.setKey(['love', metasiteId]);
}

module.exports = {
// Gets a list of Things
  index: function (req, res) {

    incrementLoveInDs(ds, req, function(err, count) {
      //callbackRead
      res.json({loveCount: count, list: [{name: 'one thing', info: 'one thing info...'}]});
    }, function (err, count) {
      console.log('transaction completed error', err, count);
    });
  }

, read: function (req,res){
    var count = 0;
    var transaction = ds.transaction();
    readLoveFromDs(ds, transaction, req, function (err, data) {
      if(typeof data !== 'undefined') {
        res.json({loveCount: data.count,settings: data.settings,data: data,"first":false});
      }
      else{
        if (err.code === 404) {
          updateLoveInDs (ds, req, count, defaultSettings, function(err,data){
            if(typeof data !== null) {
              res.json({loveCount: data.count, settings: data.settings, data: data,"first":true});
            }
            else res.status(500).send({status:err});
          });
        }
        else res.status(err.code).send({status:err});
      }
      //done();
    });
  }
  ,readSettings : function(req,res){
    var  count = 0;
    var transaction = ds.transaction();
    readLoveFromDs(ds, transaction, req, function (err, data) {
      //console.log('got res count from datastore', err, data);
      if(typeof data !== 'undefined') {
        res.json({settings: data.settings});
      }
      else{
        if (err.code === 404) {
          updateLoveInDs (ds, req, count,  defaultSettings, function(err,data){
            if(typeof data !== null) {
              res.json({settings: data.settings});
            }
            else res.status(500).send({status:err});
          });
        }
        else res.status(err.code).send({status:err});
      }

      //done();
    });
  }
  ,writeSettings : function(req,res){
    var  count = 0;

    var transaction = ds.transaction();
    var isShow = req.body.show;
    var settings = {show:isShow};

    readLoveFromDs(ds,transaction, req, function (err, data) {
      if(typeof data !== 'undefined') {
        updateLoveInDs(ds, req, data.count, settings, function (err, data) {
          if (typeof data !== null) {
            res.json({settings: data.settings});
          }
          else res.status(500).send({status: err});
        });
      }
      else {
        if (err.code === 404) {
          updateLoveInDs (ds, req, count,  settings, function(err,data){
            if(typeof data !== null) {
              res.json({settings: data.settings});
            }
            else res.status(500).send({status:err});
          });
        }
        else res.status(err.code).send({status:err});
      }
    });
  }
}

function getMetaSiteId (req){
  var instance = wix.checkInstance(req.query.instance);
  var compId = req.query.origCompId || req.query.compId;
  return (instance.instanceId+'_'+ compId) || 'demo';
}




function incrementLoveInDs(ds, req, callbackRead, callback) {
 // console.log(ds);
  var error;
  var count = 0;
  var promise = new Promise(function(resolve, reject){

  });
  var transaction = ds.transaction();

  transaction.run(function(err) {
    readLoveFromDs(ds,transaction, req, function (err, data) {

      if(typeof data !== 'undefined') {
        console.log('got count from datastore', err, data);
        count = data.count + 1;
        settings = data.settings;
      }
      else {
        console.log(err);
        if (err.code == 404){
          data = {setting:defaultSettings,count:0};
        }
      }
      callbackRead(err, count);
      updateLoveInDs(ds, req, count, data.settings,function (err, data) {
        console.log('got response from datastore', err, data);
        error = err;
        //done();
      })
    });
  }, function(transactionError) {
    if (transactionError || error) {
      callback(transactionError || error);
    } else {
      // The transaction completed successfully.
      callback(null, count);
    }
  });
}

function updateLoveInDs (ds, req, count, settings, callback) {
  var key = generateKey(req);

  var entity = {
    key: key,
    data: {'count':count,
            'settings':settings
          }
  };

  ds.save(
    entity,
    function (err) {
      callback(err, err ? null : entity.data);
    }
  );
}
function readLoveFromDs (ds, transaction,req, callback) {
  var key = generateKey(req);
  transaction.get(key, function (err, entity) {
    if (err) {
      return callback(err);
    }
    if (!entity) {
      return callback({
        code: 404,
        message: 'Not found'
      });
    }
    callback(null, entity.data);
  });
}
