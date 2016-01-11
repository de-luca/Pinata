var menubar = require('menubar');
var ipcMain = require('ipc-main');
var globalShortcut = require('global-shortcut');

var mb = menubar({
  'preloadWindow': true,
  'window-position': 'topRight',
  'width': 500,
  'height': 50,
});

mb.on('ready', function ready () {
  ipcMain.on('hotkey-set', function(event, arg) {
    event.returnValue = globalShortcut.register(arg, function() {
      mb.showWindow();
    });
  });
  ipcMain.on('hotkey-remove', function(event) {
    globalShortcut.unregisterAll();
    event.returnValue = true;
  });

  ipcMain.on('position-set', function(event, arg) {
    mb.positioner.move(arg);
    mb.setOption('window-position', arg);
    event.returnValue = true;
  });

  ipcMain.on('hide-win', function(event, arg) {
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
