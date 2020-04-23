/**
 * QCObjects SDK 1.0
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
*/
"use strict";
(function() {
  Package('org.quickcorp.components',[
    Class('ShadowedComponent',Component,{
      container:null,
      body:null,
      shadowed:true,
      cached:false,
      controller:null,
      view:null,
      data:{},
      _new_:function (o){
        o.body = _DOMCreateElement('div');
        _super_('Component','_new_').call(this,o);
      }
    }),
    Class('FormField',Component,{
      cached:false,
      reload:true,
      createBindingEvents:function (){
        var _executeBinding = this.executeBinding;
        var thisobj = this;
        if (typeof this.fieldType =='undefined' || this.fieldType == null ){
          var _objList = this.body.subelements('*[data-field]'); // every child with data-field set
        } else {
          var _objList = this.body.subelements(this.fieldType+'[data-field]'); // every child with data-field set and tagname is equal to fieldType property
        }
        for (var _datak=0;_datak<_objList.length;_datak++){
          var _obj = _objList[_datak];
          _obj.addEventListener('change',function(e){
            logger.debug('Executing change event binding');
            thisobj.executeBindings();
          });
          _obj.addEventListener('blur',function(e){
            logger.debug('Executing change event binding');
            thisobj.executeBindings();
          });
          _obj.addEventListener('focus',function(e){
            logger.debug('Executing change event binding');
            thisobj.executeBindings();
          });
          _obj.addEventListener('keydown',function(e){
            logger.debug('Executing keydown event binding');
              thisobj.executeBindings();
          });
        }
      },
      executeBinding:function (_obj){
        var _datamodel = _obj.getAttribute('data-field');
        logger.debug('Binding '+_datamodel+' for '+this.name);
        this.data[_datamodel]=_obj.value;
      },
      executeBindings:function (){
        if (typeof this.fieldType =='undefined' || this.fieldType == null ){
          var _objList = this.body.subelements('*[data-field]'); // every child with data-field set
        } else {
          var _objList = this.body.subelements(this.fieldType+'[data-field]'); // every child with data-field set and tagname is equal to fieldType property
        }
        for (var _datak=0;_datak<_objList.length;_datak++){
          var _obj = _objList[_datak];
          var _datamodel = _obj.getAttribute('data-field');
          logger.debug('Binding '+_datamodel+' for '+this.name);
          this.data[_datamodel]=_obj.value;
        }
      },
      done:function (){
        var thisobj = this;
        thisobj.executeBindings();
        thisobj.createBindingEvents();
        logger.debug('Field loaded: '+thisobj.fieldType+'[name='+thisobj.name+']');
      }
    }),
    Class('ButtonField',FormField,{
      fieldType:'button'
    }),
    Class('InputField',FormField,{
      fieldType:'input'
    }),
    Class('TextField',FormField,{
      fieldType:'textarea'
    }),
    Class('EmailField',FormField,{
      fieldType:'input'
    }),
    Class('GridComponent',Component,{
      name:'grid',
      cached:false,
      controller:null,
      view:null,
      rows:3,
      cols:3,
      reload:true,
      template:'',
      templateURI:'',
      data:{},
      body:null
    }),
    Class('ModalEnclosureComponent',Component,{
      name:'modal',
      tplsource:'none',
      cached:false,
      basePath:CONFIG.get('modalBasePath',CONFIG.get('remoteSDKPath')),
      data:{},
      body:_DOMCreateElement('div'),
      template:`
<!-- The Modal -->
<style>
  @import url('https://sdk.qcobjects.dev/css/modal.css');
</style>
<div id="modalInstance_{{modalId}}" class="modal">

<!-- Modal content -->
<div class="modal-content">
  <span class="close">&times;</span>
  {{content}}
</div>

</div>
`
    }),
    Class('ModalComponent',Component,{
      name:'modal',
      cached:false,
      modalEnclosureComponentClass:'ModalEnclosureComponent',
      basePath: CONFIG.get('modalBasePath',CONFIG.get('remoteSDKPath')),
      controller:null,
      view:null,
      tplsource:'none',
      closeOnClickOutside:false,
      data:{
        content:'',
        modalId:0
      },
      submodal:null,
      modal: function (){
        var modalId = this.data.modalId;
        var modalComponent = this;

        Tag('#modalInstance_'+parseInt(modalId)+'.modal').map(function (modal){
          modal.style.display='block';
          ModalFade.apply(modal,0,1);
        });
        Tag('#modalInstance_'+parseInt(modalId)+'.modal .modal-content').map(function (modalcontent){
          ModalMoveDown.apply(modalcontent,0,-document.body.clientHeight,0,0);
        });
        Tag('#modalInstance_'+parseInt(modalId)+'.modal .modal-content .close').map(function (closebtn){
          closebtn.addEventListener('click',function (){
            modalComponent.close();
          },false);
        });
        if (modalComponent.closeOnClickOutside){
          window.addEventListener('click',function (){
            modalComponent.close();
          },false);
        }
      },
      close: function (){
        var modalId = this.data.modalId;
        Tag('#modalInstance_'+parseInt(modalId)+'.modal').map(function (modal){
          modal.style.display='block';
          ModalFade.apply(modal,1,0);
        });
        Tag('#modalInstance_'+parseInt(modalId)+'.modal .modal-content').map(function (modalcontent){
          ModalMoveUp.apply(modalcontent,0,0,0,-document.body.clientHeight);
        });
        setTimeout(function (){
          Tag('#modalInstance_'+parseInt(modalId)+'.modal').map(function (modal){
            modal.style.display='none';
          });
        },900);
      },
      _new_:function (o){
        var component = this;
        component.data.modalId = component.__instanceID;
        var submodal = New(ClassFactory(component.modalEnclosureComponentClass),{
          name:component.name,
          basePath:component.basePath,
          data:component.data
        });
        component.subcomponents.push(submodal);
        component.submodal = submodal;
        if (submodal.tplsource == 'none'){
          component.body.innerHTML = submodal.parsedAssignmentText;
        } else {
          component.body.append(submodal.body);
        }
        _super_('Component','_new_').call(this,o); // parent call
      },
      done: function ({request,component}){
        _super_('Component','done').call(this,{request:request,component:component}); // parent call
      },
      rebuild:function (){
        this.templateURI = ComponentURI({
          'COMPONENTS_BASE_PATH':CONFIG.get('componentsBasePath'),
          'COMPONENT_NAME':'modal',
          'TPLEXTENSION':CONFIG.get('tplextension'),
          'TPL_SOURCE':'default' //here is always default in order to get the right uri
        });
        return _super_('Component','rebuild').call(this); // parent call
      }
    }),
    Class('SwaggerUIComponent',Component,{
      name:'swagger-ui',
      cached:false,
      basePath: CONFIG.get('remoteSDKPath'),
      tplextension:'tpl.html'
    })

  ]);

}).call(null);
