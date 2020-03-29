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

CONFIG.set('documentRootFileIndex','index.html');
CONFIG.set('projectPath',`${process.cwd()}/`);
CONFIG.set('useConfigService',false); // this is only true useful for client web side
CONFIG.set('documentRoot','./');
CONFIG.set('serverPortHTTP',80);
CONFIG.set('serverPortHTTPS',443);
CONFIG.set('private-key-pem','localhost-privkey.pem');
CONFIG.set('private-cert-pem','localhost-cert.pem');
CONFIG.set('allowHTTP1',true);
CONFIG.set('useTemplate',false);
CONFIG.set('domain','localhost');

let setDevMode = function (devmode){
  if (typeof devmode !== 'undefined'){
    switch (true) {
      case devmode=='debug':
        logger.debugEnabled = true;
        logger.warnEnabled = true;
        logger.infoEnabled = true;
        break;
      case devmode=='warn':
        logger.debugEnabled = false;
        logger.warnEnabled = true;
        logger.infoEnabled = true;
        break;
      case devmode=='info':
        logger.debugEnabled = false;
        logger.warnEnabled = false;
        logger.infoEnabled = true;
        break;

      default:
        logger.debugEnabled = false;
        logger.warnEnabled = false;
        logger.infoEnabled = false;
        break;
    }
  } else {
    logger.debugEnabled = false;
    logger.warnEnabled = false;
    logger.infoEnabled = false;
  }

}

try {
  var _config = require(CONFIG.get('projectPath')+'config.json');
  logger.debug('Loading settings from your config.json');

  let _secretKey = (_config.hasOwnProperty('domain'))?(_config['domain']):('_secret_');

  if (_config.hasOwnProperty('__encoded__')) {
    _config = JSON.parse(_Crypt.decrypt(_config.__encoded__, _secretKey));
  }
  for (var k in _config){
    CONFIG.set(k,_config[k]);
  }

  setDevMode(CONFIG.get('devmode',''));

  if (typeof CONFIG.get('backend') !== 'undefined'){
    global.set('backendAvailable',true);

    if (typeof CONFIG.get('basePath') !== 'undefined'){
      logger.debug(`Changing the current directory: ${process.cwd()}`);
      try {
        process.chdir(CONFIG.get('basePath'));
        logger.debug(`New directory: ${process.cwd()}`);
      } catch (err) {
        logger.warn(`It was impossible to change the current chdir: ${err}`);
      }
    }
  }
}catch (e){
  logger.debug('No config.json file in your project');
}
