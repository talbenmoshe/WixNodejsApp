

'use strict';

(function() {

  class settingsCtrl {

    constructor($http,$scope,$window,$interval,$timeout,$q) {
      this.$http            = $http;
      this.$scope           = $scope;
      this.$window          = $window;
      this.$interval        = $interval;
      this.$timeout         = $timeout;
      this.$q               = $q;

      this.instanceId       = Wix.Utils.getInstanceId();
      this.loveStartId      = 'loveStart_'+this.instanceId;
      this.settings         = {show: false};
      this.loveStart        = 0;
      this.defaultTabIndex  = 4;
      this.counterControl   = null;
      this.checkboxCtrl     = null;
      this.name ='meir..';
    }




    getSettings(){
      let defer = this.$q.defer();
      let promise = defer.promise;
      let that = this;

      this.$http.get('/api/things/settings'+document.location.search)
        .then(response => {
        this.settings = response.data.settings;
      that.updateWixCtrlValue ('tsShowCounter', this.settings.show);
      //console.log('success get settings',this.settings);
      defer.resolve(true);

    },response =>{
        console.log('fail get',response);
        defer.resolve(false);
      });

      return promise;
    }

    setLoveCounter (num) {
      let that = this;
      Wix.Data.Public.set(that.loveStartId, num, {scope: 'APP'},
        function (result) { //onSuccess
          that.updateComponent();
          console.log('Success after setLoveCounter onSuccess:', result);
        },
        function (error) { //onFailure
          console.log('Failure in setLoveCounter:', error);
        }
      );
    }

    updateComponent(){
      let that = this;
      //console.log('in updateComponent',Wix.Utils.getOrigCompId());

      Wix.Settings.triggerSettingsUpdatedEvent({
        settings: that.settings,
        loveStart: that.loveStart
      },Wix.Utils.getOrigCompId());
    }

    btnUpdateSettingsCtrl() {
      let that = this;
      return {
        onClick:  function() {
          that.$scope.refs.panelTabs.setActiveTab(1);
          //console.log('change tab', that.$scope);
          //$('.tabs-menu .label-text:eq(1)').trigger('click');
        }
      };
    }

    startCounterCtrl () {
      let that = this;
      return {
        validate: function (val) {
          return (val > 1 && val < 1000);
        },
        onClick: function (val) {
          that.loveStart = val;
          that.setLoveCounter(val);
          ///console.log("Text input with button pressed startCounter: " + val);
        }
      };
    }

    showCounterCtrl()  {
      let that = this;
      return {
        onChange: function (val) {
          console.log('showCounterCtrl',val);

          that.safeApply(function () {
            that.settings.show = val;
            that.updateComponent();
          });

          that.$http.post('/api/things/settings' + document.location.search, {
            show: val
          })
            .then(response => {
            console.log('success', response);
        }, response => {
            console.log('fail', response);
          });
        }
      };
    }

    handleCheckboxCtrl() {
      let that = this;
      return {
        onChange: function () {
          console.log('onChange called', arguments);
        }
      }
    }

    $onInit() {

      let that = this;
      this.counterControl = this.showCounterCtrl();
        this.checkboxCtrl = this.handleCheckboxCtrl();
      //that.getLoveCounterValue();
      //that.getSettings();
      //console.log('aa');
    }
    //$onInit();
  }


  settingsCtrl.$inject = ['$http','$scope','$window','$interval','$timeout','$q'];

  angular.module('myApp').component('settings', {
    templateUrl: 'views/settings/settings.html',
    controller: settingsCtrl
  });
})();



