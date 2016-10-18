'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function () {
    function MainController($http, $timeout, $window) {
      _classCallCheck(this, MainController);

      this.$http = $http;
      this.settings = { show: false };
      this.loveCount = 0;
      this.$window = $window;
      this.$timeout = $timeout;

      this.instanceId = Wix.Utils.getInstanceId();

      this.loveStartId = 'loveStart_' + this.instanceId;
      this.loveStart = 0;
      this.clicked = false;
      this.origLoveCount = 0;
    }

    _createClass(MainController, [{
      key: 'safeApply',
      value: function safeApply(fn) {
        this.$timeout(fn);
      }
    }, {
      key: 'addCount',
      value: function addCount() {
        var _this = this;

        if (this.clicked) return;
        this.clicked = true;

        this.$http.post('/api/things' + document.location.search).then(function (response) {
          _this.origLoveCount = response.data.loveCount;
          _this.loveCount = _this.origLoveCount + _this.loveStart;
          _this.$window.localStorage.setItem(_this.loveStartId, '1');
        }, function (response) {
          _this.clicked = false;
        });
      }
    }, {
      key: 'getNumber',
      value: function getNumber() {
        var _this2 = this;

        var that = this;
        //console.log('in get number');
        var isClicked = this.$window.localStorage.getItem(this.loveStartId);
        if (isClicked === '1') this.clicked = true;
        Wix.Data.Public.get(that.loveStartId, { scope: 'APP' }, function (result) {
          //console.log("success before",result,that.loveStart);
          that.safeApply(function () {
            that.loveStart = result[that.loveStartId] * 1;
            that.loveCount += that.loveStart;
            // console.log("success after", result, that.loveStart);
          });
        }, function (result) {
          console.log("fail", result);
          Wix.Data.Public.set(_this2.loveStartId, 0, { scope: 'APP' });
        });
      }
    }, {
      key: '$onInit',
      value: function $onInit() {
        var _this3 = this;

        var that = this;
        this.$http.get('/api/things/read' + document.location.search).then(function (response) {
          _this3.settings = response.data.settings;
          _this3.loveCount = _this3.origLoveCount = response.data.loveCount;
          _this3.getNumber();
        });

        Wix.addEventListener(Wix.Events.SETTINGS_UPDATED, function (data) {
          that.safeApply(function () {
            console.log('Wix.Events.SETTINGS_UPDATED', data); //,that.loveStart,data.loveStart,that.loveCount);
            that.settings = data.settings;
            that.loveStart = data.loveStart * 1;
            that.loveCount = that.origLoveCount + that.loveStart;
          });
        });
      }
    }]);

    return MainController;
  }();
  /*
    angular.module('myApp')
      .component('main', {
        templateUrl: 'views/home/home.html',
        controller: MainController
      })
    ;
  */


  angular.module('myApp').controller('MainController', MainController);
})();