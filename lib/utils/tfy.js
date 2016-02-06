'use strict';

let thenify = require('thenify');

let tfy = function (func, context) {
  return context ? thenify(func).bind(context) : thenify(func);
};

module.exports = tfy;
