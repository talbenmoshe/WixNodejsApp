'use strict';

(function() {

   class MainController {

    constructor($http,$timeout,$window) {
      this.$http      = $http;
      this.settings   = {show:false};
      this.DataCount  = 0;
      this.$window    = $window;
      this.$timeout   = $timeout;

      this.instanceId   =  Wix.Utils.getInstanceId();

      this.dataStartId  = 'dataStart_'+this.instanceId;
      this.dataStart    =  0;
      this.clicked      = false;
      this.origDataCount=0;

    }
    safeApply(fn){
      this.$timeout(fn);
    }

    addCount() {
      if (this.clicked) return;
      this.clicked = true;

      this.$http.post('/api'+document.location.search)
        .then(response => {
          this.origDataCount = response.data.data.count;
          this.DataCount =  this.origDataCount + this.dataStart ;
          this.$window.localStorage.setItem(this.dataStartId,'1');

        },response =>{
          this.clicked = false;
        })
      ;


    }

    getNumber (){
      let that = this;
      //console.log('in get number');
      let isClicked = this.$window.localStorage.getItem(this.dataStartId);
      if (isClicked==='1') this.clicked = true;
      Wix.Data.Public.get(that.dataStartId, { scope: 'APP' }, function(result){
        //console.log("success before",result,that.dataStart);
        that.safeApply(function() {
          that.dataStart = result[that.dataStartId]*1;
          that.DataCount += that.dataStart;
          // console.log("success after", result, that.dataStart);
        });
      },((result)=>{
        console.log("fail",result);
        if (Wix.Utils.getViewMode() === 'editor') {
          Wix.Data.Public.set(this.dataStartId, 0, {scope: 'APP'});
        }

      }));
    }

    $onInit() {
      let that = this;
      this.$http.get('/api/read'+document.location.search)
        .then(response => {
          this.settings = response.data.data.settings;

          this.DataCount = this.origDataCount = response.data.data.count;
          this.getNumber();
        });

      Wix.addEventListener(Wix.Events.SETTINGS_UPDATED,function(data){
        that.safeApply(function(){
          //console.log('Wix.Events.SETTINGS_UPDATED',data);//,that.dataStart,data.dataStart,that.DataCount);
          that.settings = data.settings;
          that.dataStart = data.dataStart*1;
          that.DataCount = that.origDataCount + that.dataStart;

        });
      });
    }
  }
/*
  angular.module('myApp')
    .component('main', {
      templateUrl: 'views/home/home.html',
      controller: MainController
    })
  ;
*/
  angular.module('myApp').controller('MainController',MainController);
})();
