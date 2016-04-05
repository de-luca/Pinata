'use strict';

const fs = require('fs');
const remote = require('remote');

var getExtDir = () => {
  return remote.app.getPath('userData')+'/cmds';
};

var importCmd = () => {
  let cmds = {};
  cmds = importInternal(cmds);
  cmds = importExternal(cmds);
  return cmds;
};

var importInternal = (cmds) => {
  let files = fs.readdirSync(__dirname+'/../cmds/');
  for(var i in files) {
    let ext = require(__dirname+'/../cmds/'+files[i]).cmds;
    for(var index in ext) {
      cmds[index] = ext[index];
    }
  }
  return cmds;
};

var importExternal = (cmds) => {
  let files = fs.readdirSync(getExtDir());
  files.splice(files.indexOf('.DS_Store'), 1);
  for(var i in files) {
    let ext = require(getExtDir()+'/test').cmds;
    for(var index in ext) {
      cmds[index] = ext[index];
    }
  }
  return cmds;
};

module.exports = {
  "getExtDir": getExtDir,
  "import": importCmd,
};
