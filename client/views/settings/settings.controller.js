

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var SettingsController = function () {
    function SettingsController($http, $scope, $window, $interval, $timeout, $q) {
      _classCallCheck(this, SettingsController);

      this.$http = $http;
      this.$q = $q;
      this.$interval = $interval;

      this.$scope = $scope;
      this.$window = $window;
      this.$timeout = $timeout;
      this.loveStart = 0;

      this.instanceId = Wix.Utils.getInstanceId();

      this.loveStartId = 'loveStart_' + this.instanceId;
      this.settings = { show: false };
      this.UIFuncs = null;

      this.tabIndex = 0;
    }

    _createClass(SettingsController, [{
      key: 'safeApply',
      value: function safeApply(fn) {
        this.$timeout(fn);
      }
    }, {
      key: 'getNumber',
      value: function getNumber() {
        var defer = this.$q.defer();
        var promise = defer.promise;
        var that = this;

        Wix.Data.Public.get(this.loveStartId, { scope: 'APP' }, function (result) {

          that.safeApply(function () {
            that.loveStart = result[that.loveStartId];
            that.$scope.refs.loveStart.setValue(that.loveStart);

            defer.resolve(true);
          });
        }, function (result) {
          console.log("fail", result);defer.resolve(false);
        });

        return promise;
      }
    }, {
      key: 'getSettings',
      value: function getSettings() {
        var _this = this;

        var defer = this.$q.defer();
        var promise = defer.promise;

        this.$http.get('/api/data/settings' + document.location.search).then(function (response) {
          _this.settings = response.data.settings;
          _this.$scope.refs.showLove.state.checked = _this.settings.show;
          defer.resolve(true);
        }, function (response) {
          console.log('fail get', response);
          defer.resolve(false);
        });

        return promise;
      }
    }, {
      key: 'setNumber',
      value: function setNumber(num) {
        var that = this;
        if (that.loveStart === num) return;
        that.loveStart = num;

        Wix.Data.Public.set(this.loveStartId, num, { scope: 'APP' }, function (result) {

          that.updateComponent();
        }, function (result) {
          console.log("fail", result);
        });
      }
    }, {
      key: 'updateComponent',
      value: function updateComponent() {

        var that = this;

        Wix.Settings.triggerSettingsUpdatedEvent({
          settings: that.settings,
          loveStart: that.loveStart
        }, Wix.Utils.getOrigCompId());
      }
    }, {
      key: 'LibMethods',
      value: function LibMethods() {
        var that = this;

        return {
          allowChange: function allowChange(val) {

            that.safeApply(function () {
              that.settings.show = val;
              that.updateComponent();
            });
            that.$http.post('/api/data/settings' + document.location.search, {
              show: val
            }).then(function (response) {
              //console.log('success', response);
            }, function (response) {
              //console.log('fail', response);
            });
          },
          getShow: function getShow() {
            var defer = that.$q.defer();
            var promise = defer.promise;
            that.$timeout(function () {
              defer.resolve(false);
            }, 15000);
            return promise;
          },
          inputChange: function inputChange(num) {
            // console.log("is %s number? %s",num,parseInt(num,10)==num*1);
            var result = parseInt(num, 10) == num * 1 && num * 1 >= 0;
            if (result) {
              that.setNumber(num);
            }
            return result;
          },

          btnClick: function btnClick() {
            that.$scope.refs.panelTabs.setActiveTab(1);

            //console.log(arguments);
          }

        };
      }
    }, {
      key: '$onInit',
      value: function $onInit() {
        var _this2 = this;

        this.UIFuncs = this.LibMethods();
        var that = this;
        this.$window.inputChange = function (num) {
          //console.log("is %s number? %s",num,parseInt(num,10)==num*1);
          var result = parseInt(num, 10) == num * 1 && num * 1 >= 0;
          if (result) {
            _this2.setNumber(num);
          }
          return result;
        };

        that.$q.all([that.getNumber(), that.getSettings()]).then(function () {
          return;
          //console.log('getting script');

        });
      }
    }]);

    return SettingsController;
  }();

  SettingsController.$inject = ['$http', '$scope', '$window', '$interval', '$timeout', '$q'];

  angular.module('myApp').component('settings', {
    templateUrl: 'views/settings/settings.html',
    controller: SettingsController
  });
})();