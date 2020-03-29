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
const fs = require('fs');
const os = require('os');
const { exec,execSync } = require('child_process');
// MY_ENV_VAR="HELLO WORLD" php -f index.php

let fixWinCmd = function (commandline){
  if (!process.platform.toLowerCase().startsWith('win')){
    commandline = commandline.replace(/(")/g, String.fromCharCode(92)+`\"`);
  }
  return commandline;
}

Package('org.quickcorp.backend.php',[
  Class('PHPMicroservice',BackendMicroservice,{
    body:null,
    tempFileName: '',
    get_php_headers_list:function (){
      var phpheaders = {
        "QUERY_STRING":`${this.request.query}`,
        "REDIRECT_STATUS":`200`,
        "REQUEST_METHOD":`${this.request.method}`,
        "SCRIPT_FILENAME":`${this.scriptFilePath}`,
        "SCRIPT_NAME":`${this.scriptFilePath.toString()}`,
        "PATH_INFO":`${this.request.path}`,
        "SERVER_NAME":`${this.domain}`,
        "SERVER_PROTOCOL":`HTTP/2`,
        "REQUEST_URI":`${this.request.href}`,
        "HTTP_HOST":`${this.domain}`
      };
      function fixedEncodeURIComponent (str) {
        return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
      }
      for (var headername in this.request.headers){
        if (!headername.startsWith(':')){
          var phpheadername = headername.toUpperCase().replace(new RegExp('-','g'),'_');
          var headervalue = this.request.headers[headername];
          if (typeof headervalue != 'string'){
            headervalue = JSON.stringify(headervalue);
          }
          phpheaders['HTTP_'+phpheadername] = fixedEncodeURIComponent(headervalue);
        }
      }

      return PipeLog.pipe(phpheaders);
    },
    saveTempData: function (data,done){
      var filename = os.tmpdir() + this.tempFileName;
      fs.writeFile(filename, data, (err) => {
        if (err) throw err;
        logger.debug('A temp data file has been saved!');
        done.call(this);
      });
    },
    generateTempFileName: function (){
      this.tempFileName = 'temp' + Date.now().toString();
      return this.tempFileName;
    },
    trimSlash:function (pathname){
      if (pathname.startsWith('/')){
        pathname = pathname.slice(1);
      }
      if (pathname.endsWith('/')){
        pathname = pathname.slice(0,-1);
      }
      return pathname.replace('//','/');
    },
    get:function (){
      var microservice = this;
      microservice.generateTempFileName();

      microservice.saveTempData(this.request.query,function (){
        try {
          process.chdir(CONFIG.get('documentRoot')+microservice.request.pathname.slice(1));
        } catch (e){}

        var scriptFileName = (microservice.route.hasOwnProperty('redirect_to')
          && microservice.route.redirect_to !== '')?(microservice.route.redirect_to):(microservice.request.scriptname);
        var pathname = this.trimSlash(microservice.request.pathname);
        var documentRoot = CONFIG.get('documentRoot','');
        if (documentRoot == './'){
          documentRoot = '';
        }

        var scriptFilePath;
        if (documentRoot !== ''){
          scriptFilePath = `${documentRoot}/${pathname}/${scriptFileName}`;
        } else {
          scriptFilePath = `${pathname}/${scriptFileName}`;
        }

        scriptFilePath = scriptFilePath.replace('//','/');
        if (scriptFilePath.startsWith('/') && !documentRoot.startsWith('/')){
          scriptFilePath = scriptFilePath.slice(1);
        }

        logger.debug(`Loading PHP file: ${scriptFilePath}`);
        var PHPIncludePath = `.:${CONFIG.get('documentRoot')}:${CONFIG.get('projectPath')}`;

        microservice.scriptFilePath = scriptFilePath;

        var commandline = `echo $(cat ${os.tmpdir()}${microservice.tempFileName}) |` + microservice.get_php_headers_list()+` php -d include_path="${PHPIncludePath}" -q <<- 'EOF'
<?php
$_payload = file_get_contents(sys_get_temp_dir().'${microservice.tempFileName}');
foreach ($_SERVER as $_k => $_v) {
  if (array_key_exists($_k,$_ENV)){
    $_SERVER[$_k] = $_ENV[$_k];
  }
  if ( substr($_k, 0, strlen('HTTP_')) == 'HTTP_' ){
    $_SERVER[$_k]=urldecode($_v);
  }
}
@parse_str(parse_url('?'.$_payload, PHP_URL_QUERY), $_REQUEST);
@parse_str(parse_url('?'.$_payload, PHP_URL_QUERY), $_GET);
unlink(sys_get_temp_dir().'${microservice.tempFileName}');
include('${scriptFilePath}');
?>
EOF`
        commandline = fixWinCmd(commandline);
        logger.debug(commandline);
        try {
          let php = exec(commandline,(err,stdout,stderr)=>{
            microservice.body = stdout;
            console.log(stderr);
            microservice.done();
          });
        } catch (ex){
          microservice.body = '500 - INTERNAL ERROR';
          logger.debug(ex.toString());
          console.log(ex);
          microservice.done();
        }

      });

    },
    head:function (formData){this.done()},
    post:function (formData){
      logger.debug('POST DATA');
      var microservice = this;
      microservice.generateTempFileName();

      microservice.saveTempData(formData,function (){
        try {
          process.chdir(CONFIG.get('documentRoot')+microservice.request.pathname.slice(1));
        } catch (e){}

        var scriptFileName = (microservice.route.hasOwnProperty('redirect_to')
          && microservice.route.redirect_to !== '')?(microservice.route.redirect_to):(microservice.request.scriptname);
        var pathname = this.trimSlash(microservice.request.pathname);
        var documentRoot = CONFIG.get('documentRoot','');
        if (documentRoot == './'){
          documentRoot = '';
        }

        var scriptFilePath;
        if (documentRoot !== ''){
          scriptFilePath = `${documentRoot}/${pathname}/${scriptFileName}`;
        } else {
          scriptFilePath = `${pathname}/${scriptFileName}`;
        }

        scriptFilePath = scriptFilePath.replace('//','/');
        if (scriptFilePath.startsWith('/') && !documentRoot.startsWith('/')){
          scriptFilePath = scriptFilePath.slice(1);
        }

        logger.debug(`Loading PHP file: ${scriptFilePath}`);
        var PHPIncludePath = `.:${CONFIG.get('documentRoot')}:${CONFIG.get('projectPath')}`;

        microservice.scriptFilePath = scriptFilePath;

        var commandline = `echo $(cat ${os.tmpdir()}${microservice.tempFileName}) |` + microservice.get_php_headers_list()+` php -d include_path="${PHPIncludePath}" -q <<- 'EOF'
<?php
$_payload = file_get_contents(sys_get_temp_dir().'${microservice.tempFileName}');
foreach ($_SERVER as $_k => $_v) {
  if (array_key_exists($_k,$_ENV)){
    $_SERVER[$_k] = $_ENV[$_k];
  }
  if ( substr($_k, 0, strlen('HTTP_')) == 'HTTP_' ){
    $_SERVER[$_k]=urldecode($_v);
  }
}
@parse_str(parse_url('?'.$_payload, PHP_URL_QUERY), $_REQUEST);
@parse_str(parse_url('?'.$_payload, PHP_URL_QUERY), $_POST);
unlink(sys_get_temp_dir().'${microservice.tempFileName}');
@include('${scriptFilePath}');
?>
EOF`
        commandline = fixWinCmd(commandline);
//        logger.debug(commandline);

        try {
          microservice.body = execSync(commandline).toString();
        } catch (ex){
          microservice.body = '500 - INTERNAL ERROR';
          logger.debug(ex.toString());
        }
        microservice.done();

      });

    },
    put:function (formData){this.done()},
    delete:function (formData){this.done()},
    connect:function (formData){this.done()},
    options:function (formData){this.done()},
    trace:function (formData){this.done()},
    patch:function (formData){this.done()},
    done: function(){
      var microservice = this;
      var stream = microservice.stream;
      try {
        stream.respond(microservice.headers);
      } catch (e){
        //
      }
      if (microservice.body != null){
        microservice.finishWithBody.call(microservice,stream);
      }
    },
    finishWithBody:function (stream){
      try {
        stream.write(this.body);
        stream.end();
      } catch (e){
        logger.debug('Something wrong writing the response for microservice'+e.toString());
      }
    },
    _new_:function (o){
      logger.debug('PHP Microservice executing');
      let microservice = this;
      let request = microservice.request;
      let stream = o.stream;
      microservice.stream = stream;
      stream.on('data', (data) => {
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

    }
  }),
  Class('Microservice',PHPMicroservice)
]);
