'use strict';

const $ = require('jquery');
const ipcRenderer = require('ipc-renderer');
const ext = require('./libs/ext');
const view = require('./libs/view');

ext.init();

$(() => {

  $('#search').keyup((event) => {
    switch (event.keyCode) {
      case 13:
        $('.active').click();
        break;
      case 27:
        ipcRenderer.sendSync('hide-win');
        break;
      case 38:
        $('#search').focus().val($('#search').val());
        view.prevResult();
        break;
      case 40:
        $('#search').focus().val($('#search').val());
        view.nextResult();
        break;
      case 16: //shift
      case 17: //ctrl
      case 18: //alt
      case 20: //caps lock
      case 37: //left
      case 39: //right
      case 91: //left super
      case 92: //right super
      case 93: //select
        break;
      default:
        $('#results').html('');
        view.resizeWin(true);
        if($('#search').val().length >= 3) {
          ext.match($('#search').val(), view.selectResult);
        }
        break;
    }
  });

});

ipcRenderer.on('purge-view', (event) => {
  $('#search').val('').focus();
  $('#results').html('');
  view.resizeWin(true);
  event.sender.send(true);
});
