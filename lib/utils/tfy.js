var thenify = require('thenify');

var tfy = function (func, context) {
  return context ? thenify(func).bind(context) : thenify(func);
};

module.exports = tfy;
