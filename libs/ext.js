'use strict';

const fs = require('fs');
const remote = require('remote');
const _ = require('lodash');
const config = remote.require('electron-json-config');

var cmds = {};

var match = (query, callback) => {
  for(let cmd in cmds) {
    cmds[cmd](query, callback);
  }
};

var getExtDir = () => {
  return remote.app.getPath('userData')+'/cmds';
};

var listExt = () => {
  return _.pull(fs.readdirSync(getExtDir()), '.DS_Store');
};

var listReqExt = () => {
  return config.get('ext');
};

var init = () => {
  importInternal();
  importExternal();
};

var importInternal = () => {
  let files = fs.readdirSync(__dirname+'/../cmds/');
  for(var i in files) {
    cmds[files[i]] = require(__dirname+'/../cmds/'+files[i]).matcher;
  }
};

var importExternal = () => {
  let files = listExt();
  let reqExt = listReqExt();
  for(var i in files) {
    if(reqExt.indexOf(files[i]) !== -1) {
      cmds[files[i]] = require(getExtDir()+'/'+files[i]).matcher;
    }
  }
};

var load = (extName) => {
  cmds = require(getExtDir()+'/'+extName).matcher;
};

var unload = (extName) => {
  delete cmds[extName];
};

module.exports = {
  "match": match,
  "getExtDir": getExtDir,
  "listExt": listExt,
  "listReqExt": listReqExt,
  "load": load,
  "unload": unload,
  "init": init,
};
