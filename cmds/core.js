'use strict';

const remote = require('remote');
const shell = require('shell');
const ipcRenderer = require('ipc-renderer');
const view = require('../libs/view');
const config = remote.require('electron-json-config');

var quit = () => {
  remote.require('app').quit();
};

var help = (query, callback) => {
  view.addNode(null, 'Help', 'Use <kbd>Up arrow</kbd> and <kbd>Down arrow</kbd> to navigate throught the current session history.');
  view.addNode(null, 'Help', '<code>:about</code>', 'Display info about Piñata');
  view.addNode(null, 'Help', '<code>:quit</code> or <code>:q</code>', 'Quit Pinata');
  view.addNode(null, 'Help', '<code>:hotkey</code>', 'Display HotKey configuration');
  view.addNode(null, 'Help', '<code>:position</code>', 'Display Position configuration');
  callback();
};

var cmds =  {
  ":q": quit,
  ":quit": quit,
  ":devtools": (query, callback) => {
    remote.getCurrentWindow().toggleDevTools();
    callback();
  },
  ":time": (query, callback) => {
    view.addNode(null, null, '| (• ◡•)| (❍ᴥ❍ʋ)');
    callback();
  },
  ":searchcode": (query, callback) => {
    shell.openExternal('https://searchcode.com/');
    callback();
  },
  ":about": (query, callback) => {
    view.addNode('https://github.com/de-luca/Pinata', 'About', 'Piñata - Hit it and get your candy (or documentation)', 'A menubar application using searchcode.com API');
    view.addNode('https://searchcode.com', 'About', null, 'More about Searchcode');
    view.addNode('https://github.com/thomaspark/bootswatch', 'About', null, 'Theme is Slate by Bootswatch');
    view.addNode('https://de-luca.io', 'About', null, 'A simple tool by Bastien de Luca');
    callback();
  },
  ":?": help,
  ":help": help,
  ":position": (query, callback) => {
    switch (query[1]) {
      case 'set':
        if(!query[2]) {
          view.addNode(null, 'Position', 'Error!', 'Position cannot be null');
        } else {
          ipcRenderer.sendSync('position-set', query[2]);
          view.addNode(null, 'Position', 'Saved!', '<code>'+query[2]+'</code> is the new Position.');
        }
        break;
      case 'reset':
        ipcRenderer.sendSync('position-set', 'topRight');
        view.addNode(null, 'Position', 'Done!', 'Position reset to <code>topRight</code> (default).');
        break;
      default:
        view.addNode(null, 'Position',
                'Current Position: <code>'+config.get('position')+'</code>');
        view.addNode('https://github.com/jenslind/electron-positioner#position',
                'Position',
                '<code>:position set &lt;position-name&gt;</code>',
                'Set the new position.<br><i>Click this node to get help about supported positions.</i>');
        view.addNode(null, 'Position', '<code>:position reset</code>', 'Reset Position to <code>topRight</code>.');
        break;
    }
    callback();
  },
  ":hotkey": (query, callback) => {
    switch (query[1]) {
      case 'set':
        if(!query[2]) {
          view.addNode(null, 'HotKey', 'Error!', 'HotKey cannot be null');
        } else {
          if(ipcRenderer.sendSync('hotkey-set', query[2])) {
            view.addNode(null, 'HotKey', 'Saved!', '<kbd>'+query[2]+'</kbd> is the new HotKey.');
          } else {
            view.addNode(null, 'HotKey', 'Error!', '<kbd>'+query[2]+'</kbd> could not be set, another application already uses this shortcut.');
          }
        }
        break;
      case 'remove':
        ipcRenderer.sendSync('hotkey-remove');
        view.addNode(null, 'HotKey', 'Done!', 'HotKey removed.');
        break;
      default:
        view.addNode(null, 'HotKey', 'Current HotKey: <kbd>'+config.get('hotkey')+'</kbd>');
        view.addNode('https://github.com/atom/electron/blob/master/docs/api/accelerator.md',
                'HotKey',
                '<code>:hotkey set &lt;combo&gt;</code>',
                'Set the combo as the new HotKey.<br><i>Click this node to get help about key codes.</i>');
        view.addNode(null, 'HotKey', '<code>:hotkey remove</code>', 'Remove the saved HotKey');
        break;
    }
    callback();
  }
};

module.exports = {
  "cmds": cmds
};
