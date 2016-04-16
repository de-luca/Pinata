'use strict';

const $ = require('jquery');
const shell = require('shell');
const ipcRenderer = require('ipc-renderer');
const cmd = require('./libs/cmd');
const view = require('./libs/view');

cmd.init();

var ready = true;

$(() => {

  $('#search').keyup((event) => {
    switch (event.keyCode) {
      case 8:
        ready = true;
        break;
      case 13:
        if(ready) {
          $('#results').html('');                 // Clean results already in place

          var query = $('#search').val().trim();  // Grab the input and clean it
          $('#search').val('');

          if(query === '') {
            view.resizeWin(true);                 // Just reset to textfield size
            return;
          } else {
            view.toggleWait();                    // Display wait spinner
          }

          query = query.split(' ');
          if(query[0] in cmd.getCmds()) {
            cmd.getCmds()[query[0]](query, view.toggleWait);
            ready = false;
          } else {
            view.addNode('Command not found', 'Maybe check <code>:help</code>.', 'Oops');
            view.toggleWait();
          }
        } else {
          if($('.active').attr('href') && $('.active').attr('type')) {
            switch ($('.active').attr('type')) {
              case 'web':
                shell.openExternal($('.active').attr('href'));
                break;
            }
          }
        }
        break;
      case 27:
        ipcRenderer.sendSync('hide-win');
        break;
      case 38:
        view.prevResult();
        break;
      case 40:
        view.nextResult();
        break;
      default:
        ready = true;
        break;
    }
  });

  $('body').on('click', '.list-group-item', function(event) {
    event.preventDefault();
    if($(this).attr('href') && $(this).attr('type')) {
      switch ($(this).attr('type')) {
        case 'web':
          shell.openExternal($(this).attr('href'));
          break;
      }
    }
  });

});

ipcRenderer.on('purge-view', (event) => {
  $('#search').val('').focus();
  $('#results').html('');
  view.resizeWin(true);
  event.sender.send(true);
});
