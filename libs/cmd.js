'use strict';

const fs = require('fs');
const remote = require('remote');
const _ = require('lodash');
const config = remote.require('electron-json-config');

var cmds = {};

var getCmds = () => {
  return cmds;
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
    cmds = _.assign(cmds, require(__dirname+'/../cmds/'+files[i]).cmds);
  }
};

var importExternal = () => {
  let files = listExt();
  let reqExt = listReqExt();
  for(var i in files) {
    if(reqExt.indexOf(files[i]) !== -1) {
      cmds = _.assign(cmds, require(getExtDir()+'/'+files[i]).cmds);
    }
  }
};

var load = (extName) => {
  cmds = _.assign(cmds, require(getExtDir()+'/'+extName).cmds);
};

var unload = (extName) => {
  _.unset(cmds, _.keys(require(getExtDir()+'/'+extName).cmds));
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
