'use strict';

angular.module('myApp', ['ngRoute', 'ngAnimate']).config(function ($routeProvider, $locationProvider) {

  $routeProvider.when('/settings', {
    template: '<settings></settings>'
  }).when('/mobile', {
    controller: 'MobileController',
    templateUrl: 'views/mobile/mobile.html'
  }).when('/index', {
    templateUrl: function templateUrl() {
      var mainUrl = 'views/home/home.html';
      var mobileUrl = 'views/mobile/mobile.html';
      var deviceType = Wix.Utils.getDeviceType();

      if (deviceType == 'mobile') {
        return mobileUrl;
      }
      return mainUrl;
    },
    controller: function controller() {
      var mainController = 'MainController';
      var mobileController = 'MobileController';
      var deviceType = Wix.Utils.getDeviceType();

      if (deviceType == 'mobile') {
        return mobileController;
      }
      return mainController;
    }

  }).otherwise({ redirectTo: '/index' });

  $locationProvider.html5Mode(true);
});