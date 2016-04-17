'use strict';

const $ = require('jquery');
const remote = require('remote');

var toggleWait = () => {
  if($('#wait').is(':visible')) {
    $('#wait').hide();
    $('#results').children().first().addClass('active');
  } else {
    $('#wait').slideDown('fast');
    remote.getCurrentWindow().setSize(500, 85);
  }
};

var addNode = (head, body, badge, link) => {
  let template = $('#nodeTemplate').clone().removeAttr('id');
  if(link) {
    template.attr('href', link.value);
    template.attr('type', link.type);
  }
  template.find('#type').html(badge).addClass(badge);
  template.find('#head').html(head);
  template.find('#body').html(body);
  template.appendTo('#results').slideDown(resizeWin());
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

module.exports = {
  "toggleWait": toggleWait,
  "addNode": addNode,
  "resizeWin": resizeWin,
  "prevResult": prevResult,
  "nextResult": nextResult,
};
