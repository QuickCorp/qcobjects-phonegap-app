'use strict';
Package('org.quickcorp.modal.effects',[
  Class('ModalFade',Effect,{
    duration:500,
    apply: function (){
      _super_('Fade','apply').apply(this,arguments);
    }
  }),
  Class('ModalMoveDown',Effect,{
    duration:300,
    apply: function (){
      _super_('Move','apply').apply(this,arguments);
    }
  }),
  Class('ModalMoveUp',Effect,{
    duration:800,
    apply: function (){
      _super_('Move','apply').apply(this,arguments);
    }
  })
]);
