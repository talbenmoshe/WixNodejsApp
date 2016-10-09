'use strict';

(function() {

   class MobileController{
     constructor() {
       //this.MainController = MainController;

     }
    $onInit() {
      console.log('mobile controller',this);
    }
  }
/*
  angular.module('myApp')
    .component('mobile', {
      transclude: true,
      templateUrl: 'views/mobile/mobile.html',
      controller: MobileController,
      require: {
        parent: '^MainController'
      },
    })
  ;
  */
  angular.module('myApp').controller('MobileController',MobileController);
})();
