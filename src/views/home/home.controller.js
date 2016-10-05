'use strict';

(function() {

  class MainController {

    constructor($http,$timeout,$window) {
      this.$http      = $http;
      this.settings   = {show:false};
      this.loveCount  = 0;
      this.$window    = $window;
      this.$timeout   = $timeout;

      this.instanceId   =  Wix.Utils.getInstanceId();

      this.loveStartId  = 'loveStart_'+this.instanceId;
      this.loveStart    =  0;
      this.clicked      = false;
      this.origLoveCount=0;

    }
    safeApply(fn){
      this.$timeout(fn);
    }

    addCount() {
      if (this.clicked) return;
      this.clicked = true;

      this.$http.post('/api/things'+document.location.search)
        .then(response => {
          this.origLoveCount = response.data.loveCount;
          this.loveCount =  this.origLoveCount + this.loveStart ;
          this.$window.localStorage.setItem(this.loveStartId,'1');

        },response =>{
          this.clicked = false;
        })
      ;


    }

    getNumber (){
      let that = this;
      //console.log('in get number');
      let isClicked = this.$window.localStorage.getItem(this.loveStartId);
      if (isClicked==='1') this.clicked = true;
      Wix.Data.Public.get(that.loveStartId, { scope: 'APP' }, function(result){
        //console.log("success before",result,that.loveStart);
        that.safeApply(function() {
          that.loveStart = result[that.loveStartId]*1;
          that.loveCount += that.loveStart;
          // console.log("success after", result, that.loveStart);
        });
      },((result)=>{console.log("fail",result)}));
    }

    $onInit() {
      let that = this;
      this.$http.get('/api/things/read'+document.location.search)
        .then(response => {
          this.settings = response.data.settings;
          this.loveCount = this.origLoveCount = response.data.loveCount;
          this.getNumber();
        });

      Wix.addEventListener(Wix.Events.SETTINGS_UPDATED,function(data){
        that.safeApply(function(){
          //console.log('Wix.Events.SETTINGS_UPDATED',data,that.loveStart,data.loveStart,that.loveCount);
          that.settings = data.settings;
          that.loveStart = data.loveStart*1;
          that.loveCount = that.origLoveCount + that.loveStart;

        });
      });
    }
  }

  angular.module('myApp')
    .component('main', {
      templateUrl: 'views/home/home.html',
      controller: MainController
    })
  ;
})();
