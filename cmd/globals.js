var quit = function() {
  remote.require('app').quit();
};

var help = function() {
  addNode(null, 'Help', 'Use <kbd>Up arrow</kbd> and <kbd>Down arrow</kbd> to navigate throught the current session history.');
  addNode(null, 'Help', '<code>:about</code>', 'Display info about Piñata');
  addNode(null, 'Help', '<code>:quit</code> or <code>:q</code>', 'Quit Pinata');
  addNode(null, 'Help', '<code>:hotkey</code>', 'Display HotKey configuration');
  addNode(null, 'Help', '<code>:position</code>', 'Display Position configuration');
};

var cmds =  {
  ":q": quit,
  ":quit": quit,
  ":devtools": function() {
    remote.getCurrentWindow().toggleDevTools();
  },
  ":time": function() {
    addNode(null, null, '| (• ◡•)| (❍ᴥ❍ʋ)');
  },
  ":searchcode": function() {
    shell.openExternal('https://searchcode.com/');
  },
  ":about": function() {
    addNode('https://github.com/de-luca/Pinata', 'About', 'Piñata - Hit it and get your candy (or documentation)', 'A menubar application using searchcode.com API');
    addNode('https://searchcode.com', 'About', null, 'More about Searchcode');
    addNode('https://github.com/thomaspark/bootswatch', 'About', null, 'Theme is Slate by Bootswatch');
    addNode('https://de-luca.io', 'About', null, 'A simple tool by Bastien de Luca');
  },
  ":?": help,
  ":help": help,
  ":position": function(query) {
    switch (query[1]) {
      case 'set':
        if(!query[2]) {
          addNode(null, 'Position', 'Error!', 'Position cannot be null');
        } else {
          ipcRenderer.sendSync('position-set', query[2]);
          addNode(null, 'Position', 'Saved!', '<code>'+query[2]+'</code> is the new Position.');
        }
        break;
      case 'reset':
        ipcRenderer.sendSync('position-set', 'topRight');
        addNode(null, 'Position', 'Done!', 'Position reset to <code>topRight</code> (default).');
        break;
      default:
        addNode(null, 'Position',
                'Current Position: <code>'+config.get('position')+'</code>');
        addNode('https://github.com/jenslind/electron-positioner#position',
                'Position',
                '<code>:position set &lt;position-name&gt;</code>',
                'Set the new position.<br><i>Click this node to get help about supported positions.</i>');
        addNode(null, 'Position', '<code>:position reset</code>', 'Reset Position to <code>topRight</code>.');
        break;
    }
  },
  ":hotkey": function(query) {
    switch (query[1]) {
      case 'set':
        if(!query[2]) {
          addNode(null, 'HotKey', 'Error!', 'HotKey cannot be null');
        } else {
          if(ipcRenderer.sendSync('hotkey-set', query[2])) {
            addNode(null, 'HotKey', 'Saved!', '<kbd>'+query[2]+'</kbd> is the new HotKey.');
          } else {
            addNode(null, 'HotKey', 'Error!', '<kbd>'+query[2]+'</kbd> could not be set, another application already uses this shortcut.');
          }
        }
        break;
      case 'remove':
        ipcRenderer.sendSync('hotkey-remove');
        addNode(null, 'HotKey', 'Done!', 'HotKey removed.');
        break;
      default:
        addNode(null, 'HotKey', 'Current HotKey: <kbd>'+config.get('hotkey')+'</kbd>');
        addNode('https://github.com/atom/electron/blob/master/docs/api/accelerator.md',
                'HotKey',
                '<code>:hotkey set &lt;combo&gt;</code>',
                'Set the combo as the new HotKey.<br><i>Click this node to get help about key codes.</i>');
        addNode(null, 'HotKey', '<code>:hotkey remove</code>', 'Remove the saved HotKey');
        break;
    }
  }
};

module.exports = {
  "cmds": cmds
};
