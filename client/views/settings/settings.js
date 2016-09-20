'use strict';

angular.module('myLoveCounter')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/settings', {
        templateUrl: 'views/settings/settings.html',
        controller: 'settingsCtrl',
        controllerAs: 'settingsCtrl'
      });
  });
