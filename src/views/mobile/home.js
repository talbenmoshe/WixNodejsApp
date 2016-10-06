'use strict';

angular.module('myApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        /*
         templateUrl: 'views/settings/settings.html',
         controller: 'settingsCtrl',
         controllerAs: 'settingsCtrl'
         */
        template: '<main></main>'
      });
  });
