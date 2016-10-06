'use strict';

(function() {

   class MobileController{
     constructor() {
      // this.MainController = MainController;

     }
    $onInit() {
      console.log('mobile controller');
    }
  }

  angular.module('myApp')
    .component('mobile', {
      templateUrl: 'views/mobile/mobile.html',
      controller: MobileController

    })
  ;
})();
