'use strict';

angular.module('myApp', ['ngRoute', 'ngAnimate']).config(function ($routeProvider, $locationProvider) {

  $routeProvider.when('/settings', {

    template: '<settings></settings>'
  }).when('/mobile', {
    controller: function controller() {
      console.log('in mobile view');
    },
    template: '<mobile></mobile>'
  }).when('/index', {
    template: function template() {
      var mobileTemplate = '<mobile></mobile>';
      var indexTemplate = '<main></main>';
      var deviceType = Wix.Utils.getDeviceType();
      console.log('device type', deviceType);
      if (deviceType == 'mobile') {
        return mobileTemplate;
      }

      return indexTemplate;
    }
  }).otherwise({ redirectTo: '/index' });

  $locationProvider.html5Mode(true);
});