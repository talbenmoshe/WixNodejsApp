'use strict';

/**
 * Inject css/js files in index.ejs
 */

var gulp       = require('gulp');
var bowerFiles = require('main-bower-files');
var fileSort   = require('gulp-angular-filesort');
var inject     = require('gulp-inject');
var runSequence          = require('run-sequence');
var sq                   = require('streamqueue');

var toInject   = require('./config/indexFilesToInject');
var settingsToInject = require('./config/settingsFilesToInject');
var toExclude  = require('./config/bowerFilesToExclude');

function doInject (fileName,files,cssFileNames){
  //console.log('do js inject for ',fileName);


  return gulp.src(fileName)
    .pipe(gulp.dest('client'))
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

gulp.task('inject:ejs', function (done) {
  return gulp.src('src/*.ejs')
    .pipe(gulp.dest('client'));
});

gulp.task('inject:index', function (done) {
  return  doInject('src/index.ejs',toInject,'client/views/home/styles/*.css');
});

gulp.task('inject:mobile', function (done) {
  return  doInject('src/mobile.ejs',toInject,['client/views/home/styles/*.css','client/views/mobile/styles/*.css']);
});

gulp.task('inject:settings', function(done){
  return doInject('src/settings.ejs',settingsToInject,'client/views/settings/styles/*.css');
});
module.exports = function (done) {
  return runSequence(
    ['inject:ejs'],['inject:index','inject:mobile'],'inject:settings',
    done);
};




