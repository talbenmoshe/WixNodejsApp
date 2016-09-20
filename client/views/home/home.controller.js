'use strict';

angular.module('myLoveCounter')
  .controller('HomeCtrl', function ($http) {

    var vm = this;
    this.$http = $http;
    angular.extend(vm, {
      name: 'HomeCtrl'
    });
    this.$http.post('/api/things'+document.location.search)
      .then(function(response)  {
      console.log('success',response);
  },function(response)  {
        console.log('fail',response);
    })
    ;
  });
