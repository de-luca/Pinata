'use strict';

const $ = require('jquery');
const shell = require('shell');
const ipcRenderer = require('ipc-renderer');
const cmd = require('./libs/cmd');
const view = require('./libs/view');

var cmds = cmd.import();

var pastQuery = [];
var i = 0;

$(() => {

  $('#search').keydown((event) => {    // 38=UP, 40=DOWN, 27=ESCAPE
    if(event.keyCode === 38 || event.keyCode === 40) {
      if(event.keyCode === 38 && i < pastQuery.length)
        i++;
      if(event.keyCode === 40 && i > -1)
        i--;
      $('#search').val(pastQuery[i]);
    } else if (event.keyCode === 27) {
      ipcRenderer.sendSync('hide-win');
    }
  });

  $('#search-form').submit((event) => {
    event.preventDefault();                 // Prevent Submit
    i = 0;                                  // Reset history to bottom
    $('#results').html('');                 // Clean results already in place

    var query = $('#search').val().trim();  // Grab the input and clean it

    if(query === '') {
      view.resizeWin(true);                 // Just reset to textfield size
      return;
    } else {
      pastQuery.unshift(query);             // Save if for history
      view.toggleWait();                    // Display wait spinner
    }

    query = query.split(' ');
    if(query[0] in cmds) {
      cmds[query[0]](query, view.toggleWait);
    } else {
      view.addNode(null, 'Oops', 'Command not found', 'Maybe check <code>:help</code>.');
      view.toggleWait();
    }
  });

  $('body').on('click', '.result', (event) => {
    event.preventDefault();
    shell.openExternal($(this).attr('href'));
  });

});

ipcRenderer.on('purge-bar', (event) => {
  $('#search').val('').focus();
  event.sender.send(true);
});
