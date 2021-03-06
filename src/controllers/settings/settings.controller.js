

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
      this.dataStart = 0;

      this.instanceId =  Wix.Utils.getInstanceId();

      this.dataStartId = 'dataStart_'+this.instanceId;
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

      Wix.Data.Public.get(this.dataStartId, { scope: 'APP' }, function(result){

        that.safeApply(function() {
          that.dataStart = result[that.dataStartId];
          that.$scope.refs.dataStart.setValue(that.dataStart);

          defer.resolve(true);

        });
      },((result)=>{console.log("fail",result); defer.resolve(false);}));

      return promise;
    }

    getSettings(){
      let defer = this.$q.defer();
      let promise = defer.promise;

      this.$http.get('/api/settings'+document.location.search)
        .then(response => {
          this.settings = response.data.settings;
          this.$scope.refs.showdata.state.checked = this.settings.show;
          defer.resolve(true);
        },response =>{
          console.log('fail get',response);
          defer.resolve(false);
        });

      return promise;
    }


    getDesign(){
      let defer = this.$q.defer();
      let promise = defer.promise;

      this.$http.get('/design'+document.location.search)
        .then(response => {

          this.design = response.data.design;
          console.log('design',this.design);
          defer.resolve(true);
        },response =>{
          console.log('fail get',response);
          defer.resolve(false);
        });

      return promise;
    }

    setNumber(num){
      let that = this;
      if (that.dataStart === num) return;
      that.dataStart = num;

      Wix.Data.Public.set(this.dataStartId, num, { scope: 'APP' },function(result){


        that.updateComponent();

      },function(result){
        console.log("fail",result);
      });
    }

    updateComponent(){

      let that = this;


      Wix.Settings.triggerSettingsUpdatedEvent({
        settings: that.settings,
        dataStart: that.dataStart
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
          that.$http.post('/api/settings' + document.location.search, {
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
        that.getDesign(),
        that.getNumber(),
        that.getSettings()
      ])
        .then(function(){
          return;
          //console.log('getting script');


        });



    }

  }


  SettingsController.$inject = ['$http','$scope','$window','$interval','$timeout','$q'];

  angular.module('myApp').component('settings', {
    templateUrl: 'views/settings/settings.html',
    controller: SettingsController
  });
})();



