var _                  = require('lodash');
var debug              = require('debug')('koa-waterline');
var Waterline          = require('waterline');
var designModel        = require('./design');

// Create waterline instance to prevent re-registering of connections by adapters
var _waterlineInstance = _waterlineInstance ? _waterlineInstance : false;

var init = function *(injection){
  try {
    if(_waterlineInstance){
      debug('Returning the instance of waterline');

      return _waterlineInstance;
    } else {
      debug('creating the instance of waterline');

      var models          = yield initModels(injection);
      _waterlineInstance  = models;

      return models;
    }
  } catch(err){
    debug('An error occured attempting to start the instance of waterline');

    console.log();
    console.error(':: koa-waterline: Please make sure you included a proper injection to instiatiate ::');
    console.error(err.stack);
    console.log();

    return false;
  }
};

var initModels = function *(injection){
  try {
    var settings = {};

    settings.connections = settings.connections ? settings.connections : injection.connections;
    settings.adapters    = settings.adapters    ? settings.adapters    : injection.adapters;

    debug('This settings getting passed in to initiate the models %s', settings);

    var orm  = new Waterline();
    var i    = Object.keys(injection.models).length -1;
    var keys = _.keysIn(injection.models);
    var model;

    while (i > -1) {
      injection.models[keys[i]].name = keys[i];
      var _designModel       = yield designModel(injection.models[keys[i]], injection.methods[keys[i]]);

      debug('Thie model designed %s', _designModel);

      if(_designModel) model = Waterline.Collection.extend(_designModel);
      if(_designModel) orm.loadCollection(model);
      i--;
    }

    var results = yield ormMaker(settings, orm);
    debug('The results of the orm %s', results);

    return results;
  } catch(err){
    debug('An error occured while trying to create the models in to the ORM');

    console.log();
    console.error(':: koa-waterline: failed to instiatiate the models ::');
    console.error(err.stack);
    console.log();

    return false;
  }
};

var ormMaker = function *(settings, orm){
  return yield function(cb){
    try{
      debug('Making the ORM');

      orm.initialize(settings, function(err, models){
        if (err) {
          debug('An error occured attempting to make a connection with the ORM to the foreign entitity');

          console.log();
          console.error(':: koa-waterline: Failed to initialize the connection ::');

          if(settings.connections) console.error(settings.connections);

          throw err;
          console.log();
        }

        cb(null, models);
      });
    } catch (err){
      debug('An error occured while trying to create the ORM');

      console.log();
      console.error(':: koa-waterline: Please make sure you included a proper settings object and model definitions ::');
      console.error(err.stack);
      console.log();

      cb(null, false);
    }
  }
};

module.exports = init;
