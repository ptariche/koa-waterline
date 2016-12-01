'use strict';

const debug = require('debug')('koa-waterline');

module.exports = function (opts) {

  if (!opts) throw new TypeError(':: koa-waterline: Options are required to initiate waterline properly ::');

  function * define(ctx) {
    debug('Defining the instance of this in the co-flow to create the models in the the eventloop');

    if (ctx._waterline) {
      debug('The instance of ctx already has koa-waterline initiated');

      return ctx._waterline;
    } else {
      let context   = ctx.context || ctx;
      const init    = require('./models/init.js');

      debug('Attempting to initiate koa-waterline');

      let waterline = yield init(opts);

      debug('Initiated koa-waterline');

      return ctx._waterline = waterline;
    }
  };

  return function *(next) {
    try {
      debug('Start defining ctx inside the co flow');

      yield define(this);

      debug('Begin yield to next middleware');

      yield next;
    } catch (err) {
      debug('An error was thrown in the return function of middlware');

      console.log();
      console.error(':: koa-waterline error :: ');
      throw err;
      console.log();
    }
  };
};

module.exports.init = require('./models/init');
