module.exports = function(opts){

  if (!opts) throw new TypeError('Options are required to initiate waterline properly');

  function* define(ctx) {
    var context   = ctx.context || ctx;
    if (ctx._waterline) return ctx._waterline;
    var init      = require('./models/init.js');
    var waterline = yield init(opts);
    return ctx._waterline = waterline;
  };

  return function*(next) {
    try {
      yield define(this);
      yield next;
    } catch (err){
      throw err; 
    }
  };
}; 


