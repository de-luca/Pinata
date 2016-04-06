'use strict';

const fs = require('fs');
const remote = require('remote');
const config = remote.require('electron-json-config');

var cmds = {};

var getCmds = () => {
  return cmds;
};

var getExtDir = () => {
  return remote.app.getPath('userData')+'/cmds';
};

var listExt = () => {
  let files = fs.readdirSync(getExtDir());
  files.splice(files.indexOf('.DS_Store'), 1);
  return files;
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
    let ext = require(__dirname+'/../cmds/'+files[i]).cmds;
    for(var index in ext) {
      cmds[index] = ext[index];
    }
  }
};

var importExternal = () => {
  let files = listExt();
  let reqExt = listReqExt();
  for(var i in files) {
    if(reqExt.indexOf(files[i]) !== -1) {
      let ext = require(getExtDir()+'/'+files[i]).cmds;
      for(var index in ext) {
        cmds[index] = ext[index];
      }
    }
  }
};

var load = (extName) => {
  let ext = require(getExtDir()+'/'+extName).cmds;
  for(var index in ext) {
    cmds[index] = ext[index];
  }
};

var unload = (extName) => {
  let ext = require(getExtDir()+'/'+extName).cmds;
  for(var index in ext) {
    delete cmds[index];
  }
};

module.exports = {
  "getCmds": getCmds,
  "getExtDir": getExtDir,
  "listExt": listExt,
  "listReqExt": listReqExt,
  "load": load,
  "unload": unload,
  "init": init,
};
