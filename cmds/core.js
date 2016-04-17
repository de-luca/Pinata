'use strict';

const remote = require('remote');
const ipcRenderer = require('ipc-renderer');
const view = require('../libs/view');
const cmd = require('../libs/cmd');
const config = remote.require('electron-json-config');
const _ = require('lodash');

const hotkeyRegex = new RegExp(/^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super|Plus|Space|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|[0-9]|F(1\d|[0-2][0-4]|[1-9])|[A-Z]|\W)(\+(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super|Plus|Space|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|[0-9]|F(1\d|[0-2][0-4]|[1-9])|[A-Z]|\W))*$/);
const positions = [
  'trayLeft',
  'trayBottomLeft',
  'trayRight',
  'trayBottomRight',
  'trayCenter',
  'trayBottomCenter',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'topCenter',
  'bottomCenter',
  'center',
];

var quit = () => {
  remote.require('app').quit();
};

var devtools = (query, callback) => {
  remote.getCurrentWindow().toggleDevTools();
  callback();
};

var time = (query, callback) => {
  view.addNode('| (• ◡•)| (❍ᴥ❍ʋ)');
  callback();
};

var about = (query, callback) => {
  view.addNode(
    'Piñata - Hit it and get your candy (or documentation)',
    'A menubar application using searchcode.com API',
    null,
    {type: 'web', value: 'https://github.com/de-luca/Pinata'}
  );
  view.addNode(
    null,
    'More about Searchcode',
    null,
    {type: 'web', value: 'https://searchcode.com'}
  );
  view.addNode(
    null,
    'Theme is Slate by Bootswatch',
    null,
    {type: 'web', value: 'https://github.com/thomaspark/bootswatch'}
  );
  view.addNode(
    null,
    'A simple tool by Bastien de Luca',
    null,
    {type: 'web', value: 'https://de-luca.io'}
  );
  callback();
};

var help = (query, callback) => {
  view.addNode('Use <kbd>Up arrow</kbd> and <kbd>Down arrow</kbd> to navigate throught results.');
  view.addNode(
    '<code>:about</code>',
    'Display info about Piñata'
  );
  view.addNode(
    '<code>:quit</code> or <code>:q</code>',
    'Quit Pinata'
  );
  view.addNode(
    '<code>:hotkey</code>',
    'Display HotKey configuration'
  );
  view.addNode(
    '<code>:position</code>',
    'Display Position configuration'
  );
  callback();
};

var position = (query, callback) => {
  switch (query[1]) {
    case 'set':
      if(!query[2] || _.indexOf(positions, query[2] === -1)) {
        view.addNode(
          'Error!',
          'Position <code>'+query[2]+'</code> is not a valid position.'
        );
      } else {
        ipcRenderer.sendSync('position-set', query[2]);
        view.addNode(
          'Saved!',
          '<code>'+query[2]+'</code> is the new Position.'
        );
      }
      break;
    case 'reset':
      ipcRenderer.sendSync('position-set', 'topRight');
      view.addNode(
        'Done!',
        'Position reset to <code>topRight</code> (default).'
      );
      break;
    default:
      view.addNode('Current Position: <code>'+config.get('position')+'</code>');
      view.addNode(
        '<code>:position set &lt;position-name&gt;</code>',
        'Set the new position.<br><i>Click this node to get help about supported positions.</i>',
        null,
        {type: 'web', value: 'https://github.com/jenslind/electron-positioner#position'}
      );
      view.addNode(
        '<code>:position reset</code>',
        'Reset Position to <code>topRight</code>.'
      );
      break;
  }
  callback();
};

var hotkey = (query, callback) => {
  switch (query[1]) {
    case 'set':
      if(!query[2] || !query[2].match(hotkeyRegex)) {
        view.addNode(
          'Error!',
          'HotKey cannot be null'
        );
      } else {
        if(ipcRenderer.sendSync('hotkey-set', query[2])) {
          view.addNode(
            'Saved!',
            '<kbd>'+query[2]+'</kbd> is the new HotKey.'
          );
        } else {
          view.addNode(
            'Error!',
            '<kbd>'+query[2]+'</kbd> could not be set, another application already uses this shortcut.'
          );
        }
      }
      break;
    case 'remove':
      ipcRenderer.sendSync('hotkey-remove');
      view.addNode(
        'Done!',
        'HotKey removed.'
      );
      break;
    default:
      view.addNode('Current HotKey: <kbd>'+config.get('hotkey')+'</kbd>');
      view.addNode(
        '<code>:hotkey set &lt;combo&gt;</code>',
        'Set the combo as the new HotKey.<br><i>Click this node to get help about key codes.</i>',
        null,
        {type: 'web', value: 'https://github.com/atom/electron/blob/master/docs/api/accelerator.md'}
      );
      view.addNode(
        '<code>:hotkey remove</code>',
        'Remove the saved HotKey'
      );
      break;
  }
  callback();
};

var ext = (query, callback) => {
  let reqExt = cmd.listReqExt();
  switch (query[1]) {
    case 'list':
      if(cmd.listExt().length === 0) {
        view.addNode('No extension found in '+cmd.getExtDir());
        callback();
        return;
      }
      cmd.listExt().forEach((curExt, i, all) => {
        view.addNode(curExt, cmd.getExtDir()+'/'+curExt);
        if(i === all.length-1) {
          callback();
        }
      });
      return;
    case 'loaded':
      if(reqExt.length === 0) {
        view.addNode('No extensions loaded');
        callback();
        return;
      }
      reqExt.forEach((curExt, i, all) => {
        view.addNode(curExt, null);
        if(i === all.length-1) {
          callback();
        }
      });
      return;
    case 'load':
      if(cmd.listExt().indexOf(query[2]) === -1) {
        view.addNode(
          'Error',
          'Extension '+query[2]+' is not available.'
        );
      } else if(reqExt.indexOf(query[2]) !== -1) {
        view.addNode(
          'Error',
          'Extension '+query[2]+' is already loaded.'
        );
      } else {
        reqExt.push(query[2]);
        config.set('ext', reqExt);
        cmd.load(query[2]);
        view.addNode(
          'Okay',
          'Extension '+query[2]+' as been loaded.'
        );
      }
      break;
    case 'unload':
      reqExt.splice(reqExt.indexOf(query[2]), 1);
      config.set('ext', reqExt);
      cmd.unload(query[2]);
      view.addNode(
        'Okay',
        'Extension '+query[2]+' as been unloaded.'
      );
      break;
    default:
      view.addNode(
        '<code>:ext list</code>',
        'List extension found in '+cmd.getExtDir()
      );
      view.addNode(
        '<code>:ext loaded</code>',
        'List extension loaded'
      );
      view.addNode(
        '<code>:ext load &lt;extension-name&gt;</code>',
        'Attempt to load extension from '+cmd.getExtDir()
      );
      view.addNode(
        '<code>:ext unload &lt;extension-name&gt;</code>',
        'Attempt to unload extension from '+cmd.getExtDir()
      );
      break;
  }
  callback();
};

var cmds =  {
  ":q": quit,
  ":quit": quit,
  ":devtools": devtools,
  ":time": time,
  ":about": about,
  ":?": help,
  ":help": help,
  ":position": position,
  ":hotkey": hotkey,
  ":ext": ext,
};

module.exports = {
  "cmds": cmds
};
