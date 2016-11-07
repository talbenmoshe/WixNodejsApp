
'use strict';

/**
 * Compile es2015
 */

var gulp    = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var srcFolder = 'src';//was 'client'
module.exports = function () {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('client'));
};
