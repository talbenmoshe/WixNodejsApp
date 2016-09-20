'use strict';

/**
 * Inject css/js files in index.ejs
 */

var gulp       = require('gulp');
var bowerFiles = require('main-bower-files');
var fileSort   = require('gulp-angular-filesort');
var inject     = require('gulp-inject');

var toInject   = require('./config/indexFilesToInject');
var settingsToInject = require('./config/settingsFilesToInject');
var toExclude  = require('./config/bowerFilesToExclude');

function doInject (fileName,files,cssFileNames){
  console.log('do js inject for ',fileName);
  return gulp.src(fileName)
    .pipe(inject(gulp.src(bowerFiles(), { read: false }), {
      name: 'bower',
      relative: 'true',
      ignorePath: toExclude
    }))
    .pipe(inject(
      gulp.src(files).pipe(fileSort()), { relative: true }
    ))
    .pipe(inject(gulp.src(cssFileNames, { read: false}),{
      relative: true
    }))
    .pipe(gulp.dest('client'));
}

function doCSSInject (fileName,files){
  console.log('do css inject for ',fileName);
  var target = gulp.src(fileName);
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(files, {read: false });

  return target.pipe(inject(sources,{relative:true,base:'views'}))
    .pipe(gulp.dest('client'));

}
module.exports = function () {
  //doCSSInject('client/index.ejs', 'client/views/home/styles/*.css');
  //doCSSInject('client/settings.ejs', 'client/views/settings/styles/*.css');
  doInject('client/index.ejs',toInject,'client/views/home/styles/*.css');

  return doInject('client/settings.ejs',settingsToInject,'client/views/settings/styles/*.css');



  //doInject('client/index.ejs',toInject);
  //return  doInject('client/settings.ejs',settingsToInject);


};
