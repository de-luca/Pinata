'use strict';

const $ = require('jquery');
const view = require('../libs/view');

var search = (query, callback) => {
  query = query.join("+");
  query += "+!helloworld";
  $.get('https://searchcode.com/api/search_IV/?q='+query+'&p=0')
    .done(function(data) {
      if(data.results.length === 0) {
        view.addNode(null, '404', 'Nothing found... How sad...');
      } else {
        data.results.forEach(function(curRes) {
          view.addNode(curRes.url, curRes.type, curRes.synopsis, curRes.description);
        });
      }
    })
    .fail(function() {
      view.addNode(null, 'Failed', 'Request failed', 'Maybe check your internet connexion or your query');
    })
    .always(function() {
      callback();
    });
};

var cmds =  {
  "php": (query, callback) => {
    query[0] = 'php';
    search(query, callback);
  },
  "js": (query, callback) => {
    query[0] = 'javascript';
    search(query, callback);
  }
};

module.exports = {
  "cmds": cmds
};
