var config = require('./../config/environment/index.js');

module.exports = function (req, res) {
  if ((config.env !== 'production') && (req.query.deviceType) && (req.query.deviceType === 'mobile')) {
    res.render('mobile');
  }
  else res.render('index');
}
