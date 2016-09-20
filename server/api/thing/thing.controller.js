/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 */

'use strict';
var wix =require('wix');
var defaultSettings = {show:false};

module.exports = {
// Gets a list of Things
  index: function (req, res) {
  //console.log('GOT ds ', req.ds);
  var metasiteId = getMetaSiteId(req);
  incrementLoveInDs(req.ds, metasiteId, function(err, count) {
    //callbackRead
    console.log('read completed', err, count);
    res.json({loveCount: count, list: [{name: 'one thing', info: 'one thing info...'}]});
  }, function (err, count) {
    console.log('transaction completed', err, count);
  });
}
, read: function (req,res){
    var ds = req.ds, count = 0, settings = {show: false};
    var metasiteId = getMetaSiteId(req);
    var key = ds.key(['love', metasiteId]);
    readLoveFromDs(ds, metasiteId, function (err, data) {
      console.log('got res count from datastore', err, data);
      if(typeof data !== 'undefined') {
        console.log('got count from datastore', err, data);
        res.json({loveCount: data.count,settings: data.settings,data: data,"first":false});
      }
      else{
        if (err.code === 404) {
          updateLoveInDs (ds, metasiteId, 0, defaultSettings, function(err,data){
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
    var ds = req.ds, count = 0, settings = {show: false};
    var metasiteId = getMetaSiteId(req);
    var key = ds.key(['love', metasiteId]);

    var isShow = settings.show;
    readLoveFromDs(ds, metasiteId, function (err, data) {
      //console.log('got res count from datastore', err, data);

      if(typeof data !== 'undefined') {
        res.json({settings: data.settings});
      }
      else{
        if (err.code === 404) {
          updateLoveInDs (ds, metasiteId, 0,  {show:isShow}, function(err,data){
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
    var ds = req.ds, count = 0, settings = {show: false};
    var metasiteId = getMetaSiteId(req);
    var key = ds.key(['love', metasiteId]);

    var isShow = req.body.show;
    readLoveFromDs(ds, metasiteId, function (err, data) {
      //console.log('got res count from datastore', err, data);

      if(typeof data !== 'undefined') {

        //console.log('got settings from datastore', err, data);
        updateLoveInDs(ds, metasiteId, data.count, {show: isShow}, function (err, data) {
          if (typeof data !== null) {
            res.json({settings: data.settings});
          }
          else res.status(500).send({status: err});
        });

      }
      else{
        if (err.code === 404) {
          updateLoveInDs (ds, metasiteId, 0,  {show:isShow}, function(err,data){
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
}

function getMetaSiteId (req){
  return 'demo';
  var instance = wix.parse(req.query.instance);
  var compId = req.query.origCompId || req.query.compId;
  return (instance.instanceId+'_'+ compId) || 'demo';
}




function incrementLoveInDs(ds, metasiteId, callbackRead, callback) {
 // console.log(ds);
  var error;
  var count = 0;
  var settings = {show:false};
  var transaction = ds.transaction();

  transaction.run(function(err) {
    readLoveFromDs(ds,transaction, metasiteId, function (err, data) {
      console.log('got res count from datastore', err, data);
      if(typeof data !== 'undefined') {
        console.log('got count from datastore', err, data);
        count = data.count + 1;
        settings = data.settings;
      }
      else {
        console.log(err);
        if (err.code == 404){
          data = {setting:settings,count:0};
        }
      }
      callbackRead(err, count);
      updateLoveInDs(ds, metasiteId, count, data.settings,function (err, data) {
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

function updateLoveInDs (ds, metasiteId, count, settings, callback) {
  var key = ds.key(['love', metasiteId]);

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
function readLoveFromDs (ds, transaction,metasiteId, callback) {
  var key = ds.key(['love', metasiteId]);
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
