/**
 * Files injected into index.html by gulp-inject
 * used by tasks inject & watch
 */
var srcFolder = 'client';
module.exports = [
  srcFolder+'/views/settings/*.js',
  srcFolder+'/animations/*.js',
  srcFolder+'/views/settings/directives/*.js', '!'+srcFolder+'/views/settings/directives/**/*.spec.js',
  srcFolder+'/filters/**/*.js', '!'+srcFolder+'/filters/**/*.spec.js',
  srcFolder+'/services/**/*.js', '!'+srcFolder+'/services/**/*.spec.js',
  srcFolder+'/controllers/settings/*.js',
  '!'+srcFolder+'/views/**/*.spec.js', '!'+srcFolder+'/views/**/*.e2e.js'
];
