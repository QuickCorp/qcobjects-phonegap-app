'use strict';
/**
 * QCObjects New App PWA Template 1.x
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

/*
* The next values are the default settings
* You can change any value in runtime by using CONFIG.set
* or changing the static initial value in a config.json file
*/
CONFIG.set('relativeImportPath', 'js/packages/');
CONFIG.set('componentsBasePath', 'templates/components/');
CONFIG.set('delayForReady', 1); // delay to wait before executing the first ready event, it includes imports
CONFIG.set('preserveComponentBodyTag', false); // don't use <componentBody></componentBody> tag
CONFIG.set('useConfigService', false); // Load settings from config.json
CONFIG.set('routingWay','hash'); // routingWay possible values are 'hash','pathname','search'
CONFIG.set('useSDK',true); // it is recommended to use the SDK that is dynamically loaded, but you can chose not to load it
CONFIG.set('useLocalSDK',false); // on the frontend side you can chose whether to load the SDK from sdk.qcobjects.dev or from your local website
CONFIG.set('tplextension','tpl.html'); // this is the file extension to locate the template files (if component.name = 'main' then template name will be main.tpl.html)
CONFIG.set('asynchronousImportsLoad',true); // it is recommended to load the Import declarations in an asyncronous way
CONFIG.set('serviceWorkerURI','/sw.js'); //QCObjects will register an launch this service worker automatically to work offline

// if Component.cached is true, all the Class('Component') declarations will save the template in a localStorage cache
// until a cached=false attribute is found in a <component> html declaration
Component.cached=true;

/**
 * Main import sentence.
 */


Import('org.quickcorp.custom'); // this will load js/packages/org.quickcorp.custom.js file

Ready(function (){
  // your initial code here   
});
