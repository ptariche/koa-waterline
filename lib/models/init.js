var _                  = require('lodash');
var _waterlineInstance = _waterlineInstance ? _waterlineInstance : false;
var Waterline          = require('waterline');

var designModel = require('./design');

var init = function *(injection){
  if(_waterlineInstance){
    return _waterlineInstance;
  } else {
    var models          = yield initModels(injection);
    _waterlineInstance  = models;
    return models;
  }
};

var initModels = function *(injection){
  var settings = {};

  settings.connections = settings.connections ? settings.connections : injection.connections;
  settings.adapters    = settings.adapters    ? settings.adapters    : injection.adapters;

  var orm  = new Waterline();
  var i    = Object.keys(injection.models).length -1;
  var keys = _.keysIn(injection.models);

  while (i > -1) {
    injection.models[keys[i]].name = keys[i];
    var _designModel = yield designModel(injection.models[keys[i]], injection.methods[keys[i]]);
    var model        = Waterline.Collection.extend(_designModel);
    orm.loadCollection(model);
    i--;
  }

  var results = yield ormMaker(settings, orm);
  return results;
};

var ormMaker = function *(settings, orm){
  return yield function(cb){
    orm.initialize(settings, function(err, models){
      if (err) { throw err; }
      cb(null, models);
    });
  }
};

module.exports = init;
