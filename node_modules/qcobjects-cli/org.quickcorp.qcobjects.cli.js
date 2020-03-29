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
const path = require('path');
const absolutePath = path.resolve( __dirname, "./" );
const templatePath = path.resolve( __dirname, "./templates/apps/" )+'/';
const templatePwaPath = path.resolve( __dirname, "./templates/pwa/" )+'/';
const package_config = require(absolutePath+'/package.json');
const { exec,execSync } = require('child_process');
const Handlebars = require('handlebars');


logger.debugEnabled=false;
CONFIG.set('node_modules_path','./node_modules/');
CONFIG.set('qcobjectsnewapp_path',CONFIG.get('node_modules_path')+'/qcobjectsnewapp');

require(absolutePath+'/org.quickcorp.qcobjects.api.client_services');

Package('org.quickcorp.qcobjects.cli',[
  Class('SwitchCommander',{
    program:require('commander'),
    fileListRecursive : function (dir) {
        var instance = this;
        return (fs.statSync(dir).isDirectory())
            ? (Array.prototype.concat(...fs.readdirSync(dir).map(f =>instance.fileListRecursive(path.join(dir, f))))
            .filter((f)=>{return !f.startsWith('.git')
              && f.lastIndexOf('.DS_Store')==-1
            })
          )
            : (dir);
    },
    register: function (email,phonenumber){
      return new Promise (function (resolve,reject){
        logger.info(`I'm going to register your profile on the cloud...`);
        let cloudClient = New(QuickCorpCloud, {
          apiMethod: 'register',
          data:{email:email,phonenumber:phonenumber}
        });
//        logger.debugEnabled = true;
        try {
          let service = serviceLoader(cloudClient).then(successResonse => {
            let template = successResonse.service.template;
            let response = JSON.parse(template);
            resolve(response);
          }).catch ((e)=>{
            console.log('\u{1F926} Something went wrong \u{1F926} when trying to register you in the cloud');
            reject();
          });
        } catch (e){
          console.log('\u{1F926} Something went wrong \u{1F926} when trying to register you in the cloud');
          reject();
        }

      });
    },
    generateServiceWorker: function (appName){
      var filelist = ["/"].concat(this.fileListRecursive('./'));
      filelist = filelist.filter(function (fl){return fl !== "sw.js" && (!fl.startsWith('node_modules/')) });
      fs.readFile(templatePwaPath+'/sw.js', function(err, data) {
        const swTemplate = Handlebars.compile(data.toString());
        var swContent = swTemplate({appName: appName,filelist:"\n\t\""+filelist.join("\",\n\t\"")+"\""});
        fs.writeFile('./sw.js', swContent, err => {
          logger.info("Service Worker Generated");
          console.log('')
          console.log('Now simply put:');
          console.log('CONFIG.set(\'serviceWorkerURI\',\'/sw.js\');');
          console.log(' In your init.js file ');
          console.log('')
          console.log('To start your app in a local server ');
          console.log('Execute the command: ');
          console.log('> qcobjects launch <appname>');
          console.log('')
          process.exit(0);
        });
      });
    },
    copyTemplate: function (){
      var map_files = function (pathname,callback){
        var _filenames = function (pathname){
          fs.readdir(pathname,{withFileTypes:true},function (err,files){
            if (typeof files !== 'undefined'){
              files.filter((f)=>{return f.isFile()}).map((file)=>{
                callback(pathname+'/'+file.name);
                _filenames(pathname+'/'+file.name);
              });
            }
          });
        };
        return _filenames(pathname);
      };
      var map_dirnames = function (pathname,callback){
        var _main_pathnames = [];
        var _dirnames = function (pathname){
          fs.readdir(pathname,{withFileTypes:true},function (err,files){
            var _pathnames = [];
            files.filter((f)=>{return f.isDirectory()}).map((d)=>{
                _pathnames.push(pathname+'/'+d.name);
                callback(pathname+'/'+d.name);
                _dirnames(pathname+'/'+d.name);
              });
            _main_pathnames = _main_pathnames.concat(_pathnames);
          });
          return _main_pathnames;
        }
        return _dirnames(pathname);
      };
      var relativePath = function (dirname){
        return dirname.replace(CONFIG.get('qcobjectsnewapp_path'),'.');
      };
      var copyTemplateFile = function (sourceFileName, destFileName){
        fs.copyFile(sourceFileName, destFileName, (err) => {
          if (err) throw err;
          logger.debug('File '+destFileName+' was created successfully');
        });
      };
      map_dirnames(CONFIG.get('qcobjectsnewapp_path'),(dirname)=>{
        logger.info('Creating path: '+relativePath(dirname));
        fs.mkdir(relativePath(dirname),()=>{
          map_files(dirname,(filename)=>{
            logger.debug('Creating file: '+relativePath(filename));
            copyTemplateFile(filename,relativePath(filename));
          });
        });
      });
      map_files(CONFIG.get('qcobjectsnewapp_path'),(filename)=>{
        if (!['./package.json',
              './package-lock.json',
              './sw.js'].includes(relativePath(filename))){
          logger.info('Creating file: '+relativePath(filename));
          copyTemplateFile(filename,relativePath(filename));
        }
      });

    },
    choiceOption:{
      generateSw: function (_appName){
        let switchCommander = this;
        let appName = (typeof _appName ==='undefined' || _appName === true)?('MyAppName'):(_appName);
        switchCommander.generateServiceWorker(appName);

      },
      create:function (_appName, options){
        let switchCommander = this;
        let appName = (typeof _appName ==='undefined' || _appName === true)?('MyAppName'):(_appName);

        const readline = require('readline');

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.question('Please tell me your git repository url: \n', (answer) => {
          logger.info(`your git repository url is ${answer}`);
          rl.close();
          let giturl = answer;

          let createAppCommandCustom = `echo \
{ \
      "name": "`+appName.toLowerCase()+`", \
      "repository": { \
              "type": "git", \
              "url": "`+giturl+`" \
      }, \
      "description": "This is a custom NPM template app from ${options.createCustom} generated with QCObjects.", \
      "main": "js/init.js", \
      "license": "LGPL-3.0-or-later", \
      "dependencies": { \
              "${options.createCustom}": "latest", \
              "qcobjects": "latest" \
      } \
} > package.json`;


          let createAppCommandPWA = `echo \
{ \
      "name": "`+appName.toLowerCase()+`", \
      "repository": { \
              "type": "git", \
              "url": "`+giturl+`" \
      }, \
      "description": "Awesome PWA application that will help you achieve your dreams.", \
      "main": "js/init.js", \
      "license": "LGPL-3.0-or-later", \
      "dependencies": { \
              "qcobjectsnewapp": "latest", \
              "qcobjects": "latest" \
      } \
} > package.json`;

          let createAppCommandAMP = `echo \
{ \
      "name": "`+appName.toLowerCase()+`", \
      "repository": { \
              "type": "git", \
              "url": "`+giturl+`" \
      }, \
      "description": "Awesome AMP application that will help you achieve your dreams.", \
      "main": "js/init.js", \
      "license": "LGPL-3.0-or-later", \
      "dependencies": { \
              "qcobjects-ecommerce-amp": "latest", \
              "qcobjects": "latest" \
      } \
} > package.json`;

          let createAppCommandPHP = `echo \
{ \
      "name": "${appName.toLowerCase()}", \
      "repository": {\
          "type": "git",\
          "url": "${giturl}"\
      },\
      "description": "Awesome PHP application that will help you achieve your dreams.",\
      "main": "js/init.js",\
      "license": "LGPL-3.0-or-later",\
      "devDependencies": {\
        "jasmine": "latest",\
        "qcobjects-cli": "latest"\
      },\
      "dependencies": {\
        "qcobjectsnewphp": "latest",\
        "qcobjects": "latest",\
        "qcobjects-sdk": "latest"\
      }\
} > package.json`;

          let createAppCommand;
          let appTemplateName;

          if (options.createAmp){
            appTemplateName = 'qcobjects-ecommerce-amp';
            createAppCommand = createAppCommandAMP;
          } else if (options.createPwa){
            appTemplateName = 'qcobjectsnewapp';
            createAppCommand = createAppCommandPWA;
          } else if (options.createPhp){
            appTemplateName = 'qcobjectsnewphp';
            createAppCommand = createAppCommandPHP;
          } else if (options.createCustom){
            appTemplateName = options.createCustom;
            createAppCommand = createAppCommandCustom;
          } else {
            appTemplateName = 'qcobjectsnewapp';
            createAppCommand = createAppCommandPWA;
          }
          CONFIG.set('qcobjectsnewapp_path',CONFIG.get('node_modules_path')+'/'+appTemplateName);
          if (!process.platform.toLowerCase().startsWith('win')){
            createAppCommand = createAppCommand.replace(/(")/g, String.fromCharCode(92)+`\"`);
          }
          logger.debug(createAppCommand);
          exec(createAppCommand, (err, stdout, stderr) => {
            console.log(stdout);
            exec("npm cache verify && npm i --save-dev ", (err, stdout, stderr) => {
              console.log(stdout);
              Promise.resolve(switchCommander.copyTemplate()).then(()=>{
                logger.info('Good! Your application is getting done. You can play with QCObjects now!');
                logger.info('In about five seconds your server will start...');
                exec("qcobjects-createcert",(err,stdout,stderr)=>{
                  logger.info("Test certificates generated");
                  exec("npm uninstall "+appTemplateName+" --save && npm cache verify",(err,stdout,stderr)=>{
                    switchCommander.generateServiceWorker(appName);
                  });
                });
              });
            });
          });

        });

      },
      publish: function (_appName){
        logger.debug('publish is not yet implemented');
      },
      upgradeToEnterprise: function (){
        let switchCommander = this;
        const readline = require('readline');

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        var emailQuestion = function (){
          rl.question(`
[NOTE: No information will be sent to a server until I got your consent]

Please tell me your e-Mail (\u{1F48C}):
`, (email) => {
            if (email !== ''){
              var phoneNumberQuestion = function (){
                rl.question ('Please tell me your phone number (\u{1F919}): \n', (phonenumber) => {
                  if (phonenumber !== ''){
                    rl.question (`
Please select one of the following options (type a number):

1.- \u{1F640} This is your first interaction \u{1F60D} with QCObjects Enterprise Edition \u{1F3E2},
you want to send your email and phone number to one of our executives to process your
inquiry, pay the license (when aplies) and receive a new fresh license number
that will free up to you the most advanced features for large companies

2.- \u{2714} Your assigned executive \u{1F9D1} has given to you a new fresh QCObjects Enterprise Edition License Number
and you want to enter it to follow up with the next steps.

3.- \u{1F3C3} You want to quit this form, as you got here accidentally
(You should think about it. It's not a coincidence, It's destiny \u{1F600}).

Please enter the number of the option and press [enter]: `, (interaction_option)=> {
                      logger.infoEnabled=true;

                      switch (interaction_option) {
                        case '1':
                          switchCommander.register(email,phonenumber).then(function (response){
                            logger.info(`\u{1F44F} Congrats! You have been successfully registered to the cloud! \u{1F44F}
One of our executives will be in touch with you as soon as possible to give you the next steps
to get a new License Number and start using QCObjects Entrprise Edition!

(In the meantime, you can continue using all the features of the QCObjects Community Edition)
`);
                            rl.close();
                          }).catch ((e)=>{
                            rl.close();
                          });
                          break;
                        case '2':
                          rl.question('Please tell me the number of license that your executive has given to you: \n', (license) => {
                            logger.info(`Your entered license number is ${license} and the email have entered is ${email}`);
                            logger.info(`Now, I'm installing QCObjects Enterprise Edition in your computer...`);
                            let cmdDownloadGit = `npm i --force -g git+https://license:${license}@software.qcobjects.io/qcobjects-enterprise/qcobjects-enterprise.git`;
                            exec(cmdDownloadGit,(err,stdout,stderr)=>{
                              if(!err){
                                exec("qcobjects --version",(err,stdout,stderr)=>{
                                  if (stdout.lastIndexOf('Enterprise Edition')!==-1){
                                    logger.info('\u{1F44F} Congrats! Now you have installed QCObjects Entrprise Edition! \u{1F44F}');
                                    logger.info(`You can test it using:
> qcobjects --version

To find more help, type the command:

> qcobjects --help

Enjoy!
`);
                                  } else {
                                    console.log('\u{1F926} Something went wrong \u{1F926} when trying to update your license to QCObjects Enterprise Edition');
                                    console.log('Ask your executive to help');
                                  }
                                });

                              } else {
                                console.log('\u{1F926} Something went wrong \u{1F926} when trying to update your license to QCObjects Enterprise Edition');
                                if (stderr.lastIndexOf('Authentication failed')!==-1){
                                  console.log('Please ask to your executive for the right license number');
                                } else {
                                  console.log(stderr);
                                }
                              }
                            }).stdout.on('data', function(data) {
                                console.log(data);
                            });

                            rl.close();
                          });

                          break;
                        default:
                          logger.info('\u{1F937} You can continue to use QCObjects Community Edition, see you! \u{1F64B} ');
                          rl.close();
                          break;
                      }

                    });

                  } else {
                    console.log(`You need to enter a Phone Number if you want to be contacted.
If you want to quit, press Ctrl-C.
`);
                    phoneNumberQuestion();
                  }
                });
              };
              phoneNumberQuestion();

            } else {
              console.log(`You need to enter a real e-Mail adress if you want to be contacted.
If you want to quit, press Ctrl-C.
`);
              emailQuestion();
            }
          });

        };
        emailQuestion();

      }
    },
    initCommand: function (){
      let switchCommander = this;
      if (process.argv.length>1){

        this.program
          .version(package_config.version);
        this.program
          .command('create <appname>')
          .description('Creates an app with <appname>')
          .option('--pwa, --create-pwa', 'Creates the progressive web app assets')
          .option('--amp, --create-amp', 'Creates the accelerated mobile pages assets')
          .option('--php, --create-php', 'Creates the PWA PHP assets')
          .option('--custom, --create-custom <templateappname>', 'Creates an App from any NPM package template')
          .option('--tests, --create-tests', 'Creates the test suite')
          .action(function(args, options){
              switchCommander.choiceOption.create.call(switchCommander,args,options);
          });
        this.program.command('publish <appname>')
          .description('Publishes an app with <appname>')
          .option('--pwa, --create-pwa', 'Publishes the progressive web app assets')
          .option('--amp, --create-amp', 'Publishes the accelerated mobile pages assets')
          .option('--php, --create-php', 'Creates the PWA PHP assets')
          .option('--custom, --create-custom', 'Creates an App from any NPM package template')
          .option('--tests, --create-tests', 'Publishes the test suite')
          .action(function(args, options){
              switchCommander.choiceOption.publish.call(switchCommander,args,options);
          });

        this.program.command('upgrade-to-enterprise')
          .description('Upgrades to QCObjects Enterprise Edition')
          .action(function(args, options){
              switchCommander.choiceOption.upgradeToEnterprise.call(switchCommander,args,options);
          });

        this.program.command('generate-sw  <appname>')
          .description('Generates the service worker  <appname>')
          .action(function(args, options){
              switchCommander.choiceOption.generateSw.call(switchCommander,args,options);
          });
        this.program.command('launch <appname>')
          .description('Launches the application')
          .action(function (args,options){
            logger.info("Launching...");
            setTimeout(()=>{
              logger.info("Go to the browser and open https://localhost ");
              logger.info("Press Ctrl-C to stop serving ");
              exec("qcobjects-server",(err,stdout,stderr)=>{
              }).stdout.on('data', function(data) {
                  console.log(data);
              });
            },5000);
  //          setTimeout(()=>{
  //            execSync("open -a \"google chrome\" https://localhost");
  //          },6000);

          });

          this.program.on('--help', function(){
            console.log('')
            console.log('Use:');
            console.log('  $ qcobjects-cli [command] --help');
            console.log('  For detailed information of a command ');
            console.log('')
            process.exit(0);
          });
          this.program.on('command:*', function () {
            console.error('Invalid command: %s\nSee --help for a list of available commands.', switchCommander.program.args.join(' '));
            process.exit(1);
          });
          this.program.parse(process.argv);
        } else {
          console.log('')
          console.log('Use:');
          console.log('  $ qcobjects-cli [command] --help');
          console.log('  For detailed information of a command ');
          console.log('')
          process.exit(0);

        }

    }
  })
]);
