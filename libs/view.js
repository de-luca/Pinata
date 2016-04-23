'use strict';

const $ = require('jquery');
const remote = require('remote');

var selectResult = () => {
  $('#results').children().first().addClass('active');
};

var toggleWait = () => {
  if($('#working').is(':visible')) {
    $('#working').hide();
  } else {
    $('#working').show();
  }
};

var addNode = (head, body, badge, link) => {
  let node = $('<a>', {class: 'list-group-item'});

  if(link) {
    node.on('click', link.action);
  }

  if(badge && link) {
    node.append($('<span>', {
      class: 'badge merged-right',
      html: getIconLink(link.type)
    }));
    node.append($('<span>', {
      class: 'badge merged-left '+badge,
      html: badge
    }));
  } else if (!(badge && link) && (badge || link)) {
    node.append($('<span>', {
      class: 'badge '+badge||'',
      html: badge || getIconLink(link.type)
    }));
  }

  if(head) {
    node.append($('<p>', {
      class: 'lead list-group-item-heading',
      html: head
    }));
  }

  if(body) {
    node.append($('<p>', {
      class: 'list-group-item-text',
      html: '<small>'+body+'</small>'
    }));
  }

  node.appendTo('#results');
  resizeWin();
};

var removeActive = (reset) => {
  $('.active').slideUp('fast', function() {
    this.remove();
    resizeWin(reset);
  });
};

var resizeWin = (reset) => {
  remote.getCurrentWindow().setSize(500, (reset ? 50 : ($('#results').height()<550 ? $('#results').height()+65 : 600)));
};

var prevResult = () => {
  if($('.active').prev().length !== 0) {
    let result = $('.active');
    result.removeClass('active');
    result.prev().addClass('active').get(0).scrollIntoView(true);
  }
};

var nextResult = () => {
  if($('.active').next().length !== 0) {
    let result = $('.active');
    result.removeClass('active');
    result.next().addClass('active').get(0).scrollIntoView(true);
  }
};

var setSearch = (value, trigger) => {
  $('#search').val(value);
  if(trigger) {
    $('#search').keyup();
  }
};

var getIconLink = (type) => {
  switch (type) {
    case 'web':
      return '<i class="fa fa-fw fa-link"></i>';
    case 'function':
      return '<i class="fa fa-fw fa-cog"></i>';
  }
};

module.exports = {
  "selectResult": selectResult,
  "toggleWait": toggleWait,
  "addNode": addNode,
  "removeActive": removeActive,
  "resizeWin": resizeWin,
  "prevResult": prevResult,
  "nextResult": nextResult,
  "setSearch": setSearch,
};
