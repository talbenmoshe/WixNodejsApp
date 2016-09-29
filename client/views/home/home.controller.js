'use strict';

angular.module('myLoveCounter')
  .controller('HomeCtrl', function ($http) {

    var vm = this;
    this.$http = $http;

    var that = this;

    angular.extend(vm, {
      name: 'HomeCtrl'
    });
    this.getData = function() {
      return that.$http.post('/api/things' + document.location.search);

    };
    //alert(1);
    this.getData();
  });
