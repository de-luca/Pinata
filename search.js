var shell = require('shell');
var remote = require('remote');
var ipcRenderer = require('ipc-renderer');
var cmd = require('./cmd/cmd.js');

var pastQuery = [];
var i = 0;

if(localStorage.getItem('hotkey') !== null)
  ipcRenderer.sendSync('hotkey-set', localStorage.getItem('hotkey'));

$(function() {

  $('#search').keydown(function(event) {    // 38=UP, 40=DOWN, 27=ESCAPE
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

  //Search Bar
  $('#search-form').submit(function(event) {
    event.preventDefault();                 // Prevent Submit
    i = 0;                                  // Reset history to bottom
    $('#results').html('');                 // Clean results already in place

    var query = $('#search').val().trim();  // Grab the input and clean it

    if(query === '') {
      resizeWin(true);                      // Just reset to textfield size
      return;
    } else {
      pastQuery.unshift(query);             // Save if for history
      toggleWait();                         // Display wait spinner
    }

    if(query.charAt(0) === ':') {           // This is a command! Split args by spaces
      query = query.split(' ');
      if(query[0] in cmd.cmds)
        cmd.cmds[query[0]](query);
      else
        addNode(null, 'Oops', 'Command not found', 'Maybe check <code>:help</code>.');
      toggleWait();
    } else {                                // This a query! Replace spaces by + for the request
      query = query.replace(/ /g,"+");
      $.get('https://searchcode.com/api/search_IV/?q='+query+'&p=0')
        .done(function(data) {
          if(data.results.length === 0) {
            addNode(null, '404', 'Nothing found... How sad...');
          } else {
            data.results.forEach(function(curRes) {
              addNode(curRes.url, curRes.type, curRes.synopsis, curRes.description);
            });
          }
        })
        .fail(function() {
          addNode(null, 'Failed', 'Request failed', 'Maybe check your internet connexion or your query');
        })
        .always(function() {
          toggleWait();
        });
    }
  });

  $('body').on('click', '.result', function(event) {
    event.preventDefault();
    shell.openExternal($(this).attr('href'));
  });

});

function toggleWait() {
  if($('#wait').is(':visible')) {
    $('#wait').hide();
  } else {
    $('#wait').slideDown('fast');
    remote.getCurrentWindow().setSize(500, 85);
  }
}

function addNode(url, badge, head, body) {
  var template = $('#template').clone().removeAttr('id');
  template.attr('href', url);
  template.find('#type').html(badge).addClass(badge);
  template.find('#head').html(head);
  template.find('#body').html(body);
  template.appendTo('#results').slideDown();
  resizeWin();
}

function resizeWin(reset) {
    remote.getCurrentWindow().setSize(500, (reset ? 50 : ($('#results').height()<550 ? $('#results').height()+65 : 600)));
}
