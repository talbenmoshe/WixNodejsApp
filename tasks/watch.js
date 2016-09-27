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

var indexToInject   = require('./config/indexFilesToInject');
var settingsToInject   = require('./config/settingsFilesToInject');
var toExclude  = require('./config/bowerFilesToExclude');
var srcFolder = 'src';//was 'client'
module.exports = function () {

  //livereload.listen();

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
     // .pipe(livereload());
  });

  var coreFiles = [
    srcFolder+'/assets/**/*',
    srcFolder+'/translations/**/*.json',
    srcFolder+'/views/**/*.html',
    srcFolder+'/views/**/*.js',
    srcFolder+'/views/**/*.css',
    '!'+srcFolder+'/views/**/*.scss',
    '!'+srcFolder+'/views/**/*.spec.js',
    '!'+srcFolder+'/views/**/*.e2e.js',
    srcFolder+'/views/*/directives/*.html',
    srcFolder+'/views/*/directives/*.js',
    '!'+srcFolder+'/views/**/directives/*.spec.js',
    srcFolder+'/services/**/*.js',
    '!'+srcFolder+'/services/**/*.spec.js',
    srcFolder+'/animations/*.js',
    srcFolder+'/filters/**/*.js',
    '!'+srcFolder+'/filters/**/*.spec.js'
  ];

  gulp.src(coreFiles,{base:'./'+srcFolder}).pipe(gulp.dest('client')).pipe(livereload());

  var lastInjection = Date.now();

  watch(coreFiles, { events: ['add', 'unlink'] }, function () {

    if (Date.now() - lastInjection < 100) { return; }

    lastInjection = Date.now();

    gulp.src(coreFiles,{base:'./'+srcFolder}).pipe(gulp.dest('client'))
      .pipe(gulp.src('client/index.ejs'))
      .pipe(inject(gulp.src(indexToInject), { relative: true }))
      .pipe(gulp.dest('client'))
      .pipe(
    gulp.src('client/settings.ejs')
      .pipe(inject(gulp.src(settingsToInject), { relative: true }))
      .pipe(gulp.dest('client')));
  });

  watch(coreFiles, livereload.changed);
  watch([srcFolder+'/*.ejs'], livereload.changed);

};
