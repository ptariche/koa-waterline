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
  },
  cassandra: {
    adapter: "cassandra",
    host: '',
    password: '',
    contactPoints: ['127.0.0.1'],
    keyspace: 'dev'
  }
};

var adapters = {
  couch:     require('sails-couchdb-orm'),
  mongo:     require('sails-mongo'),
  cassandra: require('sails-cassandra')
};

var models = {
    "comments": {
      "model": true,
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
      "model" : true,
      "adp": "mongo",
      "connection": "mongo",
      "properties": {
        "year": {
          "type": "string"
        }
      }
    },
    "tweet": {
      "adp": "cassandra",
      "connection": "cassandra",
      "index": ['tweet_body'],
      "properties": {
        "tweet_body": {
          "type": "string"
        }
      }
    },
    "error": {
      "model": false,
      "properties": {
        "erro": {
          "type": "string"
        }
      }
    }
  };

var injection               = {};
injection.methods           = false;
injection.models            = models;
injection.adapters          = adapters;
injection.connections       = connections;

app.use(waterline(injection));

app.use(function* () {
  var ctx            = this;
  var message        = 'This is an example';
  var commentCreated = yield ctx._waterline.collections.comments.create({message: message});
  // You can yield to the CRUD waterline functions because they are written as promises.
  console.log(commentCreated);

  var year           = '1976';
  var createHistory  = yield ctx._waterline.collections.history.create({year : year});
  console.log(createHistory);

  var new_tweet     = 'this is my example tweet!';
  var createTweet   = yield ctx._waterline.collections.tweet.create({tweet_body: new_tweet});
  console.log(createTweet);

});

app.listen(1337);
