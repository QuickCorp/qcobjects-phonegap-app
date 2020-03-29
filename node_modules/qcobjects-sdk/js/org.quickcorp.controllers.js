'use strict';
Package('org.quickcorp.controllers',[
  Class('GridController',Controller,{
    dependencies:[],
    component:null,
    _new_:function (o){
      this.__new__(o);
    },
    done: function (){
      var controller=this;
      var s = document.createElement('style');
      var templateRows = 'auto '.repeat(this.rows);
      var templateCols = 'auto '.repeat(this.cols);
      var className = 'grid'+this.__instanceID.toString();
      s.innerHTML = '.'+className+' { \
                        display: grid; \
                        grid-template-rows: '+templateRows+'; \
                        grid-template-columns: '+templateCols+'; \
                        margin:0 auto; \
                    }';
      this.component.body.append(s);
      var d = document.createElement('div');
      d.className=className;
      this.component.body.append(d);
      logger.debug('GridComponent built');

    }
  }),
  Class('DataGridController',Controller,{
    dependencies:[],
    component:null,
    _new_:function (o){
      var controller=this;
      //TODO: Implement
      logger.debug('DataGridController INIT');
    },
    addSubcomponents:function (){
      var controller = this;
      controller.component.subcomponents = [];
      controller.component.body.innerHTML = '';
      console.log(controller.component.data);
      try {
        var subcomponentClass = controller.component.body.getAttribute('subcomponentClass');
        if (subcomponentClass != null){
          controller.component.data.map(
            function (record,dataIndex){
                try {
                  var subcomponent = New(ClassFactory(subcomponentClass),{
                    data:record,
                    templateURI:ComponentURI({
                      'COMPONENTS_BASE_PATH':CONFIG.get('componentsBasePath'),
                      'COMPONENT_NAME':ClassFactory(subcomponentClass).name,
                      'TPLEXTENSION':CONFIG.get('tplextension'),
                      'TPL_SOURCE':'default' //here is always default in order to get the right uri
                    }),
                    body:document.createElement('component'),
                    done: function (){
                      this.runComponentHelpers();
                    }
                  });
                  try {
                    if (subcomponent){
                      subcomponent.data.__dataIndex = dataIndex;
                      if (controller.component.data.hasOwnProperty('length')){
                        subcomponent.data.__dataLength = controller.component.data.length;
                      }
                      logger.debug('adding subcomponent to body');
                      controller.component.body.append(subcomponent.body);
                      try {
                        controller.component.subcomponents.push(subcomponent);
                      }catch (e){
                        logger.debug('ERROR LOADING SUBCOMPONENT IN DATAGRID');
                      }
                    } else {
                      logger.debug('ERROR LOADING SUBCOMPONENT IN DATAGRID');
                    }
                  }catch (e){
                    logger.debug('ERROR LOADING SUBCOMPONENT IN DATAGRID');
                  }

                } catch (e) {
                  logger.debug('ERROR LOADING SUBCOMPONENT IN DATAGRID');
                }
            }
          );
        } else {
          logger.debug('NO SUBCOMPONENT CLASS IN COMPONENT');
        }

      } catch (e){
        logger.debug('No data for component');
      }
    },
    done:function (){
      var controller = this;
      var componentInstance = controller.component;
      logger.debug('DataGridController DONE');
      var serviceClass = controller.component.body.getAttribute('serviceClass');
      if (serviceClass != null){
        var service = serviceLoader(New(ClassFactory(serviceClass),{
            data:componentInstance.serviceData
        })).then(
          (successfulResponse)=>{
            // This will show the service response as a plain text
            console.log('DONE SERVICE COMPONENT');
            successfulResponse.service.JSONresponse = JSON.parse(successfulResponse.service.template);
            console.log(successfulResponse.service.JSONresponse.result);
            componentInstance.data = successfulResponse.service.JSONresponse.result;
            controller.addSubcomponents();

          },
          (failedResponse)=>{

          }).catch ((e)=>{
            logger.debug('Something went wrong when calling the service from: '+serviceClass);
          });

      }

    }

  }),
  Class('ModalController',Controller,{
    dependencies:[],
    component:null,
    _new_:function (o){
      this.__new__(o);
      var controller=this;
      //TODO: Implement
    },
    done: function (){
      var component = this.component;
      component.body.innerHTML = component.body.innerHTML.replace('/{{content}}/g',component.submodal.template);

    }
  }),
  Class('FormController',Controller,{
    dependencies:[],
    component:null,
    serviceClass:'',
    formSettings:{
      backRouting:'#',
      loadingRouting:'#loading',
      nextRouting:'#signupsuccessful'
    },
    hasValidation(element){
      var fieldName = element.getAttribute('data-field');
      var _hasValidation = false;
      if (typeof this.validations !== 'undefined'
        && this.validations.hasOwnProperty(fieldName)){
        _hasValidation = true;
      }
      return _hasValidation;
    },
    isInvalid (element){
      var _isInvalid = false;
      var fieldName = element.getAttribute('data-field');
      if (typeof this.validations !== 'undefined' && (
        !this.validations[fieldName].call(this,fieldName,this.component.data[fieldName],element)
      )){
        _isInvalid = true;
      }
      return _isInvalid;
    },
    isValid (element){
      return this.isInvalid(element);
    },
    save: function (){
      var controller = this;
      if (controller.serviceClass !== ''){
        location.href=controller.formSettings.loadingRouting;
        var service = serviceLoader(New(ClassFactory(controller.serviceClass),{
            data:controller.component.data
        })).then(
          (successfulResponse)=>{
            // This will show the service response as a plain text
            console.log('DONE SERVICE COMPONENT');
            try{
              console.log(successfulResponse.service.JSONresponse);
            }catch (e){
                // no json
            }
            location.href=controller.formSettings.nextRouting;

          },
          (failedResponse)=>{
            location.href=controller.formSettings.backRouting;
          });
      } else {
        logger.debug('No service name declared on serviceClass property')
      }

    },
    formSaveTouchHandler: function (){
      logger.debug('Saving data...');
      var controller = this;
      controller.component.executeBindings();
      if (controller.formValidatorModal!=null){
        var componentElementFields = controller.component.body.subelements('*[data-field]');
        var fieldsToValidate = componentElementFields.filter(
          f=>controller.hasValidation.bind(controller)
        );
        var invalidFields = componentElementFields.filter(f=>controller.isInvalid(f)).pop();
        if (invalidFields){
          var validationMessage = `
<details>
    <summary>Please verify the following incorrect fields:</summary>
    <ul>
      ${invalidFields.map(f=> '<li>'+f.getAttribute('data-field')+'</li>')}
    </ul>
</details>
`;
          controller.formValidatorModal.body.subelements('.validationMessage')[0].innerHTML=validationMessage;
          controller.formValidatorModal.modal();
        } else {
          controller.save();
        }
      } else {
        logger.debug('Unable to find the modal validator...');
        logger.debug('Saving data...');
        controller.save();
      }
    },
    _new_:function (o){
      var controller = this;
      this.__new__(o);
      var controller=this;
      controller.component = o.component;
      controller.component = controller.component.Cast(FormField);
    },
    done: function (){
      logger.debugEnabled=true;
      var controller=this;
      try {
        controller.component.createBindingEvents();
        var modalBody = document.createElement('div');
        modalBody.className='modal_body';
        controller.formValidatorModal = New(ModalComponent,{
          body:modalBody,
          subcomponents:[],
          data:{
            content:'<div class="validationMessage"></div>'
          }
        });

        Tag('.modal_body').map(e=>document.body.removeChild(e));
        document.body.append(controller.formValidatorModal);

      } catch (e){
        logger.debug('Unable to create the modal');
      }
      controller.onpress('.submit',function (e){
        e.preventDefault();
        controller.formSaveTouchHandler();
      });

    }
  }),
  Class('SwaggerUIController',Controller,{
	  dependencies:[],
	  component:null,
		startSwaggerUI: function (){
			// Begin Swagger UI call region
			const ui = SwaggerUIBundle({
				url: CONFIG.get('swagger-ui-url','https://petstore.swagger.io/v2/swagger.json'),
				dom_id: '#'+CONFIG.get('swagger-ui-dom_id','swagger-ui'),
				deepLinking: true,
				presets: [
					SwaggerUIBundle.presets.apis,
					SwaggerUIStandalonePreset
				],
				plugins: [
					SwaggerUIBundle.plugins.DownloadUrl
				],
				layout: "StandaloneLayout"
			})
			// End Swagger UI call region

			window.ui = ui

		},
		done: function (){
			var controller = this;
      controller.component.body.innerHTML = '<div id="'+CONFIG.get('swagger-ui-dom_id','swagger-ui')+'"></div>';
			var swaggerUIPackagePath = CONFIG.get('swagger-ui-package-path',"node_modules/swagger-ui-dist/");

			this.dependencies.push(New(SourceJS,{
				url:swaggerUIPackagePath+'swagger-ui-standalone-preset.js',
				external:CONFIG.get('swagger-ui-external',false)
			}));
			this.dependencies.push(New(SourceCSS,{
				url:swaggerUIPackagePath+'swagger-ui.css',
				external:CONFIG.get('swagger-ui-external',false)
			}));
			this.dependencies.push(New(SourceJS,{
				url:swaggerUIPackagePath+'swagger-ui-bundle.js',
				external:CONFIG.get('swagger-ui-external',false),
				done:function (){
					controller.startSwaggerUI();
				}
			}));
		}
	})
]);
