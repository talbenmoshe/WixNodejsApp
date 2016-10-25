'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function () {
    function MainController($http, $timeout, $window) {
      _classCallCheck(this, MainController);

      this.$http = $http;
      this.settings = { show: false };
      this.DataCount = 0;
      this.$window = $window;
      this.$timeout = $timeout;

      this.instanceId = Wix.Utils.getInstanceId();

      this.dataStartId = 'dataStart_' + this.instanceId;
      this.dataStart = 0;
      this.clicked = false;
      this.origDataCount = 0;
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

        this.$http.post('/api' + document.location.search).then(function (response) {
          _this.origDataCount = response.data.data.count;
          _this.DataCount = _this.origDataCount + _this.dataStart;
          _this.$window.localStorage.setItem(_this.dataStartId, '1');
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
        var isClicked = this.$window.localStorage.getItem(this.dataStartId);
        if (isClicked === '1') this.clicked = true;
        Wix.Data.Public.get(that.dataStartId, { scope: 'APP' }, function (result) {
          //console.log("success before",result,that.dataStart);
          that.safeApply(function () {
            that.dataStart = result[that.dataStartId] * 1;
            that.DataCount += that.dataStart;
            // console.log("success after", result, that.dataStart);
          });
        }, function (result) {
          console.log("fail", result);
          if (Wix.Utils.getViewMode() === 'editor') {
            Wix.Data.Public.set(_this2.dataStartId, 0, { scope: 'APP' });
          }
        });
      }
    }, {
      key: '$onInit',
      value: function $onInit() {
        var _this3 = this;

        var that = this;
        this.$http.get('/api/read' + document.location.search).then(function (response) {
          _this3.settings = response.data.data.settings;

          _this3.DataCount = _this3.origDataCount = response.data.data.count;
          _this3.getNumber();
        });

        Wix.addEventListener(Wix.Events.SETTINGS_UPDATED, function (data) {
          that.safeApply(function () {
            //console.log('Wix.Events.SETTINGS_UPDATED',data);//,that.dataStart,data.dataStart,that.DataCount);
            that.settings = data.settings;
            that.dataStart = data.dataStart * 1;
            that.DataCount = that.origDataCount + that.dataStart;
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