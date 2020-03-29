#!/usr/bin/env node
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
const templatePath = path.resolve( __dirname, "./templates/apps/" )+'/';
const package_config = require(absolutePath+'/package.json');


require('qcobjects');
logger.debugEnabled = false;
const welcometo = 'Welcome to \n';
const instructions = `
Community Edition
=================

This edition has the most of features that you can use for free but if you want to

Upgrade to \u{1F3E2} Enterprise Edition,
type the command:

> qcobjects upgrade-to-enterprise
`;
const logo = ' .d88888b.  .d8888b.  .d88888b. 888       d8b                888            \r\nd88P\" \"Y88bd88P  Y88bd88P\" \"Y88b888       Y8P                888            \r\n888     888888    888888     888888                          888            \r\n888     888888       888     88888888b.  8888 .d88b.  .d8888b888888.d8888b  \r\n888     888888       888     888888 \"88b \"888d8P  Y8bd88P\"   888   88K      \r\n888 Y8b 888888    888888     888888  888  88888888888888     888   \"Y8888b. \r\nY88b.Y8b88PY88b  d88PY88b. .d88P888 d88P  888Y8b.    Y88b.   Y88b.      X88 \r\n \"Y888888\"  \"Y8888P\"  \"Y88888P\" 88888P\"   888 \"Y8888  \"Y8888P \"Y888 88888P\' \r\n       Y8b                                888                               \r\n                                         d88P                               \r\n                                       888P\"   ';
console.log(welcometo);
console.log(logo);
if (process.argv.length<3){
  console.log(instructions);
}

require(absolutePath+'/org.quickcorp.qcobjects.cli');

let switchCommander;

Class('Main',Object,{
  _new_:(o)=>{
    let main = this;

    switchCommander = New(SwitchCommander);
    switchCommander.initCommand();

    /*
    let template = New(AppTemplate,{
      compileAndSave:true
    });
    */
    logger.debug('initialized');


  }
});

let __main__ = New(Main,{});
