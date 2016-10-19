var config = require('./config/environment');

function seoRoute(req,res){
  var mysplit= req.url.split('?');
  mysplit= mysplit.length<2?'':mysplit[1];
  res.render('seo',{myquery:mysplit});
}

function indexRoute(req,res){

  //console.log(config.env ,req.query.deviceType);
  if ((config.env !== 'production') && (req.query.deviceType) &&  (req.query.deviceType === 'mobile') ){
    res.render('mobile');
  }
  else res.render('index');
}

module.exports = {
  seoRoute,
  indexRoute
};
