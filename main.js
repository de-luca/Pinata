'use strict';

const menubar = require('menubar');
const globalShortcut = require('global-shortcut');
const config = require('electron-json-config');
const ipcMain = require('ipc-main');

if(!config.has('position'))
  config.set('position', 'topRight');
if(!config.has('hotkey'))
  config.set('hotkey', null);

let mb = menubar({
  'preloadWindow': true,
  'windowPosition': config.get('position'),
  'icon': __dirname+'/res/IconTemplate.png',
  'width': 500,
  'height': 50
});

mb.on('ready', function ready () {
  mb.tray.setToolTip('Pinata is running...');
  if(config.get('hotkey') !== null)
    globalShortcut.register(config.get('hotkey'), function() {
      mb.showWindow();
    });

  if (process.platform === 'win32') {
    var contextMenu = require('menu').buildFromTemplate([
      { label: 'Quit Pinata', type: 'normal', click: function() { mb.app.quit(); }}
    ]);
    mb.tray.setContextMenu(contextMenu);
  }

  ipcMain.on('hotkey-set', function(event, keys) {
    config.set('hotkey', keys);
    event.returnValue = globalShortcut.register(keys, function() {
      mb.showWindow();
    });
  });
  ipcMain.on('hotkey-remove', function(event) {
    globalShortcut.unregisterAll();
    config.set('hotkey', null);
    event.returnValue = true;
  });

  ipcMain.on('position-set', function(event, pos) {
    mb.positioner.move(pos);
    mb.setOption('windowPosition', pos);
    config.set('position', pos);
    event.returnValue = true;
  });

  ipcMain.on('hide-win', function(event) {
    mb.hideWindow();
    event.returnValue = true;
  });

  mb.app.on('will-quit', function() {
    globalShortcut.unregisterAll();
  });
});

mb.on('after-create-window', function() {
  mb.window.webContents.on('did-start-loading', function() {
    mb.window.setSize(500, 50);
  });
});

mb.on('after-hide', function() {
  mb.window.webContents.send('purge-view');
});
