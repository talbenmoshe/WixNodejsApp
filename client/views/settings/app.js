'use strict';
/*app declaration */
angular.module('myLoveCounter', [
  'ngRoute',
  'ngAnimate',
  'WixControls'
])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .otherwise({
        redirectTo: '/settings'
      });

    $locationProvider.html5Mode(true);

  });
