'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngAnimate'
])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/settings', {
        templateUrl: 'views/settings/settings.html',
        controller: 'HomeCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
      templateUrl: 'views/home/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'ctrl'
      });

    $locationProvider.html5Mode(true);

  });
