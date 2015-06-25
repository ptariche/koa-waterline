var koa       = require('koa');
var waterline = require('./lib/koa-waterline.js');

var app = koa();

var connections = {
  couch: {
    adapter: "couch",
    host: '127.0.0.1',
    port: '5984',
    username: '',
    password: ''
  },
  mongo: {
    adapter: "mongo",
    host: 'localhost',
    port: '27017',
    user: '',
    password: '',
    database: 'waterline'
  }
};

var adapters = {
  couch: require('sails-couchdb-orm'),
  mongo: require('sails-mongo')
};

var models = {
    "comments": {
      "adp": "couch",
      "connection": "couch",
      "properties": {
        "archived": {
            "type": "boolean",
            "defaultValue": false
        },
        "message": {
            "type": "string"
        }
      }
    },
    "history": {
      "adp": "mongo",
      "connection": "mongo",
      "properties": {
        "year": {
          "type": "number"
        }
      }
    }
  };

var injection               = {};
injection.methods           = false;
injection.models            = models;
injection.adapters          = adapters;
injection.connections       = connections

app.use(waterline(injection));

app.use(function* () {
  var ctx            = this;
  var message        = 'This is an example';
  var commentCreated = yield ctx._waterline.collections.comments.create({message: message});
  // You can yield to the CRUD waterline functions because they are written as promises.
  console.log(commentCreated);

});

app.listen(1337);
