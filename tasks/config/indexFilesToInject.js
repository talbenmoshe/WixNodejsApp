/**
 * Files injected into index.html by gulp-inject
 * used by tasks inject & watch
 */
var srcFolder = 'client';
module.exports = [
  srcFolder+'/animations/*.js',
  srcFolder+'/views/home/directives/*.js', '!'+srcFolder+'/views/home/directives/**/*.spec.js',
  srcFolder+'/filters/**/*.js', '!'+srcFolder+'/filters/**/*.spec.js',
  srcFolder+'/services/**/*.js', '!'+srcFolder+'/services/**/*.spec.js',
  srcFolder+'/views/home/**/*.js', '!'+srcFolder+'/views/**/*.spec.js', '!'+srcFolder+'/views/**/*.e2e.js'
];
