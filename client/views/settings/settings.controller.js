'use strict';

angular.module('myLoveCounter')
  .controller('settingsCtrl', function ($scope) {

    var vm = this;

    angular.extend(vm, {
      name: 'settingsCtrl'
    });

    this.checkboxCtrl = {
      onChange: function(){
        console.log('onChange called', arguments);
      }
    }
  });
