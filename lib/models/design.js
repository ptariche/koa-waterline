var _ = require('lodash');

var Model = function *(modelSchema, methods){
  try {
    var _modelSchema = yield designModel(modelSchema, methods);
    return yield _modelSchema;
  }catch(e){
    console.log(e);
    return false;
  };
};

var designModel = function *(modelSchema, methods){
  return yield function(cb){
    var _modelSchema         = {};
    _modelSchema.identity    = modelSchema.name ? modelSchema.name  : false || false; 
    _modelSchema.connection  = modelSchema.connection;
    _modelSchema.adapter     = modelSchema.adp; 
    _modelSchema.attributes  = {};
    _.each(modelSchema.properties, function(property, index){
      property.defaultValue               = property.defaultValue || false;
      property.unique                     = property.unique || false;
      _modelSchema.attributes[index]      = _modelSchema.attributes[index] || {};
      _modelSchema.attributes[index].type = property.type;
      if (property.unique) _modelSchema.attributes[index].unique = property.unique;
      if (property.defaultValue) _modelSchema.attributes[index].defaultsTo = property.defaultValue;
      if (property.defaultValue && property.defaultValue == 'timestamp') _modelSchema.attributes[index].default = Date.now();
    });
    if(methods) _modelSchema[methods] = methods[modelSchema.name] ? methods : false || false;
    cb(null, _modelSchema);
  };
};

module.exports = Model;