'use strict';

let _                  = require('lodash');
let debug              = require('debug')('koa-waterline');
let Waterline          = require('waterline');
let designModel        = require('./design');

// Create waterline instance to prevent re-registering of connections by adapters
var _waterlineInstance = _waterlineInstance ? _waterlineInstance : false;

let init = function *(injection) {
  try {
    if (_waterlineInstance) {
      debug('Returning the instance of waterline');

      return _waterlineInstance;
    } else {
      debug('creating the instance of waterline');

      let models          = yield initModels(injection) || {};
      models._tfy         = models ? require('../utils/tfy') : false;
      _waterlineInstance  = models;
      return models;
    }
  } catch (err) {
    debug('An error occured attempting to start the instance of waterline');

    console.log();
    console.error(':: koa-waterline: Please make sure you included a proper injection to instiatiate ::');
    console.error(err.stack);
    console.log();

    return false;
  }
};

let initModels = function *(injection) {
  try {
    let settings = {};

    settings.connections = settings.connections ? settings.connections : injection.connections;
    settings.adapters    = settings.adapters    ? settings.adapters    : injection.adapters;

    debug('This settings getting passed in to initiate the models %s', settings);

    let orm  = new Waterline();
    let i    = Object.keys(injection.models).length - 1;
    let keys = _.keysIn(injection.models);
    let model;

    while (i > -1) {
      injection.models[keys[i]].name = keys[i];
      let _designModel       = yield designModel(injection.models[keys[i]], injection.methods[keys[i]]);

      debug('Thie model designed %s', _designModel);

      if (_designModel) model = Waterline.Collection.extend(_designModel);
      if (_designModel) orm.loadCollection(model);
      i--;
    }

    let results = yield ormMaker(settings, orm);
    debug('The results of the orm %s', results);

    return results;
  } catch (err) {
    debug('An error occured while trying to create the models in to the ORM');

    console.log();
    console.error(':: koa-waterline: failed to instiatiate the models ::');
    console.error(err.stack);
    console.log();

    return false;
  }
};

var ormMaker = function (settings, orm) {
  return new Promise (function (resolve, reject) {
    try {
      debug('Making the ORM');

      orm.initialize(settings, function (err, models) {
        if (err) {
          debug('An error occured attempting to make a connection with the ORM to the foreign entitity');

          console.log();
          console.error(':: koa-waterline: Failed to initialize the connection ::');

          if (settings.connections) console.error(settings.connections);

          throw err;
          console.log();
        }

        resolve(models);
      });
    } catch (err) {
      debug('An error occured while trying to create the ORM');

      console.log();
      console.error(':: koa-waterline: Please make sure you included a proper settings object and model definitions ::');
      console.error(err.stack);
      console.log();

      resolve(false);
    }
  });
};

module.exports = init;
