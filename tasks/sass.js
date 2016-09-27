'use strict';

/**
 * Compile sass
 */

var gulp    = require('gulp');
var plumber = require('gulp-plumber');
var sass    = require('gulp-sass');
var srcFolder = 'src';//was 'client'
module.exports = function () {
  return gulp.src('src/**/styles/*.scss'/*,{base:'./'}*/)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('client'));
};
