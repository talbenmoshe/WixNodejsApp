/**
 * Created by meir.c@galilsoftware.com on 26/09/2016.
 */

var gulp = require('gulp');



var shell = require('gulp-shell');

module.exports = function () {

  var arg = process.argv[3] ? process.argv[3].substr(2) : false;
  if (arg === 'production') {
    process.env.NODE_ENV = 'production';
  }
  else if (arg === 'development'){
    process.env.NODE_ENV = 'development';
  }
  else {
    console.log('Wrong parameter [%s], availables : --production, --development', arg);
    return ;
  }
  var config = require('../server/config/environment');
  /*
  return gulp.src([
    `app.yaml`
  ], { dot: true })
    .pipe(gulp.dest(`dist`));
    */
  return shell(['ls -la'],{interactive:true,verbose: true});
};
