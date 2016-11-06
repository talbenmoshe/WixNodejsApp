var fs = require('fs');
var path = require('path');
var usersFilePath = path.join(__dirname, '../config/app/design.json');
module.exports = function (req, res) {
  var readable = fs.createReadStream(usersFilePath);
  readable.pipe(res);
}
