/**
 * Files injected into index.html by gulp-inject
 * used by tasks inject & watch
 */

module.exports = [
  'client/views/settings/*.js',
  'client/animations/*.js',
  'client/views/settings/directives/*.js', '!client/views/settings/directives/**/*.spec.js',
  'client/filters/**/*.js', '!client/filters/**/*.spec.js',
  'client/services/**/*.js', '!client/services/**/*.spec.js',
  '!client/views/**/*.spec.js', '!client/views/**/*.e2e.js'
];
