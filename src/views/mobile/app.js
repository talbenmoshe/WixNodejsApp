'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngAnimate'
])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/settings', {

        template: '<settings></settings>'
      })
      .when('/mobile',{
        template: '<mobile></mobile>'
      })
      .otherwise({
        template: '<main></main>'
      });

    $locationProvider.html5Mode(true);

  });
