<<<<<<< HEAD
'use strict';

var nconf = require('nconf').file({file: './config.json'});


function getHomeUser(){
  return process.env[(process.platform == 'win32') ? 'USERPROFILE': 'HOME']
}
function saveSetting(settingkey, settingvalue){
  nconf.set(settingkey, settingvalue);
  nconf.save();
}

function readSetting(settingkey){
  nconf.load();
  return nconf.get(settingkey)
}

module.exports = {
  saveSetting,
  readSetting
}
=======
'use strict';

var nconf = require('nconf').file({file: './config.json'});


function getHomeUser(){
  return process.env[(process.platform == 'win32') ? 'USERPROFILE': 'HOME']
}
function saveSetting(settingkey, settingvalue){
  nconf.set(settingkey, settingvalue);
  nconf.save();
}

function readSetting(settingkey){
  nconf.load();
  return nconf.get(settingkey)
}

module.exports = {
  saveSetting,
  readSetting
}
>>>>>>> fd120f51cf3f114e2a16e4d609fba197b95cc40a
