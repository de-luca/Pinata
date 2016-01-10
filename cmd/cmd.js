var cmds =  {
  ":q": function() {
    remote.require('app').quit();
  },
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
    addNode('https://github.com/de-luca/Pinata', 'About', 'Piñata - Hit it and get your candy (or documentation)', 'A menu bar application using searchcode.com API');
    addNode('https://searchcode.com', 'About', null, 'More about Searchcode');
    addNode('https://github.com/thomaspark/bootswatch', 'About', null, 'Theme using Slate by Bootswatch');
    addNode('https://de-luca.io', 'About', null, 'A simple tool by Bastien de Luca');
  },
  ":help": function() {
    addNode(null, 'Help', 'Use <kbd>Up arrow</kbd> and <kbd>Down arrow</kbd> to navigate throught the current session history.');
    addNode(null, 'Help', 'Use <code>!</code> to negate an element', 'Example: <code>!php echo</code>');
    addNode(null, 'Help', 'Use <code>|</code> as an \'or\'', 'Example: <code>php|python echo</code>');
    addNode(null, 'Help', '<code>:about</code>', 'Display info about Piñata');
    addNode(null, 'Help', '<code>:q</code>', 'Quit Pinata');
    addNode(null, 'Help', '<code>:hotkey</code>', 'Display HotKey configuration');
  },
  ":hotkey": function(query) {
    switch (query[1]) {
      case 'set':
        if(!query[2]) {
          addNode(null, 'HotKey', 'Error!', 'HotKey cannot be null');
        } else {
          if(ipcRenderer.sendSync('hotkey-set', query[2])) {
            localStorage.setItem('hotkey', query[2]);
            addNode(null, 'HotKey', 'Saved!', '<kbd>'+query[2]+'</kbd> is the new hotkey.');
          } else {
            addNode(null, 'HotKey', 'Error!', '<kbd>'+query[2]+'</kbd> could not be set, another application already uses this shortcut.');
          }
        }
        break;
      case 'remove':
        ipcRenderer.sendSync('hotkey-remove');
        localStorage.removeItem('hotkey');
        addNode(null, 'HotKey', 'Done!', 'HotKey removed.');
        break;
      default:
        addNode(null, 'HotKey', 'Current HotKey: <kbd>'+localStorage.getItem('hotkey')+'</kbd>');
        addNode('https://github.com/atom/electron/blob/master/docs/api/accelerator.md',
                'HotKey',
                '<code>:hotkey set &lt;combo&gt;</code>',
                'Set the combo as the new hotkey.<br><i>Click this node to get help about key codes.</i>');
        addNode(null, 'HotKey', '<code>:hotkey remove</code>', 'Remove the saved hotkey');
        break;
    }
  }
};

module.exports = {
  "cmds": cmds
};
