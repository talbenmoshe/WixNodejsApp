var gulp       = require('gulp');
var srcFolder = 'src';
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

module.exports = function() {

  gulp.src(coreFiles,{base:'./'+srcFolder}).pipe(gulp.dest('client'));
};
