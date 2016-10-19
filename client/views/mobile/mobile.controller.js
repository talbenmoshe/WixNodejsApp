'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MobileController = function () {
    function MobileController() {
      //this.MainController = MainController;

      _classCallCheck(this, MobileController);
    }

    _createClass(MobileController, [{
      key: '$onInit',
      value: function $onInit() {
        console.log('mobile controller', this);
      }
    }]);

    return MobileController;
  }();
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


  angular.module('myApp').controller('MobileController', MobileController);
})();