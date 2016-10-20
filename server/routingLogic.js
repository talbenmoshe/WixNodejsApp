var config = require('./config/environment');

function seoRoute(req,res){
  var queryString = req.url.split('?');
  queryString= queryString.length<2?'':queryString[1];
  res.render('seo',{myquery:queryString});
}

function indexRoute(req,res){
  if ((config.env !== 'production') && (req.query.deviceType) &&  (req.query.deviceType === 'mobile') ){
    res.render('mobile');
  }
  else res.render('index');
}

module.exports = {
  seoRoute,
  indexRoute
};
