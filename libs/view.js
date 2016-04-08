'use strict';

const $ = require('jquery');
const remote = require('remote');

var toggleWait = () => {
  if($('#wait').is(':visible')) {
    $('#wait').hide();
  } else {
    $('#wait').slideDown('fast');
    remote.getCurrentWindow().setSize(500, 85);
  }
};

var addNode = (url, badge, head, body) => {
  let template = $('#template').clone().removeAttr('id');
  template.attr('href', url);
  template.find('#type').html(badge).addClass(badge);
  template.find('#head').html(head);
  template.find('#body').html(body);
  template.appendTo('#results').slideDown();
  resizeWin();
};

var resizeWin = (reset) => {
  remote.getCurrentWindow().setSize(500, (reset ? 50 : ($('#results').height()<550 ? $('#results').height()+65 : 600)));
};

module.exports = {
  "toggleWait": toggleWait,
  "addNode": addNode,
  "resizeWin": resizeWin
};
