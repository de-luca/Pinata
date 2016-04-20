'use strict';

const remote = require('remote');
const ipcRenderer = require('ipc-renderer');
const view = require('../libs/view');
const ext = require('../libs/ext');
const config = remote.require('electron-json-config');
const _ = require('lodash');
const shell = require('shell');

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

var quit = (query, callback) => {
  view.addNode(
    'Quit Pinata', null, null,
    {
      type: 'function',
      action: () => remote.require('app').quit()
    }
  );
  callback();
};

var devtools = (query, callback) => {
  view.addNode(
    'Toggle dev tools', null, null,
    {
      type: 'function',
      action: () => remote.getCurrentWindow().toggleDevTools()
    }
  );
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
    {
      type: 'web',
      action: () => shell.openExternal('https://github.com/de-luca/Pinata')
    }
  );
  view.addNode(
    null,
    'More about Searchcode',
    null,
    {
      type: 'web',
      action: () => shell.openExternal('https://searchcode.com')
    }
  );
  view.addNode(
    null,
    'Theme is Slate by Bootswatch',
    null,
    {
      type: 'web',
      action: () => shell.openExternal('https://github.com/thomaspark/bootswatch')
    }
  );
  view.addNode(
    null,
    'A simple tool by Bastien de Luca',
    null,
    {
      type: 'web',
      action: () => shell.openExternal('http://de-luca.io')
    }
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
      if(!query[2] || _.indexOf(positions, query[2]) === -1) {
        view.addNode(
          'Error!',
          'Position <code>'+query[2]+'</code> is not a valid position.'
        );
      } else {
        view.addNode(
          'Save <code>'+query[2]+'</code> has new position?', null, null,
          {
            type: 'function',
            action: () => ipcRenderer.sendSync('position-set', query[2])
          }
        );
      }
      break;
    case 'reset':
      view.addNode(
        'Reset position to  <code>topRight</code>?', null, null,
        {
          type: 'function',
          action: () => ipcRenderer.sendSync('position-set', 'topRight')
        }
      );
      break;
    default:
      view.addNode('Current Position: <code>'+config.get('position')+'</code>');
      view.addNode(
        '<code>:position set &lt;position-name&gt;</code>',
        'Set the new position.<br><i>Click this node to get help about supported positions.</i>',
        null,
        {
          type: 'web',
          action: () => shell.openExternal('https://github.com/jenslind/electron-positioner#position')
        }
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
          'Hotkey is invalid.'
        );
      } else {
        view.addNode(
          'Save <kbd>'+query[2]+'</kbd> has the new hotkey?', null, null,
          {
            type: 'function',
            action: () => {
              if(ipcRenderer.sendSync('hotkey-set', query[2])) {
                view.addNode(
                  'Done!',
                  '<kbd>'+query[2]+'</kbd> has been set!'
                );
              } else {
                view.addNode(
                  'Error!',
                  '<kbd>'+query[2]+'</kbd> could not be set, another application already uses this shortcut.'
                );
              }
            }
          }
        );
      }
      break;
    case 'remove':
      view.addNode(
        'Remove current hotkey?', null, null,
        {
          type: 'function',
          action: () => {
            ipcRenderer.sendSync('hotkey-remove');
            view.addNode(
              'Done!',
              'HotKey removed.'
            );
          }
        }
      );
      break;
    default:
      view.addNode('Current HotKey: <kbd>'+config.get('hotkey')+'</kbd>');
      view.addNode(
        '<code>:hotkey set &lt;combo&gt;</code>',
        'Set the combo as the new HotKey.<br><i>Click this node to get help about key codes.</i>',
        null,
        {
          type: 'web',
          action: () => shell.openExternal('https://github.com/atom/electron/blob/master/docs/api/accelerator.md')
        }
      );
      view.addNode(
        '<code>:hotkey remove</code>',
        'Remove the saved HotKey'
      );
      break;
  }
  callback();
};

var exts = (query, callback) => {
  let reqExt = ext.listReqExt();
  switch (query[1]) {
    case 'list':
      if(ext.listExt().length === 0) {
        view.addNode('No extension found in '+ext.getExtDir());
        callback();
        return;
      }
      ext.listExt().forEach((curExt, i, all) => {
        view.addNode(curExt, ext.getExtDir()+'/'+curExt);
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
      if(ext.listExt().indexOf(query[2]) === -1) {
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
        view.addNode(
          'Load?',
          'Load Extension '+query[2]+'?',
          null,
          {
            type: 'function',
            action: () => {
              reqExt.push(query[2]);
              config.set('ext', reqExt);
              ext.load(query[2]);
              view.addNode(
                'Done',
                'Extension '+query[2]+' as been loaded.'
              );
            }
          }
        );
      }
      break;
    case 'unload':
      view.addNode(
        'Unload?',
        'Unload Extension '+query[2]+'?',
        null,
        {
          type: 'function',
          action: () => {
            reqExt.splice(reqExt.indexOf(query[2]), 1);
            config.set('ext', reqExt);
            ext.unload(query[2]);
            view.addNode(
              'Okay',
              'Extension '+query[2]+' as been unloaded.'
            );
          }
        }
      );
      break;
    default:
      view.addNode(
        '<code>:ext list</code>',
        'List extension found in '+ext.getExtDir()
      );
      view.addNode(
        '<code>:ext loaded</code>',
        'List extension loaded'
      );
      view.addNode(
        '<code>:ext load &lt;extension-name&gt;</code>',
        'Attempt to load extension from '+ext.getExtDir()
      );
      view.addNode(
        '<code>:ext unload &lt;extension-name&gt;</code>',
        'Attempt to unload extension from '+ext.getExtDir()
      );
      break;
  }
  callback();
};

var cmds =  {
  ":quit": quit,
  ":devtools": devtools,
  ":time": time,
  ":about": about,
  ":help": help,
  ":position": position,
  ":hotkey": hotkey,
  ":ext": exts,
};

module.exports = {
  "matcher": (query, callback) => {
    query = query.trim().split(' ');
    if(cmds[query[0]]) {
      cmds[query[0]](query, callback);
    }
  }
};
