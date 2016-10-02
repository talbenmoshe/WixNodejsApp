'use strict';
function getLocale(defaultLocale){
  var locale = Wix.Utils.getLocale() ||'en';
  locale = locale.toLowerCase().replace(/[^a-zA-Z]+/g, "");

  if(locale.length === 2) {
    return locale;
  }

  return defaultLocale;
}
angular.module('myApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/settings', {
        /*
        templateUrl: 'views/settings/settings.html',
        controller: 'settingsCtrl',
        controllerAs: 'settingsCtrl'
        */
        template: '<settings></settings>'
      });
  });
