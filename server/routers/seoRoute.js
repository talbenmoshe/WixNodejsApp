module.exports = function(req, res) {
  var queryString = req.url.split('?');
  queryString = queryString.length < 2 ? '' : queryString[1];
  res.render('seo', { myquery: queryString });
}
