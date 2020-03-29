/**
 * QCObjects CLI 0.1.x
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

const path = require('path');
const absolutePath = path.resolve( __dirname, "./" );
const Handlebars = require('handlebars');

const http2 = require('http2');
const fs = require('fs');
const mime = require("mime");
require(absolutePath+'/org.quickcorp.qcobjects.main.file.js');

let ImportMicroservice = function (microservicePackage){
  var standardPath = findPackageNodePath(microservicePackage) || findPackageNodePath(microservicePackage+'.js');
  if (standardPath !== null){
    Import (microservicePackage);
  } else {
    Import (absolutePath+'/backend/'+microservicePackage);
  }
}

Package('org.quickcorp.qcobjects.main.http.gae.server',[
  Class('BackendMicroservice',Object,{
    domain:CONFIG.get('domain'),
    basePath:CONFIG.get('basePath'),
    body:null,
    stream:null,
    server:null,
    request:null,
    cors: function (){
      if (this.route.cors){
        let {allow_origins,allow_credentials,allow_methods,allow_headers} = this.route.cors;
        var microservice = this;
        if (typeof microservice.headers !== 'object'){
          microservice.headers = {};
        }
        if (typeof allow_origins !== 'undefined'){
          // an example of allow_origins is ['https://example.com','http://www.example.com']
          if (allow_origins =='*' || (typeof microservice.request.headers.origin == 'undefined') || [...allow_origins].indexOf(microservice.request.headers.origin)!== -1){
            // for compatibility with all browsers allways return a wildcard when the origin is allowed
            microservice.headers['Access-Control-Allow-Origin'] = '*';
          } else {
            logger.debug('Origin is not allowed: ' + microservice.request.headers.origin);
            logger.debug('Forcing to finish the response...');
            this.body = {};
            try {
              this.done();
            } catch (e){}
          }
        } else {
          microservice.headers['Access-Control-Allow-Origin'] = '*';
        }
        if (typeof allow_credentials !== 'undefined'){
          microservice.headers['Access-Control-Allow-Credentials'] = allow_credentials.toString();
        } else {
          microservice.headers['Access-Control-Allow-Credentials'] = 'true';
        }
        if (typeof allow_methods !== 'undefined'){
          microservice.headers['Access-Control-Allow-Methods'] = [...allow_methods].join(',');
        } else {
          microservice.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS, POST';
        }
        if (typeof allow_headers !== 'undefined'){
          microservice.headers['Access-Control-Allow-Headers'] = [...allow_headers].join(',');
        } else {
          microservice.headers['Access-Control-Allow-Headers'] = '*';
        }
      }
    },
    _new_:function (o){
      logger.debug('Executing GAE HTTP BackendMicroservice ');
      let microservice = this;
      let server = microservice.server;
      let request = microservice.request;
      this.cors();
      server.on('data', (data) => {
        // data from POST, GET
        var requestMethod = request.method.toLowerCase();
        var supportedMethods = {'post':microservice.post,
                              };
        if (supportedMethods.hasOwnProperty(requestMethod)) {
          supportedMethods[requestMethod].call(microservice,data);
        }
      });

      // data from POST, GET
      var requestMethod = request.method.toLowerCase();
      var supportedMethods = {'get':microservice.get,
                              'head':microservice.head,
                              'put':microservice.put,
                              'delete':microservice.delete,
                              'connect':microservice.connect,
                              'options':microservice.options,
                              'trace':microservice.trace,
                              'patch':microservice.patch
                            };
      if (supportedMethods.hasOwnProperty(requestMethod)) {
        supportedMethods[requestMethod].call(microservice);
      }

    },
    head:function (formData){this.done()},
    post:function (formData){this.done()},
    put:function (formData){this.done()},
    delete:function (formData){this.done()},
    connect:function (formData){this.done()},
    options:function (formData){this.done()},
    trace:function (formData){this.done()},
    patch:function (formData){this.done()},
    finishWithBody:function (stream){
      try {
        stream.write(JSON.stringify(this.body));
        stream.end();
      } catch (e){
        logger.debug('Something wrong writing the response for microservice'+e.toString());
      }
    },
    done: function(){
      var microservice = this;
      var stream = microservice.stream;
//      stream.respond(microservice.headers);
      stream.writeHead(200, {'Content-Type': 'text/plain'});
      if (microservice.body != null){
        microservice.finishWithBody.call(microservice,stream);
      }
    }
  }),
  Class('PipeLog',{
    pipe:(o)=>{
      var _o = [];
      for (var k in o){
        if (typeof o[k] !== 'undefined'
            && o[k] !== null
            && typeof o[k] !== 'function'){
          try {
            _o.push(''+k+'='+o[k].toString());
          } catch (e){
            // error logging, do nothing
          }
        }
      }
      return _o.join(' ');
    }
  }),
  Class('HTTPServerResponse',{
    headers:{
      ':status': 200,
      'content-type': 'text/html'
    },
    body:'',
    request:null,
    fileDispatcher:null,
    sendFile: function (stream, fileName) {
      // read and send file content in the stream

      try {
        console.log('trying to read '+ fileName);
        const fd = fs.openSync(fileName, "r");
        const stat = fs.fstatSync(fd);
        const headers = {
          "content-length": stat.size,
          "last-modified": stat.mtime.toUTCString(),
          "content-type": mime.getType(fileName)
        };
        console.log("closing file", fileName);
        fs.closeSync(fd);
        stream.setHeader("content-length", headers['content-length']);
        stream.setHeader("last-modified", headers['last-modified']);
        stream.setHeader("content-type", headers['content-type']);

        // This line opens the file as a readable stream
        var readStream = fs.createReadStream(fileName);

        // This will wait until we know the readable stream is actually valid before piping
        readStream.on('open', function () {
          // This just pipes the read stream to the response object (which goes to the client)
          readStream.pipe(stream);
        });

        readStream.on('end',function (){
          stream.end();
        });

        // This catches any errors that happen while creating the readable stream (usually invalid names)
        readStream.on('error', function(err) {
          stream.end(err);
        });

      } catch (e){
        if (e.errno==-2){
          const headers = {
            ':status': 404,
            'content-type': 'text/html'
          };
          stream.write('<h1>404 - FILE NOT FOUND</h1>');
          stream.on("close", () => {
            console.log("closing file", fileName);
          });
          stream.end();
        }
      }
    },
    _generateResponse:function (){
      var response = this;
      response.fileDispatcher = New(FileDispatcher,{
        scriptname:response.request.scriptname,
        pathname:response.request.pathname,
        done:function (headers,body,templateURI,isTemplate){
          response.headers = headers;
          var stream = response.stream;
          if (isTemplate){
            logger.debug('TEMPLATE')
            response.body = body;
//            stream.respond(response.headers);
            stream.write(response.body);
            stream.end();
          } else if (headers[':status']==200){
            response.sendFile(stream,templateURI);
          } else {
            logger.debug('NONE ')
//          stream.respond(response.headers);
            stream.end();
          }
        }
      });

    },
    _new_:function (o){
      var self = this;
      self.body = '';
      self.stream = o.stream;
      self._generateResponse();

    }
  }),
  Class('HTTPServerRequest',{
    scriptname:'',
    path:'',
    method:'',
    url:'',
    headers:null,
    flags:null,
    protocol: null,
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: '',
    query: '',
    pathname: '',
    path: '',
    href: ''
  }),
  Class('HTTPServer',{
    request:null,
    response:'',
    server:null,
    scriptname:'',
    showIPAddress:function (){
      var _ret_ = '';
      var os = require('os');
      var ifaces = os.networkInterfaces();
      Object.keys(ifaces).forEach(function (iface){
        ifaces[iface].map(function (ipGroup){
          _ret_ += iface +': ' + PipeLog.pipe(ipGroup)+'\n';
        });
      });
      return _ret_;
    },
    showPossibleURL: function (){
      var _ret_ = '';
      var os = require('os');
      var ifaces = os.networkInterfaces();
      Object.keys(ifaces).forEach(function (iface){
        ifaces[iface].map(function (ipGroup){
          if (ipGroup['family'].toLowerCase()=='ipv4'){
            _ret_ += 'http://'+ipGroup['address']+':'+CONFIG.get('serverPortHTTP').toString()+'/\n';
          }
        });
      });
      return _ret_;
    },
    start:function (){
      var server = this.server;
      server.listen(process.env.PORT || CONFIG.get('serverPortHTTP'));
    },
    _new_:function (){
      let oHTTPServer = this;
      const welcometo = 'Welcome to \n';
      const instructions = 'QCObjects GAE HTTPServer \n';
      const logo = ' .d88888b.  .d8888b.  .d88888b. 888       d8b                888            \r\nd88P\" \"Y88bd88P  Y88bd88P\" \"Y88b888       Y8P                888            \r\n888     888888    888888     888888                          888            \r\n888     888888       888     88888888b.  8888 .d88b.  .d8888b888888.d8888b  \r\n888     888888       888     888888 \"88b \"888d8P  Y8bd88P\"   888   88K      \r\n888 Y8b 888888    888888     888888  888  88888888888888     888   \"Y8888b. \r\nY88b.Y8b88PY88b  d88PY88b. .d88P888 d88P  888Y8b.    Y88b.   Y88b.      X88 \r\n \"Y888888\"  \"Y8888P\"  \"Y88888P\" 88888P\"   888 \"Y8888  \"Y8888P \"Y888 88888P\' \r\n       Y8b                                888                               \r\n                                         d88P                               \r\n                                       888P\"   ';
      console.log(welcometo);
      console.log(logo);
      console.log(instructions);
      logger.debug(this.showIPAddress());
      logger.info('Listening on HTTP PORT: '+CONFIG.get('serverPortHTTP').toString());
      logger.info('Go to: \n'+this.showPossibleURL());

      const http = require('http');

      this.server = http.createServer((req, res) => {});

      var server = this.server;

      server.on('error', (err) => console.error(err));

      server.on('request', (req, res) => {

        let request = Object.assign(New(HTTPServerRequest),require('url').parse(req.url));
        request.headers = req.headers;
        this.request = request;
        this.request.method = req.method;
        this.request.path = req.url;
        server.setMaxListeners(9999999999);
        CONFIG.set('backendTimeout',CONFIG.get('backendTimeout') || 20000);
        var timeoutHandler = ()=>{
          // end the stream on timeout
          try {
            if (!res.destroyed){
              logger.info('A timeout occurred...' + CONFIG.get('backendTimeout').toString());
              logger.info('Killing session...');

              res.writeHeader( 500, {
                'content-type': 'text/html'
              });
              res.on('error',()=>{});
              res.write('<h1>500 - INTERNAL SERVER ERROR (TIMEOUT)</h1>');
              res.end();
            } else {
              logger.debug('Session was normally finishing...');
            }
          }catch (e){
            logger.debug('An unhandled error occurred during timeout catching...');
            logger.debug(e.message);
          }
          server.removeListener('timeout',timeoutHandler);

        };
        if (!res.destroyed){
          server.setTimeout(CONFIG.get('backendTimeout'), timeoutHandler);
        }

        if (this.request.pathname.indexOf('.')<0){
            this.request.scriptname = CONFIG.get('documentRootFileIndex');
        } else {
          this.request.scriptname = this.request.pathname.split('/').reverse()[0];
        }
        this.request.pathname = this.request.pathname.substr(0,this.request.pathname.lastIndexOf('/'));

        logger.debug(PipeLog.pipe(this.request));

        if (global.get('backendAvailable')){
          logger.info('Backend GAE Microservices Available');
          let routes = CONFIG.get('backend').routes;
          let selectedRoute = routes.filter(route=>{let standardRoutePath = route.path.replace(/{(.*?)}/g,'\(\?\<$1\>\.\*\)');return (new RegExp(standardRoutePath,'g')).test(request.path)});
          if (selectedRoute.length>0){
            selectedRoute.map(route=>{
              let standardRoutePath = route.path.replace(/{(.*?)}/g,'\(\?\<$1\>\.\*\)'); //allowing {param}
              let selectedRouteParams = {...[...request.path.matchAll((new RegExp( standardRoutePath ,'g')))][0]['groups']};
              ImportMicroservice (route.microservice);
              var microServiceClassFactory = ClassFactory(route.microservice+'.Microservice');
              this.response = New(microServiceClassFactory,{
                domain:CONFIG.get('domain'),
                basePath:CONFIG.get('basePath'),
                projectPath:CONFIG.get('projectPath'),
                route:route,
                routeParams:selectedRouteParams,
                server:server,
                stream:res,
                request:request
              });
            });
          } else {
            this.response = New(HTTPServerResponse,{
              server:server,
              stream:res,
              request:this.request
            });
          }

        } else {
          // ...

          this.response = New(HTTPServerResponse,{
            server:server,
            stream:res,
            request:this.request
          });

        }

      });

    }
  })
]);
