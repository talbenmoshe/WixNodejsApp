'use strict';

describe('Controller: HomeCtrl', function () {

  beforeEach(module('myApp'));

  var HomeCtrl, scope;
  var $httpBackend;
  beforeEach(inject(function ($controller, $rootScope, $injector) {
    scope = $rootScope.$new();
    HomeCtrl = $controller('HomeCtrl', {
      $scope: scope
    });
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should get http success-:', inject(function ($http) {
    var test = 0;

    var res = $http.post('/api/things');
    //console.log(res);
    res.success(function () {
      console.log("success");
      test = "1";
    }).error(function () {
      console.log("fail");
      test = "2";
    });
    $httpBackend.when('POST', '/api/things').respond(200, { foo: 'bar' });

    expect($httpBackend.flush).not.toThrow();
    expect(test).toBe('1');
  }));
});