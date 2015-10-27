var _     = require('lodash');
var propT = require('./types.js');
var debug = require('debug')('koa-waterline');

var Model = function*(modelSchema, methods) {
  try {
    debug('Designing the Model Schema');
    debug('The model schema proposal %s', modelSchema);

    var _modelSchema = yield designModel(modelSchema, methods);
    return _modelSchema;
  }catch (err) {
    debug('An error occured while attempting to design the model schema');

    console.log();
    console.error(':: Koa-waterline: Failed to design the new model schema ::');
    console.error(err.stack);
    console.log();
    return false;
  };
};

var designModel = function*(modelSchema, methods) {
  return yield function(cb) {
    try {
      if (modelSchema.model === false) {
        debug('The model passed was set with the flag false to not be designed');

        cb(null, false);
      } else if (modelSchema.model === undefined || modelSchema.model === null || modelSchema.model) {
        debug('Designing a model whereby the flag is set or the flag does not exist');

        var _modelSchema         = {};
        _modelSchema.identity    = modelSchema.name ? modelSchema.name  : false || false;
        _modelSchema.connection  = modelSchema.connection;
        _modelSchema.adapter     = modelSchema.adp;
        _modelSchema.attributes  = {};

        _.each(modelSchema.properties, function(property, index) {
          property.defaultValue                                                = property.defaultValue          || false;
          property.unique                                                      = property.unique                || false;
          _modelSchema.attributes[index]                                       = _modelSchema.attributes[index] || {};
          _.each(property, function(el, _index) {
            if ((index !== 'defaultValue' && index !== 'type') && _.contains(propT, _index)) {
              _modelSchema.attributes[index][_index] = el;
            }
          });
          _modelSchema.attributes[index].type                                  = property.type;
          if (modelSchema.index) _modelSchema.attributes[index].index          = modelSchema.index;
          if (property.defaultValue) _modelSchema.attributes[index].defaultsTo = property.defaultValue;
          if (property.defaultValue && property.defaultValue == 'timestamp') _modelSchema.attributes[index].default = Date.now();
        });

        if (methods) _modelSchema[methods] = methods[modelSchema.name] ? methods : false || false;

        debug('Calling back from Design Model');

        cb(null, _modelSchema);
      } else {
        console.error(':: Koa-waterline: Please make sure to set the model attribute as being a true or false boolean ::');
        cb(null, false);
      }
    } catch (err) {
      debug('An error occured while attempting to redesign the model schema');

      console.log();
      console.error(':: Koa-waterline: Failed to design the new model because of ::');
      console.error(err.stack);
      console.log();

      cb(null, false);
    }
  };
};

module.exports = Model;
