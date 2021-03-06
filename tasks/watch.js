'use strict';

/**
 * Watch files, and do things when they changes.
 * Recompile scss if needed.
 * Reinject files
 */

var gulp       = require('gulp');
var livereload = require('gulp-livereload');
var watch      = require('gulp-watch');
var inject     = require('gulp-inject');
var plumber    = require('gulp-plumber');
var sass       = require('gulp-sass');
var bowerFiles = require('main-bower-files');
var babel = require('gulp-babel');
var indexToInject   = require('./config/indexFilesToInject');
var settingsToInject   = require('./config/settingsFilesToInject');
var toExclude  = require('./config/bowerFilesToExclude');
var srcFolder = 'src';//was 'client'
var babel = require('gulp-babel');
var srcFolder = 'src';//was 'client'

var jsFiles = [
  srcFolder+'/**/*.js',
  '!'+srcFolder+'/**/*.spec.js',
  '!'+srcFolder+'/**/*.e2e.js'
];
var pureCopy = [
  srcFolder+'/assets/**/*',
  srcFolder+'/views/**/*.html',
  srcFolder+'/translations/**/*.json',
  srcFolder+'/views/*/directives/*.html'
];

var coreFiles = [
  srcFolder+'/assets/**/*',
  srcFolder+'/**/*.json',
  srcFolder+'/**/*.html',
  srcFolder+'/**/*.js',
  srcFolder+'/**/*.css',
  '!'+srcFolder+'/**/*.scss',
  '!'+srcFolder+'/**/*.e2e.js',
  '!'+srcFolder+'/**/*.spec.js'
];

 function babelize() {
  return gulp.src(jsFiles)
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('client'));
};


module.exports = function () {

  livereload.listen();

  gulp.watch('bower.json', function () {
    gulp.src(srcFolder+'/index.ejs')
      .pipe(inject(gulp.src(bowerFiles(), { read: false }), {
        name: 'bower',
        relative: 'true',
        ignorePath: toExclude
      }))
      .pipe(gulp.dest('client'));
  });


 watch([
   srcFolder+'/**/styles/*.scss',
   srcFolder+'/views/**/*.scss',
   srcFolder+'/directives/**/*.scss'
  ], function () {

    gulp.src(srcFolder+'/**/styles/*.scss')
      .pipe(plumber())
      .pipe(sass())
      .pipe(gulp.dest('client'))
      .pipe(livereload());
  });


  gulp.src(pureCopy,{base:'./'+srcFolder})
    .pipe(gulp.dest('client'));

  babelize().pipe(livereload());

  var lastInjection = Date.now();


  watch(coreFiles,{ events: ['add', 'unlink'] }, function () {

    if (Date.now() - lastInjection < 100) { return; }

    lastInjection = Date.now();
    gulp.src(coreFiles,{base:'./'+srcFolder})
      .pipe(babelize()).pipe(gulp.dest('client'))
      .pipe(gulp.src('client/index.ejs'))
      .pipe(inject(gulp.src(indexToInject), { relative: true }))
      .pipe(gulp.dest('client'));
    gulp.src('client/settings.ejs')
      .pipe(inject(gulp.src(settingsToInject), { relative: true }))
      .pipe(gulp.dest('client'));
  });

  watch(coreFiles, {events:['change']},function(){
    gulp.src(pureCopy,{base:'./'+srcFolder})
      .pipe(gulp.dest('client'));

    return babelize()
      .pipe(livereload());


  });


  watch([srcFolder+'/*.ejs'], livereload.changed);

};
