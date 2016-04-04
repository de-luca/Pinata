'use strict';

const fs = require('fs');

var importCmd = () => {
  let files = fs.readdirSync(__dirname+'/../cmds/');
  let cmds = {};
  for(var i in files) {
    let ext = require(__dirname+'/../cmds/'+files[i]).cmds;
    for(var index in ext) {
      cmds[index] = ext[index];
    }
  }
  return cmds;
};

module.exports = {
  "import": importCmd
};
