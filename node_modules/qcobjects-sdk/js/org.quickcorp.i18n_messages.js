'use strict';
Package('org.quickcorp.i18n_messages', [
  Class('i18n_messages',Object,{
    _load_i18n_packages_: function (){
      return CONFIG.get('i18n_languages',[]).map((i18n_packagename)=>{
        Import(`org.quickcorp.i18n_messages.${i18n_packagename}`)
      });
    },
    _new_: function(o) {
      var i18n = this;
      if (CONFIG.get('use_i18n')){
        CONFIG.set('lang', 'en');
        if (!global.get('i18n')){
          global.set('i18n', {
            messages: i18n.messages
          });
        } else {
          global.set('i18n', {
            messages: global.get('i18n').messages.concat(i18n.messages)
          });
        }
      }
    }
  }),
  {
    _i18n_messages:i18n_messages._load_i18n_packages_()
  }
]);
