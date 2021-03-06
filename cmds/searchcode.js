'use strict';

const $ = require('jquery');
const view = require('../libs/view');
const shell = require('shell');

var search = (query, callback) => {
  query = query.join("+");
  query += "+!helloworld";
  $.get('https://searchcode.com/api/search_IV/?q='+query+'&p=0')
    .done(function(data) {
      if(data.results.length === 0) {
        view.addNode('Nothing found... How sad...');
      } else {
        data.results.forEach(function(curRes) {
          view.addNode(
            curRes.synopsis,
            curRes.description,
            curRes.type,
            {
              type: 'web',
              action: () => shell.openExternal(curRes.url)
            }
          );
        });
      }
    })
    .fail(function() {
      view.addNode(
        'Request failed',
        'Maybe check your internet connexion or your query'
      );
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
  },
  "py": (query, callback) => {
    query[0] = 'python';
    search(query, callback);
  },
  "java": (query, callback) => {
    query[0] = 'java';
    search(query, callback);
  },
  "clojure": (query, callback) => {
    query[0] = 'clojure';
    search(query, callback);
  },
  "perl": (query, callback) => {
    query[0] = 'perl5';
    search(query, callback);
  }
};

module.exports = {
  "matcher": (query, callback) => {
    query = query.split(' ');
    if(cmds[query[0]]) {
      cmds[query[0]](query, callback);
    }
  }
};
