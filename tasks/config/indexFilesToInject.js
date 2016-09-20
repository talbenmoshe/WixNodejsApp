/**
 * Files injected into index.html by gulp-inject
 * used by tasks inject & watch
 */

module.exports = [
  'client/animations/*.js',
  'client/views/home/directives/*.js', '!client/views/home/directives/**/*.spec.js',
  'client/filters/**/*.js', '!client/filters/**/*.spec.js',
  'client/services/**/*.js', '!client/services/**/*.spec.js',
  'client/views/home/**/*.js', '!client/views/**/*.spec.js', '!client/views/**/*.e2e.js'
];
