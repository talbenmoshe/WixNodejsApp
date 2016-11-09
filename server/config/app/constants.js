const constants = {
  WIX_JS: '//sslstatic.wix.com/services/js-sdk/1.66.0/js/wix.min.js',
  WIX_FONTS: '//static.parastorage.com/services/third-party/fonts/Helvetica/fontFace.css',
  MOBILE: 'mobile',
  DEFAULT_LANGUAGE:'en'
};

const appConstants  = {
  LAYOUT_ROUND:'round',
  LAYOUT_SQUARE:'square'

};


module.exports = {
  asJSON: function (){
    return constants;
  },
  appConstantsAsJSON: function(){
    return appConstants;
  }
};


