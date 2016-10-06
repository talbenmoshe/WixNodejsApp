'use strict';

/*app declaration */
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'WixControls',
  'pascalprecht.translate','nl2br-filter'
])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .otherwise({
        template: '<settings></settings>'
      });

    $locationProvider.html5Mode(true);

  })
  .config(function ($translateProvider) {
    var locale = getLocale('en');
    $translateProvider.useStaticFilesLoader({
      prefix: "translations/settings/text_",
      suffix: ".json"
    })
      .preferredLanguage(locale)
      .fallbackLanguage('en')  // if translation file not exist then load English by default
      .useSanitizeValueStrategy(null); //http://angular-translate.github.io/docs/#/guide/19_security;
  });
