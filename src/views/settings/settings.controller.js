

'use strict';

(function() {

  class SettingsController {

    constructor($http,$scope,$window,$interval,$timeout,$q) {

      this.$http = $http;
      this.$q = $q;
      this.$interval = $interval;

      this.$scope = $scope;
      this.$window = $window;
      this.$timeout = $timeout;
      this.loveStart = 0;

      this.instanceId =  Wix.Utils.getInstanceId();

      this.loveStartId = 'loveStart_'+this.instanceId;
      this.settings     = {show: false};
      this.UIFuncs = null;

      this.tabIndex = 0;

    }

    safeApply(fn){
      this.$timeout(fn);
    }

    getNumber (){
      let defer = this.$q.defer();
      let promise = defer.promise;
      let that = this;

      Wix.Data.Public.get(this.loveStartId, { scope: 'APP' }, function(result){

        that.safeApply(function() {
          that.loveStart = result[that.loveStartId];
          that.$scope.refs.loveStart.setValue(that.loveStart);
          console.log("success after getNumber", result, that.loveStart);
          defer.resolve(true);

        });
      },((result)=>{console.log("fail",result); defer.resolve(false);}));

      return promise;
    }

    getSettings(){
      let defer = this.$q.defer();
      let promise = defer.promise;

      this.$http.get('/api/things/settings'+document.location.search)
        .then(response => {
          this.settings = response.data.settings;
          console.log('refs',this.$scope.refs);
          this.$scope.refs.showLove.state.checked = this.settings.show;
          console.log('success get settings',this.settings);
          defer.resolve(true);

        },response =>{
          console.log('fail get',response);
          defer.resolve(false);
        });

      return promise;
    }

    setNumber(num){
      let that = this;
      that.loveStart = num;

      Wix.Data.Public.set(this.loveStartId, num, { scope: 'APP' },function(result){


        that.updateComponent();

      },function(result){
        console.log("fail",result);
      });
    }

    updateComponent(){

      let that = this;
      console.log('in updateComponent',Wix.Utils.getOrigCompId());
      Wix.Settings.triggerSettingsUpdatedEvent({
        settings: that.settings,
        loveStart: that.loveStart
      },Wix.Utils.getOrigCompId());
    }

    LibMethods() {
      let that = this;

      return {
        allowChange: function (val) {

          that.safeApply(function () {
            that.settings.show = val;
            that.updateComponent();
          });
          that.$http.post('/api/things/settings' + document.location.search, {
            show: val
          })
            .then(response => {
              //console.log('success', response);
            }, response => {
              //console.log('fail', response);
            })
          ;
        },
        getShow: function(){
          var defer= that.$q.defer();
          var promise = defer.promise;
          that.$timeout(function(){
            defer.resolve(false)
          },15000);
          return promise;
        },
        inputChange : ((num)=>{
         // console.log("is %s number? %s",num,parseInt(num,10)==num*1);
          var result = parseInt(num,10)==num*1 && num*1>=0;
          if (result){
            that.setNumber(num);
          }
          return result;
        }),

        btnClick : function(){
          that.$scope.refs.panelTabs.setActiveTab(1);

          //console.log(arguments);
        }


      }
    }
    $onInit() {
      this.UIFuncs = this.LibMethods();
      let that = this;
      this.$window.inputChange = ((num)=>{
        //console.log("is %s number? %s",num,parseInt(num,10)==num*1);
        var result = parseInt(num,10)==num*1 && num*1>=0;
        if (result){
          this.setNumber(num);
        }
        return result;
      });





      that.$q.all([
        that.getNumber(),
        that.getSettings()
      ])
        .then(function(){
          return;
          //console.log('getting script');
          var promise = $.getScript("app/settings/editor-ui-lib-jquery.js");
          that.$q.when(promise).then(
            function(){
              //console.log('script loaded');
            }
          );

        });



    }

  }


  SettingsController.$inject = ['$http','$scope','$window','$interval','$timeout','$q'];

  angular.module('myApp').component('settings', {
    templateUrl: 'views/settings/settings.html',
    controller: SettingsController
  });
})();



