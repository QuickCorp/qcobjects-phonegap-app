'use strict';
Import ('installer');

Package('org.quickcorp.custom.controllers',[
	Class('MainController',Controller,{
	  dependencies:[],
	  component:null,
	  _new_:function (o){
	    this.__new__(o);
	    var controller=this;
	    //TODO: Implement
	  },
		done:function(){
			var controller = this;

			/*
			Timer.thread({
		      duration:300,
		      timing(timeFraction,elapsed){
		        return timeFraction;
		      },
		      intervalInterceptor(progress){
								if (progress>=100 && !Component._bindroute.__assigned){
									controller.component.route();
								}
		      }
		  });
			*/


		}
	}),
	Class('PWAController',Object,{
		component:null,
		_new_:function (o){
			logger.debug('PWAController Element Initialized');
			this.component = o.component;
		},
		done: function (){
			document.head.innerHTML+=this.component.body.innerHTML;
			this.component.body.innerHTML="";
		}
	}),
  Class('SideNavController',Object,{
  dependencies:[],
  component:null,
  visibility:false,
  effect:null,
  open:function (){
    if (this.effect != null){
      this.effect.apply(this.component.body, 0,1);
    }
    this.component.body.style.width="100%";
    this.component.body.style.overflowX="visible";
    this.component.body.parentElement.subelements('.navbtn')[0].style.display='none';
		this.component.body.parentElement.subelements('.closebtn')[0].style.display='block';
    this.visibility = true;
    return this.visibility;
  },
  close:function (){
    if (this.effect != null){
      this.effect.apply(this.component.body, 1,0);
    }
    this.component.body.style.width="0px";
    this.component.body.style.overflowX="hidden";
    this.component.body.parentElement.subelements('.navbtn')[0].style.display='block';
		this.component.body.parentElement.subelements('.closebtn')[0].style.display='none';
    this.visibility = false;
    return this.visibility;
  },
  toggle:function (){
    if (this.visibility){
      this.close();
    } else {
      this.open();
    }
  },
  _new_:function (o){
      this.__new__(o);
      var controller = this;
      GLOBAL._sdk_.then(function (){
        controller.effect = New(Fade,{duration:300});
      });
      GLOBAL.sideNavController = this;
      GLOBAL.sideNavController.close();
      //TODO: Implement

    },
    done: function (){
    }
  }),
	Class('HeaderController',Controller,{
	  dependencies:[],
	  component:null,
		installer:null,
		loadInstallerButton:function (){
			this.installer = new Installer(this.component.body.subelements('#installerbutton')[0]);
		},
	  _new_:function (o){
	    this.__new__(o);
	    //TODO: Implement
	  },
		done: function (){
			this.loadInstallerButton();
		}
	}),
  Class('Controller1',Controller,{
    dependencies:[],
    component:null,
    _new_:function (o){
      this.__new__(o);
      var controller=this;
      //TODO: Implement
    }
  }),
  Class('Controller2',Controller,{
    dependencies:[],
    component:null,
    _new_:function (o){
      this.__new__(o);
      var controller=this;
      //TODO: Implement
    }
  }),
]);
