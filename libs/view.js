'use strict';

const $ = require('jquery');
const remote = require('remote');

var toggleWait = () => {
  if($('#working').is(':visible')) {
    $('#working').hide();
    $('#results').children().first().addClass('active');
  } else {
    $('#working').show();
  }
};

var addNode = (head, body, badge, link) => {
  let node = $('<a>', {class: 'list-group-item'});

  if(link) {
    node.attr({
      href: link.value,
      type: link.type
    });
  }

  if(badge && link) {
    node.append($('<span>', {
      class: 'badge merged-right',
      html: getIconLink(link.type)
    }));
    node.append($('<span>', {
      class: 'badge merged-left',
      html: badge
    }));
  } else if (!(badge && link) && (badge || link)) {
    node.append($('<span>', {
      class: 'badge',
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

var resizeWin = (reset) => {
  remote.getCurrentWindow().setSize(500, (reset ? 50 : ($('#results').height()<550 ? $('#results').height()+65 : 600)));
};

var prevResult = () => {
  if($('.active').prev().length !== 0) {
    let result = $('.active');
    result.removeClass('active');
    result.prev().addClass('active');
  }
};

var nextResult = () => {
  if($('.active').next().length !== 0) {
    let result = $('.active');
    result.removeClass('active');
    result.next().addClass('active');
  }
};

var getIconLink = (type) => {
  switch (type) {
    case 'web':
      return '<i class="fa fa-fw fa-link"></i>';
  }
};

module.exports = {
  "toggleWait": toggleWait,
  "addNode": addNode,
  "resizeWin": resizeWin,
  "prevResult": prevResult,
  "nextResult": nextResult,
};
