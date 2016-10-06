'use strict';

angular.module('myApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/index-desktop', {
        /*
         templateUrl: 'views/settings/settings.html',
         controller: 'settingsCtrl',
         controllerAs: 'settingsCtrl'
         */
        template: '<main></main>'
      });
  });
